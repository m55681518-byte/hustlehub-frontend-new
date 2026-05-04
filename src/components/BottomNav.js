const TABS = [
  { id: 'home',       icon: '🏠', label: 'Home'    },
  { id: 'findWork',   icon: '🔍', label: 'Work'    },
  { id: 'postHustle', icon: '+',  label: '',       }, // Primary Action
  { id: 'messages',   icon: '💬', label: 'Chat'    },
  { id: 'profile',    icon: '👤', label: 'Profile' },
]

export default function BottomNav({ currentPage, setPage }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`nav-item ${tab.id === 'postHustle' ? 'post-btn' : ''} ${currentPage === tab.id ? 'active' : ''}`}
          onClick={() => setPage(tab.id)}
        >
          <div className="nav-icon-container">
            <span className="nav-icon">{tab.icon}</span>
          </div>
          {tab.label && <span className="nav-label">{tab.label}</span>}
        </button>
      ))}
    </nav>
  )
}