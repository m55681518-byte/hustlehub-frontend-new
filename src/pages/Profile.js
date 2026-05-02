import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'

export default function Profile({ setPage, session }) {
  const [profile, setProfile] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone_number: '' })

  const loadProfile = useCallback(async () => {
    try {
      const userId = session.user.id
      const [profileRes, paymentsRes] = await Promise.all([
        api.getProfile(userId),
        api.getPayments(userId)
      ])

      if (profileRes.success) {
        setProfile(profileRes.data)
        setForm({
          full_name: profileRes.data.full_name || '',
          phone_number: profileRes.data.phone_number || ''
        })
      }
      if (paymentsRes.success) setPayments(paymentsRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleSave = async () => {
    try {
      const res = await api.updateProfile(session.user.id, form)
      if (res.success) {
        setProfile(res.data)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) return <Loading />

  return (
    <div className="page">
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          margin: '0 auto 16px',
          border: '4px solid var(--primary)'
        }}>
          {profile?.full_name?.[0] || '👤'}
        </div>

        {editing ? (
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <input
              className="input"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Full name"
              style={{ marginBottom: '8px' }}
            />
            <input
              className="input"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              placeholder="Phone number"
              style={{ marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{profile?.full_name || 'No name set'}</h2>
            <p style={{ color: 'var(--neutral-700)', marginBottom: '16px' }}>{profile?.phone_number || 'No phone'}</p>
            <button className="btn btn-secondary btn-sm" style={{ width: 'auto', margin: '0 auto' }} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{payments.length}</div>
          <div className="stat-label">Payments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            KSh {payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString()}
          </div>
          <div className="stat-label">Total Paid</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{payments.filter(p => p.status === 'completed').length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Recent Payments</h3>
        {payments.length === 0 ? (
          <EmptyState
            icon="💳"
            title="No payments yet"
            description="Your payment history will appear here"
          />
        ) : (
          payments.slice(0, 5).map(payment => (
            <div key={payment.id} className="card" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{payment.transaction_type || 'Payment'}</div>
                <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>
                  {new Date(payment.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>KSh {parseFloat(payment.amount).toLocaleString()}</div>
                <span className={`badge badge-${payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'error' : 'warning'}`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button className="btn btn-ghost" style={{ color: 'var(--error)' }} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  )
}
