import { useState } from 'react';

export function AdPlaceholder({ type = 'inline' }) {
  return (
    <div style={{
      background: '#f8f9fa',
      border: '1px dashed #ced4da',
      borderRadius: '12px',
      padding: '20px',
      margin: '15px 0',
      textAlign: 'center',
      minHeight: type === 'bottom' ? '150px' : '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: '#6c757d',
      fontSize: '12px'
    }}>
      <span style={{ fontWeight: 'bold', marginBottom: '4px' }}>SPONSORED AD</span>
      <p>Placeholder for AdSense / AdMob</p>
    </div>
  );
}

export function WatchAdModal({ onComplete, onClose }) {
  const [timer, setTimer] = useState(7);
  const [started, setStarted] = useState(false);

  const startAd = () => {
    setStarted(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {!started ? (
          <>
            <h3>Watch a short ad to unlock this hustle</h3>
            <button onClick={startAd} className="btn btn-primary" style={{ marginTop: '15px' }}>
              Start Video (5-10s)
            </button>
            <p onClick={onClose} style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>Cancel</p>
          </>
        ) : (
          <>
            <h2>Ad Playing...</h2>
            <div style={{ fontSize: '48px', margin: '20px 0' }}>📺</div>
            <p>Unlocking in {timer} seconds</p>
          </>
        )}
      </div>
    </div>
  );
}