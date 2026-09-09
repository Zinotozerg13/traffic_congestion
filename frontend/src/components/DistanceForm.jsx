

import { useState } from "react";

const WEATHER = ["Clear", "Rainy", "Foggy", "Snowy", "Stormy"];
const ROADS = ["Highway", "City Road", "Rural", "Mountain"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inp = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#0f172a",
  background: "#fff",
  fontFamily: "inherit",
  boxSizing: "border-box",
  outline: "none",
};

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>{label}</label>
      {children}
    </div>
  );
}

function Sel({ value, onChange, opts }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...inp, appearance: "none", cursor: "pointer" }}
    >
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.09em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "12px" }}>
      {children}
    </div>
  );
}

export default function DistanceForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    source: "", destination: "", weather: "Clear",
    road: "Highway", time: "", day: "Monday",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.source && form.destination && !loading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(form);
  };

  return (
    <div>
      {/* Route */}
      <SectionLabel>Route</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        <Field label="Source">
          <input style={inp} placeholder="e.g. New York, NY" value={form.source} onChange={e => set("source", e.target.value)} />
        </Field>
        <Field label="Destination">
          <input style={inp} placeholder="e.g. Los Angeles, CA" value={form.destination} onChange={e => set("destination", e.target.value)} />
        </Field>
      </div>

      <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "24px" }} />

      {/* Conditions */}
      <SectionLabel>Conditions</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <Field label="Weather"><Sel value={form.weather} onChange={v => set("weather", v)} opts={WEATHER} /></Field>
        <Field label="Road Type"><Sel value={form.road} onChange={v => set("road", v)} opts={ROADS} /></Field>
        <Field label="Time (hrs)">
          <input type="number" style={inp} placeholder="e.g. 2.5" value={form.time} onChange={e => set("time", e.target.value)} />
        </Field>
        <Field label="Day"><Sel value={form.day} onChange={v => set("day", v)} opts={DAYS} /></Field>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: "100%", padding: "12px",
          background: canSubmit ? "#0f172a" : "#e2e8f0",
          color: canSubmit ? "#fff" : "#94a3b8",
          border: "none", borderRadius: "10px",
          fontSize: "14px", fontWeight: "600",
          cursor: canSubmit ? "pointer" : "not-allowed",
          fontFamily: "inherit",
        }}
      >
        {loading ? "Calculating..." : "Calculate →"}
      </button>
    </div>
  );
}