import { NextResponse } from "next/server";
import { providers, coverageData, modems, mobileRanges } from "../../../lib/data";

export async function GET() {
  const data = providers.map(p => ({
    ...p,
    coverage: coverageData[p.id] || null,
    modems: modems.filter(m => m.provider === p.id),
    mobileRanges: mobileRanges.filter(r => r.provider === p.id)
  }));
  return NextResponse.json({ providers: data, total: data.length });
}
