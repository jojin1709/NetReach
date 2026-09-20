import { NextResponse } from "next/server";

const OPENCELLID_KEY = process.env.OPENCELLID_API_KEY || "";

function classifyProvider(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("airtel")) return "airtel";
  if (n.includes("jio") || n.includes("reliance")) return "jio";
  if (n.includes("vodafone") || n.includes("idea")) return "vi";
  if (n.includes("bsnl")) return "bsnl";
  return "local";
}

async function fetchOverpass(lat: number, lng: number, pad: number) {
  const query = `[out:json][timeout:15];(node["telecom"="tower"](${lat-pad},${lng-pad},${lat+pad},${lng+pad});node["man_made"="communications_tower"](${lat-pad},${lng-pad},${lat+pad},${lng+pad}););out body;`;
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) {
        const data = await res.json();
        return (data.elements || []).map((el: any) => {
          const tags = el.tags || {};
          const operator = (tags.operator || tags["operator:mobile"] || tags.network || "").toLowerCase();
          return { id: String(el.id), provider: classifyProvider(operator), lat: el.lat, lng: el.lon, source: "overpass" };
        });
      }
    } catch { continue; }
  }
  return null;
}

async function fetchOpenCellID(lat: number, lng: number) {
  if (!OPENCELLID_KEY) return null;
  try {
    const url = `https://opencellid.org/api/cell/getInArea?key=${OPENCELLID_KEY}&lat=${lat}&lon=${lng}&distance=3000&limit=100&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.records) return null;
    const seen = new Set();
    return data.records
      .filter((r: any) => {
        const key = `${r.lat},${r.lon}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((r: any, i: number) => {
        const mcc = String(r.mcc || "");
        const mnc = String(r.mnc || "");
        let provider = "local";
        if (mcc === "404" || mcc === "405") {
          if (["10","11","12","14","15","16","17","18","19","20","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99"].includes(mnc)) provider = "airtel";
          else if (["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66"].includes(mnc)) provider = "jio";
          else if (["11","12","13","14","15","16","17","18","19","20","99"].includes(mnc)) provider = "vi";
          else if (["1","2","3","4","5","7","9","10","11","12","13","14","15","16","17","18","19","20"].includes(mnc)) provider = "bsnl";
        }
        return { id: `ocd-${i}`, provider, lat: r.lat, lng: r.lon, source: "opencellid" };
      });
  } catch { return null; }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "10.5276");
  const lng = parseFloat(searchParams.get("lng") || "76.2144");
  const pad = 0.03;

  // Try Overpass first
  const overpassResults = await fetchOverpass(lat, lng, pad);
  if (overpassResults && overpassResults.length > 0) {
    return NextResponse.json({ towers: overpassResults, total: overpassResults.length, source: "overpass" });
  }

  // Fallback to OpenCelliD
  const opencellidResults = await fetchOpenCellID(lat, lng);
  if (opencellidResults && opencellidResults.length > 0) {
    return NextResponse.json({ towers: opencellidResults, total: opencellidResults.length, source: "opencellid" });
  }

  return NextResponse.json({ towers: [], total: 0, source: "none" });
}
