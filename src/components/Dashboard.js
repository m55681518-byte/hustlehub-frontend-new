import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      // 1. Get the current logged-in user
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // 2. Fetch their specific data from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={centerStyle}>Loading your Hustle...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontWeight: 800 }}>My Dashboard</h2>
        <button onClick={() => supabase.auth.signOut()} style={logoutBtn}>Logout</button>
      </div>

      {/* Balance Card */}
      <div style={balanceCard}>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>Total Earnings</p>
        <h1 style={{ margin: '5px 0', fontSize: '36px' }}>KES {profile?.earnings || '0.00'}</h1>
        <div style={badge}>
          {profile?.is_premium ? '🏆 Premium Member' : '⭐ Standard Member'}
        </div>
      </div>

      {/* Profile Details */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={sectionTitle}>Account Details</h3>
        <div style={infoRow}>
          <span>M-Pesa Number</span>
          <span style={{ fontWeight: 600 }}>{profile?.phone_number || 'Not Set'}</span>
        </div>
        <div style={infoRow}>
          <span>Status</span>
          <span style={{ color: profile?.is_premium ? '#28a745' : '#6c757d' }}>
            {profile?.is_premium ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '40px' }}>
        <button style={primaryBtn}>Withdraw to M-Pesa</button>
        <button style={secondaryBtn}>Find New Hustles</button>
      </div>
    </div>
  )
}

// --- STYLES ---
const balanceCard = {
  background: 'linear-gradient(135deg, #0070f3 0%, #00a1ff 100%)',
  color: '#fff',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 10px 20px rgba(0,112,243,0.2)'
}

const badge = {
  background: 'rgba(255,255,255,0.2)',
  display: 'inline-block',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  marginTop: '10px'
}

const infoRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px 0',
  borderBottom: '1px solid #eee',
  fontSize: '15px'
}

const sectionTitle = { fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }
const primaryBtn = { width: '100%', padding: '16px', borderRadius: '12px', background: '#000', color: '#fff', border: 'none', fontWeight: 700, marginBottom: '10px', cursor: 'pointer' }
const secondaryBtn = { width: '100%', padding: '16px', borderRadius: '12px', background: '#f0f0f0', color: '#333', border: 'none', fontWeight: 700, cursor: 'pointer' }
const logoutBtn = { background: 'none', border: '1px solid #ddd', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontWeight: 600 }