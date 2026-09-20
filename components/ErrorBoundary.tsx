"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{padding:32,textAlign:"center",background:"#fdf2f2",borderRadius:12,border:"1px solid #f5d0d0",margin:16}}>
          <AlertTriangle size={32} color="#e55f5f" style={{margin:"0 auto 12px"}}/>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:8,color:"#e55f5f"}}>Something went wrong</h3>
          <p style={{fontSize:12,color:"#666",marginBottom:12}}>{this.state.error?.message || "An unexpected error occurred."}</p>
          <button onClick={()=>this.setState({hasError:false,error:null})} style={{padding:"8px 16px",fontSize:12,fontWeight:600,borderRadius:8,border:"1px solid #e1e8f1",background:"#fff",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
            <RefreshCw size={14}/> Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
