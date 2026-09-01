import { Resend } from 'resend'

const VIBE_TOPIC_ID = '63f281c0-b99e-4a94-9840-d4f2613d5778'
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const attempts = new Map()
const BUSINESS_CONTACT = [
  'Vibe Smoke & Supply Co',
  '5260 Duncan Rd, Unit 3',
  'Punta Gorda, FL 33982',
  'Support: vibesupplypg@gmail.com',
  'Phone: (941) 286-2750',
].join('\n')

function getClientIp(request) {
  const forwarded = request.headers['x-forwarded-for']
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const recent = (attempts.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  attempts.set(ip, recent)
  return recent.length > RATE_LIMIT_MAX
}

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sendJson(response, status, body) {
  response.setHeader('Cache-Control', 'no-store')
  return response.status(status).json(body)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  let body
  try {
    body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : request.body || {}
  } catch {
    return sendJson(response, 400, { error: 'Invalid request.' })
  }
  const email = normalizeEmail(body.email)

  // Quietly accept bot submissions so the endpoint does not teach bots how to bypass it.
  if (body.company) return sendJson(response, 200, { ok: true })

  if (!isValidEmail(email)) {
    return sendJson(response, 400, { error: 'Enter a valid email address.' })
  }

  if (isRateLimited(getClientIp(request))) {
    return sendJson(response, 429, { error: 'Too many attempts. Please try again in a few minutes.' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.')
    return sendJson(response, 503, { error: 'Email signup is being configured. Please try again soon.' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const topicId = process.env.RESEND_TOPIC_ID || VIBE_TOPIC_ID
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'vibesupplypg@gmail.com'
  const topicPreference = [{ id: topicId, subscription: 'opt_in' }]

  try {
    const { data: existingContact, error: lookupError } = await resend.contacts.get({ email })
    let contactId = existingContact?.id
    let created = false

    if (lookupError?.name === 'not_found') {
      const { data: newContact, error: createError } = await resend.contacts.create({
        email,
        unsubscribed: false,
        topics: topicPreference,
      })

      if (createError) throw new Error(`Contact creation failed: ${createError.name}`)
      contactId = newContact.id
      created = true
    } else if (lookupError) {
      throw new Error(`Contact lookup failed: ${lookupError.name}`)
    } else {
      const { error: topicError } = await resend.contacts.topics.update({
        id: existingContact.id,
        topics: topicPreference,
      })

      if (topicError) throw new Error(`Topic update failed: ${topicError.name}`)
    }

    if (created && notifyEmail) {
      const { error: notificationError } = await resend.emails.send(
        {
          from: process.env.RESEND_FROM_EMAIL || 'Vibe Website <website@updates.fasmotorsports.com>',
          to: [notifyEmail],
          replyTo: email,
          subject: 'New Vibe subscriber',
          text: `${email} subscribed to Vibe store updates.\n\n${BUSINESS_CONTACT}`,
          tags: [{ name: 'source', value: 'vibe-opening-site' }],
        },
        { idempotencyKey: `vibe-signup-notice/${contactId}` },
      )

      if (notificationError) {
        console.error('Signup notification failed:', notificationError.name)
      }
    }

    return sendJson(response, 200, { ok: true })
  } catch (error) {
    console.error('Resend signup failed:', error instanceof Error ? error.message : 'unknown error')
    return sendJson(response, 502, { error: 'We could not add you right now. Please try again.' })
  }
}
