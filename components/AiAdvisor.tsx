"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";
import { providers, coverageData, mobileRanges, getStorage, setStorage } from "../lib/data";

type Msg = {
  role: "ai" | "user";
  content: string;
  suggestions?: { label: string; action: string }[];
  providerCards?: { id: string; name: string; score: number; reason: string; color: string }[];
  planCards?: { provider: string; name: string; price: number; data: string; validity: string; speed: string; why: string }[];
  offerCards?: { provider: string; offer: string; code?: string; expires: string }[];
};

type Props = {
  location: { lat: number; lng: number; label: string };
  towers: { provider: string; tech: string }[];
};

function analyzeLocation(towers: { provider: string; tech: string }[]) {
  const towerCount: Record<string, number> = {};
  towers.forEach(t => { towerCount[t.provider] = (towerCount[t.provider] || 0) + 1; });
  const scores: Record<string, { signal: number; speed: number; coverage: number; value: number }> = {};
  providers.forEach(p => {
    const cov = coverageData[p.id];
    const ranges = mobileRanges.filter(r => r.provider === p.id);
    const avgCov = ranges.length > 0 ? ranges.reduce((a, r) => a + r.coveragePercent, 0) / ranges.length : 50;
    const has5G = ranges.some(r => r.generation.includes("5G"));
    const has4G = ranges.some(r => r.generation.includes("4G"));
    const cheapest = Math.min(...p.plans.filter(pl => pl.type === "mobile").map(pl => pl.price));
    scores[p.id] = {
      signal: Math.min((towerCount[p.id] || 0) * 15 + (cov?.urbanCoverage || 50) * 0.3, 100),
      speed: has5G ? 90 : has4G ? 70 : 40,
      coverage: avgCov,
      value: Math.max(100 - cheapest / 10, 20)
    };
  });
  return { towerCount, scores };
}

function genOffers() {
  return [
    { provider: "jio", offer: "50GB extra data free with any Rs.299+ recharge", code: "JIO50", expires: "Limited time" },
    { provider: "jio", offer: "JioAirFiber first month free for new users", code: "AIRFREE", expires: "Ongoing" },
    { provider: "airtel", offer: "Rs.100 cashback on first recharge via Airtel Thanks app", code: "THANKS100", expires: "New users" },
    { provider: "airtel", offer: "Free Amazon Prime 3 months with Rs.599+ plan", code: "PRIME3M", expires: "Selected plans" },
    { provider: "vi", offer: "Binge All Night - unlimited data 12am-6am on Rs.299+", code: "BINGE", expires: "Ongoing" },
    { provider: "vi", offer: "Vi Movies & TV free for 30 days with any recharge", expires: "Auto-activated" },
    { provider: "bsnl", offer: "Double data on all Rs.187+ plans", expires: "Government offer" },
    { provider: "bsnl", offer: "Free 5GB extra data for BSNL app users", code: "BSNL5G", expires: "Ongoing" }
  ].sort(() => Math.random() - 0.5).slice(0, 4);
}

function getPlanRecs(scores: Record<string, any>, uc: string) {
  const all = providers.flatMap(p => p.plans.filter(pl => pl.type === "mobile").map(pl => ({ ...pl, provider: p.id })));
  const sorted = [...all].sort((a, b) => {
    const sA = (scores[a.provider]?.signal || 0) + (scores[a.provider]?.value || 0);
    const sB = (scores[b.provider]?.signal || 0) + (scores[b.provider]?.value || 0);
    return sB - sA;
  });
  return sorted.slice(0, 5).map(pl => {
    const prov = providers.find(p => p.id === pl.provider)!;
    let why = "Best overall choice for your area";
    if (uc === "streaming") why = "Good speed for streaming with ample data";
    else if (uc === "gaming") why = "Low latency connection for gaming";
    else if (uc === "budget") why = "Best value for money at this location";
    else if (uc === "work") why = "Reliable for video calls and work apps";
    return { provider: prov.name, name: pl.name, price: pl.price, data: pl.data, validity: pl.validity, speed: pl.speed, why };
  });
}

