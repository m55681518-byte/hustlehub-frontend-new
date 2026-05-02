import React, { useState } from 'react'
import { api } from '../lib/api'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const categories = ['Delivery', 'Cleaning', 'Tech', 'Design', 'Writing', 'Marketing', 'Other']

export default function PostHustle({ setPage }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    payout_amount: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await supabase.auth.getUser()

      const res = await api.createHustle({
        ...form,
        payout_amount: parseFloat(form.payout_amount) || 0
      })

      if (res.success) {
        setToast({ message: 'Hustle posted successfully! 🎉', type: 'success' })
        setTimeout(() => setPage('home'), 2000)
      } else {
        setToast({ message: res.message || 'Failed to post hustle', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Something went wrong', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    if (step === 1) return form.title.length >= 3 && form.category
    if (step === 2) return form.description.length >= 10
    if (step === 3) return form.payout_amount && parseFloat(form.payout_amount) > 0
    return true
  }

  return (
    <div className="page">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="top-bar">
        <button className="btn btn-ghost" style={{ width: 'auto' }} onClick={() => step > 1 ? setStep(step - 1) : setPage('home')}>
          ← {step > 1 ? 'Back' : 'Cancel'}
        </button>
        <h1>Post a Hustle</h1>
        <span style={{ fontSize: '14px', color: 'var(--neutral-500)' }}>Step {step}/3</span>
      </div>

      <div style={{ padding: '16px' }}>
        <div className="step-indicator">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`step ${s === step ? 'active' : s < step ? 'completed' : ''}`}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className={`step-line ${s < step ? 'completed' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="input-group">
              <label className="input-label">What do you need done?</label>
              <input
                className="input"
                placeholder="e.g., Deliver package to Westlands"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                maxLength={100}
              />
              <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>
                {form.title.length}/100
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className="btn"
                    style={{
                      background: form.category === cat ? 'var(--primary-light)' : 'var(--white)',
                      border: form.category === cat ? '2px solid var(--primary)' : '2px solid var(--neutral-300)',
                      color: form.category === cat ? 'var(--primary)' : 'var(--neutral-700)'
                    }}
                    onClick={() => handleChange('category', cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="input"
                placeholder="Describe what you need in detail..."
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="input-group">
              <label className="input-label">Budget (KSh)</label>
              <input
                className="input"
                type="number"
                placeholder="e.g., 1500"
                value={form.payout_amount}
                onChange={(e) => handleChange('payout_amount', e.target.value)}
              />
            </div>

            <div className="card" style={{ marginTop: '16px' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Preview</h4>
              <p><strong>{form.title}</strong></p>
              <p style={{ color: 'var(--neutral-700)', fontSize: '14px' }}>{form.description}</p>
              <p style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '8px' }}>
                KSh {form.payout_amount}
              </p>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ marginTop: '24px' }}
          onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
          disabled={!isStepValid() || loading}
        >
          {loading ? 'Posting...' : step === 3 ? 'Publish Hustle' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
