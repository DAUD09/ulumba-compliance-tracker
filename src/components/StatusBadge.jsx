import { daysUntil } from '../utils/dateUtils'

const LABELS = {
  VALID: 'Valid',
  EXPIRING_SOON: 'Expiring soon',
  EXPIRED: 'Expired',
  UNKNOWN: 'Unknown',
}

export default function StatusBadge({ status, expiryDate }) {
  const days = expiryDate ? daysUntil(expiryDate) : null
  let detail = ''
  if (status === 'EXPIRED' && days !== null) {
    const d = Math.abs(days)
    detail = `${d} day${d === 1 ? '' : 's'} ago`
  } else if (status === 'EXPIRING_SOON' && days !== null) {
    detail = days === 0 ? 'today' : `in ${days} day${days === 1 ? '' : 's'}`
  }

  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      <span className="status-dot" />
      {LABELS[status] || status}
      {detail && <span className="status-detail">· {detail}</span>}
    </span>
  )
}