function pCards(scores: Record<string, any>) {
  return Object.entries(scores).map(([id, s]) => ({
    id, name: providers.find(p => p.id === id)?.name || id,
    score: Math.round((s.signal + s.speed + s.coverage) / 3),
    reason: s.signal > 70 ? "Strong signal" : s.speed > 70 ? "Fast speed" : "Good coverage",
    color: providers.find(p => p.id === id)?.color || "#666"
  }));
}

export default function AiAdvisor({ location, towers }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hist = getStorage<Msg[]>("netreach-ai-history", []);
    if (hist.length > 0) { setMessages(hist); return; }
    const a = analyzeLocation(towers);
    const top = Object.entries(a.scores).sort((x, y) => (y[1].signal + y[1].speed) - (x[1].signal + x[1].speed))[0];
    const prov = providers.find(p => p.id === top[0]);
    setMessages([{
      role: "ai",
      content: "Hello! I'm your **NetReach AI** assistant.\n\nI've analyzed **" + location.label + "** using " + towers.length + " nearby towers.\n\n**Best SIM for your area: " + (prov?.name || "Jio") + "**\n- Signal: " + Math.round(top[1].signal) + "%\n- Speed: " + Math.round(top[1].speed) + "%\n- Coverage: " + Math.round(top[1].coverage) + "%\n\nAsk me anything or pick a topic below!",
      suggestions: [
        { label: "Which SIM is best?", action: "which SIM is better here" },
        { label: "Best plan for me", action: "best plan for general use" },
        { label: "Show offers", action: "show offers" },
        { label: "Signal strength", action: "signal strength here" },
        { label: "Fiber options", action: "fiber broadband options" }
      ],
      providerCards: pCards(a.scores),
      offerCards: genOffers()
    }]);
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    setStorage("netreach-ai-history", messages.slice(-20));
  }, [messages]);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setMessages(p => [...p, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    const a = analyzeLocation(towers);
    const lq = q.toLowerCase();

    let aiReply = "";
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          location,
          towers,
          history: messages.slice(-6)
        })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        aiReply = data.reply;
      }
    } catch {}

    if (aiReply) {
      const providerCardsData = pCards(a.scores);
      const offerData = (lq.includes("offer") || lq.includes("discount") || lq.includes("cashback")) ? genOffers() : undefined;
      setMessages(p => [...p, {
        role: "ai",
        content: aiReply,
        providerCards: providerCardsData,
        offerCards: offerData,
        suggestions: [
          { label: "Which SIM is best?", action: "which SIM is better here" },
          { label: "Best plan", action: "best plan for general use" },
          { label: "Show offers", action: "show offers" },
          { label: "Fiber options", action: "fiber broadband options" }
        ]
      }]);
      setLoading(false);
      return;
    }

    await new Promise(r => setTimeout(r, 500 + Math.random() * 700));
    let r: Msg;

    if (lq.includes("plan") || lq.includes("recharge") || lq.includes("best plan")) {
      const uc = lq.includes("stream") ? "streaming" : lq.includes("game") ? "gaming" : lq.includes("budget") || lq.includes("cheap") ? "budget" : lq.includes("work") ? "work" : "general";
      const plans = getPlanRecs(a.scores, uc);
      r = { role: "ai", content: "Based on **" + location.label + "**:\n\nThe best network is **" + (plans[0]?.provider || "Jio") + "** with the strongest signal.\n\nRanked by signal + speed + value:", planCards: plans, suggestions: [{ label: "Show offers", action: "show offers" }, { label: "Compare SIMs", action: "compare all SIMs" }] };
    } else if (lq.includes("offer") || lq.includes("discount")) {
      r = { role: "ai", content: "Here are the latest offers and deals:", offerCards: genOffers(), suggestions: [{ label: "Best plan", action: "best plan for general use" }] };
    } else if (lq.includes("compare") || lq.includes("better") || lq.includes("which sim")) {
      const sorted = Object.entries(a.scores).sort((x, y) => (y[1].signal + y[1].speed) - (x[1].signal + x[1].speed));
      const t2 = sorted.slice(0, 2);
      const n1 = providers.find(p => p.id === t2[0][0]);
      const n2 = providers.find(p => p.id === t2[1][0]);
      r = { role: "ai", content: "Comparing at **" + location.label + "**:\n\n**#1 " + n1?.name + "**\n- Signal: " + Math.round(t2[0][1].signal) + "% | Speed: " + Math.round(t2[0][1].speed) + "% | Coverage: " + Math.round(t2[0][1].coverage) + "%\n\n**#2 " + n2?.name + "**\n- Signal: " + Math.round(t2[1][1].signal) + "% | Speed: " + Math.round(t2[1][1].speed) + "% | Coverage: " + Math.round(t2[1][1].coverage) + "%\n\n**Verdict:** " + n1?.name + " is better here.", providerCards: pCards(a.scores), suggestions: [{ label: "Show plans", action: "best plan for general use" }] };
    } else if (lq.includes("range") || lq.includes("signal") || lq.includes("strength")) {
      const ts: Record<string, number> = {};
      towers.forEach(t => { ts[t.provider] = (ts[t.provider] || 0) + 1; });
      r = { role: "ai", content: "Signal analysis for **" + location.label + "**:\n\n**Towers nearby:**\n" + Object.entries(ts).map(([p, c]) => "- " + (providers.find(pr => pr.id === p)?.name || p) + ": " + c + " towers").join("\n") + "\n\n**Estimates:**\n" + providers.map(p => { const ranges = mobileRanges.filter(rn => rn.provider === p.id); const h5 = ranges.some(rn => rn.generation.includes("5G")); return "- " + p.name + ": " + (h5 ? "5G+4G" : "4G") + " " + (ranges[0]?.rangeKm || "?") + "km"; }).join("\n") + "\n\n**Tip:** For best indoor signal, choose 900MHz bands.", suggestions: [{ label: "Best plan", action: "best plan for general use" }] };
    } else if (lq.includes("fiber") || lq.includes("broadband")) {
      const fp = providers.filter(p => p.technologies.includes("Fiber"));
      r = { role: "ai", content: "Fiber at **" + location.label + "**:\n\n" + fp.map(p => { const cov = coverageData[p.id]; const pl = p.plans.find(pln => pln.type === "fiber"); return "- **" + p.name + "**: " + (cov?.urbanCoverage || "?") + "% urban, from Rs." + (pl?.price || "?"); }).join("\n") + "\n\n**Recommendation:** " + (fp[0]?.name || "Check availability") + " has best coverage.", suggestions: [{ label: "Mobile plans", action: "best plan for general use" }] };
    } else {
      const sorted = Object.entries(a.scores).sort((x, y) => (y[1].signal + y[1].speed) - (x[1].signal + x[1].speed));
      r = { role: "ai", content: "I can help with:\n\n- **Which SIM** is best here\n- **Best plans** for streaming, gaming, budget, work\n- **Current offers** and discounts\n- **Signal strength** analysis\n- **Fiber/broadband** options\n- **Router prices**\n\nJust ask!", providerCards: pCards(a.scores), suggestions: [{ label: "Which SIM is best?", action: "which SIM is better here" }, { label: "Best plan", action: "best plan for general use" }, { label: "Show offers", action: "show offers" }] };
    }
    setMessages(p => [...p, r]);
    setLoading(false);
  };

  const fmt = (s: string) => s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  return (
    <div className="card" style={{borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:600}}>
      <div style={{padding:"14px 16px",background:"linear-gradient(135deg,#0b74ff,#23c9a7)",color:"#fff",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.2)",display:"grid",placeItems:"center"}}><Bot size={20}/></div>
        <div style={{flex:1}}>
          <strong style={{fontSize:14}}>NetReach AI Advisor</strong>
          <div style={{fontSize:11,opacity:.8}}>Analyze location & find the best plan</div>
        </div>
        <Sparkles size={16} style={{opacity:.7}}/>
      </div>

      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:16,maxHeight:400,minHeight:200}}>
        {messages.map((msg, i) => (
          <div key={i} style={{marginBottom:16}}>
            <div style={{display:"flex",gap:8}}>
              {msg.role === "ai" ? (
                <div style={{width:28,height:28,borderRadius:8,background:"#0b74ff18",color:"#0b74ff",display:"grid",placeItems:"center",flexShrink:0}}><Bot size={14}/></div>
              ) : (
                <div style={{width:28,height:28,borderRadius:8,background:"#f5f8fc",display:"grid",placeItems:"center",flexShrink:0}}><User size={14} color="#666"/></div>
              )}
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:msg.role==="ai"?"#0b74ff":"#333",marginBottom:2}}>{msg.role==="ai"?"NetReach AI":"You"}</div>
                <div style={{fontSize:13,lineHeight:1.6}} dangerouslySetInnerHTML={{__html: fmt(msg.content)}}/>
              </div>
            </div>

            {msg.providerCards && (
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8,marginLeft:36}}>
                {msg.providerCards.map(pc => (
                  <div key={pc.id} style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${pc.color}22`,background:`${pc.color}08`,minWidth:120}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <div className={"provider-logo p-" + pc.id} style={{width:20,height:20,fontSize:8}}>{providers.find(p=>p.id===pc.id)?.logo}</div>
                      <strong style={{fontSize:11,color:pc.color}}>{pc.name}</strong>
                    </div>
                    <div style={{fontSize:20,fontWeight:850}}>{pc.score}%</div>
                    <div style={{fontSize:10,color:"#66758c"}}>{pc.reason}</div>
                  </div>
                ))}
              </div>
            )}

            {msg.planCards && (
              <div style={{marginLeft:36,marginTop:8}}>
                {msg.planCards.map((pl, j) => (
                  <div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#f5f8fc",borderRadius:8,marginBottom:6}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <strong style={{fontSize:12}}>{pl.name}</strong>
                        <strong style={{fontSize:14,color:"#0b74ff"}}>Rs.{pl.price}</strong>
                      </div>
                      <div style={{fontSize:11,color:"#66758c"}}>{pl.data} | {pl.validity} | {pl.speed}</div>
                      <div style={{fontSize:10,color:"#0b9a68",marginTop:2}}>{pl.why}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {msg.offerCards && (
              <div style={{marginLeft:36,marginTop:8}}>
                {msg.offerCards.map((o, j) => (
                  <div key={j} style={{padding:"8px 12px",background:"#f0faf5",borderRadius:8,marginBottom:6,border:"1px solid #d4f5e5"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                      <strong style={{fontSize:11,color:providers.find(p=>p.id===o.provider)?.color}}>{providers.find(p=>p.id===o.provider)?.name}</strong>
                      {o.code && <span style={{fontSize:10,background:"#e1e8f1",padding:"2px 6px",borderRadius:4,fontWeight:700}}>{o.code}</span>}
                    </div>
                    <div style={{fontSize:12}}>{o.offer}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2}}>{o.expires}</div>
                  </div>
                ))}
              </div>
            )}

            {msg.suggestions && (
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8,marginLeft:36}}>
                {msg.suggestions.map((s, j) => (
                  <button key={j} onClick={() => ask(s.action)} style={{fontSize:11,padding:"4px 10px",borderRadius:999,border:"1px solid #e1e8f1",background:"#fff",color:"#0b74ff",cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background="#0b74ff";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#0b74ff"}}>{s.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:8,marginLeft:36}}>
            <div style={{width:28,height:28,borderRadius:8,background:"#0b74ff18",color:"#0b74ff",display:"grid",placeItems:"center",flexShrink:0}}><Loader2 size={14} className="spin"/></div>
            <div style={{fontSize:12,color:"#66758c",padding:"8px 0"}}>Analyzing your location...</div>
          </div>
        )}
      </div>

      <div style={{padding:"12px 16px",borderTop:"1px solid #e1e8f1",display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&ask(input)} placeholder="Ask about best SIM, plans, offers, signal..." style={{flex:1,padding:"8px 12px",borderRadius:8,border:"1px solid #e1e8f1",fontSize:12,outline:"none"}}/>
        <button onClick={()=>ask(input)} disabled={loading||!input.trim()} style={{width:36,height:36,borderRadius:8,border:"none",background:input.trim()?"#0b74ff":"#ccc",color:"#fff",display:"grid",placeItems:"center",cursor:input.trim()?"pointer":"not-allowed"}}>
          {loading ? <Loader2 size={14} className="spin"/> : <Send size={14}/>}
        </button>
      </div>
    </div>
  );
}
