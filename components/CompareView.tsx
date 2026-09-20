"use client";

import { useState } from "react";
import { Check, X, Star, Smartphone, Wifi, Router, Signal } from "lucide-react";
import { providers, coverageData, modems, mobileRanges } from "../lib/data";

export default function CompareView() {
  const [selected, setSelected] = useState<string[]>(["jio", "airtel"]);
  const [section, setSection] = useState<"overview" | "mobile" | "fiber" | "modems" | "range">("overview");

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  };

  const compared = providers.filter(p => selected.includes(p.id));

  return (
    <div>
      <div className="eyebrow">Compare</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>Compare providers side by side</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:14}}>Select 2-4 providers to compare plans, coverage, modems, and signal range.</p>

      <div className="pills" style={{marginBottom:12}}>
        {providers.map(p => (
          <button key={p.id} className={`pill${selected.includes(p.id)?" active":""}`} onClick={() => toggle(p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      <div className="pills" style={{marginBottom:16}}>
        {([["overview","Overview",Star],["mobile","Mobile Plans",Smartphone],["fiber","Fiber",Wifi],["modems","Routers",Router],["range","Signal Range",Signal]] as const).map(([t,label,Icon]) => (
          <button key={t} className={`pill${section===t?" active":""}`} onClick={()=>setSection(t)} style={{display:"flex",alignItems:"center",gap:4}}>
            <Icon size={12}/> {label}
          </button>
        ))}
      </div>

      {section === "overview" && (
        <div style={{display:"grid",gridTemplateColumns:`repeat(${compared.length},1fr)`,gap:12}}>
          {compared.map(p => {
            const cov = coverageData[p.id];
            return (
              <div key={p.id} className="card card-pad">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div className={`provider-logo p-${p.id}`} style={{width:40,height:40,fontSize:14}}>{p.logo}</div>
                  <div>
                    <strong style={{fontSize:16}}>{p.name}</strong>
                    <div style={{display:"flex",gap:4,alignItems:"center",fontSize:12,color:"#66758c"}}>
                      <Star size={12} fill="#f5a623" stroke="#f5a623"/> {p.rating}
                    </div>
                  </div>
                </div>

                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>SPEED & COVERAGE</div>
                  <div style={{display:"grid",gap:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span>Avg Speed</span><strong>{p.speedAvg} Mbps</strong></div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span>Urban Coverage</span><strong>{cov?.urbanCoverage}%</strong></div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span>Rural Coverage</span><strong>{cov?.ruralCoverage}%</strong></div>
                  </div>
                </div>

                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>TECHNOLOGIES</div>
                  <div style={{display:"grid",gap:4}}>
                    {["Fiber","AirFiber","4G","5G"].map(t => (
                      <div key={t} style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
                        {p.technologies.includes(t) ? <Check size={14} color="#0b9a68"/> : <X size={14} color="#ccc"/>}
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>QUICK STATS</div>
                  <div style={{display:"grid",gap:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                      <span>Cheapest Mobile</span>
                      <strong style={{color:"#0b74ff"}}>₹{Math.min(...p.plans.filter(pl=>pl.type==="mobile").map(pl=>pl.price))}</strong>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                      <span>Cheapest Fiber</span>
                      <strong style={{color:"#0b74ff"}}>₹{Math.min(...p.plans.filter(pl=>pl.type==="fiber").map(pl=>pl.price))}</strong>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                      <span>Router Price</span>
                      <strong>{modems.find(m=>m.provider===p.id&&m.price===0)?"Free":"₹"+(modems.find(m=>m.provider===p.id)?.price||"N/A")}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {section === "mobile" && (
        <div style={{display:"grid",gridTemplateColumns:`repeat(${compared.length},1fr)`,gap:12}}>
          {compared.map(p => {
            const mobilePlans = p.plans.filter(pl => pl.type === "mobile").sort((a,b) => a.price - b.price);
            return (
              <div key={p.id} className="card card-pad">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div className={`provider-logo p-${p.id}`} style={{width:36,height:36,fontSize:13}}>{p.logo}</div>
                  <strong style={{fontSize:15}}>{p.name} Mobile</strong>
                </div>
                {mobilePlans.map(pl => (
                  <div key={pl.id} style={{borderTop:"1px solid #e1e8f1",padding:"8px 0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <strong style={{fontSize:12}}>{pl.name}</strong>
                      <strong style={{fontSize:14,color:"#0b74ff"}}>₹{pl.price}</strong>
                    </div>
                    <div style={{fontSize:11,color:"#66758c"}}>{pl.data} · {pl.validity}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2}}>{pl.features.join(" · ")}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {section === "fiber" && (
        <div style={{display:"grid",gridTemplateColumns:`repeat(${compared.length},1fr)`,gap:12}}>
          {compared.map(p => {
            const fiberPlans = p.plans.filter(pl => pl.type === "fiber").sort((a,b) => a.price - b.price);
            return (
              <div key={p.id} className="card card-pad">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div className={`provider-logo p-${p.id}`} style={{width:36,height:36,fontSize:13}}>{p.logo}</div>
                  <strong style={{fontSize:15}}>{p.name} Fiber</strong>
                </div>
                {fiberPlans.length === 0 && <div style={{fontSize:12,color:"#66758c",padding:8}}>No fiber plans</div>}
                {fiberPlans.map(pl => (
                  <div key={pl.id} style={{borderTop:"1px solid #e1e8f1",padding:"8px 0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <strong style={{fontSize:12}}>{pl.name}</strong>
                      <strong style={{fontSize:14,color:"#0b74ff"}}>₹{pl.price}</strong>
                    </div>
                    <div style={{fontSize:11,color:"#66758c"}}>{pl.speed} · {pl.data.length>30?pl.data.slice(0,30)+"...":pl.data}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2}}>{pl.features.join(" · ")}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {section === "modems" && (
        <div style={{display:"grid",gridTemplateColumns:`repeat(${compared.length},1fr)`,gap:12}}>
          {compared.map(p => {
            const pModems = modems.filter(m => m.provider === p.id);
            return (
              <div key={p.id} className="card card-pad">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div className={`provider-logo p-${p.id}`} style={{width:36,height:36,fontSize:13}}>{p.logo}</div>
                  <strong style={{fontSize:15}}>{p.name} Routers</strong>
                </div>
                {pModems.map(m => (
                  <div key={m.id} style={{borderTop:"1px solid #e1e8f1",padding:"8px 0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <strong style={{fontSize:12}}>{m.name}</strong>
                      <strong style={{fontSize:14,color:m.price===0?"#0b9a68":"#0b74ff"}}>{m.price===0?"Free":"₹"+m.price}</strong>
                    </div>
                    <div style={{fontSize:11,color:"#66758c"}}>{m.type.toUpperCase()} · {m.wifi} · {m.speed}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2}}>{m.features.join(" · ")}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {section === "range" && (
        <div style={{display:"grid",gridTemplateColumns:`repeat(${compared.length},1fr)`,gap:12}}>
          {compared.map(p => {
            const pRanges = mobileRanges.filter(r => r.provider === p.id);
            return (
              <div key={p.id} className="card card-pad">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div className={`provider-logo p-${p.id}`} style={{width:36,height:36,fontSize:13}}>{p.logo}</div>
                  <strong style={{fontSize:15}}>{p.name} Signal</strong>
                </div>
                {pRanges.map((r,i) => (
                  <div key={i} style={{borderTop:"1px solid #e1e8f1",padding:"8px 0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <strong style={{fontSize:12}}>{r.generation}</strong>
                      <span style={{fontSize:11,fontWeight:700,color:r.coveragePercent>=90?"#0b9a68":r.coveragePercent>=70?"#f5a623":"#e55f5f"}}>{r.coveragePercent}%</span>
                    </div>
                    <div style={{fontSize:11,color:"#66758c"}}>Range: {r.rangeKm}km · {r.frequency}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2}}>Speed: {r.speed} · Indoor: {r.indoorPenetration}</div>
                    <div style={{width:"100%",height:4,background:"#e1e8f1",borderRadius:999,overflow:"hidden",marginTop:4}}>
                      <div style={{width:`${r.coveragePercent}%`,height:"100%",background:r.coveragePercent>=90?"#0b9a68":r.coveragePercent>=70?"#f5a623":"#e55f5f",borderRadius:999}}/>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
