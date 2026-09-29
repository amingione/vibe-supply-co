import { useEffect, useRef, useState } from 'react'
import { getStoreDay } from './storeHours'
import './shop-updates.css'

const CALENDAR_IMAGE = '/products/dumpling-advent-calendar.jpg'
const OCTOBER_OFFER_END = new Date('2026-11-01T00:00:00-04:00').getTime()
const GENERAL_ANNOUNCEMENT = 'October Specials • Different Deals Everyday'
const BANNER_ROTATION_MS = 6000

const DAILY_ANNOUNCEMENTS = [
  'SUNDAY • VIBE DAY ~ $2 OFF VIBE MERCH',
  'GUMMY MONDAY ~ $2.50 OFF TREEHOUSE GUMMIES',
  'TUCK IT TUESDAY - BOGO ROLL',
  'WRAP IT WEDNESDAY • BUY 3 GET 5',
  'COLLAB THURSDAY - SEE DETAILS',
  'FIRE EM’ UP FRIDAY',
  'SPOOKTACULAR SATURDAY',
]

function useShopClock() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const refresh = () => setNow(Date.now())
    let timer
    const tick = () => {
      refresh()
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000))
    }
    timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000))
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return now
}

export function DailyBanner() {
  const now = useShopClock()
  const today = getStoreDay(new Date(now))

  if (today.date >= '2026-11-01') return null

  return (
    <div className="daily-banner-space">
      <DailyBannerRotation key={today.date} dayIndex={today.dayIndex} />
    </div>
  )
}

