/**
 * Browser geolocation + drive estimate for the store locator.
 *
 * Locator Plus has no public "use my location" API, so this adds one beside it:
 * W3C `navigator.geolocation` (accurate, user-consented — never IP guessing) →
 * Google Distance Matrix for real drive time when the Maps JS API is on the page
 * → straight-line miles as the fallback → the directions link rewritten with the
 * origin so Google Maps opens a real route.
 */

/**
 * @typedef {{ lat: number, lng: number }} LatLng
 * @typedef {{ coords: LatLng, placeId: string }} DriveDestination
 * @typedef {{ distanceText: string, durationText: string | null, source: 'google' | 'straight-line' }} DriveEstimate
 * @typedef {'unsupported' | 'denied' | 'unavailable' | 'timeout'} GeolocationFailure
 */

export class GeolocationError extends Error {
  /** @param {GeolocationFailure} reason */
  constructor(reason) {
    super(`Geolocation failed: ${reason}`)
    this.name = 'GeolocationError'
    this.reason = reason
  }
}

/** @returns {Promise<LatLng>} */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    const { navigator } = window
    if (!('geolocation' in navigator)) {
      reject(new GeolocationError('unsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => {
        const reason =
          error.code === error.PERMISSION_DENIED
            ? 'denied'
            : error.code === error.TIMEOUT
              ? 'timeout'
              : 'unavailable'
        reject(new GeolocationError(reason))
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  })
}

const EARTH_RADIUS_MILES = 3958.8

/**
 * @param {LatLng} a
 * @param {LatLng} b
 */
export function straightLineMiles(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h))
}

function formatMiles(miles) {
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`
}

/**
 * @param {LatLng} origin
 * @param {DriveDestination} destination
 * @returns {Promise<DriveEstimate | null>}
 */
async function googleDriveEstimate(origin, destination) {
  const api = window.google?.maps
  if (!api?.importLibrary) return null
  try {
    const { DistanceMatrixService } = await api.importLibrary('routes')
    const response = await new DistanceMatrixService().getDistanceMatrix({
      origins: [origin],
      destinations: [{ placeId: destination.placeId }],
      travelMode: 'DRIVING',
      unitSystem: api.UnitSystem?.IMPERIAL ?? 1,
    })
    const element = response.rows[0]?.elements[0]
    if (!element || element.status !== 'OK' || !element.distance) return null
    return { distanceText: element.distance.text, durationText: element.duration?.text ?? null, source: 'google' }
  } catch {
    return null
  }
}

/**
 * @param {LatLng} origin
 * @param {DriveDestination} destination
 * @returns {Promise<DriveEstimate>}
 */
export async function estimateDrive(origin, destination) {
  return (
    (await googleDriveEstimate(origin, destination)) ?? {
      distanceText: formatMiles(straightLineMiles(origin, destination.coords)),
      durationText: null,
      source: 'straight-line',
    }
  )
}

/**
 * @param {DriveEstimate} estimate
 * @param {string} label
 */
export function formatDriveEstimate(estimate, label) {
  if (estimate.source === 'google') {
    return estimate.durationText
      ? `${estimate.durationText} drive · ${estimate.distanceText} from ${label}`
      : `${estimate.distanceText} from ${label}`
  }
  return `${estimate.distanceText} from ${label} (straight line)`
}

/** @param {GeolocationFailure} reason */
export function geolocationMessage(reason) {
  switch (reason) {
    case 'unsupported':
      return 'Location services are not available in this browser.'
    case 'denied':
      return 'Location access was declined. Use Get directions to enter your starting point.'
    case 'timeout':
      return 'Finding your location took too long. Try again or use Get directions.'
    default:
      return 'We could not determine your location. Use Get directions to enter your starting point.'
  }
}

/**
 * Rewrite a Google Maps `dir/` URL so it starts from `origin`.
 * @param {string} href
 * @param {LatLng} origin
 */
export function withOrigin(href, origin) {
  const url = new URL(href)
  url.searchParams.set('origin', `${origin.lat},${origin.lng}`)
  return url.toString()
}
