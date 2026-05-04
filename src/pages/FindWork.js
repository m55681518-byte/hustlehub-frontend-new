import { useState, useEffect } from 'react';
import usePremium from '../hooks/usePremium';
import { AdPlaceholder, WatchAdModal } from '../components/AdSystem'; 

export default function FindWork() { 
  const { isPremium } = usePremium(); 
  const [hustles, setHustles] = useState([]);
  const [unlockedHustles, setUnlockedHustles] = useState([]);
  const [adTarget, setAdTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHustles() {
      try {
        // Fetching live data from your Render backend
        const response = await fetch('https://hustlehub-backend-new.onrender.com/hustles');
        const json = await response.json();
        if (json.success) {
          setHustles(json.data); // Set real jobs from database
        }
      } catch (error) {
        console.error("Error fetching hustles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHustles();
  }, []); 

  const handleAdComplete = () => {
    if (adTarget) {
      setUnlockedHustles(prev => [...prev, adTarget]);
      setAdTarget(null);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading hustles...</div>;

  return (
    <div style={{ padding: '16px', paddingBottom: '80px', background: '#fbfbfb', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 800 }}>Available Hustles</h2>
      
      {hustles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: '#666' }}>No hustles found in the database.</p>
          <p style={{ fontSize: '14px', color: '#888' }}>Try posting a new one using the (+) button.</p>
        </div>
      ) : (
        hustles.map((h, index) => {
          const isLocked = !isPremium && index >= 3 && !unlockedHustles.includes(h.id);
          const showAd = (index + 1) % 3 === 0;

          return (
            <div key={h.id}>
              <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '15px', marginBottom: '15px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '10px', background: '#e3f2fd', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, color: '#0070f3' }}>
                     {h.category?.toUpperCase() || 'GENERAL'}
                   </span>
                   <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#28a745' }}>KSh {h.payout_amount}</span>
                 </div>
                 
                 <h3 style={{ marginTop: '12px', fontSize: '18px', fontWeight: 700 }}>
                   {isLocked ? `${h.title.substring(0, 15)}...` : h.title}
                 </h3>
                 
                 <p style={{ fontSize: '14px', color: '#666', filter: isLocked ? 'blur(4px)' : 'none', margin: '8px 0' }}>
                   {h.description}
                 </p>
                 
                 <button 
                   onClick={isLocked ? () => setAdTarget(h.id) : null}
                   style={{ marginTop: '10px', background: isLocked ? '#000' : '#0070f3', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 600 }}
                 >
                   {isLocked ? 'Watch Ad to Unlock' : 'Apply Now'}
                 </button>
              </div>
              {showAd && !isPremium && <AdPlaceholder />}
            </div>
          );
        })
      )}
      {adTarget && <WatchAdModal onComplete={handleAdComplete} onClose={() => setAdTarget(null)} />}
    </div>
  );
}