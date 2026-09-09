// TrafficInput.jsx
import { useState, useEffect } from "react";

const ROADS   = ["congested", "urban", "freeway"];
const WEATHER = ["Clear", "Rain", "Heavy Rain", "Fog","Storm"];
const now     = new Date();

const lbl   = { fontFamily:"'Inter',sans-serif", fontSize:15, letterSpacing:1, color:"#475569", textTransform:"uppercase", display:"block", marginBottom:10, fontWeight:700 };
const field = { width:"100%", padding:"16px 18px", background:"#fff", border:"2px solid #e2e8f0", borderRadius:12, color:"#0f172a", fontFamily:"'Inter',sans-serif", fontSize:17, outline:"none", boxSizing:"border-box", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", cursor:"pointer", transition:"border-color .2s" };

export default function TrafficInput({ distance, roadType }) {
  const [form, setForm] = useState({
    hour:      now.getHours(),
    minute:    Math.floor(now.getMinutes() / 15) * 15,
    road_type: "congested",
    weather:   "Clear",
    date:      now.toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  useEffect(() => {
    if (roadType) setForm(p => ({ ...p, road_type: roadType }));
  }, [roadType]);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePredict = async () => {
    setLoading(true); setResult(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distance_km:   distance,
          time_in_hours: form.hour + form.minute / 60,
          road_type:     form.road_type,
          weather:       form.weather,
          date:          form.date,
        }),
      });
      setResult(await res.json());
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const level = !result ? null :
    result.congestion_index < 0.3 ? { label:"LOW",      color:"#15803d", bg:"#f0fdf4", border:"#86efac" } :
    result.congestion_index < 0.6 ? { label:"MODERATE", color:"#a16207", bg:"#fefce8", border:"#fde047" } :
    result.congestion_index < 0.8 ? { label:"HIGH",     color:"#c2410c", bg:"#fff7ed", border:"#fdba74" } :
                                     { label:"SEVERE",   color:"#dc2626", bg:"#fef2f2", border:"#fecaca" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bebas+Neue&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        select option { background:#fff; color:#0f172a; }
        .predict-btn:hover:not(:disabled) { background:#b91c1c !important; transform:translateY(-1px); box-shadow:0 6px 16px rgba(220,38,38,0.35) !important; }
        .field-hover:hover { border-color:#94a3b8 !important; }
      `}</style>

      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:18, letterSpacing:1, color:"#1e293b", fontWeight:800, textTransform:"uppercase" }}>
        🚦 Traffic Prediction
      </div>

      <div>
        <label style={lbl}>Distance (km)</label>
        <div style={{ ...field, cursor:"default", color: distance ? "#dc2626" : "#94a3b8", border:`2px solid ${distance ? "#fca5a5" : "#e2e8f0"}`, background: distance ? "#fef2f2" : "#f8fafc", fontWeight:700, fontSize:18 }}>
          {distance ? `${parseFloat(distance).toFixed(2)} km  ·  from route` : "Calculate a route first"}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        <div style={{ gridColumn:"span 2" }}>
          <label style={lbl}>Date</label>
          <div style={{ position:"relative" }}>
            <input
              type="date"
              className="field-hover"
              value={form.date}
              style={{ ...field, cursor:"pointer", paddingRight:140 }}
              onChange={e => setF("date", e.target.value)}
            />
            {form.date && (
              <span style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:700, letterSpacing:1, color:"#dc2626", background:"#fef2f2", border:"1.5px solid #fca5a5", borderRadius:20, padding:"3px 12px", pointerEvents:"none" }}>
                {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", { weekday:"long" }).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div>
          <label style={lbl}>Time of Day</label>
          <div lang="en-GB">
            <input
              type="time"
              className="field-hover"
              value={`${String(form.hour).padStart(2,"0")}:${String(form.minute).padStart(2,"0")}`}
              style={{ ...field, cursor:"pointer" }}
              onChange={e => {
                const [h, m] = e.target.value.split(":").map(Number);
                setForm(p => ({ ...p, hour: h, minute: m }));
              }}
            />
          </div>
        </div>

        <div>
          <label style={lbl}>Weather</label>
          <select className="field-hover" style={field} value={form.weather} onChange={e => setF("weather", e.target.value)}>
            {WEATHER.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>

        <div style={{ gridColumn:"span 2" }}>
          <label style={lbl}>
            Road Type
            {roadType && <span style={{ marginLeft:8, fontSize:11, background:"#dbeafe", color:"#1d4ed8", padding:"2px 8px", borderRadius:20, fontWeight:600, letterSpacing:1, verticalAlign:"middle" }}>AUTO-DETECTED</span>}
          </label>
          <select className="field-hover" style={{ ...field, borderColor: roadType ? "#93c5fd" : "#e2e8f0", background: roadType ? "#eff6ff" : "#fff" }} value={form.road_type} onChange={e => setF("road_type", e.target.value)}>
            {ROADS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
          </select>
        </div>

      </div>

      <button className="predict-btn" disabled={!distance || loading} onClick={handlePredict}
        style={{ width:"100%", padding:"20px", border:"none", borderRadius:12, color:"white", background: !distance||loading ? "#fca5a5" : "#dc2626", fontFamily:"'Inter',sans-serif", fontSize:17, letterSpacing:2, fontWeight:800, cursor: !distance||loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12, boxShadow:"0 4px 12px rgba(220,38,38,0.25)", transition:"all .2s" }}
      >
        {loading
          ? <><div style={{ width:20, height:20, border:"3px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin .7s linear infinite" }} />PREDICTING...</>
          : "▸ PREDICT TRAFFIC"}
      </button>

      {result && (
        <div style={{ padding:"28px 32px", background:level.bg, border:`2px solid ${level.border}`, borderRadius:14, animation:"fadeIn .4s ease", boxShadow:`0 4px 16px ${level.border}88` }}>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, letterSpacing:2, color:"#94a3b8", textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>Prediction Result</div>

          <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:20 }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:80, color:"#0f172a", lineHeight:1 }}>{Math.round(result.travel_time_minutes)}</span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:26, color:"#dc2626", fontWeight:900 }}>MIN</span>
          </div>

          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:14, letterSpacing:1, color:"#64748b", textTransform:"uppercase", fontWeight:600 }}>Congestion Index</span>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:level.color, fontWeight:700 }}>{result.congestion_index.toFixed(3)} — {level.label}</span>
            </div>
            <div style={{ height:10, background:"#e2e8f0", borderRadius:5, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min(result.congestion_index*100,100).toFixed(1)}%`, background:level.color, borderRadius:5, transition:"width .7s ease" }} />
            </div>
          </div>

         
        </div>
      )}
    </div>
  );
}