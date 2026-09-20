"use client";

import { useState } from "react";
import { Check, X, Star, Smartphone, Wifi, ArrowDown, ArrowUp } from "lucide-react";
import { providers, mobileRanges, coverageData, modems } from "../lib/data";

export default function SimComparison() {
  const [useCase, setUseCase] = useState<"general"|"streaming"|"gaming"|"rural"|"budget">("general");
  const [sim1, setSim1] = useState("jio");
  const [sim2, setSim2] = useState("airtel");

  const recommendations: Record<string, { best: string; reason: string }[]> = {
    general: [
      { best: "jio", reason: "Best overall coverage + speed combo" },
      { best: "airtel", reason: "Strong urban coverage + fast 4G" }
    ],
    streaming: [
      { best: "jio", reason: "Unlimited 5G + OTT apps included" },
      { best: "airtel", reason: "Disney+ Hotstar + fast speeds" }
    ],
    gaming: [
      { best: "jio", reason: "Low latency 5G + high bandwidth" },
      { best: "airtel", reason: "Consistent speeds + low ping" }
    ],
    rural: [
      { best: "bsnl", reason: "Widest rural coverage" },
      { best: "jio", reason: "Best 4G rural penetration" }
    ],
    budget: [
      { best: "bsnl", reason: "Cheapest plans available" },
      { best: "vi", reason: "Good value for money" }
    ]
  };

  const recs = recommendations[useCase];
  const p1 = providers.find(p => p.id === sim1)!;
  const p2 = providers.find(p => p.id === sim2)!;
  const r1 = mobileRanges.filter(r => r.provider === sim1);
  const r2 = mobileRanges.filter(r => r.provider === sim2);
  const cov1 = coverageData[sim1];
  const cov2 = coverageData[sim2];
  const cheapest1 = Math.min(...p1.plans.filter(pl=>pl.type==="mobile").map(pl=>pl.price));
  const cheapest2 = Math.min(...p2.plans.filter(pl=>pl.type==="mobile").map(pl=>pl.price));

  return (
    <div>
      <div className="eyebrow">SIM Compare</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>Which SIM is best for you?</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:14}}>Compare two providers side-by-side for your specific use case.</p>

      <div className="pills" style={{marginBottom:12}}>
        {([["general","General"],["streaming","Streaming"],["gaming","Gaming"],["rural","Rural"],["budget","Budget"]] as const).map(([k,l])=>(
          <button key={k} className={`pill${useCase===k?" active":""}`} onClick={()=>setUseCase(k)}>{l}</button>
        ))}
      </div>

      <div style={{background:"#f0f6ff",borderRadius:10,padding:12,marginBottom:16,fontSize:12}}>
        <strong>Best for {useCase}:</strong> {recs.map((r,i)=>(
          <span key={i} style={{marginLeft:8}}>
            <span style={{color:providers.find(p=>p.id===r.best)?.color,fontWeight:700}}>{providers.find(p=>p.id===r.best)?.name}</span>
            {i<recs.length-1?" · ":" — "}{r.reason}{i<recs.length-1?" ":""}
          </span>
        ))}
      </div>

      <div className="pills" style={{marginBottom:16}}>
        <span style={{fontSize:12,marginRight:8,fontWeight:700}}>SIM 1:</span>
        {providers.map(p=>(
          <button key={p.id} className={`pill${sim1===p.id?" active":""}`} onClick={()=>setSim1(p.id)}>{p.name}</button>
        ))}
      </div>
      <div className="pills" style={{marginBottom:16}}>
        <span style={{fontSize:12,marginRight:8,fontWeight:700}}>SIM 2:</span>
        {providers.map(p=>(
          <button key={p.id} className={`pill${sim2===p.id?" active":""}`} onClick={()=>setSim2(p.id)}>{p.name}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[p1, p2].map((p, idx) => {
          const ranges = idx === 0 ? r1 : r2;
          const cov = idx === 0 ? cov1 : cov2;
          const cheapest = idx === 0 ? cheapest1 : cheapest2;
          return (
            <div key={`${p.id}-${idx}`} className="card card-pad">
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div className={`provider-logo p-${p.id}`} style={{width:40,height:40,fontSize:14}}>{p.logo}</div>
                <div>
                  <strong style={{fontSize:16}}>{p.name}</strong>
                  <div style={{display:"flex",gap:4,alignItems:"center",fontSize:12,color:"#66758c"}}>
                    <Star size={12} fill="#f5a623" stroke="#f5a623"/> {p.rating}
                  </div>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                <div style={{background:"#f5f8fc",padding:10,borderRadius:8,textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#66758c"}}>Urban</div>
                  <strong style={{fontSize:18,color:cov?.urbanCoverage>=95?"#0b9a68":"#f5a623"}}>{cov?.urbanCoverage}%</strong>
                </div>
                <div style={{background:"#f5f8fc",padding:10,borderRadius:8,textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#66758c"}}>Rural</div>
                  <strong style={{fontSize:18,color:cov?.ruralCoverage>=80?"#0b9a68":"#f5a623"}}>{cov?.ruralCoverage}%</strong>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>SIGNAL RANGE</div>
                {ranges.map((r,i) => (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",borderBottom:"1px solid #f0f3f8"}}>
                    <span>{r.generation}</span>
                    <span style={{fontWeight:600}}>{r.rangeKm}km · {r.coveragePercent}%</span>
                  </div>
                ))}
              </div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>PLAN PRICES</div>
                <div style={{display:"grid",gap:4}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span>Cheapest mobile</span>
                    <strong style={{color:"#0b74ff"}}>₹{cheapest}</strong>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span>5G available</span>
                    {p.technologies.includes("5G") ? <Check size={14} color="#0b9a68"/> : <X size={14} color="#ccc"/>}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span>Fiber available</span>
                    {p.technologies.includes("Fiber") ? <Check size={14} color="#0b9a68"/> : <X size={14} color="#ccc"/>}
                  </div>
                </div>
              </div>

              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>TOP MOBILE PLANS</div>
                {p.plans.filter(pl=>pl.type==="mobile").slice(0,3).map(pl=>(
                  <div key={pl.id} style={{borderTop:"1px solid #e1e8f1",padding:"6px 0",fontSize:11}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><strong>{pl.name}</strong><strong style={{color:"#0b74ff"}}>₹{pl.price}</strong></div>
                    <div style={{color:"#66758c"}}>{pl.data} · {pl.validity}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}