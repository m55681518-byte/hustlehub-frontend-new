import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function PremiumPage({ session, setPage }) {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')

  async function handlePayment() {
    setLoading(true)
    try {
      // 1. Call your Render backend to trigger M-Pesa STK Push
      const response = await fetch('https://hustlehub-backend-new.onrender.com/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          amount: 30,
          userId: session.user.id
        })
      })
      
      const result = await response.json()
      if (result.success) {
        alert("Check your phone for the M-Pesa PIN prompt!")
      } else {
        alert("Payment failed to initialize. Please try again.")
      }
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-content" style={{ background: 'var(--accent)', color: 'white', minHeight: '100vh' }}>
      {/* ── Header ── */}
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', float: 'left' }}>✕ Close</button>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>👑</div>
        <h1 className="font-display" style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>HustleHub Pro</h1>
        <p style={{ opacity: 0.8 }}>Unlock your full earning potential</p>
      </div>

      {/* ── Benefits ── */}
      <div className="px-5">
        {[
          { icon: '🚫', title: 'Zero Ads', desc: 'No timers. No interruptions. Just hustles.' },
          { icon: '💰', title: 'High-Pay Gigs', desc: 'Instant access to jobs paying KES 5,000+' },
          { icon: '⚡', title: 'Priority Payouts', desc: 'Your withdrawals go to the top of the queue.' },
          { icon: '🔍', title: 'Hidden Gigs', desc: 'See work before standard members.' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ fontSize: '24px', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>{item.icon}</div>
            <div>
              <h4 style={{ margin: 0, fontWeight: 700 }}>{item.title}</h4>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', opacity: 0.7 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Payment Box ── */}
      <div style={{ 
        background: 'white', color: 'black', margin: '20px', padding: '30px', 
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="badge badge-dark">LIFETIME ACCESS</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '10px 0' }}>KES 30</h2>
          <p style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>One-time payment. No monthly fees.</p>
        </div>

        <div className="input-group">
          <label className="input-label">M-PESA NUMBER</label>
          <input 
            className="input" 
            placeholder="07XXXXXXXX" 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-primary btn-full" 
          onClick={handlePayment}
          disabled={loading || !phone}
          style={{ padding: '18px', fontSize: '18px' }}
        >
          {loading ? 'Processing...' : 'Pay via M-Pesa'}
        </button>
        
        <p style={{ textAlign: 'center', fontSize: '11px', marginTop: '15px', color: '#999' }}>
          Secure payment powered by Intasend/Daraja
        </p>
      </div>
    </div>
  )
}