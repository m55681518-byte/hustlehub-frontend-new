import React from 'react'

const navItems = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'findWork', label: 'Find Work', icon: '🔍' },
  { id: 'postHustle', label: 'Post', icon: '➕' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'profile', label: 'Profile', icon: '👤' }
]

export default function BottomNav({ currentPage, setPage }) {
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={currentPage === item.id ? 'active' : ''}
          onClick={() => setPage(item.id)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
