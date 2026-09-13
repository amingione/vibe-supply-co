import { useEffect, useRef, useState } from 'react'

import {
  GeolocationError,
  estimateDrive,
  formatDriveEstimate,
  geolocationMessage,
  getCurrentPosition,
  withOrigin,
} from './geolocate'
import {
  DIRECTIONS_URL,
  LOCATOR_LIBRARY_URL,
  LOCATOR_SOLUTION_CHANNEL,
  STORE,
  STORE_ADDRESS_ONE_LINE,
  STORE_LOCATION,
  buildLocatorConfiguration,
} from './storeLocation'

const MAPS_API_KEY = String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '').trim()
const MAP_ID = String(import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? '').trim() || 'DEMO_MAP_ID'

/** @type {Promise<void> | undefined} */
let libraryPromise

/** Inject Google's module bundle once per page lifetime. */
function loadLibrary() {
  if (libraryPromise) return libraryPromise
  libraryPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${LOCATOR_LIBRARY_URL}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = LOCATOR_LIBRARY_URL
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Locator library failed to load')), { once: true })
    document.head.append(script)
  })
  return libraryPromise
}

/**
 * The shop on a Google map — Locator Plus (`gmpx-store-locator`), Vibe-skinned.
 *
 * Address search, use-my-location, drive time, directions and Business Profile
 * hours come from the component. Google's bundle loads only when the block nears
 * the viewport; with no key the block shows the address and a directions link.
 */
export default function StoreLocatorMap() {
  const rootRef = useRef(null)
  const locatorRef = useRef(null)
  const [state, setState] = useState(MAPS_API_KEY ? 'idle' : 'no-key')
  const [directionsHref, setDirectionsHref] = useState(DIRECTIONS_URL)
  const [route, setRoute] = useState({ state: 'idle', message: STORE_ADDRESS_ONE_LINE })
  const [geoSupported, setGeoSupported] = useState(true)

  async function useMyLocation() {
    setRoute({ state: 'loading', message: 'Finding your current location…' })
    try {
      const origin = await getCurrentPosition()
      setDirectionsHref(withOrigin(DIRECTIONS_URL, origin))
      setRoute({ state: 'loading', message: 'Calculating the drive from your location…' })
      const estimate = await estimateDrive(origin, { coords: STORE_LOCATION.coords, placeId: STORE_LOCATION.placeId })
      setRoute({ state: 'success', message: formatDriveEstimate(estimate, 'your location') })
    } catch (error) {
      const reason = error instanceof GeolocationError ? error.reason : 'unavailable'
      if (reason === 'unsupported') setGeoSupported(false)
      setRoute({ state: 'error', message: geolocationMessage(reason) })
    }
  }

  useEffect(() => {
    if (!MAPS_API_KEY) return undefined
    const root = rootRef.current
    if (!root) return undefined

    let cancelled = false

    async function boot() {
      setState('loading')
      try {
        // React reserves the `key` prop, so <gmpx-api-loader key="…"> can't be
        // written in JSX — the element is created imperatively instead.
        if (!root.querySelector('gmpx-api-loader')) {
          const loader = document.createElement('gmpx-api-loader')
          loader.setAttribute('key', MAPS_API_KEY)
          loader.setAttribute('solution-channel', LOCATOR_SOLUTION_CHANNEL)
          root.prepend(loader)
        }
        await loadLibrary()
        await window.customElements.whenDefined('gmpx-store-locator')
        const locator = locatorRef.current
        if (cancelled || !locator) return
        locator.configureFromQuickBuilder(buildLocatorConfiguration(MAPS_API_KEY, MAP_ID))
        setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    }

    if (!('IntersectionObserver' in window)) {
      boot()
      return () => {
        cancelled = true
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        boot()
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(root)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  return (
    <div className="locator" ref={rootRef} data-state={state}>
      <div className="locator__frame">
        {state === 'no-key' ? (
          <div className="locator__fallback" role="status">
            <strong>{STORE.name}</strong>
            <span>{STORE_ADDRESS_ONE_LINE}</span>
            <small>Interactive map unavailable — use the directions link.</small>
          </div>
        ) : (
          <>
            <gmpx-store-locator
              ref={locatorRef}
              map-id={MAP_ID}
              role="region"
              aria-label={`Interactive map showing ${STORE.name} in Punta Gorda with directions`}
            />
            {state !== 'ready' ? (
              <div className="locator__loading" aria-hidden="true">
                <span>{state === 'error' ? `${STORE_ADDRESS_ONE_LINE} · map unavailable` : STORE_ADDRESS_ONE_LINE}</span>
              </div>
            ) : null}
          </>
        )}
      </div>
      <p className="locator__status" data-state={route.state} role="status" aria-live="polite">
        {route.message}
      </p>
      <div className="locator__actions">
        {geoSupported ? (
          <button
            type="button"
            className="locator__locate"
            onClick={useMyLocation}
            aria-busy={route.state === 'loading' ? 'true' : undefined}
            disabled={route.state === 'loading'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="7" />
            </svg>
            Use my location
          </button>
        ) : null}
        <a className="locator__directions" href={directionsHref} target="_blank" rel="noreferrer">
          Get directions
          <svg className="arrow arrow--right" viewBox="0 0 28 16" aria-hidden="true">
            <path d="M1 8h24M18 1l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}
