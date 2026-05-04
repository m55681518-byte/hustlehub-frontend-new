import { useState } from 'react'

export default function PremiumPage({ session, setPage }) {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')

  async function handlePayment() {
    setLoading(true)
    try {
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
    <div className="main-content" style={{ background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', float: 'left' }}>✕ Close</button>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>👑</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>HustleHub Pro</h1>
        <p style={{ opacity: 0.8 }}>Unlock your full earning potential</p>
      </div>

      <div style={{ padding: '0 20px' }}>
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
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', color: 'black', margin: '20px', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ background: '#eee', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 800 }}>LIFETIME ACCESS</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '10px 0' }}>KES 30</h2>
          <p style={{ fontSize: '12px', color: '#666' }}>One-time payment. No monthly fees.</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#999', marginBottom: '8px' }}>M-PESA NUMBER</label>
          <input style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', fontSize: '16px' }} placeholder="07XXXXXXXX" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handlePayment} disabled={loading || !phone} style={{ width: '100%', padding: '18px', borderRadius: '12px', background: '#0070f3', color: 'white', border: 'none', fontWeight: 700, fontSize: '18px' }}>
          {loading ? 'Processing...' : 'Pay via M-Pesa'}
        </button>
      </div>
    </div>
  )
}