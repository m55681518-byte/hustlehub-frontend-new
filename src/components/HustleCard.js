import React from 'react'

export default function HustleCard({ hustle, onClick }) {
  const formatDate = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000 / 60)

    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  const formatPrice = (amount) => {
    if (!amount) return 'Negotiable'
    return `KSh ${parseFloat(amount).toLocaleString()}`
  }

  return (
    <div className="hustle-card card" onClick={onClick}>
      <div className="hustle-card-header">
        <span className="badge badge-primary">{hustle.category || 'General'}</span>
        <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>
          {formatDate(hustle.created_at)}
        </span>
      </div>

      <h3 className="hustle-card-title">{hustle.title}</h3>

      {hustle.description && (
        <p className="hustle-card-desc">{hustle.description}</p>
      )}

      <div className="hustle-card-footer">
        <span className="hustle-card-price">{formatPrice(hustle.payout_amount)}</span>
        <button className="btn btn-sm btn-primary" style={{ width: 'auto' }}>
          Apply
        </button>
      </div>
    </div>
  )
}
