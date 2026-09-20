"use client";

export function SkeletonLine({ width = "100%", height = 14, style = {} }: { width?: string | number; height?: number; style?: React.CSSProperties }) {
  return <div style={{width,height,borderRadius:6,background:"linear-gradient(90deg,#eef1f6 25%,#e1e8f1 50%,#eef1f6 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",...style}}/>;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{padding:16,background:"#fff",borderRadius:12,border:"1px solid #e1e8f1"}}>
      <SkeletonLine width="40%" height={16} style={{marginBottom:12}}/>
      {Array.from({length:lines}).map((_,i)=>(
        <SkeletonLine key={i} width={i===lines-1?"60%":"100%"} height={12} style={{marginBottom:8}}/>
      ))}
    </div>
  );
}

export function SkeletonMap() {
  return (
    <div style={{height:400,borderRadius:12,background:"linear-gradient(90deg,#eef1f6 25%,#e1e8f1 50%,#eef1f6 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",display:"grid",placeItems:"center",color:"#66758c",fontSize:13}}>
      Loading map...
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{display:"grid",gap:8}}>
      <SkeletonLine height={32} style={{borderRadius:8}}/>
      {Array.from({length:rows}).map((_,i)=>(
        <SkeletonLine key={i} height={40} style={{borderRadius:8}}/>
      ))}
    </div>
  );
}
