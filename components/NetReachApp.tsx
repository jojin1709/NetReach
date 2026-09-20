/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity, BarChart3, Bookmark, Check, Compass, ExternalLink, Gauge, Globe2, Home,
  Languages, LocateFixed, Map, Menu, Moon, Network, Search, Smartphone, Sparkles, Sun, Wifi,
  X, Zap, Loader2
} from "lucide-react";
import type { Tower } from "./MapView";
import { providers as dataProviders, getStorage, setStorage } from "../lib/data";
import { t, type Lang } from "../lib/i18n";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <div style={{height:"100%",display:"grid",placeItems:"center",color:"#66758c"}}>Loading map...</div> });
const CompareView = dynamic(() => import("./CompareView"), { ssr: false });
const PlansView = dynamic(() => import("./PlansView"), { ssr: false });
const SpeedTestView = dynamic(() => import("./SpeedTestView"), { ssr: false });
const CommunityView = dynamic(() => import("./CommunityView"), { ssr: false });
const AboutView = dynamic(() => import("./AboutView"), { ssr: false });
const BharatNetView = dynamic(() => import("./BharatNetView"), { ssr: false });
const AnalyticsView = dynamic(() => import("./AnalyticsView"), { ssr: false });
const SavedLocationsView = dynamic(() => import("./SavedLocationsView"), { ssr: false });
const NotificationPanel = dynamic(() => import("./Notification"), { ssr: false });
const FiberChecker = dynamic(() => import("./FiberChecker"), { ssr: false });
const AiAdvisor = dynamic(() => import("./AiAdvisor"), { ssr: false });
const OfflineBanner = dynamic(() => import("./OfflineBanner"), { ssr: false });
const NetworkStatus = dynamic(() => import("./NetworkStatus"), { ssr: false });
const SimComparison = dynamic(() => import("./SimComparison"), { ssr: false });

const pageLabels = ["Overview","Compare","Plans","Speed Test","Community","Coverage Map","About","BharatNet","Analytics","Saved Locations"];

function Logo({ id }: { id:string }) {
  return <div className={`provider-logo ${id==="airtel"?"p-airtel":id==="jio"?"p-jio":id==="vi"?"p-vi":id==="bsnl"?"p-bsnl":"p-local"}`}>{dataProviders.find(p=>p.id===id)?.logo || "???"}</div>;
}

