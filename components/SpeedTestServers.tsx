"use client";

import { useState } from "react";
import { Globe, Server, Zap } from "lucide-react";

export const testServers = [
  { id: "cloudflare", name: "Cloudflare", url: "https://speed.cloudflare.com/__down?bytes=10000000", location: "Global CDN", size: 10000000 },
  { id: "ovh", name: "OVH France", url: "https://proof.ovh.net/files/10Mb.dat", location: "France", size: 10000000 },
  { id: "tele2", name: "Tele2 Sweden", url: "https://speedtest.tele2.net/10MB.zip", location: "Sweden", size: 10000000 },
  { id: "thinkbroadband", name: "ThinkBroadband UK", url: "https://thinkbroadband.com/speedtest/10MB.bin", location: "UK", size: 10000000 },
];

type Props = {
  selected: string;
  onSelect: (id: string) => void;
};

export default function SpeedTestServers({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const server = testServers.find(s => s.id === selected) || testServers[0];

  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,padding:"4px 10px",borderRadius:6,border:"1px solid #e1e8f1",background:"#f5f8fc",color:"#66758c",cursor:"pointer"}}>
        <Server size={12}/> {server.name}
      </button>
      {open && (
        <div style={{position:"absolute",top:32,right:0,width:220,background:"#fff",borderRadius:10,boxShadow:"0 4px 20px rgba(0,0,0,.12)",border:"1px solid #e1e8f1",zIndex:50,overflow:"hidden"}}>
          {testServers.map(s => (
            <button key={s.id} onClick={()=>{onSelect(s.id);setOpen(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",fontSize:12,background:s.id===selected?"#f0f6ff":"transparent",border:"none",borderBottom:"1px solid #f0f3f8",cursor:"pointer",textAlign:"left"}}>
              <Globe size={12} color="#0b74ff"/>
              <div>
                <strong>{s.name}</strong>
                <div style={{fontSize:10,color:"#66758c"}}>{s.location}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}