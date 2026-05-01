import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hcriatxprcifgwfqokbw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjcmlhdHhwcmNpZmd3ZnFva2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODAyNzIsImV4cCI6MjA5MzE1NjI3Mn0.JUbLKt8MZD15pf9NRz-xrIbcaBNNzPcv_TShH3YeHiU'
)

const ALL_HUSTLES = [
  { id: 1, title: 'Take online surveys', pay: 'KES 50-200', time: '10 min', free: true, category: 'Quick' },
  { id: 2, title: 'Test mobile apps', pay: 'KES 100-500', time: '20 min', free: true, category: 'Tech' },
  { id: 3, title: 'Share product reviews', pay: 'KES 80-300', time: '15 min', free: true, category: 'Social' },
  { id: 4, title: 'Transcribe audio clips', pay: 'KES 300-1,000', time: '30 min', free: false, category: 'Writing' },
  { id: 5, title: 'Data entry tasks', pay: 'KES 200-800', time: '25 min', free: false, category: 'Office' },
  { id: 6, title: 'Virtual assistant gigs', pay: 'KES 500-2,000', time: '1 hour', free: false, category: 'Service' },
  { id: 7, title: 'Social media management', pay: 'KES 1,000-5,000', time: 'Daily', free: false, category: 'Marketing' },
  { id: 8, title: 'Graphic design tasks', pay: 'KES 800-3,000', time: '2 hours', free: false, category: 'Creative' },
  { id: 9, title: 'Video editing', pay: 'KES 1,500-5,000', time: '3 hours', free: false, category: 'Creative' },
  { id: 10, title: 'Online tutoring', pay: 'KES 500-2,000', time: '1 hour', free: false, category: 'Education' },
]

