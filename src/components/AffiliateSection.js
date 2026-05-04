const BACKEND = 'http://localhost:10000'; // Match your backend port

export default function AffiliateSection() {
  
  // THE FRONTEND CALL CODE GOES HERE
  const logClick = async (toolName) => {
    try {
      await fetch(`${BACKEND}/track/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          item: toolName, 
          type: 'affiliate_link',
          timestamp: new Date() 
        })
      });
    } catch (err) {
      console.error("Tracking failed", err);
    }
  };

  const TOOLS = [
    { title: "SurveyTime", link: "https://surveytime.io/?aff=123" },
    { title: "Fiverr", link: "https://fiverr.com/refer" }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3>Recommended Tools 🛠️</h3>
      {TOOLS.map((tool, i) => (
        <div key={i} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px' }}>
          <h4>{tool.title}</h4>
          {/* WE TRIGGER THE LOGGING ON CLICK */}
          <a 
            href={tool.link} 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => logClick(tool.title)}
            style={{ color: 'green', fontWeight: 'bold' }}
          >
            Try this app →
          </a>
        </div>
      ))}
    </div>
  );
}