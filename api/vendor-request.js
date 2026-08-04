import { createHash } from 'node:crypto'
import { Resend } from 'resend'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const attempts = new Map()
const REQUIRED_FIELDS = [
  'businessName',
  'contactName',
  'email',
  'phone',
  'preferredDate',
  'offering',
  'setupNeeds',
]

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

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
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

  // Quietly accept bot submissions so the endpoint does not teach bots how to bypass it.
  if (body.website) return sendJson(response, 200, { ok: true })

  const collaborationType = body.collaborationType === 'pop-up' ? 'pop-up' : body.collaborationType === 'food-truck' ? 'food-truck' : ''
  const submission = {
    businessName: clean(body.businessName, 120),
    contactName: clean(body.contactName, 120),
    email: clean(body.email, 254).toLowerCase(),
    phone: clean(body.phone, 40),
    websiteOrSocial: clean(body.websiteOrSocial, 200),
    preferredDate: clean(body.preferredDate, 100),
    offering: clean(body.offering, 1200),
    setupNeeds: clean(body.setupNeeds, 1200),
    notes: clean(body.notes, 2000),
  }

  if (!collaborationType || REQUIRED_FIELDS.some((field) => !submission[field])) {
    return sendJson(response, 400, { error: 'Complete all required fields.' })
  }

  if (!isValidEmail(submission.email)) {
    return sendJson(response, 400, { error: 'Enter a valid email address.' })
  }

  if (submission.phone.length < 7) {
    return sendJson(response, 400, { error: 'Enter a valid phone number.' })
  }

  if (isRateLimited(getClientIp(request))) {
    return sendJson(response, 429, { error: 'Too many attempts. Please try again in a few minutes.' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.')
    return sendJson(response, 503, { error: 'The request form is being configured. Please try again soon.' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'vibesupplypg@gmail.com'
  const typeLabel = collaborationType === 'food-truck' ? 'Food truck' : 'Pop-up shop'
  const requestText = [
    'New Vibe collaboration request',
    '',
    `Collaboration type: ${typeLabel}`,
    `Business name: ${submission.businessName}`,
    `Contact name: ${submission.contactName}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    `Website or social: ${submission.websiteOrSocial || 'Not provided'}`,
    `Preferred date: ${submission.preferredDate}`,
    '',
    'What they serve or sell:',
    submission.offering,
    '',
    'Setup size and power needs:',
    submission.setupNeeds,
    '',
    'Anything else:',
    submission.notes || 'Not provided',
    '',
    'Submitted through https://www.vibesupplyco.org/collaborate',
  ].join('\n')
  const idempotencyKey = createHash('sha256')
    .update(`${collaborationType}|${submission.email}|${submission.businessName}|${submission.preferredDate}|${submission.offering}`)
    .digest('hex')
    .slice(0, 40)

  try {
    const { error } = await resend.emails.send(
      {
        from: process.env.RESEND_FROM_EMAIL || 'Vibe Website <website@updates.fasmotorsports.com>',
        to: [notifyEmail],
        replyTo: submission.email,
        subject: `New ${typeLabel.toLowerCase()} request — ${submission.businessName.replace(/[\r\n]/g, ' ')}`,
        text: requestText,
        tags: [
          { name: 'source', value: 'vibe-collaborate' },
          { name: 'vendor_type', value: collaborationType },
        ],
      },
      { idempotencyKey: `vibe-collaboration/${idempotencyKey}` },
    )

    if (error) throw new Error(`Notification failed: ${error.name}`)
    return sendJson(response, 200, { ok: true })
  } catch (error) {
    console.error('Vendor request failed:', error instanceof Error ? error.message : 'unknown error')
    return sendJson(response, 502, { error: 'We could not send your request right now. Please try again.' })
  }
}
