import { NextResponse } from "next/server";
import { providers, modems, mobileRanges } from "../../../lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const type = searchParams.get("type");
  
  const validProviders = ["jio", "airtel", "vi", "bsnl"];
  const validTypes = ["mobile", "fiber", "airfiber"];
  
  let plans = providers.flatMap(p => p.plans);
  if (provider && validProviders.includes(provider)) plans = plans.filter(p => p.provider === provider);
  if (type && validTypes.includes(type)) plans = plans.filter(p => p.type === type);

  let filteredModems = modems;
  if (provider && validProviders.includes(provider)) filteredModems = modems.filter(m => m.provider === provider);

  let filteredRanges = mobileRanges;
  if (provider && validProviders.includes(provider)) filteredRanges = mobileRanges.filter(r => r.provider === provider);

  return NextResponse.json({
    plans,
    modems: filteredModems,
    mobileRanges: filteredRanges,
    totals: { plans: plans.length, modems: filteredModems.length, ranges: filteredRanges.length }
  });
}
