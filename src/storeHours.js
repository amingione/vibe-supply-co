export const STORE_TIMEZONE = 'America/New_York'
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Display strings and open/close hours live together so the hours list and the
// live status badge can never drift apart. `opens`/`closes` are store-local 24h.
export const STORE_HOURS = [
  { days: 'Mon – Thu', time: '10am – 10pm', dayIndexes: [1, 2, 3, 4], opens: 10, closes: 22 },
  { days: 'Fri – Sat', time: '10am – 11pm', dayIndexes: [5, 6], opens: 10, closes: 23 },
  { days: 'Sunday', time: '10am – 6pm', dayIndexes: [0], opens: 10, closes: 18 },
]

export function getStoreDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const date = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  const dayIndex = WEEKDAYS.indexOf(date.weekday)
  return {
    weekday: date.weekday,
    dayIndex,
    date: `${date.year}-${date.month}-${date.day}`,
    hours: hoursForDay(dayIndex).time,
  }
}

function formatHour(hour) {
  const suffix = hour >= 12 ? 'pm' : 'am'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}${suffix}`
}

function hoursForDay(dayIndex) {
  return STORE_HOURS.find((row) => row.dayIndexes.includes(dayIndex))
}

// Resolve the clock in Punta Gorda, not in the visitor's timezone — otherwise
// someone browsing from Denver is told we're shut when the doors are open.
function storeNow(now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const found = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return {
    dayIndex: WEEKDAYS.findIndex((day) => day.startsWith(found.weekday)),
    minutes: (Number(found.hour) % 24) * 60 + Number(found.minute),
  }
}

export function getStoreStatus(now = new Date()) {
  const { dayIndex, minutes } = storeNow(now)
  const today = hoursForDay(dayIndex)

  if (today && minutes >= today.opens * 60 && minutes < today.closes * 60) {
    const closing = formatHour(today.closes)
    return {
      isOpen: true,
      headline: `Open 'til ${closing}`,
      detail: `Come see us — the doors are open until ${closing} today.`,
    }
  }

  if (today && minutes < today.opens * 60) {
    const opening = formatHour(today.opens)
    return {
      isOpen: false,
      headline: `Opens ${opening}`,
      detail: `Closed right now — we unlock at ${opening} today.`,
    }
  }

  const nextIndex = (dayIndex + 1) % 7
  const opening = formatHour(hoursForDay(nextIndex).opens)
  return {
    isOpen: false,
    headline: `Opens ${opening}`,
    detail: `Closed for the night — back ${WEEKDAYS[nextIndex]} at ${opening}.`,
  }
}
