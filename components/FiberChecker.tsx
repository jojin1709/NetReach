"use client";

import { useState } from "react";
import { Wifi, Search, Check, X, ExternalLink, MapPin } from "lucide-react";
import { providers, coverageData, bharatNetData } from "../lib/data";

export default function FiberChecker({ location }: { location: { lat: number; lng: number; label: string } }) {
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<Array<{provider:string;available:boolean;speed:string;price:number;url:string}>|null>(null);

  const checkAvailability = async () => {
    setChecking(true);
    try {
      const res = await fetch(`/api/coverage?lat=${location.lat}&lng=${location.lng}`);
      const data = await res.json();
      const fiberProviders = providers.filter(p => p.technologies.includes("Fiber"));
      const fiberPlans = fiberProviders.map(p => {
        const cov = coverageData[p.id];
        const plan = p.plans.find(pl => pl.type === "fiber");
        const apiResult = data.providers?.find((r: any) => r.id === p.id);
        return {
          provider: p.name,
          available: apiResult?.available ?? (cov ? cov.urbanCoverage > 70 : false),
          speed: plan?.speed || "Check website",
          price: plan?.price || 0,
          url: p.coverageUrl
        };
      });
      setResults(fiberPlans);
    } catch {
      const fiberProviders = providers.filter(p => p.technologies.includes("Fiber"));
      setResults(fiberProviders.map(p => {
        const cov = coverageData[p.id];
        const plan = p.plans.find(pl => pl.type === "fiber");
        return { provider: p.name, available: cov ? cov.urbanCoverage > 70 : false, speed: plan?.speed || "Check website", price: plan?.price || 0, url: p.coverageUrl };
      }));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="card card-pad" style={{marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <Wifi size={18} color="#0b74ff"/>
        <strong style={{fontSize:14}}>Fiber availability checker</strong>
      </div>
      <p style={{fontSize:12,color:"#66758c",marginBottom:12}}>Check which fiber broadband providers are available at your address.</p>

      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1}}>
          <label style={{fontSize:11,fontWeight:700,color:"#66758c"}}>PIN code or area</label>
          <input type="text" value={pin} onChange={e=>setPin(e.target.value)} placeholder="e.g. 680001 or Thrissur" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:12,marginTop:4}}/>
        </div>
        <button onClick={checkAvailability} disabled={!pin || checking} style={{marginTop:18,padding:"8px 16px",fontSize:12,fontWeight:600,borderRadius:8,border:"none",background:!pin?"#ccc":"#0b74ff",color:"#fff",cursor:!pin?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6}}>
          {checking ? <><div className="spinner"/> Checking...</> : <><Search size={13}/> Check</>}
        </button>
      </div>

      {results && (
        <div style={{display:"grid",gap:8}}>
          {results.map((r,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:r.available?"#f0faf5":"#fdf2f2",borderRadius:8,border:`1px solid ${r.available?"#d4f5e5":"#f5d0d0"}`}}>
              {r.available ? <Check size={16} color="#0b9a68"/> : <X size={16} color="#e55f5f"/>}
              <div style={{flex:1}}>
                <strong style={{fontSize:13}}>{r.provider}</strong>
                <div style={{fontSize:11,color:"#66758c"}}>
                  {r.available ? `Available — ${r.speed} from ₹${r.price}/mo` : "Not confirmed — check official map"}
                </div>
              </div>
              <button onClick={()=>window.open(r.url,"_blank","noopener,noreferrer")} style={{fontSize:11,color:"#0b74ff",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                Check <ExternalLink size={10}/>
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop:12,fontSize:10,color:"#66758c",padding:"8px 10px",background:"#f5f8fc",borderRadius:8}}>
        <MapPin size={10} style={{verticalAlign:-1,marginRight:4}}/>
        Current location: {location.label}. Fiber availability depends on local infrastructure. Always verify with the provider.
      </div>
    </div>
  );
}
