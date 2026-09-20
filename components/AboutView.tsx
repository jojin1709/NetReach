"use client";

import { Shield, Globe, Users, Heart, ExternalLink, Wifi, BarChart3, MapPin } from "lucide-react";
import { bharatNetData } from "../lib/data";

export default function AboutView({ lang = "en" }: { lang?: string }) {
  return (
    <div>
      <div className="eyebrow">About</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>{lang==="hi"?"NetReach के बारे में":lang==="ml"?"NetReach കുറിച്ച്":lang==="ta"?"NetReach பற்றி":lang==="te"?"NetReach గురించి":lang==="kn"?"NetReach ಬಗ್ಗೆ":"NetReach — Indian connectivity checker"}</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:18}}>Helping people across India find the best internet for their location.</p>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h2 style={{fontSize:18,letterSpacing:-0.5,marginBottom:10}}>What is NetReach?</h2>
        <p style={{fontSize:13,color:"#46546e",lineHeight:1.7,marginBottom:12}}>
          NetReach is an open-source tool that helps people across India find the best internet options for their exact location.
          We aggregate data from real tower installations (OpenStreetMap), community speed tests, government fiber rollout data (BharatNet),
          and official coverage maps mandated by TRAI.
        </p>
        <p style={{fontSize:13,color:"#46546e",lineHeight:1.7,marginBottom:12}}>
          Whether you are moving to a new city, choosing a home broadband plan, or want to know which mobile network works best at your home or office,
          NetReach gives you an unbiased, data-driven view — not marketing promises.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {icon:<Wifi size={16}/>,title:"Real tower data",desc:"OpenStreetMap cell tower locations"},
            {icon:<MapPin size={16}/>,title:"Exact location",desc:"Search by address, PIN, or city"},
            {icon:<BarChart3 size={16}/>,title:"Speed tests",desc:"Community-submitted real speeds"},
            {icon:<Globe size={16}/>,title:"All providers",desc:"Jio, Airtel, Vi, BSNL coverage"}
          ].map((f, i) => (
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:10,background:"#f5f8fc",borderRadius:8}}>
              <div style={{color:"#0b74ff",marginTop:2}}>{f.icon}</div>
              <div>
                <div style={{fontSize:12,fontWeight:700}}>{f.title}</div>
                <div style={{fontSize:11,color:"#66758c"}}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h2 style={{fontSize:18,letterSpacing:-0.5,marginBottom:10}}>How it works</h2>
        <div style={{display:"grid",gap:10}}>
          {[
            {step:"1",title:"Enter your location",desc:"Search by PIN code, city, or any address in India. We use Nominatim geocoding to find your exact coordinates."},
            {step:"2",title:"Find nearby towers",desc:"We query OpenStreetMap via Overpass API for real cell tower locations near you. Towers are tagged with operator and technology data."},
            {step:"3",title:"Compare providers",desc:"See coverage circles for each provider. Check plans, pricing, and technologies available in your area."},
            {step:"4",title:"Community data",desc:"Submit your own speed tests and reviews. The more people contribute, the better the data for everyone."},
          ].map((item, i) => (
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:28,height:28,borderRadius:8,background:"#0b74ff",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0}}>{item.step}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{item.title}</div>
                <div style={{fontSize:12,color:"#66758c"}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h2 style={{fontSize:18,letterSpacing:-0.5,marginBottom:10}}>Data sources</h2>
        <div style={{display:"grid",gap:8}}>
          {[
            {name:"OpenStreetMap (Overpass API)",desc:"Cell tower locations mapped by the community",url:"https://www.openstreetmap.org"},
            {name:"Nominatim",desc:"Free geocoding from OpenStreetMap",url:"https://nominatim.openstreetmap.org"},
            {name:"BharatNet",desc:"Government rural fiber rollout data (PM-WANI)",url:"https://bharatnet.gov.in"},
            {name:"TRAI",desc:"Mandated provider coverage links",url:"https://www.trai.gov.in"},
            {name:"Provider websites",desc:"Official plan pricing and details",url:"https://www.jio.com"},
            {name:"Community",desc:"User-submitted speed tests and reviews",url:null}
          ].map((s, i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#f5f8fc",borderRadius:8}}>
              <div>
                <strong style={{fontSize:12}}>{s.name}</strong>
                <div style={{fontSize:11,color:"#66758c"}}>{s.desc}</div>
              </div>
              {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#0b74ff",display:"flex",alignItems:"center",gap:4}}>Visit <ExternalLink size={10}/></a>}
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h2 style={{fontSize:18,letterSpacing:-0.5,marginBottom:10}}>BharatNet — Rural fiber connectivity</h2>
        <p style={{fontSize:13,color:"#46546e",lineHeight:1.7,marginBottom:12}}>
          BharatNet is India&apos;s ambitious project to connect all 250,000 Gram Panchayats with broadband fiber.
          As of 2024, approximately {bharatNetData.connectedGPs.toLocaleString()} GPs ({Math.round(bharatNetData.connectedGPs/bharatNetData.totalGPs*100)}%) have been connected.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <div style={{textAlign:"center",padding:12,background:"#f5f8fc",borderRadius:8}}>
            <div style={{fontSize:24,fontWeight:850,color:"#0b74ff"}}>{bharatNetData.totalGPs.toLocaleString()}</div>
            <div style={{fontSize:11,color:"#66758c"}}>Total GPs</div>
          </div>
          <div style={{textAlign:"center",padding:12,background:"#f5f8fc",borderRadius:8}}>
            <div style={{fontSize:24,fontWeight:850,color:"#0b9a68"}}>{bharatNetData.connectedGPs.toLocaleString()}</div>
            <div style={{fontSize:11,color:"#66758c"}}>Connected GPs</div>
          </div>
          <div style={{textAlign:"center",padding:12,background:"#f5f8fc",borderRadius:8}}>
            <div style={{fontSize:24,fontWeight:850,color:"#f5a623"}}>{Math.round(bharatNetData.connectedGPs/bharatNetData.totalGPs*100)}%</div>
            <div style={{fontSize:11,color:"#66758c"}}>Progress</div>
          </div>
        </div>
        <div style={{fontSize:12,fontWeight:700,color:"#66758c",marginBottom:8}}>STATE-WISE PROGRESS</div>
        {bharatNetData.states.slice(0, 6).map((s, i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{width:90,fontSize:11}}>{s.name}</div>
            <div style={{flex:1,height:8,background:"#e1e8f1",borderRadius:999,overflow:"hidden"}}>
              <div style={{width:`${s.connected}%`,height:"100%",background:s.connected>=80?"#0b9a68":s.connected>=60?"#f5a623":"#e55f5f",borderRadius:999}}/>
            </div>
            <div style={{width:35,textAlign:"right",fontSize:11,fontWeight:700}}>{s.connected}%</div>
          </div>
        ))}
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h2 style={{fontSize:18,letterSpacing:-0.5,marginBottom:10}}>Provider Support</h2>
        <p style={{fontSize:13,color:"#46546e",lineHeight:1.7,marginBottom:12}}>
          Need help with your connection? Contact your provider directly:
        </p>
        <div style={{display:"grid",gap:8}}>
          {[
            { name: "Jio", phone: "199", url: "https://www.jio.com/selfcare/jio-care/contact-us", color: "#1767d5" },
            { name: "Airtel", phone: "121", url: "https://www.airtel.in/contactUs", color: "#e51f3d" },
            { name: "Vi", phone: "199", url: "https://www.myvi.in/contact-us", color: "#f03655" },
            { name: "BSNL", phone: "1800-345-1503", url: "https://www.bsnl.co.in/complaint", color: "#0872ad" }
          ].map((s, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#f5f8fc",borderRadius:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:s.color}}/>
              <div style={{flex:1}}>
                <strong style={{fontSize:13}}>{s.name}</strong>
                <div style={{fontSize:11,color:"#66758c"}}>Toll-free: {s.phone}</div>
              </div>
              <button onClick={() => window.open(s.url, "_blank", "noopener,noreferrer")} style={{fontSize:11,color:"#0b74ff",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                Visit <ExternalLink size={10}/>
              </button>
            </div>
          ))}
        </div>
        <div style={{marginTop:12,fontSize:11,color:"#66758c"}}>
          Keyboard shortcuts: Ctrl+K (Search), Ctrl+D (Dark mode), Ctrl+L (My location)
        </div>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h2 style={{fontSize:18,letterSpacing:-0.5,marginBottom:10}}>Open source</h2>
        <p style={{fontSize:13,color:"#46546e",lineHeight:1.7}}>
          NetReach is built with Next.js, React, Leaflet, and TypeScript. All data comes from public sources.
          Contributions welcome — report bugs, suggest features, or submit a pull request on GitHub.
        </p>
      </div>
    </div>
  );
}
