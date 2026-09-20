"use client";

import { useState, useEffect } from "react";
import { Users, Star, MapPin, Clock, MessageSquare, Send, Wifi, ArrowDown, ArrowUp } from "lucide-react";
import { providers, getStorage, setStorage, SpeedMeasurement, FeedbackEntry } from "../lib/data";

type InsightTab = "speeds" | "feedback" | "submit-speed" | "submit-feedback";

export default function CommunityView() {
  const [tab, setTab] = useState<InsightTab>("speeds");
  const [speeds, setSpeeds] = useState<SpeedMeasurement[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);

  // Submit speed form
  const [sp, setSp] = useState({ provider: "jio", download: "", upload: "", latency: "", location: "" });
  const [spSubmitting, setSpSubmitting] = useState(false);

  // Submit feedback form
  const [fb, setFb] = useState({ provider: "jio", rating: 5, comment: "", location: "" });
  const [fbSubmitting, setFbSubmitting] = useState(false);

  useEffect(() => {
    setSpeeds(getStorage<SpeedMeasurement[]>("netreach-community-speeds", []));
    setFeedback(getStorage<FeedbackEntry[]>("netreach-community-feedback", []));
  }, []);

  const submitSpeed = () => {
    if (!sp.download || !sp.location) return;
    setSpSubmitting(true);
    setTimeout(() => {
      const entry: SpeedMeasurement = {
        id: Date.now().toString(),
        provider: sp.provider,
        download: Number(sp.download) || 0,
        upload: Number(sp.upload) || 0,
        latency: Number(sp.latency) || 0,
        location: sp.location,
        timestamp: Date.now(),
        device: navigator.userAgent.slice(0, 50)
      };
      const updated = [entry, ...speeds].slice(0, 100);
      setSpeeds(updated);
      setStorage("netreach-community-speeds", updated);
      setSp({ provider: "jio", download: "", upload: "", latency: "", location: "" });
      setSpSubmitting(false);
      setTab("speeds");
    }, 800);
  };

  const submitFeedback = () => {
    if (!fb.comment || !fb.location) return;
    setFbSubmitting(true);
    setTimeout(() => {
      const entry: FeedbackEntry = {
        id: Date.now().toString(),
        provider: fb.provider,
        rating: fb.rating,
        comment: fb.comment,
        location: fb.location,
        timestamp: Date.now()
      };
      const updated = [entry, ...feedback].slice(0, 100);
      setFeedback(updated);
      setStorage("netreach-community-feedback", updated);
      setFb({ provider: "jio", rating: 5, comment: "", location: "" });
      setFbSubmitting(false);
      setTab("feedback");
    }, 800);
  };

  const avgByProvider = (type: "download" | "upload" | "latency") => {
    const result: Record<string, number> = {};
    providers.forEach(p => {
      const pSpeeds = speeds.filter(s => s.provider === p.id && s[type] > 0);
      result[p.id] = pSpeeds.length > 0 ? Math.round(pSpeeds.reduce((a, s) => a + s[type], 0) / pSpeeds.length) : 0;
    });
    return result;
  };

  const avgDl = avgByProvider("download");
  const avgUl = avgByProvider("upload");
  const avgLat = avgByProvider("latency");

  const ratings: Record<string, { avg: number; count: number }> = {};
  providers.forEach(p => {
    const pFb = feedback.filter(f => f.provider === p.id);
    ratings[p.id] = {
      avg: pFb.length > 0 ? Math.round(pFb.reduce((a, f) => a + f.rating, 0) / pFb.length * 10) / 10 : 0,
      count: pFb.length
    };
  });

  return (
    <div>
      <div className="eyebrow">Community</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>Community insights</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:14}}>Speed tests and reviews from real users across India.</p>

      <div className="pills" style={{marginBottom:16}}>
        {([["speeds","Speed Results"],["feedback","User Reviews"],["submit-speed","Submit Speed"],["submit-feedback","Submit Review"]] as [InsightTab,string][]).map(([t,l]) => (
          <button key={t} className={`pill${tab===t?" active":""}`} onClick={()=>setTab(t)}>
            {t==="speeds"||t==="feedback" ? <Users size={12} style={{marginRight:4}}/> : t==="submit-speed" ? <Wifi size={12} style={{marginRight:4}}/> : <Star size={12} style={{marginRight:4}}/>}
            {l}
          </button>
        ))}
      </div>

      {tab === "speeds" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:16}}>
            {providers.map(p => (
              <div key={p.id} className="card card-pad" style={{textAlign:"center"}}>
                <div className={`provider-logo p-${p.id}`} style={{width:36,height:36,fontSize:13,margin:"0 auto 8px"}}>{p.logo}</div>
                <strong style={{fontSize:14}}>{p.name}</strong>
                <div style={{fontSize:11,color:"#66758c",marginBottom:8}}>{speeds.filter(s=>s.provider===p.id).length} tests</div>
                <div style={{display:"grid",gap:4}}>
                  <div style={{fontSize:12}}><ArrowDown size={12} style={{verticalAlign:-2,color:"#0b74ff"}}/> <strong>{avgDl[p.id]}</strong> Mbps</div>
                  <div style={{fontSize:12}}><ArrowUp size={12} style={{verticalAlign:-2,color:"#0b9a68"}}/> <strong>{avgUl[p.id]}</strong> Mbps</div>
                  <div style={{fontSize:12}}>⏱ <strong>{avgLat[p.id]}</strong> ms</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <div style={{fontSize:14,fontWeight:800,marginBottom:10}}>Recent submissions</div>
            {speeds.length === 0 ? <div style={{fontSize:12,color:"#66758c",padding:12}}>No community speed results yet.</div> : (
              <div style={{display:"grid",gap:6}}>
                {speeds.slice(0, 15).map(s => (
                  <div key={s.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:12,alignItems:"center",padding:"8px 12px",background:"var(--soft, #f5f8fc)",borderRadius:8,fontSize:12}}>
                    <div>
                      <strong>{providers.find(p=>p.id===s.provider)?.name || s.provider}</strong>
                      <div style={{fontSize:10,color:"#66758c"}}><MapPin size={10} style={{verticalAlign:-1}}/> {s.location}</div>
                    </div>
                    <div style={{textAlign:"right"}}><strong>{s.download}</strong><div style={{fontSize:10,color:"#66758c"}}>↓ Mbps</div></div>
                    <div style={{textAlign:"right"}}><strong>{s.upload}</strong><div style={{fontSize:10,color:"#66758c"}}>↑ Mbps</div></div>
                    <div style={{textAlign:"right",fontSize:10,color:"#66758c"}}><Clock size={10}/> {new Date(s.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "feedback" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:16}}>
            {providers.map(p => (
              <div key={p.id} className="card card-pad" style={{textAlign:"center"}}>
                <div className={`provider-logo p-${p.id}`} style={{width:36,height:36,fontSize:13,margin:"0 auto 8px"}}>{p.logo}</div>
                <strong style={{fontSize:14}}>{p.name}</strong>
                <div style={{display:"flex",justifyContent:"center",gap:2,margin:"4px 0"}}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i<=Math.round(ratings[p.id].avg)?"#f5a623":"#e1e8f1"} stroke={i<=Math.round(ratings[p.id].avg)?"#f5a623":"#e1e8f1"}/>)}
                </div>
                <div style={{fontSize:11,color:"#66758c"}}>{ratings[p.id].avg > 0 ? ratings[p.id].avg.toFixed(1) : "—"} ({ratings[p.id].count} reviews)</div>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <div style={{fontSize:14,fontWeight:800,marginBottom:10}}>Recent reviews</div>
            {feedback.length === 0 ? <div style={{fontSize:12,color:"#66758c",padding:12}}>No reviews yet.</div> : (
              <div style={{display:"grid",gap:8}}>
                {feedback.slice(0, 15).map(f => (
                  <div key={f.id} style={{padding:"10px 12px",background:"var(--soft, #f5f8fc)",borderRadius:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <strong style={{fontSize:13}}>{providers.find(p=>p.id===f.provider)?.name || f.provider}</strong>
                      <div style={{display:"flex",gap:1}}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i<=f.rating?"#f5a623":"#e1e8f1"} stroke={i<=f.rating?"#f5a623":"#e1e8f1"} />)}
                      </div>
                    </div>
                    <div style={{fontSize:12,marginBottom:4}}>{f.comment}</div>
                    <div style={{fontSize:10,color:"#66758c"}}><MapPin size={10} style={{verticalAlign:-1}}/> {f.location} · {new Date(f.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "submit-speed" && (
        <div className="card card-pad">
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Submit your speed test result</div>
          <div style={{fontSize:12,color:"#66758c",marginBottom:16}}>Share your real-world speed test result with the community.</div>
          <div style={{display:"grid",gap:12}}>
            <div>
              <label style={{fontSize:12,fontWeight:700}}>Provider</label>
              <select value={sp.provider} onChange={e=>setSp({...sp,provider:e.target.value})} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4}}>
                {providers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div><label style={{fontSize:12,fontWeight:700}}>Download (Mbps) *</label><input type="number" value={sp.download} onChange={e=>setSp({...sp,download:e.target.value})} placeholder="e.g. 45" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4}}/></div>
              <div><label style={{fontSize:12,fontWeight:700}}>Upload (Mbps)</label><input type="number" value={sp.upload} onChange={e=>setSp({...sp,upload:e.target.value})} placeholder="e.g. 12" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4}}/></div>
              <div><label style={{fontSize:12,fontWeight:700}}>Latency (ms)</label><input type="number" value={sp.latency} onChange={e=>setSp({...sp,latency:e.target.value})} placeholder="e.g. 18" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4}}/></div>
            </div>
            <div><label style={{fontSize:12,fontWeight:700}}>Location (city/area) *</label><input type="text" value={sp.location} onChange={e=>setSp({...sp,location:e.target.value})} placeholder="e.g. Thrissur, Kerala" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4}}/></div>
          </div>
          <button onClick={submitSpeed} disabled={spSubmitting||!sp.download||!sp.location} style={{marginTop:16,padding:"10px 24px",fontSize:13,fontWeight:700,borderRadius:8,border:"none",background:!sp.download||!sp.location?"#ccc":"#0b74ff",color:"#fff",cursor:!sp.download||!sp.location?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6}}>
            {spSubmitting ? <><div className="spinner"/> Submitting...</> : <><Send size={14}/> Submit speed result</>}
          </button>
        </div>
      )}

      {tab === "submit-feedback" && (
        <div className="card card-pad">
          <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Submit a review</div>
          <div style={{fontSize:12,color:"#66758c",marginBottom:16}}>Rate your experience with a provider.</div>
          <div style={{display:"grid",gap:12}}>
            <div>
              <label style={{fontSize:12,fontWeight:700}}>Provider</label>
              <select value={fb.provider} onChange={e=>setFb({...fb,provider:e.target.value})} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4}}>
                {providers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:700}}>Rating</label>
              <div style={{display:"flex",gap:4,marginTop:4}}>
                {[1,2,3,4,5].map(i=>(
                  <button key={i} onClick={()=>setFb({...fb,rating:i})} style={{background:"none",border:"none",cursor:"pointer",padding:2}}>
                    <Star size={28} fill={i<=fb.rating?"#f5a623":"#e1e8f1"} stroke={i<=fb.rating?"#f5a623":"#e1e8f1"}/>
                  </button>
                ))}
              </div>
            </div>
            <div><label style={{fontSize:12,fontWeight:700}}>Your experience *</label><textarea value={fb.comment} onChange={e=>setFb({...fb,comment:e.target.value})} placeholder="Tell us about speed, reliability, customer support..." rows={3} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4,resize:"vertical"}}/></div>
            <div><label style={{fontSize:12,fontWeight:700}}>Location *</label><input type="text" value={fb.location} onChange={e=>setFb({...fb,location:e.target.value})} placeholder="e.g. Kochi, Kerala" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:13,marginTop:4}}/></div>
          </div>
          <button onClick={submitFeedback} disabled={fbSubmitting||!fb.comment||!fb.location} style={{marginTop:16,padding:"10px 24px",fontSize:13,fontWeight:700,borderRadius:8,border:"none",background:!fb.comment||!fb.location?"#ccc":"#0b74ff",color:"#fff",cursor:!fb.comment||!fb.location?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6}}>
            {fbSubmitting ? <><div className="spinner"/> Submitting...</> : <><Send size={14}/> Submit review</>}
          </button>
        </div>
      )}
    </div>
  );
}
