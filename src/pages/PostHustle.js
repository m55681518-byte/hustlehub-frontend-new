import { useState } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['Delivery', 'Cleaning', 'Tech', 'Design', 'Writing', 'Marketing', 'Repairs', 'Other']

export default function PostHustle({ setPage }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', category: '', description: '', payout_amount: '' });

  const update = (field, val) => { setForm(f => ({ ...f, [field]: val })); setError(''); }

  async function submit() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch('https://hustlehub-backend-new.onrender.com/hustles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          payout_amount: Number(form.payout_amount),
          posted_by: user?.id,
        }),
      });
      const json = await res.json();
      if (json.success) setSuccess(true);
      else setError(json.message || 'Error posting hustle');
    } catch {
      setError('Connection error. Check your internet.');
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Hustle Posted!</h2>
      <button onClick={() => setPage('findWork')} style={{ marginTop: '20px', padding: '12px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px' }}>View Jobs</button>
    </div>
  );

  return (
    <div style={{ padding: '20px', background: '#fff', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Post a Hustle</h1>
      
      <div style={{ marginTop: '20px' }}>
        {step === 0 && (
          <>
            <input placeholder="Job Title" style={inputStyle} value={form.title} onChange={e => update('title', e.target.value)} />
            <select style={inputStyle} value={form.category} onChange={e => update('category', e.target.value)}>
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea placeholder="What needs to be done?" style={{ ...inputStyle, height: '120px' }} value={form.description} onChange={e => update('description', e.target.value)} />
            <button onClick={() => setStep(1)} style={primaryBtn}>Next</button>
          </>
        )}

        {step === 1 && (
          <>
            <input type="number" placeholder="Payout Amount (KSh)" style={inputStyle} value={form.payout_amount} onChange={e => update('payout_amount', e.target.value)} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(0)} style={{ ...primaryBtn, background: '#eee', color: '#000' }}>Back</button>
              <button onClick={submit} style={primaryBtn} disabled={loading}>{loading ? 'Posting...' : 'Post Now'}</button>
            </div>
          </>
        )}
      </div>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' }
const primaryBtn = { width: '100%', padding: '16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '16px' }