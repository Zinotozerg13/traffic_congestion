// Distance.jsx
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ClickHandler({ points, setPoints, setAddress, onRouteReady }) {
  useMapEvents({
    async click(e) {
      const res  = await fetch(`http://127.0.0.1:8000/reverse/?lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
      const data = await res.json();
      const name = data.display_name;
      if (points.length === 0) {
        setPoints([e.latlng]);
        setAddress(prev => ({ ...prev, source: name }));
      } else if (points.length === 1) {
        const np = [points[0], e.latlng];
        setPoints(np);
        setAddress(prev => ({ ...prev, destination: name }));
        onRouteReady(np[0], np[1]);
      } else {
        setPoints([e.latlng]);
        setAddress({ source: name, destination: "" });
      }
    }
  });
  return null;
}

export default function Distance({ onDistanceChange, onRouteData, children }) {
  const [points,      setPoints]      = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance,    setDistance]    = useState(null);
  const [address,     setAddress]     = useState({ source:"", destination:"" });
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const searchTimeout = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchRoute = async (p1, p2) => {
    const res  = await fetch(`http://127.0.0.1:8000/route/?lat1=${p1.lat}&lon1=${p1.lng}&lat2=${p2.lat}&lon2=${p2.lng}`);
    const data = await res.json();
    setDistance(data.distance_km);
    onDistanceChange?.(data.distance_km);
    onRouteData?.({ distance_km: data.distance_km, road_type: data.road_type });
    // Backend returns GeoJSON geometry: coordinates are [lon, lat] pairs
    const coords = data.geometry.coordinates.map(c => [c[1], c[0]]);
    setRouteCoords(coords);
  };

  const searchLocation = (query) => {
    clearTimeout(searchTimeout.current);
    if (!query || query.length < 2) { setSuggestions([]); return; }
    searchTimeout.current = setTimeout(async () => {
      const res  = await fetch(`http://127.0.0.1:8000/search/?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
    }, 300);
  };

  const pickSuggestion = (s) => {
    const latlng = { lat: parseFloat(s.lat), lng: parseFloat(s.lon) };
    setSuggestions([]);
    if (activeField === "source") {
      setAddress(prev => ({ ...prev, source: s.display_name }));
      const np = [latlng, ...(points.length > 1 ? [points[1]] : [])];
      setPoints(np);
      if (np.length === 2) fetchRoute(np[0], np[1]);
    } else {
      setAddress(prev => ({ ...prev, destination: s.display_name }));
      const np = points.length >= 1 ? [points[0], latlng] : [latlng];
      setPoints(np);
      if (np.length === 2) fetchRoute(np[0], np[1]);
    }
  };

  const lbl = { fontFamily:"'Inter',sans-serif", fontSize:15, letterSpacing:1, color:"#475569", textTransform:"uppercase", display:"block", marginBottom:10, fontWeight:700 };

  const clickHint = points.length === 0
    ? { text:"Click map to set source",      color:"#dc2626", bg:"#fef2f2", border:"#fecaca" }
    : points.length === 1
    ? { text:"Click map to set destination", color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe" }
    : { text:"Route calculated ✓",           color:"#15803d", bg:"#f0fdf4", border:"#86efac" };

  const inputStyle = (active, color) => ({
    width:"100%", padding:"18px 20px 18px 46px",
    background:"#fff", border:`2px solid ${active ? color : "#e2e8f0"}`,
    borderRadius:12, color:"#0f172a",
    fontFamily:"'Inter',sans-serif", fontSize:18,
    outline:"none", transition:"all .2s", boxSizing:"border-box",
    boxShadow: active ? `0 0 0 4px ${color}20` : "0 1px 4px rgba(0,0,0,0.07)",
  });

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", display:"flex", flex:1, overflow:"hidden", background:"#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bebas+Neue&display=swap');
        input::placeholder { color:#94a3b8; font-size:17px; }
        .sug-item:hover { background:#f1f5f9 !important; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      {/* LEFT PANEL */}
      <div ref={panelRef} style={{ width:"60%", flexShrink:0, background:"#ffffff", borderRight:"2px solid #e2e8f0", display:"flex", flexDirection:"column", overflowY:"auto", padding:"36px 40px", gap:24 }}>

        {/* Hint */}
        <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", background:clickHint.bg, border:`2px solid ${clickHint.border}`, borderRadius:12 }}>
          <span style={{ width:13, height:13, borderRadius:"50%", background:clickHint.color, flexShrink:0, animation:points.length < 2 ? "pulse 1.8s infinite" : "none", boxShadow:`0 0 0 4px ${clickHint.border}` }} />
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:clickHint.color, fontWeight:600 }}>{clickHint.text}</span>
        </div>

        {/* Source */}
        <div style={{ position:"relative" }}>
          <label style={lbl}>Source</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", width:13, height:13, borderRadius:"50%", background:"#dc2626", boxShadow:"0 0 0 4px #fecaca", zIndex:1 }} />
            <input type="text" placeholder="Search location or click map" value={address.source}
              onFocus={() => setActiveField("source")}
              onChange={e => { setAddress({ ...address, source:e.target.value }); searchLocation(e.target.value); }}
              style={inputStyle(activeField === "source", "#dc2626")}
            />
          </div>
          {/* Source suggestions — float absolutely */}
          {suggestions.length > 0 && activeField === "source" && (
            <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:9999, background:"#fff", border:"2px solid #e2e8f0", borderRadius:12, overflow:"hidden", boxShadow:"0 16px 40px rgba(0,0,0,0.15)", marginTop:6 }}>
              {suggestions.map((s, i) => (
                <div key={i} className="sug-item"
                  style={{ padding:"15px 20px", fontSize:16, color:"#334155", cursor:"pointer", borderBottom:"1px solid #f1f5f9", display:"flex", gap:12, transition:"all .15s" }}
                  onMouseDown={e => { e.preventDefault(); pickSuggestion(s); }}
                >
                  <span style={{ color:"#dc2626", flexShrink:0, fontSize:18 }}>◎</span>
                  <span>{s.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div style={{ position:"relative" }}>
          <label style={lbl}>Destination</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", width:13, height:13, borderRadius:"50%", background:"#1d4ed8", boxShadow:"0 0 0 4px #bfdbfe", zIndex:1 }} />
            <input type="text" placeholder="Search location or click map" value={address.destination}
              onFocus={() => setActiveField("destination")}
              onChange={e => { setAddress({ ...address, destination:e.target.value }); searchLocation(e.target.value); }}
              style={inputStyle(activeField === "destination", "#1d4ed8")}
            />
          </div>
          {/* Destination suggestions — float absolutely */}
          {suggestions.length > 0 && activeField === "destination" && (
            <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:9999, background:"#fff", border:"2px solid #e2e8f0", borderRadius:12, overflow:"hidden", boxShadow:"0 16px 40px rgba(0,0,0,0.15)", marginTop:6 }}>
              {suggestions.map((s, i) => (
                <div key={i} className="sug-item"
                  style={{ padding:"15px 20px", fontSize:16, color:"#334155", cursor:"pointer", borderBottom:"1px solid #f1f5f9", display:"flex", gap:12, transition:"all .15s" }}
                  onMouseDown={e => { e.preventDefault(); pickSuggestion(s); }}
                >
                  <span style={{ color:"#1d4ed8", flexShrink:0, fontSize:18 }}>◎</span>
                  <span>{s.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distance badge */}
        {distance && (
          <div style={{ padding:"24px 28px", background:"linear-gradient(135deg,#fef2f2,#fff)", border:"2px solid #fecaca", borderRadius:14, animation:"fadeIn .4s ease", boxShadow:"0 4px 12px rgba(220,38,38,0.1)" }}>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, letterSpacing:2, color:"#94a3b8", textTransform:"uppercase", marginBottom:6, fontWeight:600 }}>Total Distance</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:72, color:"#0f172a", lineHeight:1 }}>{parseFloat(distance).toFixed(1)}</span>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:24, color:"#dc2626", fontWeight:800, letterSpacing:2 }}>KM</span>
            </div>
          </div>
        )}

        {/* TrafficInput slot */}
        {children && <>
          <div style={{ height:2, background:"#f1f5f9", borderRadius:1 }} />
          {children}
        </>}
      </div>

      {/* RIGHT MAP */}
      <div style={{ flex:1, overflow:"hidden" }}>
        <MapContainer center={[27.7172, 85.3240]} zoom={13} style={{ height:"100%", width:"100%" }}>
          <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler points={points} setPoints={setPoints} setAddress={setAddress} onRouteReady={fetchRoute} />
          {points.map((p, i) => (
            <Marker key={i} position={p} icon={window.L && window.L.divIcon({
              className:"",
              html:`<div style="width:38px;height:38px;border-radius:50% 50% 50% 0;background:${i===0?"#dc2626":"#1d4ed8"};transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:white;font-weight:800;font-size:15px;font-family:sans-serif;display:block;">${i===0?"A":"B"}</span></div>`,
              iconSize:[38,38], iconAnchor:[19,38],
            })} />
          ))}
          {routeCoords.length > 0 && <Polyline positions={routeCoords} color="#dc2626" weight={8} opacity={0.85} />}
        </MapContainer>
      </div>
    </div>
  );
}