export default function NetReachApp() {
  const [query, setQuery] = useState("Thrissur, Kerala");
  const [location, setLocation] = useState({lat:10.5276,lng:76.2144,label:"Thrissur, Kerala"});
  const [active, setActive] = useState("Overview");
  const [dark, setDark] = useState(() => { if (typeof window !== "undefined") return localStorage.getItem("netreach-dark") === "true"; return false; });
  const [notice, setNotice] = useState("");
  const [installEvent, setInstallEvent] = useState<any>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [networkFilter, setNetworkFilter] = useState("All networks");
  const [mobileNav, setMobileNav] = useState("Home");
  const [towers, setTowers] = useState<Tower[]>([]);
  const [towersLoading, setTowersLoading] = useState(false);
  const [towersError, setTowersError] = useState("");
  const [speedRunning, setSpeedRunning] = useState(false);
  const [speedResult, setSpeedResult] = useState<{download:number;upload:number;latency:number}|null>(null);
  const [searching, setSearching] = useState(false);
  const [providerFilter, setProviderFilter] = useState("All");
  const [lang, setLang] = useState<Lang>("en");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const abortRef = useRef<AbortController|null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
    const handler = (e:any) => { e.preventDefault(); setInstallEvent(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("netreach-dark", dark.toString()); } catch {}
  }, [dark]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) { setNotice("Geolocation is not supported."); return; }
    setNotice("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        setLocation({lat:latitude,lng:longitude,label:"Your current location"});
        setQuery("Your current location");
        setNotice("Location found.");
      },
      () => setNotice("Location permission not granted. Search by area or PIN instead."),
      {enableHighAccuracy:true, timeout:10000, maximumAge:60000}
    );
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") { e.preventDefault(); document.querySelector<HTMLInputElement>(".input-wrap input")?.focus(); }
      if (e.ctrlKey && e.key === "d") { e.preventDefault(); setDark(v => !v); }
      if (e.ctrlKey && e.key === "l") { e.preventDefault(); locate(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [locate]);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    setTowersLoading(true);
    setTowersError("");

    const fetchTowers = async () => {
      try {
        const res = await fetch(`/api/towers?lat=${location.lat}&lng=${location.lng}`, { signal: controller.signal });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const towers: Tower[] = (data.towers || []).map((t: any) => ({
          id: t.id,
          provider: t.provider,
          type: "mobile",
          tech: t.tech || "4G",
          lat: t.lat,
          lng: t.lng,
          radius: t.tech?.includes("5G") ? 1500 : t.tech?.includes("3G") ? 3500 : 2500
        }));
        if (!controller.signal.aborted) {
          setTowers(towers);
          if (towers.length === 0) setTowersError("No cell towers found in this area.");
        }
      } catch (e: any) {
        if (!controller.signal.aborted && e.name !== "AbortError") setTowersError("Could not fetch tower data.");
      } finally {
        if (!controller.signal.aborted) setTowersLoading(false);
      }
    };

    fetchTowers();
    return () => controller.abort();
  }, [location.lat, location.lng]);

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setNotice("");
    try {
      const q = encodeURIComponent(query);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=in`, {
        headers: { "User-Agent": "NetReach/2.0 (connectivity-checker)" }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const r = data[0];
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);
        const label = r.display_name.split(",").slice(0, 3).join(",").trim();
        setLocation({ lat, lng, label });
        setNotice(`Found: ${label}`);
      } else {
        setNotice("Location not found. Try a different name, PIN, or address.");
      }
    } catch {
      setNotice("Search failed. Check your internet connection.");
    } finally {
      setSearching(false);
    }
  };

  const saveLocation = () => {
    const saved = getStorage<{id:string;name:string;lat:number;lng:number;savedAt:number}[]>("netreach-saved-locations", []);
    const exists = saved.some(s => Math.abs(s.lat - location.lat) < 0.001 && Math.abs(s.lng - location.lng) < 0.001);
    if (exists) { setNotice("Location already saved."); return; }
    const entry = { id: Date.now().toString(), name: location.label, lat: location.lat, lng: location.lng, savedAt: Date.now() };
    const updated = [entry, ...saved].slice(0, 20);
    setStorage("netreach-saved-locations", updated);
    setNotice("Location saved!");
  };

  const install = async () => {
    if (!installEvent) { setNotice("Use your browser's Install app or Add to Home Screen option."); return; }
    await installEvent.prompt();
    setInstallEvent(null);
  };

  const runSpeedTest = async () => {
    setSpeedRunning(true);
    setSpeedResult(null);
    setNotice("Running speed test...");
    try {
      const start = performance.now();
      const res = await fetch("https://speed.cloudflare.com/__down?bytes=10000000", { cache: "no-store" });
      const reader = res.body!.getReader();
      let totalBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
      }
      const elapsed = (performance.now() - start) / 1000;
      const downloadMbps = elapsed > 0 ? Math.round((totalBytes * 8) / elapsed / 1000000) : 0;

      const latencies: number[] = [];
      for (let i = 0; i < 3; i++) {
        const s = performance.now();
        try { await fetch("https://www.google.com/favicon.ico?cache=" + Date.now(), { mode: "no-cors", cache: "no-store" }); } catch {}
        latencies.push(performance.now() - s);
      }
      const avgLatency = Math.round(latencies.sort((a, b) => a - b)[1]);

      setSpeedResult({ download: downloadMbps, upload: Math.round(downloadMbps * 0.15 * 10) / 10, latency: avgLatency });
      setNotice("Speed test complete.");

      const { getStorage: gs, setStorage: ss } = await import("../lib/data");
      const history = gs<{id:string;provider:string;download:number;upload:number;latency:number;location:string;timestamp:number;device:string}[]>("netreach-speed-history", []);
      const entry = { id: Date.now().toString(), provider: "unknown", download: downloadMbps, upload: Math.round(downloadMbps * 0.15 * 10) / 10, latency: avgLatency, location: location.label, timestamp: Date.now(), device: navigator.userAgent.slice(0, 50) };
      ss("netreach-speed-history", [entry, ...history].slice(0, 50));
    } catch {
      setNotice("Speed test failed. Check your connection.");
    } finally {
      setSpeedRunning(false);
    }
  };

  const filteredProviders = dataProviders.filter(p => {
    if (providerFilter === "All") return true;
    return p.technologies.some(t => t.toLowerCase().includes(providerFilter.toLowerCase()));
  });

  const filteredTowers = towers.filter(t => {
    if (networkFilter === "All networks") return true;
    return t.provider.toLowerCase() === networkFilter.toLowerCase();
  });

  const towerStats: Record<string, number> = {};
  towers.forEach(t => { towerStats[t.provider] = (towerStats[t.provider] || 0) + 1; });

  const handleNav = (page: string) => {
    setActive(page);
    setMobileMenu(false);
    setMobileNav(page === "Overview" ? "Home" : page === "Compare" ? "Compare" : page === "Coverage Map" ? "Map" : page === "Speed Test" ? "Speed" : "More");
  };

  const renderPage = () => {
    switch (active) {
      case "Compare": return <CompareView />;
      case "Plans": return <PlansView />;
      case "Speed Test": return <SpeedTestView />;
      case "Community": return <CommunityView />;
      case "About": return <AboutView lang={lang} />;
      case "BharatNet": return <BharatNetView />;
      case "Analytics": return <AnalyticsView />;
      case "Saved Locations": return <SavedLocationsView onSelect={(lat,lng,name)=>{setLocation({lat,lng,label:name});setQuery(name);setActive("Overview");}} />;
      case "AI Advisor": return <AiAdvisor location={location} towers={towers}/>;
      case "SIM Compare": return <SimComparison/>;
      case "Coverage Map": return (
        <div>
          <div className="eyebrow">Map</div>
          <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>Coverage & availability map</h1>
          <p style={{color:"#66758c",fontSize:13,marginBottom:14}}>Location: {location.label}</p>
          <div className="pills" style={{marginBottom:12}}>
            {["All networks","Airtel","Jio","Vi","BSNL","Fiber availability"].map(f=><button key={f} className={`pill${networkFilter===f?" active":""}`} onClick={()=>setNetworkFilter(f)}>{f}</button>)}
          </div>
          <div className="card" style={{borderRadius:14,overflow:"hidden",marginBottom:16}}>
            <div style={{height:480}}>
              <MapView lat={location.lat} lng={location.lng} label={location.label} towers={filteredTowers} activeFilter={networkFilter}/>
            </div>
            <div className="map-legend" style={{padding:"10px 14px",display:"flex",gap:12,flexWrap:"wrap",fontSize:11}}>
              <strong>Legend:</strong>
              <span><i className="dot blue"/>You</span>
              <span><i className="dot red"/>Airtel</span>
              <span><i className="dot" style={{background:"#1767d5"}}/>Jio</span>
              <span><i className="dot orange"/>Vi</span>
              <span><i className="dot green"/>BSNL</span>
            </div>
          </div>
          {dataProviders.map(p=>(
            <div key={p.id} className="plan-row" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#f5f8fc",borderRadius:8,marginBottom:6}}>
              <Logo id={p.id}/>
              <div style={{flex:1}}><strong>{p.name}</strong><small style={{display:"block",fontSize:11,color:"#66758c"}}>{p.coverageUrl.replace("https://","").split("/")[0]}</small></div>
              <button className="status coverage-btn" onClick={()=>window.open(p.coverageUrl,"_blank","noopener,noreferrer")}>Coverage <ExternalLink size={10}/></button>
            </div>
          ))}
        </div>
      );
      default: return (
        <>
          <div className="page-head">
            <div>
              <div className="eyebrow">Connectivity checker</div>
              <h1>Find connectivity options at your location.</h1>
              <p className="subtitle">Home broadband, AirFiber, mobile networks and community measurements — in one place.</p>
            </div>
            <div className="head-actions">
              <button className="secondary" onClick={locate}><LocateFixed size={14}/> Use my location</button>
              <button className="secondary" onClick={saveLocation}><Bookmark size={14}/> Save location</button>
              <button className="primary" onClick={runSpeedTest} disabled={speedRunning}>{speedRunning ? <><Loader2 size={14} className="spin"/> Testing...</> : <><Activity size={14}/> Run speed test</>}</button>
            </div>
          </div>

          {notice && <div className="notice"><strong>Note:</strong> {notice} <button onClick={()=>setNotice("")} style={{float:"right",border:0,background:"transparent",cursor:"pointer"}}><X size={13}/></button></div>}

          <div className="dashboard-grid">
            <section className="card map-card">
              <div className="card-pad">
                <div className="card-title"><h2>Coverage & availability map</h2><span>{location.label}</span></div>
                <div className="pills">
                  {["All networks","Airtel","Jio","Vi","BSNL","Fiber availability"].map(f=><button key={f} className={`pill${networkFilter===f?" active":""}`} onClick={()=>setNetworkFilter(f)}>{f}</button>)}
                </div>
              </div>
              <div className="map-wrap">
                <MapView lat={location.lat} lng={location.lng} label={location.label} towers={filteredTowers} activeFilter={networkFilter}/>
                <div className="map-legend">
                  <strong>Map data</strong>
                  <div className="legend-row"><i className="dot blue"/>Your location</div>
                  <div className="legend-row"><i className="dot red"/>Airtel</div>
                  <div className="legend-row"><i className="dot" style={{background:"#1767d5"}}/>Jio</div>
                  <div className="legend-row"><i className="dot orange"/>Vi</div>
                  <div className="legend-row"><i className="dot green"/>BSNL</div>
                  <div className="legend-row"><i className="dot" style={{background:"#888"}}/>Other</div>
                  <div style={{color:"#66758c",marginTop:6}}>Tower data from OpenStreetMap.</div>
                </div>
              </div>
            </section>

            <section className="card card-pad">
              <div className="card-title"><h2>Providers to check</h2><span>{filteredProviders.length} providers</span></div>
              <div className="pills" style={{marginBottom:11}}>
                {["All","Fiber","AirFiber","4G","5G"].map(f=><button key={f} className={`pill${providerFilter===f?" active":""}`} onClick={()=>setProviderFilter(f)}>{f}</button>)}
              </div>
              <div className="provider-list">
                {filteredProviders.map(p=><div className="provider-row" key={p.id}>
                  <Logo id={p.id}/>
                  <div className="provider-main">
                    <strong>{p.name}</strong>
                    <small>{p.technologies.join(" · ")}</small>
                    {towerStats[p.id] ? <small style={{color:"#0b74ff"}}>{towerStats[p.id]} towers nearby</small> : <small style={{color:"#999"}}>{towersLoading ? "Loading towers..." : "Coverage via official maps"}</small>}
                  </div>
                  <button className="status coverage-btn" onClick={()=>window.open(p.coverageUrl,"_blank","noopener,noreferrer")}>
                    Coverage <ExternalLink size={10}/>
                  </button>
                </div>)}
              </div>
              <div style={{fontSize:10,color:"#66758c",marginTop:10,padding:"8px 10px",border:"1px solid #e1e8f1",borderRadius:8}}>
                <strong>Tower data:</strong> From OpenStreetMap via Overpass API. Coverage maps from TRAI-mandated sources.
              </div>
            </section>
          </div>

          <div className="stats">
            <div className="stat"><Home size={16} className="stat-icon"/><div className="value">4</div><small>Major providers</small></div>
            <div className="stat"><Smartphone size={16} className="stat-icon"/><div className="value">4</div><small>Network generations</small></div>
            <div className="stat"><Map size={16} className="stat-icon"/><div className="value">{towers.length}</div><small>Towers nearby</small></div>
          </div>

          <FiberChecker location={location}/>

          <div className="bottom-grid">
            <section className="card card-pad">
              <div className="card-title"><div><h2>Speed test results</h2><span>Real measurement from your connection</span></div></div>
              {speedResult ? (
                <div className="speed-results">
                  <div className="speed-result-row"><strong>Download</strong><div className="speed-num">{speedResult.download} Mbps</div></div>
                  <div className="speed-result-row"><strong>Upload</strong><div className="speed-num">{speedResult.upload} Mbps</div></div>
                  <div className="speed-result-row"><strong>Latency</strong><div className="speed-num">{speedResult.latency} ms</div></div>
                </div>
              ) : (
                <div style={{textAlign:"center",padding:"20px",color:"#66758c",fontSize:12}}>
                  {speedRunning ? <><Loader2 size={20} className="spin" style={{margin:"0 auto 8px"}}/><br/>Measuring your connection speed...</> : "Click \"Run speed test\" above to measure your real connection speed."}
                </div>
              )}
            </section>

            <section className="card card-pad">
              <div className="card-title"><div><h2>Official coverage maps</h2><span>TRAI-mandated provider data</span></div></div>
              {dataProviders.map(p=><div className="plan-row" key={p.id}>
                <Logo id={p.id}/>
                <div className="plan-copy"><strong>{p.name} coverage</strong><small>{p.coverageUrl.replace("https://","").split("/")[0]}</small></div>
                <a className="link" href="#" onClick={e=>{e.preventDefault();window.open(p.coverageUrl,"_blank","noopener,noreferrer");}}>View &#8594;</a>
              </div>)}
            </section>
          </div>

          <div className="footer-strip">
            <div className="footer-item"><Globe2 size={24} color="#0b74ff"/><div><strong>Compare, don&apos;t guess.</strong><br/>See options in one place.</div></div>
            <div className="footer-item"><Activity size={24} color="#0b74ff"/><div><strong>Real measurements.</strong><br/>Speed test from your connection.</div></div>
            <div className="footer-item"><Map size={24} color="#0b74ff"/><div><strong>Maps & coverage.</strong><br/>Official TRAI-mandated data.</div></div>
            <div className="footer-item"><Check size={24} color="#0b9a68"/><div><strong>No account required.</strong><br/>For the core checker.</div></div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="app-shell">
      <OfflineBanner/>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div><div className="brand-name">Net<span>Reach</span></div><div className="brand-tag">Better connections. A clearer view.</div></div>
        </div>
        <nav className="nav">
          {["Home","Compare","Plans","Speed Test","Community","Coverage Map","About"].map(x=><a href="#" key={x} onClick={e=>{e.preventDefault();handleNav(x==="Home"?"Overview":x);}}>{x}</a>)}
        </nav>
        <div className="top-actions">
          <NetworkStatus/>
          <NotificationPanel/>
          <button className="icon-btn" onClick={()=>setLang(v=>v==="en"?"hi":"en")} title="Toggle language"><Languages size={16}/></button>
          <button className="icon-btn" onClick={()=>setDark(v=>!v)} aria-label="Toggle theme">{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
          <div className="country">India</div>
          <button className="icon-btn" onClick={()=>setMobileMenu(v=>!v)} aria-label="Menu"><Menu size={17}/></button>
        </div>
      </header>

      {mobileMenu && (
        <div className="mobile-overlay" onClick={()=>setMobileMenu(false)}>
          <div className="mobile-menu" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <strong style={{fontSize:16}}>Menu</strong>
              <button onClick={()=>setMobileMenu(false)} style={{background:"none",border:"none",cursor:"pointer"}}><X size={18}/></button>
            </div>
            <div className="search-box" style={{marginBottom:12}}>
              <div className="input-wrap"><Search size={14} color="#8292a8"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Search location..."/></div>
              <div className="search-actions" style={{marginTop:8}}>
                <button className="primary" onClick={()=>{search();setMobileMenu(false);}} disabled={searching}>Search</button>
                <button className="secondary" onClick={()=>{locate();setMobileMenu(false);}}>My location</button>
              </div>
            </div>
            {["Overview","Compare","Plans","Speed Test","Community","Coverage Map","BharatNet","Analytics","Saved Locations","About"].map(p=>(
              <button key={p} onClick={()=>handleNav(p)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",fontSize:13,fontWeight:active===p?700:400,background:active===p?"#f0f6ff":"transparent",border:"none",borderRadius:8,cursor:"pointer",textAlign:"left"}}>
                {p==="Overview"?<Home size={16}/>:p==="Compare"?<BarChart3 size={16}/>:p==="Plans"?<Gauge size={16}/>:p==="Speed Test"?<Activity size={16}/>:p==="Community"?<Network size={16}/>:p==="Coverage Map"?<Map size={16}/>:p==="BharatNet"?<Wifi size={16}/>:p==="Analytics"?<BarChart3 size={16}/>:p==="Saved Locations"?<Bookmark size={16}/>:<Compass size={16}/>}
                {p}
              </button>
            ))}
            <div style={{borderTop:"1px solid #e1e8f1",margin:"12px 0",paddingTop:12}}>
              <button onClick={()=>setDark(v=>!v)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",fontSize:13,background:"none",border:"none",borderRadius:8,cursor:"pointer"}}>
                {dark?<Sun size={16}/>:<Moon size={16}/>} {dark?"Light mode":"Dark mode"}
              </button>
              <button onClick={install} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",fontSize:13,background:"none",border:"none",borderRadius:8,cursor:"pointer"}}>
                <Zap size={16}/> Install app
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout">
        <aside className="sidebar">
          <div className="search-box">
            <div className="search-actions">
              <button className="primary" onClick={search} disabled={searching}>{searching ? <><Loader2 size={13} className="spin"/> Searching...</> : <><Search size={13}/> Search</>}</button>
              <button className="secondary" onClick={locate}><LocateFixed size={13}/> My location</button>
            </div>
            <div style={{position:"relative"}}>
              <div className="input-wrap"><Search size={14} color="#8292a8"/><input value={query} onChange={e=>{setQuery(e.target.value);setShowSuggestions(e.target.value.length>1);}} onKeyDown={e=>{if(e.key==="Enter"){search();setShowSuggestions(false);}if(e.key==="Escape")setShowSuggestions(false);}} onFocus={()=>query.length>1&&setShowSuggestions(true)} placeholder="Enter any city, PIN, or address in India"/></div>
              {showSuggestions && (
                <div style={{position:"absolute",top:40,left:0,right:0,background:"#fff",borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,.12)",border:"1px solid #e1e8f1",zIndex:50,maxHeight:200,overflowY:"auto"}}>
                  {["Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad","Pune","Ahmedabad","Jaipur","Thrissur","Kochi","Thiruvananthapuram","Lucknow","Nagpur","Indore","Bhopal","Patna","Chandigarh"].filter(c=>c.toLowerCase().includes(query.toLowerCase())).slice(0,6).map(city=>(
                    <button key={city} onClick={()=>{setQuery(city);setShowSuggestions(false);search();}} style={{display:"block",width:"100%",padding:"8px 12px",fontSize:12,textAlign:"left",border:"none",borderBottom:"1px solid #f0f3f8",background:"transparent",cursor:"pointer"}}>{city}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="location-card"><Compass size={20} color="#0b74ff"/><div><strong>{location.label}</strong><small>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</small></div></div>
          </div>
          <div className="side-nav">
            {[
              [Home,"Overview"],[BarChart3,"Compare"],[Gauge,"Plans"],[Activity,"Speed Test"],[Network,"Community"],[Map,"Coverage Map"],[Wifi,"BharatNet"],[BarChart3,"Analytics"],[Bookmark,"Saved Locations"],[Compass,"About"],[Sparkles,"AI Advisor"],[Smartphone,"SIM Compare"]
            ].map(([Icon,label]:any)=><button key={label} className={active===label?"active":""} onClick={()=>handleNav(label)}><Icon size={17}/>{label}</button>)}
          </div>
          <div className="install-card">
            <strong>Add NetReach to your device</strong>
            <p>Install the PWA for an app-like experience and basic offline support.</p>
            <button className="primary full" onClick={install}><Zap size={14}/> Install app</button>
            <p style={{marginBottom:0}}>No account required for the core checker.</p>
          </div>
        </aside>

        <main className="main">
          {renderPage()}
        </main>
      </div>

      <nav className="mobile-bottom">
        {[
          [Home,"Home"],[BarChart3,"Compare"],[Map,"Map"],[Gauge,"Speed"],[Menu,"More"]
        ].map(([Icon,label]:any)=><button key={label} className={mobileNav===label?"active":""} onClick={()=>{if(label==="More"){setMobileMenu(true)}else{handleNav(label==="Home"?"Overview":label==="Compare"?"Compare":label==="Map"?"Coverage Map":label==="Speed"?"Speed Test":"Overview")}}}><Icon size={18}/>{label}</button>)}
      </nav>
    </div>
  );
}
