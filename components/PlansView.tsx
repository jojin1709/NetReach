"use client";

import { useState } from "react";
import { Check, ExternalLink, Smartphone, Wifi, Router, Signal } from "lucide-react";
import { providers, modems, mobileRanges } from "../lib/data";

type Tab = "mobile" | "fiber" | "airfiber" | "modems" | "range";

export default function PlansView() {
  const [tab, setTab] = useState<Tab>("mobile");
  const [providerFilter, setProviderFilter] = useState("all");

  const allPlans = providers.flatMap(p => p.plans);

  const filteredPlans = allPlans.filter(pl => {
    if (providerFilter !== "all" && pl.provider !== providerFilter) return false;
    if (tab === "mobile" && pl.type !== "mobile") return false;
    if (tab === "fiber" && pl.type !== "fiber") return false;
    if (tab === "airfiber" && pl.type !== "airfiber") return false;
    return true;
  });

  const filteredModems = modems.filter(m => {
    if (providerFilter !== "all" && m.provider !== providerFilter) return false;
    return true;
  });

  const filteredRanges = mobileRanges.filter(r => {
    if (providerFilter !== "all" && r.provider !== providerFilter) return false;
    return true;
  });

  const providerFor = (id: string) => providers.find(p => p.id === id);

  const tabs: [Tab, string, any][] = [
    ["mobile", "Mobile Recharge", Smartphone],
    ["fiber", "Fiber Broadband", Wifi],
    ["airfiber", "AirFiber", Wifi],
    ["modems", "Routers & Modems", Router],
    ["range", "Mobile Range", Signal],
  ];

  return (
    <div>
      <div className="eyebrow">Plans</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>All plans & equipment</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:14}}>Mobile recharges, fiber, AirFiber, routers, and signal range data.</p>

      <div className="pills" style={{marginBottom:12}}>
        {tabs.map(([t, label, Icon]) => (
          <button key={t} className={`pill${tab===t?" active":""}`} onClick={()=>setTab(t)} style={{display:"flex",alignItems:"center",gap:4}}>
            <Icon size={12}/> {label}
          </button>
        ))}
      </div>
      <div className="pills" style={{marginBottom:16}}>
        {[{id:"all",name:"All"},{id:"jio",name:"Jio"},{id:"airtel",name:"Airtel"},{id:"vi",name:"Vi"},{id:"bsnl",name:"BSNL"}].map(p => (
          <button key={p.id} className={`pill${providerFilter===p.id?" active":""}`} onClick={()=>setProviderFilter(p.id)}>{p.name}</button>
        ))}
      </div>

      {(tab === "mobile" || tab === "fiber" || tab === "airfiber") && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
          {filteredPlans.length === 0 && <div style={{fontSize:12,color:"#66758c",padding:16}}>No plans found for this filter.</div>}
          {filteredPlans.map(pl => {
            const prov = providerFor(pl.provider);
            const isMobile = pl.type === "mobile";
            return (
              <div key={pl.id} className="card card-pad" style={{display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div className={`provider-logo p-${pl.provider}`} style={{width:32,height:32,fontSize:11}}>{prov?.logo}</div>
                  <div style={{flex:1}}>
                    <strong style={{fontSize:14}}>{pl.name}</strong>
                    <div style={{fontSize:11,color:"#66758c"}}>{pl.type.replace("_"," ").toUpperCase()}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:22,fontWeight:850,color:"#0b74ff"}}>₹{pl.price}</div>
                    <div style={{fontSize:10,color:"#66758c"}}>{pl.validity}</div>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr",gap:8,marginBottom:12}}>
                  {isMobile ? (
                    <>
                      <div style={{background:"#f0f6ff",padding:"8px 10px",borderRadius:8}}>
                        <div style={{fontSize:10,color:"#66758c"}}>Data</div>
                        <strong style={{fontSize:12}}>{pl.data}</strong>
                      </div>
                      <div style={{background:"#f0f6ff",padding:"8px 10px",borderRadius:8}}>
                        <div style={{fontSize:10,color:"#66758c"}}>Speed</div>
                        <strong style={{fontSize:12}}>{pl.speed}</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{background:"#f0f6ff",padding:"8px 10px",borderRadius:8}}>
                        <div style={{fontSize:10,color:"#66758c"}}>Speed</div>
                        <strong style={{fontSize:13}}>{pl.speed}</strong>
                      </div>
                      <div style={{background:"#f0f6ff",padding:"8px 10px",borderRadius:8}}>
                        <div style={{fontSize:10,color:"#66758c"}}>Data</div>
                        <strong style={{fontSize:11}}>{pl.data.length > 30 ? pl.data.slice(0,30)+"..." : pl.data}</strong>
                      </div>
                    </>
                  )}
                </div>

                <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>FEATURES</div>
                <div style={{flex:1}}>
                  {pl.features.map((f, i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,marginBottom:4}}>
                      <Check size={12} color="#0b9a68"/> {f}
                    </div>
                  ))}
                </div>

                <div style={{borderTop:"1px solid #e1e8f1",paddingTop:10,marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:"#66758c"}}>Valid: {pl.validity}</span>
                  <button className="status coverage-btn" onClick={()=>window.open(prov?.website,"_blank","noopener,noreferrer")}>
                    Recharge <ExternalLink size={10}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "modems" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
            {filteredModems.length === 0 && <div style={{fontSize:12,color:"#66758c",padding:16}}>No modems found for this filter.</div>}
            {filteredModems.map(m => {
              const prov = providerFor(m.provider);
              return (
                <div key={m.id} className="card card-pad" style={{display:"flex",flexDirection:"column"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div className={`provider-logo p-${m.provider}`} style={{width:32,height:32,fontSize:11}}>{prov?.logo}</div>
                    <div style={{flex:1}}>
                      <strong style={{fontSize:14}}>{m.name}</strong>
                      <div style={{fontSize:11,color:"#66758c"}}>{m.type.toUpperCase()} · {m.wifi}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontWeight:850,color:m.price===0?"#0b9a68":"#0b74ff"}}>
                        {m.price===0 ? "Free" : `₹${m.price}`}
                      </div>
                      <div style={{fontSize:10,color:"#66758c"}}>{m.price===0?"With plan":"One-time"}</div>
                    </div>
                  </div>

                  <div style={{background:"#f0f6ff",padding:"8px 10px",borderRadius:8,marginBottom:12}}>
                    <div style={{fontSize:10,color:"#66758c"}}>Max Speed</div>
                    <strong style={{fontSize:13}}>{m.speed}</strong>
                  </div>

                  <div style={{fontSize:11,fontWeight:700,color:"#66758c",marginBottom:6}}>FEATURES</div>
                  <div style={{flex:1}}>
                    {m.features.map((f, i) => (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,marginBottom:4}}>
                        <Check size={12} color="#0b9a68"/> {f}
                      </div>
                    ))}
                  </div>

                  <div style={{borderTop:"1px solid #e1e8f1",paddingTop:10,marginTop:10}}>
                    <button className="status coverage-btn" onClick={()=>window.open(prov?.website,"_blank","noopener,noreferrer")} style={{width:"100%",justifyContent:"center"}}>
                      Check availability <ExternalLink size={10}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:12,fontSize:11,color:"#66758c",textAlign:"center"}}>
            Most providers offer free routers with fiber plans. Standalone routers available for purchase.
          </div>
        </div>
      )}

      {tab === "range" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12}}>
            {filteredRanges.length === 0 && <div style={{fontSize:12,color:"#66758c",padding:16}}>No range data found.</div>}
            {filteredRanges.map((r, i) => {
              const prov = providerFor(r.provider);
              return (
                <div key={i} className="card card-pad">
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div className={`provider-logo p-${r.provider}`} style={{width:32,height:32,fontSize:11}}>{prov?.logo}</div>
                    <div style={{flex:1}}>
                      <strong style={{fontSize:14}}>{prov?.name} — {r.generation}</strong>
                      <div style={{fontSize:11,color:"#66758c"}}>Frequency: {r.frequency}</div>
                    </div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                    <div style={{background:"#f5f8fc",padding:"8px 10px",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#66758c"}}>Range</div>
                      <strong style={{fontSize:16,color:"#0b74ff"}}>{r.rangeKm}</strong>
                      <div style={{fontSize:10,color:"#66758c"}}>km</div>
                    </div>
                    <div style={{background:"#f5f8fc",padding:"8px 10px",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#66758c"}}>Speed</div>
                      <strong style={{fontSize:11,color:"#0b9a68"}}>{r.speed.split("-")[0]}</strong>
                      <div style={{fontSize:10,color:"#66758c"}}>Mbps</div>
                    </div>
                    <div style={{background:"#f5f8fc",padding:"8px 10px",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#66758c"}}>Coverage</div>
                      <strong style={{fontSize:16,color:r.coveragePercent>=90?"#0b9a68":r.coveragePercent>=70?"#f5a623":"#e55f5f"}}>{r.coveragePercent}%</strong>
                      <div style={{fontSize:10,color:"#66758c"}}>India</div>
                    </div>
                  </div>

                  <div style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                      <span>Indoor penetration</span>
                      <strong>{r.indoorPenetration}</strong>
                    </div>
                    <div style={{width:"100%",height:6,background:"#e1e8f1",borderRadius:999,overflow:"hidden"}}>
                      <div style={{width:`${r.coveragePercent}%`,height:"100%",background:r.coveragePercent>=90?"#0b9a68":r.coveragePercent>=70?"#f5a623":"#e55f5f",borderRadius:999}}/>
                    </div>
                  </div>

                  <div style={{fontSize:10,color:"#66758c"}}>
                    {r.generation === "5G NR" ? "Higher speed but shorter range. Requires line-of-sight for best performance." :
                     r.generation === "4G LTE" ? "Good balance of speed and coverage. Works well indoors and outdoors." :
                     "Widest coverage but slower speeds. Best for voice and basic data."}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:12,fontSize:11,color:"#66758c",textAlign:"center"}}>
            Signal range varies by terrain, building materials, and weather. Actual speeds may differ from advertised speeds.
          </div>
        </div>
      )}

      <div style={{marginTop:16,fontSize:11,color:"#66758c",textAlign:"center"}}>
        Prices are indicative and may vary by region. Visit the provider website for the latest offers.
      </div>
    </div>
  );
}
