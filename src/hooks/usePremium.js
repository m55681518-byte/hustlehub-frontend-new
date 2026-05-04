import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function usePremium() {
  const [isPremium, setIsPremium] = useState(false)
  const [loading,   setLoading]   = useState(true)

  async function check() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setIsPremium(false); return }

      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single()

      setIsPremium(data?.is_premium === true)
    } catch (err) {
      console.error("Premium Check Error:", err)
      setIsPremium(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { check() }, [])

  return { isPremium, loading, refresh: check }
}