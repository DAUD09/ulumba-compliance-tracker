// How many days out counts as "expiring soon". Tweak as needed.
export const EXPIRING_SOON_WINDOW_DAYS = 30

/**
 * Computes a live status for a document based on today's date, rather than
 * trusting a static "status" column that can go stale.
 * Returns one of: 'EXPIRED' | 'EXPIRING_SOON' | 'VALID' | 'UNKNOWN'
 */
export function computeLiveStatus(expiryDate) {
  if (!expiryDate) return 'UNKNOWN'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  if (isNaN(expiry.getTime())) return 'UNKNOWN'

  const diffMs = expiry.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'EXPIRED'
  if (diffDays <= EXPIRING_SOON_WINDOW_DAYS) return 'EXPIRING_SOON'
  return 'VALID'
}

export function daysUntil(expiryDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
