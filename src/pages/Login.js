import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleSendOTP = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone })
      if (error) throw error
      setStep('otp')
      setToast({ message: 'OTP sent!', type: 'success' })
    } catch (error) {
      setToast({ message: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
      if (error) throw error
      setToast({ message: 'Logged in!', type: 'success' })
      window.location.reload()
    } catch (error) {
      setToast({ message: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', background: 'var(--white)' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>💼</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>HustleHub</h1>
        <p style={{ color: 'var(--neutral-700)' }}>Earn money using your phone</p>
      </div>

      {step === 'phone' ? (
        <div>
          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input
              className="input"
              type="tel"
              placeholder="2547XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSendOTP}
            disabled={loading || phone.length < 10}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div>
          <div className="input-group">
            <label className="input-label">Enter OTP</label>
            <input
              className="input"
              type="number"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleVerifyOTP}
            disabled={loading || otp.length < 6}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setStep('phone')}
            style={{ marginTop: '8px' }}
          >
            Change number
          </button>
        </div>
      )}

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: 'var(--neutral-500)' }}>
          <span>✓ Secure</span>
          <span>✓ Verified</span>
          <span>✓ 24/7</span>
        </div>
      </div>
    </div>
  )
}
