import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [tab, setTab] = useState('hustles')
  const [isPremium, setIsPremium] = useState(false)
  const [showPay, setShowPay] = useState(false)
  const [payStatus, setPayStatus] = useState('idle')
  const [phone, setPhone] = useState('')
  const [pollInterval, setPollInterval] = useState(null)
  const [checkoutId, setCheckoutId] = useState(null)

  // Auth state
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authFullName, setAuthFullName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [authMessage, setAuthMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Check auth on load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const hustles = [
    { id: 1, title: 'Complete surveys', pay: 'KES 50-200', free: true },
    { id: 2, title: 'Watch ads', pay: 'KES 20-100', free: true },
    { id: 3, title: 'Refer friends', pay: 'KES 100-500', free: true },
    { id: 4, title: 'Premium tasks', pay: 'KES 500-5,000', free: false },
    { id: 5, title: 'Brand partnerships', pay: 'KES 1,000-10,000', free: false },
  ]

  async function handleAuthSubmit(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              full_name: authFullName,
              phone: authPhone
            }
          }
        })
        if (error) throw error
        setAuthMessage('Sign up successful! Check your email to confirm.')
        console.log('New user UUID:', data.user.id)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        })
        if (error) throw error
        setAuthMessage('Signed in!')
        setShowAuth(false)
        console.log('Signed in user UUID:', data.user.id)
      }
    } catch (err) {
      setAuthMessage('Error: ' + err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function handlePayment() {
    if (!user) {
      setShowAuth(true)
      return
    }
    if (!phone) return alert('Enter M-Pesa phone number')
    setPayStatus('sending')

    try {
      const res = await fetch('https://hustlehub-backend-3h1v.onrender.com/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          amount: 100,
          userId: user.id,
          description: 'HustleHub Pro Subscription'
        })
      })
      const data = await res.json()
      if (data.success && data.data?.checkoutRequestId) {
        setCheckoutId(data.data.checkoutRequestId)
        setPayStatus('waiting')
        startPolling(data.data.checkoutRequestId)
      } else {
        setPayStatus('failed')
        alert(data.message || 'Payment failed')
      }
    } catch (err) {
      setPayStatus('failed')
      alert('Error: ' + err.message)
    }
  }

  function startPolling(id) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://hustlehub-backend-3h1v.onrender.com/payment-status/${id}`)
        const data = await res.json()
        if (data.status === 'success') {
          clearInterval(interval)
          setPollInterval(null)
          setPayStatus('success')
          setIsPremium(true)
          setShowPay(false)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setPollInterval(null)
          setPayStatus('failed')
        }
      } catch (err) {
        console.error('Poll error:', err)
      }
    }, 3000)
    setPollInterval(interval)
  }

  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [pollInterval])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>
            <span style={{ marginRight: '8px' }}>🔥</span> HustleHub Pro
          </div>
          <div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#a0a0c0', fontSize: '14px' }}>
                  👤 {user.user_metadata?.full_name || user.email}
                </span>
                <button 
                  onClick={handleSignOut}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid #ff4757',
                    background: 'transparent',
                    color: '#ff4757',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  border: 'none',
                  background: '#0070f3',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', background: 'linear-gradient(90deg, #0070f3, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Earn KES 500-5,000 Daily
          </h1>
          <p style={{ color: '#a0a0c0', fontSize: '18px', marginBottom: '24px' }}>
            Join 10,000+ Kenyans making money online
          </p>
          {!isPremium && (
            <button 
              onClick={() => setShowPay(true)}
              style={{ 
                padding: '16px 32px', 
                borderRadius: '12px', 
                border: 'none',
                background: 'linear-gradient(90deg, #0070f3, #00d4aa)',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Unlock Pro — KES 100
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {['👥 10K+ Users', '💵 KES 2M+ Paid', '⭐ 4.8/5 Rating', '🛡️ 100% Secure'].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.split(' ')[0]}</div>
              <div style={{ color: '#a0a0c0', fontSize: '12px' }}>{s.split(' ').slice(1).join(' ')}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          {['hustles', 'deals', 'earnings'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: tab === t ? '#0070f3' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: tab === t ? 600 : 400
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'hustles' && hustles.map(h => (
          <div key={h.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{h.title}</h3>
              <span style={{ color: '#00d4aa', fontWeight: 600 }}>{h.pay}</span>
              {!h.free && !isPremium && (
                <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#ff4757', borderRadius: '4px', fontSize: '12px' }}>PRO</span>
              )}
            </div>
            {(h.free || isPremium) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer' }}>
                Start
              </button>
            )}
          </div>
        ))}

        {tab === 'deals' && !isPremium && (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h2>Premium Deals Locked</h2>
            <p style={{ color: '#a0a0c0' }}>Get exclusive high-paying deals from verified partners.</p>
            <button 
              onClick={() => setShowPay(true)}
              style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer', marginTop: '16px' }}
            >
              Unlock Pro
            </button>
          </div>
        )}

        {tab === 'earnings' && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0c0' }}>
            Complete hustles to see earnings here!
          </div>
        )}

      </div>

      {/* Payment Modal */}
      {showPay && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowPay(false)}>
          <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>

            {payStatus === 'idle' && (
              <>
                <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Unlock HustleHub Pro</h2>
                <p style={{ textAlign: 'center', color: '#a0a0c0', marginBottom: '24px' }}>
                  <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>KES 500</span>
                  <span style={{ color: '#00d4aa', fontWeight: 700 }}>KES 100</span>
                  <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#ff4757', borderRadius: '4px', fontSize: '12px' }}>80% OFF</span>
                </p>
                <input
                  type="tel"
                  placeholder="Enter M-Pesa number (2547XXXXXXXX)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #1a1a3e', background: '#0a0a1a', color: '#fff', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
                />
                <button
                  onClick={handlePayment}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #0070f3, #00d4aa)', color: '#fff', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Pay with M-Pesa
                </button>
              </>
            )}

            {payStatus === 'sending' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p>Sending STK Push...</p>
              </div>
            )}

            {payStatus === 'waiting' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
                <p>Check your phone! Enter M-Pesa PIN.</p>
              </div>
            )}

            {payStatus === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <h2>Welcome to Pro!</h2>
                <p style={{ color: '#a0a0c0' }}>You now have access to all premium features.</p>
              </div>
            )}

            {payStatus === 'failed' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
                <h2>Payment Failed</h2>
                <button onClick={() => setPayStatus('idle')} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer', marginTop: '16px' }}>
                  Try Again
                </button>
              </div>
            )}

            <button onClick={() => setShowPay(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#a0a0c0', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowAuth(false)}>
          <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }} onClick={e => e.stopPropagation()}>

            <h2 style={{ color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>

            <form onSubmit={handleAuthSubmit}>
              {isSignUp && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #1a1a3e', background: '#0a0a1a', color: '#fff', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone (254712345678)"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    required
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #1a1a3e', background: '#0a0a1a', color: '#fff', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #1a1a3e', background: '#0a0a1a', color: '#fff', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
              />

              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #1a1a3e', background: '#0a0a1a', color: '#fff', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
              />

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: authLoading ? '#333' : '#0070f3',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: authLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {authLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <p style={{ color: '#a0a0c0', textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setAuthMessage('') }}
                style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

            {authMessage && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                background: authMessage.startsWith('Sign up') || authMessage.startsWith('Signed in') ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                color: authMessage.startsWith('Sign up') || authMessage.startsWith('Signed in') ? '#4ade80' : '#ff4757',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {authMessage}
              </div>
            )}

            <button
              onClick={() => setShowAuth(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#a0a0c0',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
