"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Signal } from "lucide-react";

export default function NetworkStatus() {
  const [status, setStatus] = useState<"online"|"offline"|"slow">("online");

  useEffect(() => {
    const check = () => {
      if (!navigator.onLine) { setStatus("offline"); return; }
      const conn = (navigator as any).connection;
      if (conn) {
        const slow = conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.downlink < 1;
        setStatus(slow ? "slow" : "online");
      } else {
        setStatus("online");
      }
    };
    check();
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    return () => {
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);

  const colors = { online: "#0b9a68", offline: "#e55f5f", slow: "#f5a623" };
  const labels = { online: "Online", offline: "Offline", slow: "Slow connection" };
  const icons = { online: <Wifi size={12}/>, offline: <WifiOff size={12}/>, slow: <Signal size={12}/> };

  return (
    <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:colors[status],fontWeight:600}} title={labels[status]}>
      {icons[status]} {labels[status]}
    </div>
  );
}