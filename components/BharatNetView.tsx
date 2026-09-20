"use client";

import { useState } from "react";
import { ExternalLink, Wifi, MapPin, Check, AlertCircle } from "lucide-react";
import { bharatNetData, providers, coverageData } from "../lib/data";

export default function BharatNetView() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const totalGPs = bharatNetData.totalGPs;
  const connectedGPs = bharatNetData.connectedGPs;
  const progress = Math.round((connectedGPs / totalGPs) * 100);

  return (
    <div>
      <div className="eyebrow">BharatNet</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>BharatNet rural fiber</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:18}}>India&apos;s national rural broadband connectivity program.</p>

      <div className="card card-pad" style={{marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
          <div style={{textAlign:"center",padding:16,background:"#f0f6ff",borderRadius:10}}>
            <div style={{fontSize:32,fontWeight:850,color:"#0b74ff"}}>{totalGPs.toLocaleString()}</div>
            <div style={{fontSize:12,color:"#66758c"}}>Total Gram Panchayats</div>
          </div>
          <div style={{textAlign:"center",padding:16,background:"#f0faf5",borderRadius:10}}>
            <div style={{fontSize:32,fontWeight:850,color:"#0b9a68"}}>{connectedGPs.toLocaleString()}</div>
            <div style={{fontSize:12,color:"#66758c"}}>Connected GPs</div>
          </div>
          <div style={{textAlign:"center",padding:16,background:"#fef9ee",borderRadius:10}}>
            <div style={{fontSize:32,fontWeight:850,color:"#f5a623"}}>{progress}%</div>
            <div style={{fontSize:12,color:"#66758c"}}>Overall Progress</div>
          </div>
        </div>

        <div style={{width:"100%",height:10,background:"#e1e8f1",borderRadius:999,overflow:"hidden",marginBottom:8}}>
          <div style={{width:`${progress}%`,height:"100%",background:"linear-gradient(90deg,#0b74ff,#0b9a68)",borderRadius:999,transition:"width 1s"}}/>
        </div>
        <div style={{fontSize:11,color:"#66758c",textAlign:"center"}}>{progress}% complete — {connectedGPs.toLocaleString()} of {totalGPs.toLocaleString()} GPs connected</div>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>State-wise progress</div>
        {bharatNetData.states.map((s, i) => (
          <div key={i} onClick={() => setSelectedState(selectedState === s.name ? null : s.name)} style={{cursor:"pointer",padding:"10px 12px",background:selectedState===s.name?"#f0f6ff":"#f5f8fc",borderRadius:8,marginBottom:6,transition:"all 0.2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <MapPin size={14} color="#0b74ff"/>
              <strong style={{flex:1,fontSize:13}}>{s.name}</strong>
              <span style={{fontSize:12,color:"#66758c"}}>{s.total.toLocaleString()} GPs</span>
              <span style={{fontSize:12,fontWeight:700,color:s.connected>=80?"#0b9a68":s.connected>=60?"#f5a623":"#e55f5f"}}>{s.connected}%</span>
            </div>
            <div style={{width:"100%",height:6,background:"#e1e8f1",borderRadius:999,overflow:"hidden"}}>
              <div style={{width:`${s.connected}%`,height:"100%",background:s.connected>=80?"#0b9a68":s.connected>=60?"#f5a623":"#e55f5f",borderRadius:999}}/>
            </div>
            {selectedState === s.name && (
              <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #e1e8f1",fontSize:11,color:"#66758c"}}>
                {s.connected >= 80 ? "Excellent fiber coverage — multiple ISPs likely available." :
                 s.connected >= 60 ? "Good fiber coverage — at least 1-2 ISPs available in most areas." :
                 "Limited fiber coverage — satellite or wireless may be better options."}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card card-pad">
        <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Providers using BharatNet</div>
        {providers.filter(p => p.technologies.includes("Fiber")).map(p => {
          const cov = coverageData[p.id];
          return (
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#f5f8fc",borderRadius:8,marginBottom:6}}>
              <div className={`provider-logo p-${p.id}`} style={{width:32,height:32,fontSize:11}}>{p.logo}</div>
              <div style={{flex:1}}>
                <strong style={{fontSize:13}}>{p.name}</strong>
                <div style={{fontSize:11,color:"#66758c"}}>Rural: {cov?.ruralCoverage}% · Urban: {cov?.urbanCoverage}%</div>
              </div>
              <button className="status coverage-btn" onClick={() => window.open(p.website, "_blank", "noopener,noreferrer")}>
                Visit <ExternalLink size={10}/>
              </button>
            </div>
          );
        })}
        <div style={{marginTop:12,fontSize:11,color:"#66758c",display:"flex",alignItems:"flex-start",gap:6}}>
          <AlertCircle size={14} style={{flexShrink:0,marginTop:1}}/>
          BharatNet provides the backbone fiber. Last-mile connectivity is handled by ISPs like JioFiber, Airtel Xstream, BSNL BharatFiber, etc.
        </div>
      </div>
    </div>
  );
}
