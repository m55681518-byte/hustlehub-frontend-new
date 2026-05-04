import React, { useState } from 'react'

export default function Settings({ setPage }) {
  const [activeModal, setActiveModal] = useState(null)
  const closeModals = () => setActiveModal(null)

  const menuItems = [
    { label: 'Edit Profile', action: () => setPage('profile') },
    { label: 'Notifications', action: () => setActiveModal('Notifications') },
    { label: 'Payment Methods', action: () => setActiveModal('Payment Methods') },
    { label: 'Help & Support', action: () => setActiveModal('Help & Support') },
    { label: 'Privacy Policy', action: () => setActiveModal('Privacy Policy') },
    { label: 'Terms of Service', action: () => setActiveModal('Terms of Service') }
  ]

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map(item => (
          <button
            key={item.label}
            className="btn btn-ghost"
            style={{ justifyContent: 'space-between', textAlign: 'left', padding: '16px' }}
            onClick={item.action}
          >
            {item.label}
            <span style={{ color: 'var(--neutral-300)' }}>→</span>
          </button>
        ))}
      </div>

      {/* Coming Soon Modal */}
      {activeModal && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.75)', zIndex: 9999, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px' 
          }} 
          onClick={closeModals}
        >
          <div 
            style={{ 
              background: 'white', padding: '32px 24px', borderRadius: '28px', 
              width: '100%', maxWidth: '340px', textAlign: 'center'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
            <h3 style={{ marginBottom: '10px', fontWeight: 800 }}>{activeModal}</h3>
            <p style={{ color: '#666', fontSize: '15px' }}>
              The <strong>{activeModal}</strong> module is under construction. Check back soon!
            </p>
            <button 
              onClick={closeModals} 
              className="btn btn-primary" 
              style={{ marginTop: '28px', width: '100%' }}
            >
              Back to Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}