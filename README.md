# Vibe Smoke & Supply Co.

Vite/React launch site for Vibe Smoke & Supply Co., ready for Vercel.

The public site includes a dedicated customer support page at `/support` with the canonical business address, phone, and email.

## Local development

```bash
pnpm install
pnpm dev
```

The regular Vite server renders the site, but the Resend signup endpoint runs as a Vercel function. Use `vercel dev` when testing the signup flow locally.

## Resend and Vercel

The store-updates form creates or updates a Resend contact and opts that contact into the public
**Vibe Store Updates** topic. The topic's name and description live in Resend, not in this repo, and
subscribers see both on the preference and unsubscribe pages — change them there, not here.

`RESEND_TOPIC_ID` must match a topic that actually exists in the Resend account the API key belongs
to. It drifted once: the committed fallback pointed at a deleted topic while production set no
override, so every signup hit an ID that returned 404. If you rebuild the topic, update the Vercel
env var and the fallback in `api/subscribe.js` together.
New-signup admin notifications include the canonical Vibe support email, phone, and postal address.

Add these Environment Variables to the Vercel project for Production, Preview, and Development:

- `RESEND_API_KEY` — a full-access key from the FAS Motorsports Resend account (required)
- `RESEND_TOPIC_ID` — `63f281c0-b99e-4a94-9840-d4f2613d5778`
- `RESEND_NOTIFY_EMAIL` — `vibesupplypg@gmail.com` to receive private signup notices (optional)
- `RESEND_FROM_EMAIL` — `Vibe Website <website@updates.fasmotorsports.com>` (optional)

The API key must stay server-side and must never use a `VITE_` prefix. The currently verified Resend domain belongs to FAS Motorsports, so the integration only uses it for private admin notifications. Verify a Vibe-owned domain in Resend before sending branded confirmations or broadcasts to subscribers.

## Google Maps

The Visit section carries a Google Maps *Locator Plus* map (`src/StoreLocatorMap.jsx`, config and
canonical NAP in `src/storeLocation.js`). Address search, drive time, directions and Business Profile
hours are the component's; "Use my location" is ours (`src/geolocate.js` — W3C geolocation → Distance
Matrix drive estimate, straight-line fallback → directions link opens with your origin); the pin and Place ID are Google's published ones for the
shop. Google's bundle loads from its CDN only when the section scrolls near.

Set `VITE_GOOGLE_MAPS_API_KEY` in Vercel (Production, Preview, Development) — a browser key restricted
by HTTP referrer (`vibesupplyco.org/*`, `www.vibesupplyco.org/*`, `*.vercel.app/*`, `localhost`) and to
the Maps JavaScript, Places, Directions and Distance Matrix APIs. `VITE_GOOGLE_MAPS_MAP_ID` is optional.
With no key the block prints the address and a directions link instead of a broken map.

Every `MAPS_URL` on the site (visit block, footer, support page) now reads from `src/storeLocation.js`
and carries the Place ID, so Google opens the Business Profile card rather than a plain search.

## Checks

```bash
pnpm run lint
pnpm run build
```
