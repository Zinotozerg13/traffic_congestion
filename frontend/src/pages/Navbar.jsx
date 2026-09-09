// Navbar.jsx
import { useState, useEffect } from "react";

export default function Navbar({ onRestart }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day  = now.toLocaleDateString("en-US", { weekday:"long" });
  const date = now.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
  const time = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit" });

  return (
    <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:78, background:"#fff", borderBottom:"2px solid #e2e8f0", flexShrink:0, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bebas+Neue&display=swap');
        .restart-btn:hover { background:#fef2f2 !important; border-color:#dc2626 !important; color:#dc2626 !important; }
      `}</style>

      {/* Left — logo + title */}
      <div style={{ display:"flex", alignItems:"center", gap:18 }}>
        <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#dc2626,#b91c1c)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 18px rgba(220,38,38,0.35)", flexShrink:0 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
            <circle cx="7.5" cy="17.5" r="2.5"/>
            <circle cx="16.5" cy="17.5" r="2.5"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:34, color:"#0f172a", letterSpacing:4, lineHeight:1 }}>TRAFFIC CONGESTION PREDICTION</div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"#94a3b8", letterSpacing:1.5, marginTop:4, fontWeight:500 }}>KATHMANDU METROPOLITAN · OSM / OSRM · ML MODEL</div>
        </div>
      </div>

      {/* Right — day/time + restart */}
      <div style={{ display:"flex", alignItems:"center", gap:20 }}>

        {/* Live clock */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#0f172a", letterSpacing:3, lineHeight:1 }}>
            {time}
          </div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"#94a3b8", letterSpacing:1.5, fontWeight:600 }}>
            {day.toUpperCase()} · {date.toUpperCase()}
          </div>
        </div>

        <div style={{ width:1, height:28, background:"#e2e8f0" }} />

        <button className="restart-btn" onClick={onRestart} style={{ display:"flex", alignItems:"center", gap:9, padding:"12px 22px", background:"#f8fafc", border:"2px solid #e2e8f0", borderRadius:10, color:"#475569", fontFamily:"'Inter',sans-serif", fontSize:14, letterSpacing:1.5, fontWeight:700, cursor:"pointer", transition:"all .2s" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          RESTART
        </button>
      </div>
    </header>
  );
}