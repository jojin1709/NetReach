import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "10.5276");
  const lng = parseFloat(searchParams.get("lng") || "76.2144");
  const pad = 0.03;

  try {
    const query = `[out:json][timeout:20];(node["telecom"="tower"](${lat-pad},${lng-pad},${lat+pad},${lng+pad});node["man_made"="communications_tower"](${lat-pad},${lng-pad},${lat+pad},${lng+pad}););out body;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    if (!res.ok) return NextResponse.json({ towers: [], error: "Overpass API error" });
    const data = await res.json();
    const towers = (data.elements || []).map((el: any) => {
      const tags = el.tags || {};
      const operator = (tags.operator || tags["operator:mobile"] || tags.network || "").toLowerCase();
      let provider = "local";
      if (operator.includes("airtel")) provider = "airtel";
      else if (operator.includes("jio") || operator.includes("reliance")) provider = "jio";
      else if (operator.includes("vodafone") || operator.includes("idea")) provider = "vi";
      else if (operator.includes("bsnl")) provider = "bsnl";
      return { id: el.id, provider, lat: el.lat, lng: el.lon, tags };
    });
    return NextResponse.json({ towers, total: towers.length });
  } catch {
    return NextResponse.json({ towers: [], error: "Failed to fetch tower data" });
  }
}
