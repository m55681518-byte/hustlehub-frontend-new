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
import PremiumPage from './pages/PremiumPage'
import BottomNav from './components/BottomNav'
import Loading from './components/Loading'
import AIAssistant from './components/AIAssistant'
import './styles/globals.css'

// The log must come AFTER the imports[cite: 7, 8]
console.log("Vercel Build Update - May 2026");

export default function App() {
  const [session, setSession] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedHustle, setSelectedHustle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [adTimer, setAdTimer] = useState(5)
  const [pendingHustle, setPendingHustle] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      if (currentSession) checkPremiumStatus(currentSession.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (currentSession) checkPremiumStatus(currentSession.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkPremiumStatus = async (userId) => {
    try {
      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'success')
        .gte('amount', 30)

      if (data && data.length > 0) {
        setIsPro(true)
      }
    } catch (err) {
      console.error("Error checking pro status:", err)
    }
  }

  useEffect(() => {
    let interval;
    if (showAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer((prev) => prev - 1);
      }, 1000);
    } else if (adTimer === 0) {
      setShowAd(false);
      setAdTimer(5);
      if (pendingHustle) {
        setSelectedHustle(pendingHustle);
        setCurrentPage('hustleDetail');
        setPendingHustle(null);
      }
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer, pendingHustle]);

  const handleHustleClick = (hustle) => {
    if (isPro) {
      setSelectedHustle(hustle);
      setCurrentPage('hustleDetail');
      return;
    }
    if (hustle.pay >= 5000) {
      setPendingHustle(hustle);
      setShowAd(true);
    } else {
      setSelectedHustle(hustle);
      setCurrentPage('hustleDetail');
    }
  }

  const renderPage = () => {
    const props = { 
      setPage: setCurrentPage, 
      onHustleClick: handleHustleClick,
      isPro: isPro,
      session: session
    }

    switch (currentPage) {
      case 'home': return <Home {...props} />
      case 'findWork': return <FindWork {...props} />
      case 'postHustle': return <PostHustle {...props} />
      case 'messages': return <Messages {...props} />
      case 'profile': return <Profile {...props} />
      case 'hustleDetail': return <HustleDetail hustle={selectedHustle} onBack={() => setCurrentPage('home')} />
      case 'settings': return <Settings {...props} />
      case 'premium': return <PremiumPage {...props} />
      default: return <Home {...props} />
    }
  }

  if (loading) return <Loading />
  if (!session) return <Login />

  const showNav = ['home', 'findWork', 'postHustle', 'messages', 'profile'].includes(currentPage)

  return (
    <div className="app">
      <main className="main-content">{renderPage()}</main>
      {showAd && (
        <div className="ad-fullscreen-overlay">
          <div className="ad-badge">PREMIUM AD</div>
          <div style={{ margin: '40px 0', textAlign: 'center' }}>
             <h2 className="font-display" style={{ fontSize: '32px' }}>👑 HustleHub Pro</h2>
             <p style={{ marginTop: '10px', opacity: 0.8 }}>Tired of waiting? Get Pro for KES 30 and never see an ad again.</p>
             <button onClick={() => { setShowAd(false); setCurrentPage('premium'); }} className="btn btn-primary" style={{ marginTop: '24px' }}>Upgrade Now</button>
          </div>
          <div className="ad-timer">Unlocking job in {adTimer}s...</div>
        </div>
      )}
      {showNav && <BottomNav currentPage={currentPage} setPage={setCurrentPage} />}
      <AIAssistant setPage={setCurrentPage} />
    </div>
  )
}"// Final build attempt" 
