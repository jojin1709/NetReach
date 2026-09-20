import { NextResponse } from "next/server";
import { providers, coverageData } from "../../../lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("provider");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const results = providers.map(p => ({
    id: p.id,
    name: p.name,
    technologies: p.technologies,
    coverage: coverageData[p.id] || null,
    available: true,
    estimatedSpeed: p.speedAvg,
    plans: p.plans.length
  }));

  let filtered = results;
  if (providerId) filtered = results.filter(r => r.id === providerId);

  return NextResponse.json({
    location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null,
    providers: filtered,
    total: filtered.length,
    note: "Coverage data is approximate. Check official provider maps for exact coverage."
  });
}
