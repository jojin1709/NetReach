import { NextResponse } from "next/server";

let speedResults: Array<{id:string;provider:string;download:number;upload:number;latency:number;location:string;timestamp:number}> = [];

export async function GET() {
  return NextResponse.json({ results: speedResults, total: speedResults.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const download = Number(body.download);
  const upload = Number(body.upload);
  const latency = Number(body.latency);
  const location = typeof body.location === "string" ? body.location.slice(0, 100) : "Unknown";
  const provider = typeof body.provider === "string" ? body.provider.slice(0, 20) : "unknown";
  
  if (isNaN(download) || download < 0 || download > 10000) {
    return NextResponse.json({ error: "Invalid download speed" }, { status: 400 });
  }

  const entry = {
    id: Date.now().toString(),
    provider,
    download,
    upload: isNaN(upload) ? 0 : upload,
    latency: isNaN(latency) ? 0 : latency,
    location,
    timestamp: Date.now()
  };
  speedResults = [entry, ...speedResults].slice(0, 200);
  return NextResponse.json({ success: true, result: entry });
}