function PlaceholderAd({ type }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: type === 'banner' ? '16px' : '24px',
      margin: '16px 0',
      textAlign: 'center',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ fontSize: type === 'banner' ? '14px' : '18px', fontWeight: 700, marginBottom: '4px' }}>
        Advertisement
      </div>
      <div style={{ fontSize: type === 'banner' ? '12px' : '14px', opacity: 0.9 }}>
        {type === 'banner' ? 'Your ad here - Banner' : 'Your ad here - Large'}
      </div>
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        fontSize: '10px',
        background: 'rgba(0,0,0,0.3)',
        padding: '2px 8px',
        borderRadius: '4px'
      }}>
        Ad
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authFullName, setAuthFullName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [authMessage, setAuthMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [unlockedCount, setUnlockedCount] = useState(3)
  const [watchingAd, setWatchingAd] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [payPhone, setPayPhone] = useState('')
  const [payStatus, setPayStatus] = useState('idle')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleAuthSubmit(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: { data: { full_name: authFullName, phone: authPhone } }
        })
        if (error) throw error
        setAuthMessage('Account created! Check your email.')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        })
        if (error) throw error
        setAuthMessage('Signed in!')
        setTimeout(() => setShowAuth(false), 1000)
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

  function handleWatchAd() {
    setWatchingAd(true)
    setTimeout(() => {
      setWatchingAd(false)
      setUnlockedCount(prev => Math.min(prev + 1, ALL_HUSTLES.length))
    }, 5000)
  }

  async function handlePayment() {
    if (!user) {
      setShowAuth(true)
      return
    }
    if (!payPhone) return alert('Enter M-Pesa number')
    setPayStatus('sending')
    try {
      const res = await fetch('https://hustlehub-backend-3h1v.onrender.com/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: payPhone,
          amount: 30,
          userId: user.id,
          description: 'Unlock Premium Hustles'
        })
      })
      const data = await res.json()
      if (data.success) {
        setPayStatus('waiting')
        const interval = setInterval(async () => {
          const statusRes = await fetch(`https://hustlehub-backend-3h1v.onrender.com/payment-status/${data.data.checkoutRequestId}`)
          const statusData = await statusRes.json()
          if (statusData.status === 'success') {
            clearInterval(interval)
            setPayStatus('success')
            setUnlockedCount(ALL_HUSTLES.length)
            setTimeout(() => setShowPayment(false), 2000)
          } else if (statusData.status === 'failed') {
            clearInterval(interval)
            setPayStatus('failed')
          }
        }, 3000)
      } else {
        setPayStatus('failed')
      }
    } catch (err) {
      setPayStatus('failed')
    }
  }

  const freeHustles = ALL_HUSTLES.slice(0, unlockedCount)
  const lockedHustles = ALL_HUSTLES.slice(unlockedCount)

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
    background: '#f8f9fa',
    fontSize: '15px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      color: '#1a1a2e',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e9ecef',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0070f3' }}>
          HustleHub
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6c757d' }}>
              {user.user_metadata?.full_name || user.email}
            </span>
            <button onClick={handleSignOut} style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #dc3545',
              background: 'transparent',
              color: '#dc3545',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 600
            }}>
              Sign Out
            </button>
          </div>
        ) : (
          <button onClick={() => setShowAuth(true)} style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#0070f3',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 600
          }}>
            Sign In
          </button>
        )}
      </header>

      <div style={{
        background: 'linear-gradient(135deg, #0070f3 0%, #00d4aa 100%)',
        color: '#fff',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          marginBottom: '12px',
          lineHeight: 1.2
        }}>
          Earn money using your phone in Kenya
        </h1>
        <p style={{
          fontSize: '16px',
          opacity: 0.95,
          marginBottom: '8px'
        }}>
          Proven hustles updated daily
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          marginTop: '16px'
        }}>
          <span style={{ color: '#ffd700' }}>⚡</span>
          New hustles added today
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>

        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>⏰</span>
          <div>
            <div style={{ fontWeight: 700, color: '#856404', fontSize: '14px' }}>
              Limited free access
            </div>
            <div style={{ color: '#856404', fontSize: '13px' }}>
              {lockedHustles.length} premium hustles locked. Unlock now!
            </div>
          </div>
        </div>

        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color: '#28a745' }}>✓</span>
          Free Hustles ({freeHustles.length})
        </h2>

        {freeHustles.map((hustle, index) => (
          <div key={hustle.id}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e9ecef'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#0070f3',
                    background: '#e7f3ff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {hustle.category}
                  </span>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    margin: '8px 0 4px 0'
                  }}>
                    {hustle.title}
                  </h3>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#28a745'
                }}>
                  {hustle.pay}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', color: '#6c757d' }}>
                  ⏱️ {hustle.time}
                </span>
                <button style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0070f3',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Start Earning
                </button>
              </div>
            </div>
            {index === 1 && <PlaceholderAd type="banner" />}
          </div>
        ))}

        {lockedHustles.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px 24px',
            marginTop: '24px',
            textAlign: 'center',
            border: '2px dashed #dee2e6',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#6f42c1',
              color: '#fff',
              padding: '4px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              🔒 PREMIUM
            </div>
            
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>💎</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              Unlock 20+ Premium Hustles
            </h3>
            <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '24px' }}>
              Get access to high-paying tasks, exclusive deals, and priority support
            </p>
            
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0070f3' }}>
                KES 30
                <span style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  textDecoration: 'line-through',
                  marginLeft: '8px'
                }}>
                  KES 100
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#28a745', marginTop: '4px' }}>
                ✓ One-time payment, lifetime access
              </div>
            </div>

            <button
              onClick={() => setShowPayment(true)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0070f3, #00d4aa)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              🔓 Unlock with Payment
            </button>

            <button
              onClick={handleWatchAd}
              disabled={watchingAd}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '2px solid #0070f3',
                background: 'transparent',
                color: '#0070f3',
                fontSize: '14px',
                fontWeight: 600,
                cursor: watchingAd ? 'not-allowed' : 'pointer'
              }}
            >
              {watchingAd ? '📺 Watching ad... (5s)' : '📺 Watch Ad to Unlock 1 Hustle'}
            </button>

            <p style={{ fontSize: '12px', color: '#adb5bd', marginTop: '16px' }}>
              💡 Watching ads helps keep hustles free for everyone
            </p>
          </div>
        )}

        <PlaceholderAd type="large" />

      </div>

      {showAuth && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowAuth(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            
            <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1a1a2e' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
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
                    style={inputStyle}
                  />
                  <input
                    type="tel"
                    placeholder="Phone (2547XXXXXXXX)"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: authLoading ? '#ccc' : '#0070f3',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: authLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {authLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6c757d' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setAuthMessage('') }}
                style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', fontWeight: 600 }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

            {authMessage && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                background: authMessage.startsWith('Account') || authMessage.startsWith('Signed') ? '#d4edda' : '#f8d7da',
                color: authMessage.startsWith('Account') || authMessage.startsWith('Signed') ? '#155724' : '#721c24',
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
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowPayment(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%'
          }} onClick={e => e.stopPropagation()}>
            
            {payStatus === 'idle' && (
              <>
                <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Unlock Premium</h2>
                <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '24px' }}>
                  One-time payment of KES 30
                </p>
                <input
                  type="tel"
                  placeholder="M-Pesa number (2547XXXXXXXX)"
                  value={payPhone}
                  onChange={(e) => setPayPhone(e.target.value)}
                  style={inputStyle}
                />
                <button
                  onClick={handlePayment}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#0070f3',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Pay with M-Pesa
                </button>
              </>
            )}

            {payStatus === 'sending' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px' }}>⏳</div>
                <p>Sending payment request...</p>
              </div>
            )}

            {payStatus === 'waiting' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px' }}>📱</div>
                <p>Check your phone and enter M-Pesa PIN</p>
              </div>
            )}

            {payStatus === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px' }}>🎉</div>
                <h3>Payment Successful!</h3>
                <p>All hustles unlocked</p>
              </div>
            )}

            {payStatus === 'failed' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px' }}>😕</div>
                <h3>Payment Failed</h3>
                <button onClick={() => setPayStatus('idle')} style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0070f3',
                  color: '#fff',
                  cursor: 'pointer',
                  marginTop: '16px'
                }}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {watchingAd && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          color: '#fff'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📺</div>
          <h2>Watching Advertisement</h2>
          <p>Please wait while the ad plays...</p>
          <div style={{
            width: '200px',
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            marginTop: '24px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#0070f3',
              animation: 'progress 5s linear'
            }} />
          </div>
        </div>
      )}

    </div>
  )
}