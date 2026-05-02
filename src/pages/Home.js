import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { supabase } from '../lib/supabase'
import HustleCard from '../components/HustleCard'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'

export default function Home({ setPage }) {
  const [hustles, setHustles] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 })
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const [hustlesRes, statsRes] = await Promise.all([
        api.getHustles(),
        user ? api.getPaymentStats(user.id) : Promise.resolve({ data: { total: 0, completed: 0, pending: 0 } })
      ])

      if (hustlesRes.success) setHustles(hustlesRes.data)
      if (statsRes.data) setStats(statsRes.data)
    } catch (error) {
      console.error('Error loading home:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) return <Loading />

  return (
    <div className="page">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
          {getGreeting()}, {user?.user_metadata?.full_name || 'Hustler'}! 👋
        </h1>
        <p style={{ color: 'var(--neutral-700)' }}>Ready to hustle today?</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">KSh {stats.total?.toLocaleString() || '0'}</div>
          <div className="stat-label">Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div className="section-title">
          <span>Recommended for You</span>
          <button className="btn btn-ghost btn-sm" style={{ width: 'auto' }} onClick={() => setPage('findWork')}>
            See all →
          </button>
        </div>

        {hustles.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No hustles yet"
            description="Be the first to post a hustle or check back later!"
            action={
              <button className="btn btn-primary" onClick={() => setPage('postHustle')}>
                Post a Hustle
              </button>
            }
          />
        ) : (
          hustles.slice(0, 3).map(hustle => (
            <HustleCard
              key={hustle.id}
              hustle={hustle}
              onClick={() => setPage('hustleDetail')}
            />
          ))
        )}
      </div>

      <div>
        <div className="section-title">
          <span>Categories</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['Delivery', 'Cleaning', 'Tech', 'Design', 'Writing', 'Marketing'].map(cat => (
            <span key={cat} className="badge badge-primary" style={{ whiteSpace: 'nowrap' }}>
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
