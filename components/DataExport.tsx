"use client";

import { Download } from "lucide-react";
import { getStorage, providers } from "../lib/data";

export default function DataExport() {
  const exportData = () => {
    const speeds = getStorage("netreach-speed-history", []);
    const community = getStorage("netreach-community-speeds", []);
    const feedback = getStorage("netreach-community-feedback", []);
    const saved = getStorage("netreach-saved-locations", []);

    const data = {
      exportedAt: new Date().toISOString(),
      app: "NetReach",
      speedTests: speeds,
      communitySpeeds: community,
      reviews: feedback,
      savedLocations: saved,
      providers: providers.map(p => ({
        id: p.id,
        name: p.name,
        rating: p.rating,
        speedAvg: p.speedAvg,
        plans: p.plans.length
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `netreach-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={exportData} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,padding:"6px 12px",borderRadius:6,border:"1px solid #e1e8f1",background:"#fff",color:"#66758c",cursor:"pointer"}}>
      <Download size={12}/> Export data
    </button>
  );
}