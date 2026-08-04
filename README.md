# Vibe Smoke & Supply Co.

Vite/React launch site for Vibe Smoke & Supply Co., ready for Vercel.

## Local development

```bash
pnpm install
pnpm dev
```

The regular Vite server renders the site, but the Resend signup endpoint runs as a Vercel function. Use `vercel dev` when testing the signup flow locally.

## Resend and Vercel

The opening-updates form creates or updates a Resend contact and opts that contact into the public **Vibe Opening Updates** topic.

Add these Environment Variables to the Vercel project for Production, Preview, and Development:

- `RESEND_API_KEY` — a full-access key from the FAS Motorsports Resend account (required)
- `RESEND_TOPIC_ID` — `4dfe54d9-ffe7-4266-b722-5225b6c06f43`
- `RESEND_NOTIFY_EMAIL` — `vibesupplypg@gmail.com` to receive private signup notices (optional)
- `RESEND_FROM_EMAIL` — `Vibe Website <website@updates.fasmotorsports.com>` (optional)

The API key must stay server-side and must never use a `VITE_` prefix. The currently verified Resend domain belongs to FAS Motorsports, so the integration only uses it for private admin notifications. Verify a Vibe-owned domain in Resend before sending branded confirmations or broadcasts to subscribers.

## Checks

```bash
pnpm run lint
pnpm run build
```
