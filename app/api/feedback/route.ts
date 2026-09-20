import { NextResponse } from "next/server";

let feedbackEntries: Array<{id:string;provider:string;rating:number;comment:string;location:string;timestamp:number}> = [];

export async function GET() {
  return NextResponse.json({ entries: feedbackEntries, total: feedbackEntries.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const entry = {
    id: Date.now().toString(),
    provider: body.provider || "unknown",
    rating: Number(body.rating) || 5,
    comment: body.comment || "",
    location: body.location || "Unknown",
    timestamp: Date.now()
  };
  feedbackEntries = [entry, ...feedbackEntries].slice(0, 200);
  return NextResponse.json({ success: true, entry });
}
