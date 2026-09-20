"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  text: string;
  url?: string;
};

export default function ShareButton({ title, text, url }: Props) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={share} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,padding:"4px 8px",borderRadius:6,border:"1px solid #e1e8f1",background:"#fff",color:"#66758c",cursor:"pointer"}}>
      {copied ? <><Check size={12} color="#0b9a68"/> Copied!</> : <><Share2 size={12}/> Share</>}
    </button>
  );
}