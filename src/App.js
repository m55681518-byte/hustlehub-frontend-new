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