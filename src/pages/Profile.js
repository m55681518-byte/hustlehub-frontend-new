import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Profile({ setPage, session, isPro }) {
  const [profile, setProfile] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!session?.user) return

      try {
        // 1. Load Profile Data (Earnings & Phone)
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileData) setProfile(profileData)

        // 2. Load Payment History from your Render backend
        const res = await fetch('https://hustlehub-backend-new.onrender.com/payments')
        const json = await res.json()
        if (json.success) setPayments(json.data || [])
      } catch (err) {
        console.error("Error loading dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [session])

  async function signOut() {
    setSigning(true)
    await supabase.auth.signOut()
  }

  // Handle display logic for Phone as ID
  const displayId = profile?.phone_number || session?.user?.email?.split('@')[0] || 'Hustler'
  const initial = displayId[0]?.toUpperCase() || 'H'

  return (
    <div style={{ background: 'var(--neutral-50)', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1a1a 0%, #333 100%)',
        padding: '40px 20px 80px',
        position: 'relative',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--white)', marginBottom: 32 }}>
          Hustler Dashboard
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 32, color: 'var(--white)', border: '3px solid rgba(255,255,255,0.2)'
          }}>
            {initial}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--white)' }}>
              {displayId} {isPro && '👑'}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>ID: {session?.user?.id.slice(0, 8)}</p>
          </div>
        </div>
      </div>

      {/* ── Earnings Card ── */}
      <div style={{ padding: '0 20px', marginTop: -40, marginBottom: 20 }}>
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '24px',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--neutral-100)', textAlign: 'center'
        }}>
          <p style={{ color: 'var(--neutral-500)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Available Balance</p>
          <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '8px 0', color: 'var(--neutral-900)' }}>
            KES {profile?.earnings?.toLocaleString() || '0.00'}
          </h2>
          <button 
            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, marginTop: 12 }}
            onClick={() => alert("Withdrawal request sent! Minimum KES 500.")}
          >
            Withdraw to M-Pesa
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px', marginBottom: 24 }}>
        <StatCard icon="💼" label="Hustles" value="0" />
        <StatCard icon="⭐" label="Rating" value="5.0" />
      </div>

      {/* ── Upgrade Banner ── */}
      {!isPro && (
        <div style={{ padding: '0 20px', marginBottom: 24 }}>
          <div onClick={() => setPage('premium')} style={{
            background: 'linear-gradient(135deg, #16213E 0%, #0F3460 100%)',
            borderRadius: '16px', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
          }}>
            <div>
              <h4 style={{ margin: 0, fontWeight: 800 }}>Unlock Pro Benefits 👑</h4>
              <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.8 }}>No ads & Instant M-Pesa withdrawals</p>
            </div>
            <span style={{ background: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>UPGRADE</span>
          </div>
        </div>
      )}

      {/* ── Recent Payments ── */}
      <div style={{ padding: '0 20px' }}>
        <SectionTitle>Payment History</SectionTitle>
        <div style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--neutral-100)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: 'center' }}>Loading...</div>
          ) : payments.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#999', fontSize: '14px' }}>No transactions found</div>
          ) : (
            payments.map((p, i) => (
              <div key={i} style={{ padding: '16px', borderBottom: i !== payments.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{p.description || 'Top Up'}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 800, color: p.status === 'success' ? '#22C55E' : '#94A3B8' }}>
                  KSh {p.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ padding: '30px 20px' }}>
        <button onClick={signOut} disabled={signing} style={{ width: '100%', background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECACA', padding: '16px', borderRadius: '12px', fontWeight: 700 }}>
          {signing ? 'Signing out...' : '🚪 Log Out'}
        </button>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid #eee' }}>
      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: '18px' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <p style={{ fontSize: '12px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, marginLeft: 4 }}>
      {children}
    </p>
  )
}