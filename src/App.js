import { useState, useEffect } from 'react' 
import { createClient } from '@supabase/supabase-js' 
 
const supabase = createClient( 
  'https://hcriatxprcifgwfqokbw.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjcmlhdHhwcmNpZmd3ZnFva2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODAyNzIsImV4cCI6MjA5MzE1NjI3Mn0.JUbLKt8MZD15pf9NRz-xrIbcaBNNzPcv_TShH3YeHiU' 
) 
 
export default function App() { 
  const [count, setCount] = useState(0) 
 
  useEffect(() => { 
    console.log('App mounted') 
  }, []) 
 
  return ( 
    <div> 
      <h1>HustleHub</h1> 
      <p>Count: {count}</p> 
      <button onClick={() => setCount(count + 1)}>Click me</button> 
      <button onClick={async () => { 
        const { data } = await supabase.auth.getUser() 
        console.log(data) 
      }}>Test Auth</button> 
    </div> 
  ) 
} 
