import React from 'react';

const Home = ({ setPage, onHustleClick, isPro }) => {
  // Sample Kenyan Hustles to show on first load
  const hustles = [
    { id: 1, title: 'Express Grocery Delivery', pay: 150, description: 'Pick up groceries from Naivas and deliver to Kilimani.', duration: '45 mins' },
    { id: 2, title: 'Premium Social Media Manager', pay: 15000, description: 'Manage a TikTok account for a local fashion brand.', duration: '1 month' },
    { id: 3, title: 'Transcription Work', pay: 800, description: 'Transcribe 15 minutes of Swahili audio to English.', duration: '2 hours' }
  ];

  return (
    <div className="main-content" style={{ paddingBottom: '80px' }}>
      <header className="page-header" style={{ padding: '20px' }}>
        <h1 className="page-title" style={{ fontSize: '24px', fontWeight: 800 }}>Available Hustles</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Find work that pays instantly to M-Pesa</p>
      </header>

      <div style={{ padding: '0 20px' }}>
        {hustles.map((hustle, index) => (
          <React.Fragment key={hustle.id}>
            {/* Standard Job Card[cite: 7] */}
            <div className="hustle-card" style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{hustle.title}</h3>
                <span style={{ color: '#0070f3', fontWeight: 800 }}>KES {hustle.pay.toLocaleString()}</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>{hustle.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>🕒 {hustle.duration}</span>
                <button 
                  style={hustle.pay >= 5000 ? premiumBtn : detailBtn}
                  onClick={() => onHustleClick(hustle)}
                >
                  {hustle.pay >= 5000 ? 'Unlock Premium' : 'Details'}[cite: 7]
                </button>
              </div>
            </div>

            {/* AD INJECTION: Every 3rd item[cite: 7] */}
            {(index + 1) % 2 === 0 && !isPro && (
              <div style={adStyle}>
                <span style={{ background: '#FFD700', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>SPONSORED</span>
                <h4 style={{ margin: '10px 0 5px' }}>Double your Earnings?</h4>
                <p style={{ fontSize: '12px', margin: 0, opacity: 0.9 }}>Pro members get 24/7 access to jobs over KES 5,000.</p>
                <button onClick={() => setPage('premium')} style={adBtn}>Upgrade Now</button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Home;

// --- Styles ---
const cardStyle = { background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const detailBtn = { padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #0070f3', color: '#0070f3', background: 'none', fontWeight: 700, cursor: 'pointer' };
const premiumBtn = { padding: '8px 16px', borderRadius: '8px', border: 'none', color: '#fff', background: '#0070f3', fontWeight: 700, cursor: 'pointer' };
const adStyle = { background: '#1a1a1a', color: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', position: 'relative' };
const adBtn = { marginTop: '12px', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#fff', color: '#000', fontWeight: 700, cursor: 'pointer' };