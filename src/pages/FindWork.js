import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import HustleCard from '../components/HustleCard'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'

export default function FindWork({ setPage }) {
  const [hustles, setHustles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadHustles()
  }, [])

  async function loadHustles() {
    try {
      const res = await api.getHustles()
      if (res.success) setHustles(res.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHustles = hustles.filter(h => {
    if (filter === 'all') return true
    if (filter === 'high-pay') return h.payout_amount >= 1000
    if (filter === 'quick') return h.category === 'Delivery'
    return h.category?.toLowerCase() === filter
  }).filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <Loading />

  return (
    <div className="page">
      <h1 className="page-title">Find Work</h1>

      <div className="input-group">
        <input
          type="text"
          className="input"
          placeholder="Search hustles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
        {['all', 'high-pay', 'quick', 'Delivery', 'Cleaning', 'Tech'].map(f => (
          <button
            key={f}
            className={`badge ${filter === f ? 'badge-primary' : ''}`}
            style={{ 
              border: filter === f ? 'none' : '1px solid var(--neutral-300)',
              background: filter === f ? 'var(--primary-light)' : 'var(--white)',
              cursor: 'pointer'
            }}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'high-pay' ? 'KSh 1K+' : f}
          </button>
        ))}
      </div>

      {filteredHustles.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No hustles found"
          description={searchQuery ? `No results for "${searchQuery}"` : "No hustles match your filters"}
          action={
            <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setFilter('all') }}>
              Clear Filters
            </button>
          }
        />
      ) : (
        filteredHustles.map(hustle => (
          <HustleCard
            key={hustle.id}
            hustle={hustle}
            onClick={() => setPage('hustleDetail')}
          />
        ))
      )}
    </div>
  )
}
