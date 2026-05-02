import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#f8f9fa'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>HustleHub</h1>
      <p style={{ color: '#6c757d', marginBottom: '32px' }}>Earn money using your phone</p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%', padding: '14px', borderRadius: '10px',
            border: '1px solid #dee2e6', fontSize: '15px',
            marginBottom: '12px', boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          style={{
            width: '100%', padding: '14px', borderRadius: '10px',
            border: '1px solid #dee2e6', fontSize: '15px',
            marginBottom: '12px', boxSizing: 'border-box'
          }}
        />

        {error && (
          <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: '10px',
            border: 'none', background: '#0070f3', color: '#fff',
            fontSize: '16px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => { setIsSignUp(!isSignUp); setError('') }}
          style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', fontWeight: 600 }}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>

      <div style={{ marginTop: '24px', display: 'flex', gap: '16px', color: '#28a745', fontSize: '13px' }}>
        <span>✓ Secure</span><span>✓ Verified</span><span>✓ 24/7</span>
      </div>
    </div>
  )
}