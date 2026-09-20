"use client";

import { useState } from "react";
import { ExternalLink, Smartphone, Wifi, Router, Signal } from "lucide-react";
import { providers, modems, mobileRanges } from "../lib/data";

type Tab = "mobile" | "fiber" | "airfiber" | "modems" | "range";

export default function PlansView() {
  const [tab, setTab] = useState<Tab>("mobile");
  const [providerFilter, setProviderFilter] = useState("all");

  const staticPlans = providers.flatMap(p => p.plans).filter(pl => {
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

  const providerLinks: Record<string, string> = {
    jio: "https://www.jio.com/selfcare/plans",
    airtel: "https://www.airtel.in/recharge-online",
    vi: "https://www.myvi.in/recharge",
    bsnl: "https://www.bsnl.co.in/selfcare/plans",
  };

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
      <div className="pills" style={{marginBottom:12}}>
        {[{id:"all",name:"All"},{id:"jio",name:"Jio"},{id:"airtel",name:"Airtel"},{id:"vi",name:"Vi"},{id:"bsnl",name:"BSNL"}].map(p => (
          <button key={p.id} className={`pill${providerFilter===p.id?" active":""}`} onClick={()=>setProviderFilter(p.id)}>{p.name}</button>
        ))}
      </div>

      {tab === "mobile" && (
        <div className="card card-pad" style={{marginBottom:16,padding:12,background:"#f0f7ff",border:"1px solid #d0e3ff",borderRadius:8}}>
          <div style={{fontSize:12,color:"#1a5dab",lineHeight:1.6}}>
            <strong>For latest plans and pricing,</strong> visit official provider websites:
            <div style={{display:"flex",gap:12,marginTop:6,flexWrap:"wrap"}}>
              {Object.entries(providerLinks).map(([id, url]) => (
                <a key={id} href={url} target="_blank" rel="noopener noreferrer" style={{color:"#0b74ff",display:"flex",alignItems:"center",gap:4}}>
                  {id.toUpperCase()} <ExternalLink size={10}/>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "mobile" && (
        <div style={{marginBottom:16}}>
          {staticPlans.map((pl: any, i: number) => {
            const prov = providerFor(pl.provider);
            return (
              <div key={pl.id || i} className="card card-pad" style={{marginBottom:8,padding:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <div className={`provider-logo p-${pl.provider}`} style={{width:28,height:28,fontSize:10}}>{prov?.logo || "???"}</div>
                      <div>
                        <div style={{fontWeight:700,fontSize:14}}>₹{pl.price}</div>
                        <div style={{fontSize:11,color:"#66758c"}}>{pl.validity}</div>
                      </div>
                    </div>
                    {pl.data && <div style={{fontSize:12,color:"#0b74ff",fontWeight:600,marginBottom:4}}>Data: {pl.data}</div>}
                    <div style={{fontSize:12,color:"#46546e",lineHeight:1.5}}>{pl.description || pl.name}</div>
                  </div>
                  {prov?.coverageUrl && (
                    <a href={prov.coverageUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#0b74ff",whiteSpace:"nowrap"}}>
                      Recharge <ExternalLink size={10}/>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {staticPlans.length === 0 && (
            <div className="card card-pad" style={{textAlign:"center",padding:24}}>
              <Smartphone size={24} color="#8292a8" style={{marginBottom:8}}/>
              <div style={{fontSize:13,color:"#66758c"}}>No plans found for this filter.</div>
            </div>
          )}
        </div>
      )}

      {tab === "fiber" && (
        <div style={{marginBottom:16}}>
          {providers.filter(p => p.technologies.includes("Fiber")).map(p => {
            const plan = p.plans.find(pl => pl.type === "fiber");
            const cov = providers.find(pr => pr.id === p.id);
            return (
              <div key={p.id} className="card card-pad" style={{marginBottom:8,padding:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div className={`provider-logo p-${p.id}`} style={{width:32,height:32,fontSize:12}}>{p.logo}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{p.name} Fiber</div>
                    <div style={{fontSize:12,color:"#66758c"}}>{plan?.speed || "Check website"} — from ₹{plan?.price || "?"}</div>
                  </div>
                  <a href={p.coverageUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#0b74ff",display:"flex",alignItems:"center",gap:4}}>
                    Check <ExternalLink size={10}/>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "airfiber" && (
        <div style={{marginBottom:16}}>
          {providers.filter(p => p.technologies.includes("AirFiber")).map(p => {
            const plan = p.plans.find(pl => pl.type === "airfiber");
            return (
              <div key={p.id} className="card card-pad" style={{marginBottom:8,padding:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div className={`provider-logo p-${p.id}`} style={{width:32,height:32,fontSize:12}}>{p.logo}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{p.name} AirFiber</div>
                    <div style={{fontSize:12,color:"#66758c"}}>{plan?.speed || "Check website"} — from ₹{plan?.price || "?"}</div>
                  </div>
                  <a href={p.coverageUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#0b74ff",display:"flex",alignItems:"center",gap:4}}>
                    Check <ExternalLink size={10}/>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "modems" && (
        <div style={{marginBottom:16}}>
          {filteredModems.map((m, i) => (
            <div key={i} className="card card-pad" style={{marginBottom:8,padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{m.name}</div>
                  <div style={{fontSize:12,color:"#66758c",marginBottom:4}}>{m.type} — {m.speed}</div>
                  <div style={{fontSize:12,color:"#46546e"}}>{m.features?.join(", ")}</div>
                </div>
                <div style={{textAlign:"right",whiteSpace:"nowrap"}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#0b74ff"}}>{m.price === 0 ? "Free" : `₹${m.price}`}</div>
                  <div style={{fontSize:11,color:"#66758c"}}>{m.provider.toUpperCase()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "range" && (
        <div style={{marginBottom:16}}>
          {filteredRanges.map((r, i) => (
            <div key={i} className="card card-pad" style={{marginBottom:8,padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{r.provider.toUpperCase()} {r.generation}</div>
                  <div style={{fontSize:12,color:"#66758c"}}>Frequency: {r.frequency} MHz — Range: {r.rangeKm} km</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#0b74ff"}}>{r.coveragePercent}%</div>
                  <div style={{fontSize:11,color:"#66758c"}}>coverage</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
