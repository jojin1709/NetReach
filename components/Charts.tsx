"use client";

import { providers } from "../lib/data";

type BarData = { label: string; value: number; color: string };

export function HorizontalBarChart({ data, maxValue }: { data: BarData[]; maxValue?: number }) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{display:"grid",gap:8}}>
      {data.map((d, i) => (
        <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:60,fontSize:11,textAlign:"right",flexShrink:0}}>{d.label}</div>
          <div style={{flex:1,height:20,background:"#eef1f6",borderRadius:6,overflow:"hidden"}}>
            <div style={{width:`${(d.value / max) * 100}%`,height:"100%",background:d.color,borderRadius:6,transition:"width 0.6s ease",display:"flex",alignItems:"center",paddingLeft:8}}>
              {d.value > 0 && <span style={{fontSize:10,color:"#fff",fontWeight:700}}>{d.value}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ segments, size = 120 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let cumulative = 0;
  const radius = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  const arcs = segments.map((seg, i) => {
    const startAngle = (cumulative / total) * 360;
    const sweepAngle = (seg.value / total) * 360;
    cumulative += seg.value;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = (((startAngle + sweepAngle) - 90) * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = sweepAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  });

  return (
    <div style={{display:"flex",alignItems:"center",gap:16}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((d, i) => (
          <path key={i} d={d} fill={segments[i].color} opacity={0.85}/>
        ))}
        <circle cx={cx} cy={cy} r={radius * 0.55} fill="#fff"/>
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight={800} fill="#10213b">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#66758c">Total</text>
      </svg>
      <div style={{display:"grid",gap:4}}>
        {segments.map((seg, i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
            <div style={{width:8,height:8,borderRadius:2,background:seg.color}}/>
            {seg.label}: {seg.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpeedGauge({ value, max = 300, label }: { value: number; max?: number; label: string }) {
  const pct = Math.min(value / max, 1);
  const angle = pct * 180;
  const color = pct > 0.7 ? "#0b9a68" : pct > 0.4 ? "#f5a623" : "#e55f5f";

  return (
    <div style={{textAlign:"center"}}>
      <svg width={120} height={70} viewBox="0 0 120 70">
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#e1e8f1" strokeWidth={8} strokeLinecap="round"/>
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 157} 157`} style={{transition:"stroke-dasharray 0.8s ease"}}/>
        <text x={60} y={55} textAnchor="middle" fontSize={20} fontWeight={850} fill="#10213b">{value}</text>
        <text x={60} y={67} textAnchor="middle" fontSize={8} fill="#66758c">Mbps</text>
      </svg>
      <div style={{fontSize:11,color:"#66758c",marginTop:4}}>{label}</div>
    </div>
  );
}

export function ProviderBarChart({ type }: { type: "download" | "upload" | "latency" | "rating" }) {
  const data = providers.map(p => ({
    label: p.name,
    value: type === "rating" ? p.rating * 20 : type === "latency" ? Math.round(100 - p.speedAvg / 5) : p.speedAvg,
    color: p.color
  }));
  const labels: Record<string, string> = { download: "Avg Download (Mbps)", upload: "Avg Upload (Mbps)", latency: "Latency Score", rating: "Rating (%)" };
  return (
    <div>
      <div style={{fontSize:12,fontWeight:700,color:"#66758c",marginBottom:8}}>{labels[type]}</div>
      <HorizontalBarChart data={data} maxValue={type === "rating" ? 100 : type === "download" ? 300 : 50}/>
    </div>
  );
}
