"use client";

import { useState, useEffect } from "react";
import { MapPin, Trash2, Navigation, Star, Clock } from "lucide-react";
import { getStorage, setStorage } from "../lib/data";

type SavedLoc = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  savedAt: number;
};

type Props = {
  onSelect: (lat: number, lng: number, name: string) => void;
};

export default function SavedLocationsView({ onSelect }: Props) {
  const [locations, setLocations] = useState<SavedLoc[]>([]);

  useEffect(() => {
    setLocations(getStorage<SavedLoc[]>("netreach-saved-locations", []));
  }, []);

  const remove = (id: string) => {
    const updated = locations.filter(l => l.id !== id);
    setLocations(updated);
    setStorage("netreach-saved-locations", updated);
  };

  return (
    <div>
      <div className="eyebrow">Saved</div>
      <h1 style={{fontSize:28,letterSpacing:-1,margin:"4px 0 5px"}}>Saved locations</h1>
      <p style={{color:"#66758c",fontSize:13,marginBottom:18}}>Quick access to your frequently checked locations.</p>

      {locations.length === 0 ? (
        <div className="card card-pad" style={{textAlign:"center",padding:"32px 16px"}}>
          <MapPin size={32} color="#ccc" style={{margin:"0 auto 8px"}}/>
          <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>No saved locations</div>
          <div style={{fontSize:12,color:"#66758c"}}>Use the map view to save a location. Click the bookmark icon on any search result.</div>
        </div>
      ) : (
        <div style={{display:"grid",gap:8}}>
          {locations.map(loc => (
            <div key={loc.id} className="card card-pad" style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:8,background:"#0b74ff18",color:"#0b74ff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <MapPin size={16}/>
              </div>
              <div style={{flex:1}}>
                <strong style={{fontSize:13}}>{loc.name}</strong>
                <div style={{fontSize:11,color:"#66758c"}}>{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</div>
                <div style={{fontSize:10,color:"#999",display:"flex",alignItems:"center",gap:4}}>
                  <Clock size={10}/> Saved {new Date(loc.savedAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={() => onSelect(loc.lat, loc.lng, loc.name)} style={{padding:"6px 12px",fontSize:11,fontWeight:700,borderRadius:6,border:"1px solid #e1e8f1",background:"#0b74ff",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <Navigation size={12}/> View
                </button>
                <button onClick={() => remove(loc.id)} style={{padding:"6px 10px",fontSize:11,borderRadius:6,border:"1px solid #f5d0d0",background:"#fdf2f2",color:"#e55f5f",cursor:"pointer"}}>
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
