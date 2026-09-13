/**
 * Canonical NAP + Google Maps Locator Plus configuration for the shop.
 *
 * One location, one source: the address block, the footer link, the support
 * page and the map all read from here.
 */

export const STORE = Object.freeze({
  name: 'Vibe Smoke & Supply Co',
  address1: '5260 Duncan Rd, Unit 3',
  address2: 'Punta Gorda, FL 33982',
  // Pin + Place ID as Google Business Profile publishes the shop (Maps Quick Builder export, 2026-09-08).
  coords: Object.freeze({ lat: 26.956058, lng: -81.9914791 }),
  placeId: 'ChIJNxwhCIGn3IgRwB2qMg5DIZI',
})

export const STORE_ADDRESS_ONE_LINE = `${STORE.address1}, ${STORE.address2}`

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  STORE_ADDRESS_ONE_LINE,
)}&query_place_id=${STORE.placeId}`

export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  STORE_ADDRESS_ONE_LINE,
)}&destination_place_id=${STORE.placeId}&travelmode=driving`

export const LOCATOR_LIBRARY_URL =
  'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.15/index.min.js'
export const LOCATOR_SOLUTION_CHANNEL = 'GMP_QB_locatorplus_v11_cABCDEF'

/**
 * @typedef {{ lat: number, lng: number }} LatLng
 * @typedef {{ label: string, defaultUrl: string }} LocatorAction
 * @typedef {{ title: string, address1: string, address2: string, coords: LatLng, placeId: string, actions?: LocatorAction[] }} LocatorLocation
 * @typedef {{
 *   locations: LocatorLocation[],
 *   mapOptions: { center: LatLng, zoom: number, maxZoom: number, mapId: string, fullscreenControl: boolean, mapTypeControl: boolean, streetViewControl: boolean, zoomControl: boolean },
 *   mapsApiKey: string,
 *   capabilities: { input: boolean, autocomplete: boolean, directions: boolean, distanceMatrix: boolean, details: boolean, actions: boolean },
 * }} LocatorConfiguration
 */

/** @type {LocatorLocation} */
export const STORE_LOCATION = {
  title: STORE.name,
  address1: STORE.address1,
  address2: STORE.address2,
  coords: STORE.coords,
  placeId: STORE.placeId,
  actions: [{ label: 'Store hours & updates', defaultUrl: '/#visit' }],
}

/**
 * Shape accepted by `gmpx-store-locator.configureFromQuickBuilder()`.
 * @param {string} mapsApiKey
 * @param {string} mapId
 * @returns {LocatorConfiguration}
 */
export function buildLocatorConfiguration(mapsApiKey, mapId) {
  return {
    locations: [STORE_LOCATION],
    mapOptions: {
      center: STORE_LOCATION.coords,
      zoom: 15,
      maxZoom: 17,
      mapId,
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
    },
    mapsApiKey,
    capabilities: {
      input: true,
      autocomplete: true,
      directions: true,
      distanceMatrix: true,
      details: true,
      actions: true,
    },
  }
}
