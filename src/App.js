import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import FindWork from './pages/FindWork'
import PostHustle from './pages/PostHustle'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Login from './pages/Login'
import HustleDetail from './pages/HustleDetail'
import Settings from './pages/Settings'
import BottomNav from './components/BottomNav'
import Loading from './components/Loading'
import './styles/globals.css'

console.log('NEW APP.JS LOADED - VERSION 2.0')

export default function App() {
  const [session, setSession] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedHustle, setSelectedHustle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleHustleClick = (hustle) => {
    setSelectedHustle(hustle)
    setCurrentPage('hustleDetail')
  }

  const renderPage = () => {
    const props = { setPage: setCurrentPage, onHustleClick: handleHustleClick }

    switch (currentPage) {
      case 'home':
        return <Home {...props} />
      case 'findWork':
        return <FindWork {...props} />
      case 'postHustle':
        return <PostHustle {...props} />
      case 'messages':
        return <Messages {...props} />
      case 'profile':
        return <Profile {...props} session={session} />
      case 'hustleDetail':
        return <HustleDetail hustle={selectedHustle} onBack={() => setCurrentPage('findWork')} />
      case 'settings':
        return <Settings {...props} />
      default:
        return <Home {...props} />
    }
  }

  if (loading) return <Loading />
  if (!session) return <Login />

  const showNav = ['home', 'findWork', 'postHustle', 'messages', 'profile'].includes(currentPage)

  return (
    <div className="app">
      <main className="main-content">
        {renderPage()}
      </main>

      {showNav && (
        <BottomNav currentPage={currentPage} setPage={setCurrentPage} />
      )}
    </div>
  )
}