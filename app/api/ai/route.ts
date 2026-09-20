import { NextResponse } from "next/server";

const GROQ_KEY = process.env.GROQ_API_KEY;

export async function POST(request: Request) {
  if (!GROQ_KEY) {
    return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
  }

  try {
    // Simple rate limiting - 10 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const rateKey = `rate-${ip}`;
    // In-memory rate limit (resets on server restart)
    if (!(globalThis as any)._rateLimits) (globalThis as any)._rateLimits = {};
    const limits = (globalThis as any)._rateLimits;
    if (!limits[rateKey]) limits[rateKey] = [];
    limits[rateKey] = limits[rateKey].filter((t: number) => now - t < 60000);
    if (limits[rateKey].length >= 10) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
    }
    limits[rateKey].push(now);

    const { message, location, towers, history } = await request.json();
    if (!message || typeof message !== "string" || message.length > 500) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const towerStats: Record<string, number> = {};
    (towers || []).forEach((t: any) => { towerStats[t.provider] = (towerStats[t.provider] || 0) + 1; });

    const systemPrompt = "You are NetReach AI, an expert Indian telecom advisor. You help users find the best SIM card, mobile plan, fiber broadband, and router for their exact location in India. Current location: " + (location?.label || "India") + " (" + (location?.lat?.toFixed(4) || "?") + ", " + (location?.lng?.toFixed(4) || "?") + "). Nearby towers: " + JSON.stringify(towerStats) + ". Total towers found: " + (towers?.length || 0) + ". Providers: Jio, Airtel, Vi, BSNL. Give specific advice with prices in Rs. Recommend the BEST provider for their location. Mention plan names and prices. Include offers. Be concise (2-4 paragraphs). Use **bold** for emphasis. For fiber mention JioFiber, Airtel Xstream, BSNL BharatFiber. Never make up prices. Always end with a clear recommendation.";

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-6).map((h: any) => ({ role: h.role === "ai" ? "assistant" : "user", content: h.content })),
      { role: "user", content: message }
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Groq API error: " + err }, { status: res.status });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
