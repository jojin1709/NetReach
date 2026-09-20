"use client";

import { useState, useEffect } from "react";
import { WifiOff, X } from "lucide-react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => { setOnline(false); setDismissed(false); };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online || dismissed) return null;

  return (
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,background:"#e55f5f",color:"#fff",padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:12,fontWeight:600}}>
      <WifiOff size={14}/>
      You are offline. Some features may not work.
      <button onClick={()=>setDismissed(true)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",marginLeft:8}}>
        <X size={14}/>
      </button>
    </div>
  );
}