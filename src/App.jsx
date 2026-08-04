import { useEffect, useMemo, useState } from 'react'

const OPENING_DATE = new Date('2026-08-08T00:00:00-04:00')
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=5260%20Duncan%20Rd%20Unit%203%2C%20Punta%20Gorda%2C%20FL%2033982'
const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vibe%20Smoke%20%26%20Supply%20Co%20Opening%20Day&dates=20260808%2F20260809&details=Opening%20day%20for%20Vibe%20Smoke%20%26%20Supply%20Co.%20Adults%2021%2B%20only.&location=5260%20Duncan%20Rd%2C%20Unit%203%2C%20Punta%20Gorda%2C%20FL%2033982'

const tumblers = [
  { name: 'Mint', src: '/products/vibe-tumbler-mint.jpg' },
  { name: 'Cream', src: '/products/vibe-tumbler-cream.jpg' },
  { name: 'Hot Pink', src: '/products/vibe-tumbler-hot-pink.jpg' },
  { name: 'Charcoal', src: '/products/vibe-tumbler-charcoal.jpg' },
]

const products = [
  { name: 'Vape', detail: 'Devices, e-liquids & more', position: '0%' },
  { name: 'Smoke', detail: 'Glass, papers & essentials', position: '33.333%' },
  { name: 'Accessories', detail: 'Tools, cases & cleanup', position: '66.666%' },
  { name: 'Everyday', detail: 'Cold drinks & quick grabs', position: '100%' },
]

