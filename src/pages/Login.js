import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [phone, setPhone] = useState('') 
  const [pin, setPin] = useState('') 
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAuth(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Generate Virtual Email for zero-limit auth
    const virtualEmail = `${phone}@hustlehub.local`

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: virtualEmail,
        password: pin,
        options: {
          data: { phone_number: phone } // Links to profiles trigger
        }
      })
      if (error) setError(error.message)
      else window.location.reload() 
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: virtualEmail,
        password: pin
      })
      if (error) {
        setError("Invalid Phone or PIN. Please try again.")
      }
    }
    
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8f9fa'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>HustleHub</h1>
      <p style={{ color: '#6c757d', marginBottom: '32px', textAlign: 'center' }}>
        {isSignUp ? 'Join 50,000+ Kenyan Hustlers' : 'Welcome back, Hustler'}
      </p>

      <form onSubmit={handleAuth} style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#444' }}>M-PESA PHONE NUMBER</label>
          <input
            type="tel"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#444' }}>{isSignUp ? 'CREATE PIN' : 'ENTER PIN'}</label>
          <input
            type="password"
            placeholder="...."
            value={pin}
            onChange={e => setPin(e.target.value)}
            required
            minLength={4}
            style={inputStyle}
          />
        </div>

        {error && <p style={{ color: '#dc3545', fontSize: '13px', marginBottom: '12px' }}>⚠️ {error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? 'Hustling...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <button
        onClick={() => { setIsSignUp(!isSignUp); setError('') }}
        style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginTop: '20px', fontWeight: 600 }}
      >
        {isSignUp ? 'Already have an account? Sign In' : "New here? Create Account"}
      </button>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '18px', marginTop: '4px', boxSizing: 'border-box', letterSpacing: '2px' }
const buttonStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: '#0070f3', color: '#fff', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }