"use client";

import { useState, useEffect, useRef } from "react";
import { Wifi, ArrowDown, ArrowUp, Clock, Globe, Trash2, Server } from "lucide-react";
import { providers, getStorage, setStorage, SpeedMeasurement } from "../lib/data";
import SpeedTestServers from "./SpeedTestServers";

type Phase = "idle" | "testing-download" | "testing-upload" | "done";

export default function SpeedTestView({ providerId }: { providerId?: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [latency, setLatency] = useState(0);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<SpeedMeasurement[]>([]);
  const [server, setServer] = useState("cloudflare");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setHistory(getStorage<SpeedMeasurement[]>("netreach-speed-history", []));
  }, []);

  const runTest = async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;
    setPhase("testing-download");
    setDownload(0);
    setUpload(0);
    setLatency(0);
    setProgress(0);

    try {
      // Latency test
      const latencies: number[] = [];
      for (let i = 0; i < 5; i++) {
        if (signal.aborted) return;
        const start = performance.now();
        try { await fetch("https://www.google.com/favicon.ico?cache=" + Date.now(), { mode: "no-cors", cache: "no-store", signal }); } catch {}
        latencies.push(performance.now() - start);
      }
      if (signal.aborted) return;
      const avgLatency = Math.round(latencies.sort((a, b) => a - b)[2]);
      setLatency(avgLatency);

      // Download test
      setProgress(0);
      const dlStart = performance.now();
      let totalBytes = 0;
      for (let chunk = 0; chunk < 3; chunk++) {
        if (signal.aborted) return;
        try {
          const { testServers } = await import("./SpeedTestServers");
          const srv = testServers.find(s => s.id === server) || testServers[0];
          const serverUrl = srv.url;
          const res = await fetch(serverUrl, { cache: "no-store", signal });
          if (!res.body) continue;
          const reader = res.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done || signal.aborted) break;
            totalBytes += value.length;
            const elapsed = (performance.now() - dlStart) / 1000;
            if (elapsed > 0) {
              const speed = ((totalBytes * 8) / elapsed / 1000000);
              setDownload(Math.round(speed));
            }
            setProgress(Math.min(95, (totalBytes / 30000000) * 100));
          }
        } catch {}
      }
      if (signal.aborted) return;
      const dlElapsed = (performance.now() - dlStart) / 1000;
      const finalDl = dlElapsed > 0 ? Math.round((totalBytes * 8) / dlElapsed / 1000000) : 0;
      setDownload(finalDl);
      setProgress(100);

      // Upload test
      setPhase("testing-upload");
      setProgress(0);
      const uploadData = new Uint8Array(2000000).fill(0xab);
      const upStart = performance.now();
      let uploaded = 0;
      for (let i = 0; i < 5; i++) {
        if (signal.aborted) return;
        try {
          await fetch("https://httpbin.org/post", { method: "POST", body: uploadData, cache: "no-store", signal });
          uploaded += uploadData.length;
          setProgress(((i + 1) / 5) * 100);
          const elapsed = (performance.now() - upStart) / 1000;
          if (elapsed > 0) setUpload(Math.round((uploaded * 8) / elapsed / 1000000));
        } catch {}
      }

      if (signal.aborted) return;
      const upElapsed = (performance.now() - upStart) / 1000;
      const finalUp = upElapsed > 0 ? Math.round((uploaded * 8) / upElapsed / 1000000) : 0;
      setUpload(finalUp);
      setPhase("done");

      const result: SpeedMeasurement = {
        id: Date.now().toString(),
        provider: providerId || "unknown",
        download: finalDl,
        upload: finalUp,
        latency: avgLatency,
        location: "Current Location",
        timestamp: Date.now(),
        device: navigator.userAgent.slice(0, 50)
      };
      const newHistory = [result, ...history].slice(0, 50);
      setHistory(newHistory);
      setStorage("netreach-speed-history", newHistory);
    } catch {
      if (!signal.aborted) setPhase("done");
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setStorage("netreach-speed-history", []);
  };

  const prov = providerId ? providers.find(p => p.id === providerId) : null;

  return (
    <div>
      <div className="eyebrow">Speed Test</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>Internet speed test</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:18}}>
        {prov ? `Testing ${prov.name} connection` : "Measure your real download, upload speed and latency"}
      </p>

      <div className="card card-pad" style={{textAlign:"center",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:16}}>
          <div>
            <div style={{fontSize:48,fontWeight:850,letterSpacing:-2,color:phase==="testing-download"?"#0b74ff":"#0e1629"}}>
              {phase === "idle" ? "—" : download}
            </div>
            <div style={{fontSize:11,color:"#66758c",display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
              <ArrowDown size={12}/> Mbps Download
            </div>
          </div>
          <div style={{width:1,background:"#e1e8f1"}}/>
          <div>
            <div style={{fontSize:48,fontWeight:850,letterSpacing:-2,color:phase==="testing-upload"?"#0b74ff":"#0e1629"}}>
              {phase === "idle" ? "—" : upload}
            </div>
            <div style={{fontSize:11,color:"#66758c",display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
              <ArrowUp size={12}/> Mbps Upload
            </div>
          </div>
          <div style={{width:1,background:"#e1e8f1"}}/>
          <div>
            <div style={{fontSize:48,fontWeight:850,letterSpacing:-2}}>
              {phase === "idle" ? "—" : latency}
            </div>
            <div style={{fontSize:11,color:"#66758c",display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
              <Clock size={12}/> ms Latency
            </div>
          </div>
        </div>

        {phase !== "idle" && (
          <div style={{width:"100%",height:6,background:"#e1e8f1",borderRadius:999,marginBottom:16,overflow:"hidden"}}>
            <div style={{width:`${progress}%`,height:"100%",background:phase==="done"?"#0b9a68":"#0b74ff",borderRadius:999,transition:"width 0.3s"}}/>
          </div>
        )}

        <div style={{marginBottom:12}}>
          <SpeedTestServers selected={server} onSelect={setServer}/>
        </div>
        <button onClick={phase==="idle"||phase==="done"?runTest:()=>{abortRef.current?.abort();setPhase("idle")}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 32px",fontSize:15,fontWeight:750,borderRadius:12,border:"none",background:phase==="idle"||phase==="done"?"#0b74ff":"#e15759",color:"#fff",cursor:"pointer",transition:"all 0.15s"}}>
          {phase==="idle"||phase==="done" ? <><Wifi size={18}/> Start test</> : <><Trash2 size={18}/> Stop test</>}
        </button>
      </div>

      <div className="card card-pad">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:800}}>Speed test history</div>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{fontSize:11,color:"#e55f5f",background:"none",border:"none",cursor:"pointer"}}>Clear all</button>
          )}
        </div>
        {history.length === 0 ? (
          <div style={{fontSize:12,color:"#66758c",padding:"16px 0"}}>No test results yet. Run a speed test above.</div>
        ) : (
          <div style={{display:"grid",gap:8}}>
            {history.slice(0, 10).map((h, i) => (
              <div key={h.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:12,alignItems:"center",padding:"8px 12px",background:i===0?"#f0f6ff":"#f5f8fc",borderRadius:8,fontSize:12}}>
                <div>
                  <strong>{providers.find(p=>p.id===h.provider)?.name || h.provider}</strong>
                  <div style={{fontSize:10,color:"#66758c"}}>{new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString()}</div>
                </div>
                <div style={{textAlign:"right"}}><strong>{h.download}</strong><div style={{fontSize:10,color:"#66758c"}}>↓ Mbps</div></div>
                <div style={{textAlign:"right"}}><strong>{h.upload}</strong><div style={{fontSize:10,color:"#66758c"}}>↑ Mbps</div></div>
                <div style={{textAlign:"right"}}><strong>{h.latency}</strong><div style={{fontSize:10,color:"#66758c"}}>ms</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
