import { useEffect, useMemo, useState } from 'react'

const OPENING_DATE = new Date('2026-08-08T00:00:00-04:00')

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

function Wordmark({ footer = false }) {
  return (
    <a className={`wordmark ${footer ? 'wordmark--footer' : ''}`} href="#top" aria-label="Vibe Smoke and Supply Co home">
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

function Header() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className="site-header">
      <Wordmark />
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
        <a href="#shop" onClick={closeMenu}>The Shop</a>
        <a href="#in-store" onClick={closeMenu}>What&apos;s In Store</a>
        <a href="#visit" onClick={closeMenu}>Visit</a>
      </nav>
      <a className="opening-link" href="#visit">Opening Aug 8</a>
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

function downloadCalendarEvent() {
  const calendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vibe Smoke & Supply Co//Opening Day//EN',
    'BEGIN:VEVENT',
    'UID:vibe-opening-20260808@vibesupply.co',
    'DTSTAMP:20260802T160000Z',
    'DTSTART;VALUE=DATE:20260808',
    'DTEND;VALUE=DATE:20260809',
    'SUMMARY:Vibe Smoke & Supply Co Opening Day',
    'LOCATION:Punta Gorda\\, Florida',
    'DESCRIPTION:Opening day for Vibe Smoke & Supply Co. Adults 21+ only.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'vibe-smoke-supply-opening-day.ics'
  link.click()
  URL.revokeObjectURL(url)
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
          <button className="calendar-link" type="button" onClick={downloadCalendarEvent}>
            Add opening day to calendar <ArrowIcon />
          </button>
        </div>
      </div>
      <figure className="visit__strip">
        <img src="/assets/shop-exterior.jpg" alt="Warm shop windows glowing at blue hour" />
      </figure>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Wordmark footer />
        <strong>Veteran owned. Punta Gorda proud.</strong>
        <p>Adults 21+ only. Please enjoy responsibly.</p>
      </div>
      <div className="footer__links">
        <nav aria-label="Footer navigation">
          <a href="#shop">The Shop</a>
          <a href="#in-store">What&apos;s In Store</a>
          <a href="#visit">Visit</a>
        </nav>
        <p className="footer__location"><PinIcon /> Punta Gorda, Florida</p>
        <p className="footer__copyright">© 2026 Vibe Smoke &amp; Supply Co.</p>
      </div>
    </footer>
  )
}

export default function App() {
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

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content">
        <Hero />
        <Story />
        <ProductRail />
        <Visit />
      </main>
      <Footer />
    </>
  )
}
