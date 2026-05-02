import React, { useState } from 'react'

export default function HustleDetail({ hustle, onBack }) {
  const [applying, setApplying] = useState(false)

  const handleApply = () => {
    setApplying(true)
    setTimeout(() => {
      setApplying(false)
      alert('Application sent! 🎉')
    }, 1500)
  }

  return (
    <div className="page">
      <div className="top-bar">
        <button className="btn btn-ghost" style={{ width: 'auto' }} onClick={onBack}>← Back</button>
        <h1>Hustle Details</h1>
        <button className="btn btn-ghost" style={{ width: 'auto' }}>⋮</button>
      </div>

      <div style={{ padding: '16px' }}>
        <span className="badge badge-primary">{hustle?.category || 'General'}</span>

        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0' }}>
          {hustle?.title || 'Hustle Title'}
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
              KSh {hustle?.payout_amount?.toLocaleString() || '0'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-700)' }}>Budget</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>📍</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-700)' }}>Nairobi</div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Description</h3>
          <p style={{ color: 'var(--neutral-700)', lineHeight: 1.6 }}>
            {hustle?.description || 'No description provided.'}
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleApply}
          disabled={applying}
        >
          {applying ? 'Sending...' : 'Apply Now'}
        </button>
      </div>
    </div>
  )
}