function ArrowIcon({ direction = 'right' }) {
  return (
    <svg
      className={`arrow arrow--${direction}`}
      viewBox="0 0 28 16"
      aria-hidden="true"
    >
      <path d="M1 8h24M18 1l7 7-7 7" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="pin-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

function FoodTruckIcon() {
  return (
    <svg className="collab-icon" viewBox="0 0 64 48" aria-hidden="true">
      <path d="M5 8h35v27H5zM40 18h10l9 10v7H40zM12 15h20v11H12z" />
      <circle cx="17" cy="38" r="5" />
      <circle cx="49" cy="38" r="5" />
      <path d="M45 23h6l4 5H45z" />
    </svg>
  )
}

function PopUpIcon() {
  return (
    <svg className="collab-icon" viewBox="0 0 64 48" aria-hidden="true">
      <path d="M8 18h48L48 7H16zM12 18v24M52 18v24M8 42h48" />
      <path d="M20 18v8M32 18v8M44 18v8M18 42V29h28v13" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg className="value-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 40S7 30 7 17a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 13-17 23-17 23Z" />
    </svg>
  )
}

function HandshakeIcon() {
  return (
    <svg className="value-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="m8 19 8-8 8 4 8-4 8 8M12 23l10 10a4 4 0 0 0 6 0l8-8M18 29l-4 4M23 34l-3 3M30 30l4 4" />
    </svg>
  )
}

function Wordmark({ footer = false, href = '#top' }) {
  return (
    <a className={`wordmark ${footer ? 'wordmark--footer' : ''}`} href={href} aria-label="Vibe Smoke and Supply Co home">
      <img
        src="/assets/vibe-logo.png"
        alt=""
        aria-hidden="true"
        decoding="async"
        loading={footer ? 'lazy' : 'eager'}
      />
    </a>
  )
}

function Header({ innerPage = false }) {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className="site-header">
      <Wordmark href={innerPage ? '/' : '#top'} />
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
        <span className="sr-only">Toggle navigation</span>
      </button>
      <nav id="site-nav" className={`site-nav ${open ? 'site-nav--open' : ''}`} aria-label="Main navigation">
        <a href={innerPage ? '/#shop' : '#shop'} onClick={closeMenu}>The Shop</a>
        <a href={innerPage ? '/#in-store' : '#in-store'} onClick={closeMenu}>What&apos;s In Store</a>
        <a href={innerPage ? '/#tumblers' : '#tumblers'} onClick={closeMenu}>Tumblers</a>
        <a href={innerPage ? '/#visit' : '#visit'} onClick={closeMenu}>Visit</a>
        <a href="/collaborate" onClick={closeMenu}>Collaborate</a>
        <a href="/support" onClick={closeMenu}>Support</a>
      </nav>
      <a className="opening-link" href={innerPage ? '/#visit' : '#visit'}>Opening Aug 8</a>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <Header />
      <div className="hero__grid">
        <div className="hero__copy">
          <h1>
            <span className="hero__word hero__word--navy">Punta</span>
            <span className="hero__word hero__word--navy">Gorda&apos;s</span>
            <span className="hero__word hero__word--orange">New</span>
            <span className="hero__word hero__word--aqua">Vibe.</span>
          </h1>
          <div className="short-rule" />
          <p>Smoke, vape, and everyday essentials—curated for the coast. Doors open August 8.</p>
          <div className="hero__actions">
            <a className="button button--coral" href="#updates">Get opening updates</a>
            <a className="text-link text-link--aqua" href="#visit">
              Plan your visit <ArrowIcon />
            </a>
          </div>
          <small>For adults 21+ only.</small>
        </div>
        <figure className="hero__media">
          <img src="/assets/shop-interior.jpg" alt="Warmly lit modern shop interior at blue hour" />
        </figure>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="story" id="shop">
      <div className="story__copy reveal">
        <div className="short-rule" />
        <h2>Built for locals.<br />Stocked right.</h2>
        <p>
          A clean, comfortable shop with a considered mix of smoke, vape, and everyday essentials.
          Friendly help, no pressure, and a lineup worth coming back for.
        </p>
        <a className="text-link text-link--coral" href="#in-store">
          Meet the new shop <ArrowIcon />
        </a>
      </div>
      <figure className="story__media reveal reveal--delay">
        <img src="/assets/shop-exterior.jpg" alt="A modern neighborhood storefront in Punta Gorda at dusk" />
      </figure>
    </section>
  )
}

function ProductRail() {
  return (
    <section className="assortment" id="in-store">
      <div className="section-heading reveal">
        <div className="short-rule" />
        <h2>Your essentials, all in one stop<span>.</span></h2>
      </div>
      <div className="product-rail reveal reveal--delay">
        <img className="product-rail__image" src="/assets/product-rail.jpg" alt="Vape, smoke, accessory, and everyday essentials arranged on a dark tabletop" />
        <div className="product-rail__labels">
          {products.map((product) => (
            <article className="product-category" key={product.name}>
              <h3>{product.name}</h3>
              <p>{product.detail}</p>
              <div
                className="product-category__mobile-image"
                style={{ '--position': product.position }}
                role="img"
                aria-label={`${product.name} assortment`}
              />
            </article>
          ))}
        </div>
      </div>
      <a className="button button--outline" href="#visit">
        See you opening day <ArrowIcon />
      </a>
    </section>
  )
}

function Tumblers() {
  return (
    <section className="tumblers" id="tumblers">
      <div className="tumblers__feature">
        <div className="tumblers__copy reveal">
          <div className="short-rule" />
          <h2>Carry the vibe<span>.</span></h2>
          <p>
            Vibe tumblers in four standout colors. Pick your favorite in store while supplies last.
          </p>
          <a className="button button--coral" href="#visit">Find them opening day</a>
        </div>
        <figure className="tumblers__group reveal reveal--delay">
          <img
            src="/products/vibe-tumblers-nightlife-background.jpg"
            alt="Mint, cream, hot pink, and charcoal Vibe Smoke and Supply Co tumblers"
            loading="lazy"
          />
        </figure>
      </div>
      <div className="tumblers__rail" aria-label="Vibe tumbler colors">
        {tumblers.map((tumbler) => (
          <figure className="tumbler reveal" key={tumbler.name}>
            <img src={tumbler.src} alt={`${tumbler.name} Vibe tumbler`} loading="lazy" />
            <figcaption>
              <strong>{tumbler.name}</strong>
              <span>Available in store</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function getTimeLeft() {
  const difference = Math.max(0, OPENING_DATE.getTime() - Date.now())
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isOpen: difference === 0,
  }
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const values = useMemo(() => [
    ['Days', timeLeft.days],
    ['Hours', timeLeft.hours],
    ['Minutes', timeLeft.minutes],
    ['Seconds', timeLeft.seconds],
  ], [timeLeft])

  if (timeLeft.isOpen) {
    return <p className="countdown__open">The doors are open.</p>
  }

  return (
    <div className="countdown" aria-label="Countdown to opening day">
      {values.map(([label, value]) => (
        <div className="countdown__unit" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function Visit() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setFormError('')

    try {
      const form = new FormData(event.currentTarget)
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company: form.get('company'),
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'We could not add you right now. Please try again.')
      }

      setSubmitted(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'We could not add you right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="visit" id="visit">
      <div className="visit__grid">
        <div className="visit__date reveal">
          <h2>Pull up August 8.</h2>
          <p>Opening day in Punta Gorda, Florida. Bring your ID—this shop is for adults 21+.</p>
          <address className="visit__contact">
            <a href={MAPS_URL} target="_blank" rel="noreferrer">
              5260 Duncan Rd, Unit 3<br />Punta Gorda, FL 33982
            </a>
            <a href="tel:+18128011391">(812) 801-1391</a>
            <a href="mailto:vibesupplypg@gmail.com">vibesupplypg@gmail.com</a>
          </address>
          <time dateTime="2026-08-08">08 / 08 / 26</time>
          <Countdown />
        </div>
        <div className="updates reveal reveal--delay" id="updates">
          <h3>Get opening updates <ArrowIcon /></h3>
          {submitted ? (
            <div className="form-success" role="status">
              <strong>You&apos;re on the list.</strong>
              <span>See you August 8.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email address</label>
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex="-1" autoComplete="off" />
              </div>
              <div className="form-row">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  disabled={submitting}
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Joining…' : 'Subscribe'}
                </button>
              </div>
              <p>Opening-day details and occasional store updates. Unsubscribe anytime.</p>
              {formError ? <p className="form-error" role="alert">{formError}</p> : null}
            </form>
          )}
          <div className="calendar-links" aria-label="Add opening day to a calendar">
            <a className="calendar-link" href="/vibe-opening-day.ics">
              Add to Apple Calendar <ArrowIcon />
            </a>
            <a className="calendar-link" href={GOOGLE_CALENDAR_URL}>
              Add to Google Calendar <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
      <figure className="visit__strip">
        <img src="/assets/shop-exterior.jpg" alt="Warm shop windows glowing at blue hour" />
      </figure>
    </section>
  )
}

function Footer({ innerPage = false }) {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Wordmark footer href={innerPage ? '/' : '#top'} />
        <strong>Veteran owned. Punta Gorda proud.</strong>
        <p>Adults 21+ only. Please enjoy responsibly.</p>
      </div>
      <div className="footer__links">
        <nav aria-label="Footer navigation">
          <a href={innerPage ? '/#shop' : '#shop'}>The Shop</a>
          <a href={innerPage ? '/#in-store' : '#in-store'}>What&apos;s In Store</a>
          <a href={innerPage ? '/#tumblers' : '#tumblers'}>Tumblers</a>
          <a href={innerPage ? '/#visit' : '#visit'}>Visit</a>
          <a href="/collaborate">Collaborate</a>
          <a href="/support">Support</a>
        </nav>
        <address className="footer__nap">
          <a className="footer__location" href={MAPS_URL} target="_blank" rel="noreferrer">
            <PinIcon />
            <span>5260 Duncan Rd, Unit 3<br />Punta Gorda, FL 33982</span>
          </a>
          <a href="tel:+18128011391">(812) 801-1391</a>
          <a href="mailto:vibesupplypg@gmail.com">vibesupplypg@gmail.com</a>
        </address>
        <p className="footer__copyright">© 2026 Vibe Smoke &amp; Supply Co.</p>
      </div>
    </footer>
  )
}

function CollaboratePage() {
  const [vendorType, setVendorType] = useState('food-truck')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleVendorSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setFormError('')

    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget))
      const response = await fetch('/api/vendor-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'We could not send your request right now. Please try again.')
      }

      setSubmitted(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'We could not send your request right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <a className="skip-link" href="#collaborate-content">Skip to collaboration request</a>
      <main id="collaborate-content">
        <section className="collaborate-page" id="top">
          <Header innerPage />
          <section className="collab-hero">
            <div className="collab-hero__copy reveal">
              <h1><span>Bring</span><span>Your vibe.</span></h1>
              <p>Food trucks, makers, and pop-up shops—let&apos;s build something good together in Punta Gorda.</p>
              <a className="button button--coral" href="#vendor-request">Request a spot</a>
            </div>
            <figure className="collab-hero__media reveal reveal--delay">
              <img
                src="/assets/vendor-collaboration-event.jpg"
                alt="Coral food truck and aqua pop-up canopy at a welcoming Punta Gorda evening event"
              />
            </figure>
          </section>

          <section className="collab-paths" aria-labelledby="collab-paths-title">
            <h2 className="sr-only" id="collab-paths-title">Ways to collaborate</h2>
            <article className="collab-path reveal">
              <div className="collab-path__icon collab-path__icon--coral"><FoodTruckIcon /></div>
              <div>
                <h3>Food trucks</h3>
                <p>Bring the menu and the energy. We&apos;ll coordinate space, timing, and event details with you.</p>
                <a href="#vendor-request" onClick={() => setVendorType('food-truck')}>Request a food truck spot <ArrowIcon /></a>
              </div>
            </article>
            <article className="collab-path reveal reveal--delay">
              <div className="collab-path__icon collab-path__icon--aqua"><PopUpIcon /></div>
              <div>
                <h3>Pop-up shops</h3>
                <p>Makers, artists, and local brands are welcome. Tell us what you sell and what your setup needs.</p>
                <a href="#vendor-request" onClick={() => setVendorType('pop-up')}>Request a pop-up spot <ArrowIcon /></a>
              </div>
            </article>
          </section>

          <section className="vendor-request" id="vendor-request" aria-labelledby="vendor-request-title">
            {submitted ? (
              <div className="vendor-success" role="status">
                <div className="vendor-success__mark" aria-hidden="true">✓</div>
                <div>
                  <h2 id="vendor-request-title">Thanks! We got your request.</h2>
                  <p>We&apos;ll review your info and reach out soon.</p>
                </div>
                <a className="button button--coral" href="/">Back to the shop</a>
              </div>
            ) : (
              <div className="vendor-form-card">
                <h2 id="vendor-request-title">Tell us what you bring.</h2>
                <form onSubmit={handleVendorSubmit}>
                  <div className="form-honeypot" aria-hidden="true">
                    <label htmlFor="vendor-website">Leave this field blank</label>
                    <input id="vendor-website" name="website" type="text" tabIndex="-1" autoComplete="off" />
                  </div>

                  <fieldset className="vendor-type-fieldset">
                    <legend>Collaboration type <span aria-hidden="true">*</span></legend>
                    <div className="vendor-type-options">
                      <label className={`vendor-type-option vendor-type-option--truck ${vendorType === 'food-truck' ? 'vendor-type-option--selected' : ''}`}>
                        <input
                          type="radio"
                          name="collaborationType"
                          value="food-truck"
                          checked={vendorType === 'food-truck'}
                          onChange={(event) => setVendorType(event.target.value)}
                        />
                        <FoodTruckIcon />
                        <span>Food truck</span>
                      </label>
                      <label className={`vendor-type-option vendor-type-option--popup ${vendorType === 'pop-up' ? 'vendor-type-option--selected' : ''}`}>
                        <input
                          type="radio"
                          name="collaborationType"
                          value="pop-up"
                          checked={vendorType === 'pop-up'}
                          onChange={(event) => setVendorType(event.target.value)}
                        />
                        <PopUpIcon />
                        <span>Pop-up shop</span>
                      </label>
                    </div>
                  </fieldset>

                  <div className="vendor-form-grid">
                    <label className="vendor-field vendor-field--wide">
                      <span>Business name <b aria-hidden="true">*</b></span>
                      <input name="businessName" type="text" autoComplete="organization" maxLength="120" required />
                    </label>
                    <label className="vendor-field vendor-field--wide">
                      <span>Contact name <b aria-hidden="true">*</b></span>
                      <input name="contactName" type="text" autoComplete="name" maxLength="120" required />
                    </label>
                    <label className="vendor-field">
                      <span>Email <b aria-hidden="true">*</b></span>
                      <input name="email" type="email" autoComplete="email" maxLength="254" required />
                    </label>
                    <label className="vendor-field">
                      <span>Phone <b aria-hidden="true">*</b></span>
                      <input name="phone" type="tel" autoComplete="tel" maxLength="40" required />
                    </label>
                    <label className="vendor-field vendor-field--wide">
                      <span>Website or social</span>
                      <input name="websiteOrSocial" type="text" placeholder="Website or @handle" maxLength="200" />
                    </label>
                    <label className="vendor-field vendor-field--wide">
                      <span>Preferred date <b aria-hidden="true">*</b></span>
                      <input name="preferredDate" type="text" placeholder="A date, month, or flexible" maxLength="100" required />
                    </label>
                    <label className="vendor-field vendor-field--wide">
                      <span>What do you serve or sell? <b aria-hidden="true">*</b></span>
                      <textarea name="offering" rows="3" maxLength="1200" required />
                    </label>
                    <label className="vendor-field vendor-field--wide">
                      <span>Setup size and power needs <b aria-hidden="true">*</b></span>
                      <textarea name="setupNeeds" rows="3" placeholder="For example: 10×10 tent, 15-foot truck, or 110V power" maxLength="1200" required />
                    </label>
                    <label className="vendor-field vendor-field--wide">
                      <span>Anything else we should know?</span>
                      <textarea name="notes" rows="4" maxLength="2000" />
                    </label>
                  </div>

                  <button className="button button--coral vendor-submit" type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send collaboration request'}
                  </button>
                  <p className="vendor-form-note">We&apos;ll only use these details to review your request and contact you about Vibe events.</p>
                  {formError ? <p className="vendor-form-error" role="alert">{formError}</p> : null}
                </form>
              </div>
            )}
          </section>

          <section className="collab-values" aria-label="What to expect">
            <article>
              <div className="collab-value__icon"><PinIcon /></div>
              <h2>Local first</h2>
              <p>We spotlight local talent and Punta Gorda businesses.</p>
            </article>
            <article>
              <div className="collab-value__icon"><HandshakeIcon /></div>
              <h2>Plan together</h2>
              <p>We&apos;ll work with you on logistics, timing, and setup details.</p>
            </article>
            <article>
              <div className="collab-value__icon"><HeartIcon /></div>
              <h2>Keep it welcoming</h2>
              <p>Great vibes, friendly faces, and a space everyone enjoys.</p>
            </article>
          </section>
        </section>
      </main>
      <Footer innerPage />
    </>
  )
}

function SupportPage() {
  return (
    <>
      <a className="skip-link" href="#support-content">Skip to support</a>
      <main id="support-content">
        <section className="support-page" id="top">
          <Header innerPage />
          <div className="support-page__grid">
            <div className="support-page__intro">
              <div className="short-rule" />
              <h1>We&apos;re here to help.</h1>
              <p>
                Questions about the store, opening day, or a product? Reach out to the Vibe team.
              </p>
              <a className="button button--coral" href="mailto:vibesupplypg@gmail.com">Email support</a>
            </div>
            <section className="support-card" aria-labelledby="support-contact-title">
              <h2 id="support-contact-title">Vibe support</h2>
              <address>
                <a href="mailto:vibesupplypg@gmail.com">vibesupplypg@gmail.com</a>
                <a href="tel:+18128011391">(812) 801-1391</a>
                <a href={MAPS_URL} target="_blank" rel="noreferrer">
                  5260 Duncan Rd, Unit 3<br />Punta Gorda, FL 33982
                </a>
              </address>
              <p>
                For faster help, include your name, question, and the product details you have.
                Please do not email identification documents or other sensitive information.
              </p>
            </section>
          </div>
          <section className="support-faq" aria-labelledby="support-faq-title">
            <h2 id="support-faq-title">Good to know.</h2>
            <div className="support-faq__items">
              <article>
                <h3>When do you open?</h3>
                <p>Opening day is August 8, 2026.</p>
              </article>
              <article>
                <h3>Where are you?</h3>
                <p>5260 Duncan Rd, Unit 3, Punta Gorda, FL 33982.</p>
              </article>
              <article>
                <h3>Who can shop?</h3>
                <p>Vibe is for adults 21+ only. Please bring a valid ID.</p>
              </article>
            </div>
          </section>
        </section>
      </main>
      <Footer innerPage />
    </>
  )
}

export default function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
  const isSupportPage = currentPath === '/support'
  const isCollaboratePage = currentPath === '/collaborate'

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('reveal--visible')
        })
      },
      { threshold: 0.12 },
    )

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const pageTitle = isCollaboratePage
      ? 'Food Truck & Pop-Up Collaborations | Vibe Smoke & Supply Co'
      : isSupportPage
        ? 'Support | Vibe Smoke & Supply Co'
        : 'Vibe Smoke & Supply Co | Punta Gorda, FL'
    const pageDescription = isCollaboratePage
      ? 'Food trucks, makers, artists, and pop-up shops can request to collaborate at Vibe Smoke & Supply Co events in Punta Gorda, Florida.'
      : isSupportPage
        ? 'Contact Vibe Smoke & Supply Co support by email or phone, or visit us at 5260 Duncan Rd, Unit 3, Punta Gorda, FL 33982.'
        : 'Vibe Smoke & Supply Co is a veteran-owned smoke, vape, and supply shop at 5260 Duncan Rd, Unit 3, Punta Gorda, Florida. Opening August 8, 2026. Adults 21+ only.'
    const pageUrl = isCollaboratePage
      ? 'https://www.vibesupplyco.org/collaborate'
      : isSupportPage
        ? 'https://www.vibesupplyco.org/support'
        : 'https://www.vibesupplyco.org/'

    document.title = pageTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', pageDescription)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', pageUrl)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageUrl)
  }, [isCollaboratePage, isSupportPage])

  if (isCollaboratePage) return <CollaboratePage />
  if (isSupportPage) return <SupportPage />

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content">
        <Hero />
        <Story />
        <ProductRail />
        <Tumblers />
        <Visit />
      </main>
      <Footer />
    </>
  )
}
