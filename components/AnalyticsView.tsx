"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MapPin, Download, ArrowDown, ArrowUp, Clock } from "lucide-react";
import { providers, getStorage, SpeedMeasurement, FeedbackEntry, coverageData } from "../lib/data";
import { ProviderBarChart, DonutChart, SpeedGauge } from "./Charts";

export default function AnalyticsView() {
  const [speeds, setSpeeds] = useState<SpeedMeasurement[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    setSpeeds(getStorage<SpeedMeasurement[]>("netreach-community-speeds", []));
    setFeedback(getStorage<FeedbackEntry[]>("netreach-community-feedback", []));
  }, []);

  const providerStats = providers.map(p => {
    const pSpeeds = speeds.filter(s => s.provider === p.id && s.download > 0);
    const pFeedback = feedback.filter(f => f.provider === p.id);
    const avgDl = pSpeeds.length > 0 ? Math.round(pSpeeds.reduce((a, s) => a + s.download, 0) / pSpeeds.length) : 0;
    const avgUl = pSpeeds.length > 0 ? Math.round(pSpeeds.reduce((a, s) => a + s.upload, 0) / pSpeeds.length) : 0;
    const avgLat = pSpeeds.length > 0 ? Math.round(pSpeeds.reduce((a, s) => a + s.latency, 0) / pSpeeds.length) : 0;
    const avgRating = pFeedback.length > 0 ? Math.round(pFeedback.reduce((a, f) => a + f.rating, 0) / pFeedback.length * 10) / 10 : 0;
    return { ...p, avgDl, avgUl, avgLat, testCount: pSpeeds.length, reviewCount: pFeedback.length, avgRating };
  });

  const totalTests = speeds.length;
  const totalReviews = feedback.length;
  const topProvider = providerStats.reduce((best, p) => p.avgDl > best.avgDl ? p : best, providerStats[0]);

  const allCities = [...new Set([...speeds.map(s => s.location), ...feedback.map(f => f.location)])];
  const cityStats = allCities.map(city => ({
    city,
    tests: speeds.filter(s => s.location === city).length,
    reviews: feedback.filter(f => f.location === city).length,
    avgDl: Math.round(speeds.filter(s => s.location === city && s.download > 0).reduce((a, s, _, arr) => a + s.download / arr.length, 0))
  })).sort((a, b) => b.tests - a.tests);

  const recentSpeeds = speeds.slice(0, 7);

  return (
    <div>
      <div className="eyebrow">Analytics</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>Network analytics</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:18}}>Aggregated community data across all providers.</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:16}}>
        {[
          {icon:<BarChart3 size={16}/>,label:"Total speed tests",value:totalTests,color:"#0b74ff"},
          {icon:<Users size={16}/>,label:"Total reviews",value:totalReviews,color:"#0b9a68"},
          {icon:<TrendingUp size={16}/>,label:"Top provider",value:topProvider?.name || "—",color:"#f5a623"},
          {icon:<MapPin size={16}/>,label:"Cities covered",value:allCities.length,color:"#8b5cf6"},
        ].map((s, i) => (
          <div key={i} className="card card-pad" style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:36,height:36,borderRadius:8,background:`${s.color}18`,color:s.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
            <div>
              <div style={{fontSize:20,fontWeight:850}}>{s.value}</div>
              <div style={{fontSize:11,color:"#66758c"}}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div className="card card-pad">
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Provider Speed Comparison</div>
          <ProviderBarChart type="download"/>
        </div>
        <div className="card card-pad">
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Provider Ratings</div>
          <ProviderBarChart type="rating"/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div className="card card-pad">
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Speed Distribution</div>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            {providers.map(p => (
              <SpeedGauge key={p.id} value={p.speedAvg} label={p.name}/>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Technology Coverage</div>
          <DonutChart
            segments={[
              { label: "Fiber", value: 2, color: "#0b74ff" },
              { label: "AirFiber", value: 2, color: "#23c9a7" },
              { label: "4G", value: 4, color: "#f5a623" },
              { label: "5G", value: 3, color: "#8b5cf6" }
            ]}
            size={130}
          />
        </div>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Provider comparison</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"2px solid #e1e8f1"}}>
                <th style={{textAlign:"left",padding:"8px 12px",fontWeight:700,color:"#66758c"}}>Provider</th>
                <th style={{textAlign:"right",padding:"8px 12px",fontWeight:700,color:"#66758c"}}>Avg ↓ Mbps</th>
                <th style={{textAlign:"right",padding:"8px 12px",fontWeight:700,color:"#66758c"}}>Avg ↑ Mbps</th>
                <th style={{textAlign:"right",padding:"8px 12px",fontWeight:700,color:"#66758c"}}>Latency</th>
                <th style={{textAlign:"right",padding:"8px 12px",fontWeight:700,color:"#66758c"}}>Rating</th>
                <th style={{textAlign:"right",padding:"8px 12px",fontWeight:700,color:"#66758c"}}>Tests</th>
                <th style={{textAlign:"right",padding:"8px 12px",fontWeight:700,color:"#66758c"}}>Reviews</th>
              </tr>
            </thead>
            <tbody>
              {providerStats.map(p => (
                <tr key={p.id} style={{borderBottom:"1px solid #f0f3f8"}}>
                  <td style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
                    <div className={`provider-logo p-${p.id}`} style={{width:28,height:28,fontSize:10}}>{p.logo}</div>
                    <strong>{p.name}</strong>
                  </td>
                  <td style={{textAlign:"right",padding:"10px 12px"}}><strong>{p.avgDl || "—"}</strong></td>
                  <td style={{textAlign:"right",padding:"10px 12px"}}><strong>{p.avgUl || "—"}</strong></td>
                  <td style={{textAlign:"right",padding:"10px 12px"}}>{p.avgLat ? `${p.avgLat} ms` : "—"}</td>
                  <td style={{textAlign:"right",padding:"10px 12px"}}>{p.avgRating > 0 ? `${p.avgRating}★` : "—"}</td>
                  <td style={{textAlign:"right",padding:"10px 12px"}}>{p.testCount}</td>
                  <td style={{textAlign:"right",padding:"10px 12px"}}>{p.reviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recentSpeeds.length > 0 && (
        <div className="card card-pad" style={{marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Recent speed tests</div>
          {recentSpeeds.map(s => (
            <div key={s.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:12,alignItems:"center",padding:"8px 12px",background:"#f5f8fc",borderRadius:8,fontSize:12,marginBottom:6}}>
              <div>
                <strong>{providers.find(p=>p.id===s.provider)?.name || s.provider}</strong>
                <div style={{fontSize:10,color:"#66758c"}}><MapPin size={10} style={{verticalAlign:-1}}/> {s.location}</div>
              </div>
              <div style={{textAlign:"right"}}><strong style={{color:"#0b74ff"}}>{s.download}</strong><div style={{fontSize:10,color:"#66758c"}}>↓ Mbps</div></div>
              <div style={{textAlign:"right"}}><strong style={{color:"#0b9a68"}}>{s.upload}</strong><div style={{fontSize:10,color:"#66758c"}}>↑ Mbps</div></div>
              <div style={{textAlign:"right",fontSize:10,color:"#66758c"}}><Clock size={10}/> {new Date(s.timestamp).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      {cityStats.length > 0 && (
        <div className="card card-pad">
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>City-wise data</div>
          {cityStats.slice(0, 10).map((c, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#f5f8fc",borderRadius:8,marginBottom:6,fontSize:12}}>
              <MapPin size={14} color="#0b74ff"/>
              <strong style={{flex:1}}>{c.city}</strong>
              <span style={{color:"#66758c"}}>{c.tests} tests</span>
              <span style={{color:"#66758c"}}>{c.reviews} reviews</span>
              {c.avgDl > 0 && <span style={{color:"#0b74ff",fontWeight:700}}>{c.avgDl} Mbps</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
