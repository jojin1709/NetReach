"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";
import { providers, getStorage, setStorage } from "../lib/data";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  timestamp: number;
  read: boolean;
};

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const stored = getStorage<Notification[]>("netreach-notifications", []);
    if (stored.length === 0) {
      const welcome: Notification = {
        id: "welcome",
        title: "Welcome to NetReach",
        message: "Check connectivity options at any location in India. Submit speed tests to help the community!",
        type: "info",
        timestamp: Date.now(),
        read: false
      };
      const tips: Notification = {
        id: "tips",
        title: "Pro tip",
        message: "Save your frequently checked locations for quick access later.",
        type: "info",
        timestamp: Date.now() - 1000,
        read: false
      };
      setNotifications([welcome, tips]);
      setStorage("netreach-notifications", [welcome, tips]);
    } else {
      setNotifications(stored);
    }
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    setStorage("netreach-notifications", updated);
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setStorage("netreach-notifications", updated);
  };

  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setShowPanel(!showPanel)} style={{position:"relative",width:38,height:38,border:"1px solid #e1e8f1",background:"#fff",borderRadius:11,display:"grid",placeItems:"center",color:"#52647b",cursor:"pointer"}} aria-label="Notifications">
        <Bell size={16}/>
        {unread > 0 && <span style={{position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:"50%",background:"#e55f5f",color:"#fff",fontSize:10,fontWeight:700,display:"grid",placeItems:"center"}}>{unread}</span>}
      </button>
      {showPanel && (
        <div style={{position:"absolute",top:46,right:0,width:320,maxHeight:400,overflowY:"auto",background:"#fff",borderRadius:12,boxShadow:"0 8px 30px rgba(0,0,0,.12)",border:"1px solid #e1e8f1",zIndex:100}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderBottom:"1px solid #e1e8f1"}}>
            <strong style={{fontSize:14}}>Notifications</strong>
            {unread > 0 && <button onClick={markAllRead} style={{fontSize:11,color:"#0b74ff",background:"none",border:"none",cursor:"pointer"}}>Mark all read</button>}
          </div>
          {notifications.length === 0 ? (
            <div style={{padding:24,textAlign:"center",fontSize:12,color:"#66758c"}}>No notifications yet.</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} onClick={()=>markRead(n.id)} style={{padding:"10px 14px",borderBottom:"1px solid #f0f3f8",cursor:"pointer",background:n.read?"#fff":"#f8faff"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  {n.type==="success" ? <Check size={12} color="#0b9a68"/> : <Bell size={12} color="#0b74ff"/>}
                  <strong style={{fontSize:12,flex:1}}>{n.title}</strong>
                  {!n.read && <span style={{width:6,height:6,borderRadius:"50%",background:"#0b74ff"}}/>}
                </div>
                <div style={{fontSize:11,color:"#66758c"}}>{n.message}</div>
                <div style={{fontSize:10,color:"#999",marginTop:4}}>{new Date(n.timestamp).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
