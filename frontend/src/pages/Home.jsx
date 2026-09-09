// Home.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Distance from "./Distance";
import Input from "./Input";

export default function Home() {
  const [distance, setDistance] = useState(null);
  const [roadType, setRoadType] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleRestart = () => {
    setDistance(null);
    setRoadType(null);
    setResetKey(k => k + 1);
  };

  const handleRouteData = ({ distance_km, road_type }) => {
    setDistance(distance_km);
    setRoadType(road_type);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#f8fafc", overflow:"hidden" }}>
      <Navbar onRestart={handleRestart} />
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <Distance key={resetKey} onDistanceChange={setDistance} onRouteData={handleRouteData}>
          <Input key={resetKey} distance={distance} roadType={roadType} />
        </Distance>
      </div>
    </div>
  );
}