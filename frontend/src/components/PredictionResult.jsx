

export default function PredictionResult({ result }) {
  if (!result) return null;

  const stats = [
    ["Distance", result.distance, ""],
    ["Duration", result.duration, ""],
    ["Speed", result.speed + " km/h", ""],
  ];

  return (
    <div style={{ marginTop: "20px", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "20px", animation: "fadeUp 0.3s ease" }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

      <div style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
        Result
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {stats.map(([label, value]) => (
          <div key={label} style={{ flex: 1, textAlign: "center", background: "#f8fafc", borderRadius: "8px", padding: "14px 8px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
      </div>

      {result.conditions && (
        <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "12px", color: "#94a3b8" }}>
          <span>🌤️ {result.conditions.weather}</span>
          <span>🛣️ {result.conditions.road}</span>
          <span>📅 {result.conditions.day}</span>
        </div>
      )}
    </div>
  );
}