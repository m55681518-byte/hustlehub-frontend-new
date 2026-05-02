import React from 'react'

export default function Settings({ setPage }) {
  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { label: 'Edit Profile', action: () => setPage('profile') },
          { label: 'Notifications', action: () => {} },
          { label: 'Payment Methods', action: () => {} },
          { label: 'Help & Support', action: () => {} },
          { label: 'Privacy Policy', action: () => {} },
          { label: 'Terms of Service', action: () => {} }
        ].map(item => (
          <button
            key={item.label}
            className="btn btn-ghost"
            style={{ justifyContent: 'space-between', textAlign: 'left' }}
            onClick={item.action}
          >
            {item.label}
            <span>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
