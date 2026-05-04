import { createClient } from '@supabase/supabase-js'

// This is the correct way to initialize the frontend client[cite: 4, 10]
export const supabase = createClient(
  'https://hcriatxprcifgwfqokbw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjcmlhdHhwcmNpZmd3ZnFva2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODAyNzIsImV4cCI6MjA5MzE1NjI3Mn0.JUbLKt8MZD15pf9NRz-xrIbcaBNNzPcv_TShH3YeHiU'
)