function DailyBannerRotation({ dayIndex }) {
  const [slide, setSlide] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const arrowButton = useRef(null)
  const detailsButton = useRef(null)
  const announcement = DAILY_ANNOUNCEMENTS[dayIndex]
  const [thursdayLabel, thursdayAction] = announcement.split(' - ')

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => 1 - current), BANNER_ROTATION_MS)
    return () => window.clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setDetailsOpen(false)
    setSlide((current) => 1 - current)
  }

  return (
    <aside
      className={`daily-banner${slide === 0 ? ' daily-banner--preview' : dayIndex === 0 ? ' daily-banner--offer' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="October specials"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && detailsOpen) {
          setDetailsOpen(false)
          if (slide === 1) detailsButton.current?.focus()
          else arrowButton.current?.focus()
        }
      }}
    >
      <div className="daily-banner__row">
        <div className="daily-banner__viewport" aria-live="off">
          <div className="daily-banner__track" style={{ transform: `translateX(-${slide * 100}%)` }}>
            <div className="daily-banner__slide" role="group" aria-roledescription="slide" aria-label="1 of 2" aria-hidden={slide !== 0} inert={slide !== 0}>
              <span>{GENERAL_ANNOUNCEMENT}</span>
            </div>
            <div className="daily-banner__slide" role="group" aria-roledescription="slide" aria-label="2 of 2" aria-hidden={slide !== 1} inert={slide !== 1}>
              {dayIndex === 4 ? (
                <button
                  className="daily-banner__details"
                  ref={detailsButton}
                  type="button"
                  aria-expanded={detailsOpen}
                  aria-controls="daily-banner-details"
                  onClick={() => setDetailsOpen((current) => !current)}
                >
                  {thursdayLabel} - <span>{thursdayAction}</span>
                </button>
              ) : <span>{announcement}</span>}
            </div>
          </div>
        </div>
        <button
          className="daily-banner__arrow"
          ref={arrowButton}
          type="button"
          aria-label={slide === 0 ? "Show today's deal" : 'Show October specials'}
          onClick={nextSlide}
        >
          <span aria-hidden="true">➜</span>
        </button>
      </div>
      {detailsOpen && (
        <div className="daily-banner__panel" id="daily-banner-details">
          <p>Steps (must complete in store):</p>
          <ol>
            <li>Like us on social media</li>
            <li>Follow us on social media</li>
            <li>Leave us a Google review</li>
          </ol>
        </div>
      )}
    </aside>
  )
}

export function OctoberMerchOffer() {
  const now = useShopClock()

  if (now >= OCTOBER_OFFER_END) return null

  return (
    <aside className="merch-offer" aria-label="October merchandise offer">
      <span className="shop-update-label">Sundays in October 2026</span>
      <strong>$2 off Vibe merchandise</strong>
      <span>Excludes lighters. In store on Sundays, October 4, 11, 18 &amp; 25.</span>
    </aside>
  )
}

export function CalendarBanner() {
  return (
    <aside className="calendar-banner" aria-labelledby="calendar-banner-title">
      <img
        src={CALENDAR_IMAGE}
        alt="Mystery Dumpling advent calendar with holiday squishy toys"
        width="1284"
        height="936"
        decoding="async"
      />
      <div className="calendar-banner__copy">
        <span className="shop-update-label">Coming soon to Vibe</span>
        <h2 id="calendar-banner-title">Dumpling advent calendar</h2>
        <p>24 mystery surprises for your holiday countdown. Arrival date to be announced.</p>
      </div>
      <a className="calendar-banner__link" href="#little-finds">
        Meet the little finds <span aria-hidden="true">↗</span>
      </a>
    </aside>
  )
}

export default function ShopUpdates() {
  const cards = useRef(null)
  const [navigation, setNavigation] = useState({ previous: false, next: false, scrollable: false })

  useEffect(() => {
    const rail = cards.current
    const updateNavigation = () => {
      const end = rail.scrollWidth - rail.clientWidth
      const next = {
        previous: rail.scrollLeft > 2,
        next: rail.scrollLeft < end - 2,
        scrollable: end > 2,
      }
      setNavigation((current) => Object.keys(next).every((key) => current[key] === next[key]) ? current : next)
    }
    const observer = new window.ResizeObserver(updateNavigation)
    observer.observe(rail)
    rail.addEventListener('scroll', updateNavigation, { passive: true })
    updateNavigation()
    return () => {
      observer.disconnect()
      rail.removeEventListener('scroll', updateNavigation)
    }
  }, [])

  const moveCards = (direction) => {
    const rail = cards.current
    const [first, second] = rail.children
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left
    rail.scrollBy({
      left: direction * step,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  return (
    <section className="shop-updates" id="little-finds" aria-labelledby="little-finds-heading">
      <div className="shop-updates__heading">
        <div>
          <span className="shop-update-label">A little something for your day</span>
          <h2 id="little-finds-heading" tabIndex="-1">Dumplings &amp; NeeDoh’s<span>.</span></h2>
        </div>
        <p>Squishy desk companions and little gifts. Take a look at what&apos;s in the shop.</p>
      </div>

      <div
        className="little-finds-grid"
        id="little-finds-cards"
        ref={cards}
        role="region"
        aria-label="Dumplings and NeeDoh product cards"
        tabIndex={navigation.scrollable ? 0 : -1}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget || !navigation.scrollable) return
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            moveCards(event.key === 'ArrowRight' ? 1 : -1)
          }
        }}
      >
        <article className="little-find">
          <img
            src="/products/squishy-dumplings.jpg"
            alt="Rainbow Mystery squishy Dumplings in their basket-shaped packages"
            width="1202"
            height="1535"
            loading="lazy"
            decoding="async"
          />
          <div className="little-find__copy">
            <span className="shop-update-label">Find them in store</span>
            <h3>Squishy Dumplings</h3>
            <p>A tiny basket, a mystery color, and a very squishy dumpling inside.</p>
            <a className="text-link" href="#visit">Come take a look <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article className="little-find little-find--needoh">
          <img
            src="/products/needoh-nice-cream-cone.jpg"
            alt="Pink and blue NeeDoh Nice Cream Cone squishy toys on the shop display"
            width="1284"
            height="1259"
            loading="lazy"
            decoding="async"
          />
          <div className="little-find__copy">
            <span className="shop-update-label">Nice Cream Cone · $6.99</span>
            <h3>A scoop of NeeDoh</h3>
            <p>All the swirls, none of the melting. Meet the Nice Cream Cone squishy toy.</p>
            <a className="text-link" href="#visit">Find your favorite <span aria-hidden="true">↗</span></a>
          </div>
        </article>

      </div>
      {navigation.scrollable && (
        <div className="little-finds-controls">
          <span>Swipe to explore</span>
          <div>
            <button type="button" aria-label="Previous find" aria-controls="little-finds-cards" disabled={!navigation.previous} onClick={() => moveCards(-1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" aria-label="Next find" aria-controls="little-finds-cards" disabled={!navigation.next} onClick={() => moveCards(1)}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
