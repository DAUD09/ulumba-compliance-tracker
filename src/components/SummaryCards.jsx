export default function SummaryCards({ counts, activeStatus, onSelect }) {
  const cards = [
    { key: 'ALL', label: 'Total documents', value: counts.total, tone: 'neutral' },
    { key: 'VALID', label: 'Valid', value: counts.valid, tone: 'valid' },
    { key: 'EXPIRING_SOON', label: 'Expiring soon', value: counts.expiringSoon, tone: 'soon' },
    { key: 'EXPIRED', label: 'Expired', value: counts.expired, tone: 'expired' },
  ]

  return (
    <div className="summary-row">
      {cards.map((c) => (
        <button
          key={c.key}
          className={`summary-card tone-${c.tone} ${activeStatus === c.key ? 'is-active' : ''}`}
          onClick={() => onSelect(c.key)}
          type="button"
        >
          <span className="summary-value">{c.value}</span>
          <span className="summary-label">{c.label}</span>
        </button>
      ))}
    </div>
  )
}
