import { useState, useRef, useEffect } from 'react';
import usePremium from '../hooks/usePremium';
import { WatchAdModal } from './AdSystem'; 

const BACKEND = 'http://localhost:10000';
const FREE_LIMIT = 5;

const BotIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L12 4M5 8L3 7M19 8L21 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="5" y="8" width="14" height="12" rx="2" stroke="white" strokeWidth="2"/>
    <circle cx="9" cy="13" r="1.5" fill="white"/>
    <circle cx="15" cy="13" r="1.5" fill="white"/>
    <path d="M9 17C9.5 18 14.5 18 15 17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function AIAssistant() { 
  const { isPremium } = usePremium();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [usage, setUsage] = useState(0); 
  const [bonusMessages, setBonusMessages] = useState(0);
  const [showAdForChat, setShowAdForChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Mambo! I'm HustleBot. I'm your adaptive, insightful partner in profit. How can I help you today?" }
  ]);
  
  const bottomRef = useRef(null);
  const isLimited = !isPremium && (usage >= (FREE_LIMIT + bonusMessages));

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleAdComplete = () => {
    setBonusMessages(prev => prev + 1);
    setShowAdForChat(false);
  };

  async function handleSend() {
    if (!input.trim() || loading || isLimited) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setUsage(prev => prev + 1);

    try {
      const res = await fetch(`${BACKEND}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          systemInstruction: "You are HustleBot, an authentic, adaptive AI collaborator with a touch of wit. Help users find money-making opportunities in Kenya with empathy and candor.",
          history: messages.slice(1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a bit of a moment. Let's try that again?" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(!open)} 
        style={{ position: 'fixed', bottom: 20, right: 20, borderRadius: '50%', width: 65, height: 65, background: '#16213E', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1000, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
      >
        {open ? '✕' : <BotIcon />}
      </button>

      {open && (
        <div style={{ position: 'fixed', bottom: 100, right: 20, width: '380px', maxWidth: '90vw', height: '550px', background: 'white', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', borderRadius: '24px', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', border: '1px solid #eee' }}>
          <div style={{ padding: '20px', background: '#16213E', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BotIcon /> <span>HustleBot</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fcfcfc' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ background: m.role === 'user' ? '#16213E' : 'white', color: m.role === 'user' ? 'white' : '#333', padding: '12px 16px', borderRadius: '18px', fontSize: '14px', border: m.role === 'user' ? 'none' : '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLimited && (
              <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                <button onClick={() => setShowAdForChat(true)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer' }}>Watch Ad to Unlock Chat</button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', background: 'white' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isLimited ? "Watch ad..." : "Ask me anything..."}
              disabled={isLimited || loading}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }}
            />
            <button 
              onClick={handleSend}
              disabled={isLimited || loading || !input.trim()}
              style={{ background: '#16213E', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', cursor: 'pointer' }}
            >
              Send
            </button>
          </div>
        </div>
      )}
      {showAdForChat && <WatchAdModal onComplete={handleAdComplete} onClose={() => setShowAdForChat(false)} />}
    </>
  );
}