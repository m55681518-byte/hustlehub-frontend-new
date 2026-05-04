const CATEGORY_ICONS = {
  Delivery:  '🛵',
  Cleaning:  '🧹',
  Tech:      '💻',
  Design:    '🎨',
  Writing:   '✍️',
  Marketing: '📣',
  Default:   '💼',
}

export default function HustleCard({ hustle, onClick }) {
  const icon = CATEGORY_ICONS[hustle.category] || CATEGORY_ICONS.Default
  const timeAgo = formatTimeAgo(hustle.created_at)

  return (
    <div className="hustle-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="hustle-card-top">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="badge badge-gray">
              {icon} {hustle.category || 'General'}
            </span>
          </div>
          <div className="hustle-title">{hustle.title}</div>
        </div>
        <div className="hustle-payout">
          KSh {(hustle.payout_amount || 0).toLocaleString()}
        </div>
      </div>

      {hustle.description && (
        <div className="hustle-desc" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {hustle.description}
        </div>
      )}

      <div className="hustle-footer">
        <span className="hustle-time">
          🕐 {timeAgo}
        </span>
        <button
          className="btn btn-primary btn-sm"
          onClick={e => { e.stopPropagation(); onClick && onClick() }}
        >
          Apply →
        </button>
      </div>
    </div>
  )
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Just now'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  return `${days}d ago`
}
