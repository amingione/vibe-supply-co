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

## Store directions and footer

The top store-details card is the `#visit` destination. Its compact **Use my location** and
**Get directions** controls use `StoreDirections` in `src/StoreLocatorMap.jsx` and the canonical
address/Place ID in `src/storeLocation.js`. Location is requested only after a click; permission
failure leaves the ordinary directions link available. `src/geolocate.js` adds the visitor's
origin to that link and reports straight-line distance (or driving distance if Maps is available).
The old map/fallback panel is no longer rendered, and Google's map bundle is not loaded by the
homepage. The unused map component remains in source.

Every `MAPS_URL` on the site (visit block, footer, support page) now reads from `src/storeLocation.js`
and carries the Place ID, so Google opens the Business Profile card rather than a plain search.

Live opening status appears below the calendar banner. After it scrolls above the screen,
a compact right-side tab appears just below the sticky banner 350ms after scrolling stops and
slides away as scrolling resumes. It shows only the short opening/closing headline, with the full
message retained in the top status strip and available to screen readers.
Both displays share the same status and refresh each minute and on window focus, using Punta Gorda's
timezone. The tab links back to the top store-details card; reduced-motion settings remove the slide.

The shared footer begins with a contrasting aqua **In the loop** signup band. On mobile the email
field and Subscribe button stay on one compact row. The existing subscription endpoint, honeypot,
loading, error and confirmation behavior are retained. The after-hours phone line is in the footer;
the former standalone hours/after-hours box has been removed.

## Shop announcements

The homepage's **Little Finds** section and Dumpling advent-calendar banner live in
`src/ShopUpdates.jsx`, with styles in `src/shop-updates.css`. The images in
`public/products/` are unchanged web copies of `IMG_2994.jpeg`, `IMG_2995.jpeg`,
and `IMG_2996.jpeg` from `docs/marketing/images/`; the supplied originals remain intact.
The NeeDoh Nice Cream Cone's $6.99 price comes from the display label in IMG_2996.
The two product cards are upright, with large uncropped photos above their copy. At widths up to
600px they form a swipeable, scroll-snapping row with previous/next buttons and keyboard arrow
support. Wider screens show both cards side by side, capped at a combined width of 46rem.

The calendar is marked **Coming soon**, with no invented arrival date or price.
It is a persistent banner below the header and above the main hero headline.
**Meet the little finds** links to the Dumplings and NeeDoh's section. The former
popup and its session-storage/timer behavior have been removed.

The header is half its former height at each breakpoint. Its transparent logo
has no frame and is centered on the boundary between the header and hero, with
half of the logo extending below the header. The footer logo is unchanged.

The hero includes the address, clickable phone and email, and weekly hours from
the shared address and hours sources. Desktop uses the navy starburst; phones
use a compact contact card below a two-line headline.

At widths up to 820px, the layout uses smaller headings, tighter spacing,
compact product cards, and shorter images. The fixed bottom navigation provides
Home, Finds, Visit, and Call with 44px-plus touch targets and active section
feedback. It also appears on Support and Collaborate, linking back to the home
sections. Safe-area padding and bottom page clearance keep content above the
bar. Desktop retains the larger composition and hides the bottom navigation.

The announcement strip above the header rotates every six seconds between
**October Specials • Different Deals Everyday** and the current weekday's deal.
The arrow advances to the other message without navigating or calling the store.
The strip stays fixed to the top throughout the homepage, at 32px tall on mobile
and 48px on desktop. A matching spacer and section-link offsets keep it from
covering the header or anchor destinations.
The day is selected using Punta Gorda's `America/New_York` date, regardless of
the visitor's timezone.
It checks on minute boundaries and when the tab regains focus or visibility,
so an open page updates when the local day changes. It does not rely on cookies.
The rotation is active now and uses the exact text from Amber's weekday mockups:

- GUMMY MONDAY ~ $2.50 OFF TREEHOUSE GUMMIES
- TUCK IT TUESDAY - BOGO ROLL
- WRAP IT WEDNESDAY • BUY 3 GET 5
- COLLAB THURSDAY - SEE DETAILS
- FIRE EM’ UP FRIDAY
- SPOOKTACULAR SATURDAY
- SUNDAY • VIBE DAY ~ $2 OFF VIBE MERCH

Amber clarified that Monday refers to gummy candy, Tuesday to bread, and Wednesday
to buying three Dumplings for a $5 discount. The public banners intentionally
retain the exact teaser wording instead of adding those details. The top strip
hides automatically after October; no extra Friday/Saturday offer is inferred.
Rotation continues automatically after arrow clicks, during hover/focus, and
while Thursday's **SEE DETAILS** panel is open. There are no play/pause controls.
The details remain open for reading until dismissed with Escape or the arrow.
Reduced-motion preferences disable the sliding animation.

The flyer in `IMG_2993.jpeg` specifies **$2 off Vibe merchandise on Sundays in
October, excluding lighters**. The tumbler section retains those terms and lists
October 4, 11, 18, and 25, 2026. It hides the offer after October ends in
America/New_York (checked every minute). No everyday discount has been assumed.

## Checks

```bash
pnpm run lint
pnpm run build
```
