import React, { useState } from 'react'
import EmptyState from '../components/EmptyState'

export default function Messages({ setPage }) {
  const [conversations] = useState([])

  return (
    <div className="page">
      <h1 className="page-title">Messages</h1>

      {conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No messages yet"
          description="Start a conversation by applying to a hustle"
          action={
            <button className="btn btn-primary" onClick={() => setPage('findWork')}>
              Browse Hustles
            </button>
          }
        />
      ) : (
        conversations.map(conv => (
          <div key={conv.id} className="card" style={{ marginBottom: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{conv.name}</div>
              <div style={{ fontSize: '14px', color: 'var(--neutral-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conv.lastMessage}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{conv.time}</div>
          </div>
        ))
      )}
    </div>
  )
}
