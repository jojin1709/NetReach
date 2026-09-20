> [!NOTE]
> **NetReach is live and fully functional:** real tower data, speed tests, AI advisor, provider comparison, community measurements — all running in your browser with no login required.

<div align="center">

# NetReach

### Indian connectivity checker — find the best internet at your location.

It analyzes real tower data from OpenStreetMap, runs live speed tests, compares providers across India, and uses AI to recommend the best SIM and plan for your exact location. **Real data, not guesses.**

**This is a Progressive Web App: install it, use it offline, run it anywhere in India.**

<p><strong>Launch NetReach</strong></p>

```bash
git clone https://github.com/yourname/NetReach-Vercel-PWA.git
cd NetReach-Vercel-PWA
npm install && npm run dev
```

<sub>Open http://localhost:3000 and allow location access for the full experience.</sub>

---

</div>

> [!TIP]
> **Works offline:** NetReach caches tower data, speed test results, and app assets. Use it on slow connections or without internet after first load.

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [What is NetReach?](#what-is-netreach)
  - [Why NetReach Exists](#why-netreach-exists)
  - [Real Data, Not Fabrication](#real-data-not-fabrication)
- [NetReach in Action](#netreach-in-action)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Run Locally](#run-locally)
  - [Deploy to Vercel](#deploy-to-vercel)
- [Key Capabilities](#key-capabilities)
- [Features](#features)
- [Architecture](#architecture)
- [API Routes](#api-routes)
- [Data Sources](#data-sources)
- [PWA Features](#pwa-features)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Safety and Privacy](#safety-and-privacy)
- [License](#license)
- [Community and Support](#community-and-support)
- [Common Questions](#common-questions)
  - [Does NetReach sell my data?](#does-netreach-sell-my-data)
  - [Why is tower data sometimes slow?](#why-is-tower-data-sometimes-slow)
  - [Which providers are supported?](#which-providers-are-supported)
  - [Can I use NetReach offline?](#can-i-use-netreach-offline)
  - [How accurate is the speed test?](#how-accurate-is-the-speed-test)

---

## What is NetReach?

NetReach is a mobile-first Progressive Web App built for India. It helps you find the best internet option at your exact location by combining real tower data, live speed tests, provider coverage maps, and AI-powered recommendations.

NetReach pulls real cell tower locations from OpenStreetMap's Overpass API, geocodes your location via Nominatim, and runs actual speed tests against Cloudflare, OVH, Tele2, and ThinkBroadband servers. It then cross-references tower data with official provider coverage maps mandated by TRAI.

<a id="why-netreach-exists"></a>
<details>
<summary><strong>Why NetReach Exists</strong></summary>

India has 4 major mobile providers, hundreds of broadband plans, and coverage that varies block by block. Choosing the wrong SIM or plan costs you money and frustration every month.

Existing coverage checkers show generic maps. NetReach shows you the actual towers near you, runs real speed tests from your connection, and uses AI to recommend the best option based on your usage — streaming, gaming, budget, or work.

</details>

<a id="real-data-not-fabrication"></a>
<details>
<summary><strong>Real Data, Not Fabrication</strong></summary>

NetReach does **not** fabricate telecom availability, plan pricing, coverage polygons, or speed-test statistics. Every data point comes from a real source:

- **Tower locations:** OpenStreetMap Overpass API (real `telecom=tower` nodes)
- **Geocoding:** Nominatim (OpenStreetMap)
- **Speed tests:** Cloudflare, OVH, Tele2, ThinkBroadband servers
- **Provider coverage:** TRAI-mandated official coverage pages (Airtel, Jio, Vi, BSNL)
- **AI recommendations:** Groq API with Llama 3.1

Provider-specific availability and current plan data are clearly labelled and sourced from official pages.

</details>

## NetReach in Action

**Find towers near you:**
- Real `telecom=tower` nodes from OpenStreetMap
- Color-coded by provider (Airtel, Jio, Vi, BSNL, Other)
- Coverage circles showing estimated signal range

**Run speed tests:**
- Real download/upload measurements against global servers
- Latency testing
- History tracking with timestamps

**Compare providers:**
- Side-by-side comparison by use case (streaming, gaming, budget, rural, work)
- Signal strength, speed, coverage, and value scores
- Mobile plans, fiber, AirFiber, routers, and signal range data

**AI advisor:**
- Powered by Llama 3.1 via Groq API
- Asks about your usage, recommends best SIM + plan
- Analyzes real tower data for your exact location

## Quick Start

### Prerequisites

- **Node.js 18+**: required for the development server.
- **Modern browser**: Chrome, Firefox, Safari, or Edge (for geolocation and PWA features).
- **Location access**: optional but recommended for tower data and provider recommendations.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/yourname/NetReach-Vercel-PWA.git
cd NetReach-Vercel-PWA

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open http://localhost:3000 and allow location access when prompted.

### Deploy to Vercel

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Framework: **Next.js**.
4. Build command: `next build`.
5. Add environment variable: `GROQ_API_KEY` (for AI advisor).
6. Deploy.

No other environment variables are required. The app works without the Groq key (falls back to rule-based recommendations).

## Key Capabilities

- **Real tower data**: Pulls actual `telecom=tower` nodes from OpenStreetMap Overpass API — not fake or random data.
- **Live speed tests**: Real download/upload/latency measurements against Cloudflare, OVH, Tele2, and ThinkBroadband servers.
- **AI-powered recommendations**: Groq API with Llama 3.1 analyzes your location and usage to recommend the best SIM and plan.
- **Provider comparison**: Side-by-side comparison of Airtel, Jio, Vi, and BSNL by signal, speed, coverage, and value.
- **Coverage maps**: Leaflet maps with provider-colored tower markers and signal range circles.
- **No login required**: Everything works in your browser. No accounts, no tracking, no ads.
- **Offline support**: PWA with service worker caching. Works on slow connections or without internet.
- **Dark mode**: Full dark theme with localStorage persistence.
- **Mobile-first**: Responsive design with bottom navigation for one-handed use.
- **Community measurements**: Submit and view crowd-sourced speed test results.
- **Data export**: Export your speed tests, reviews, and saved locations as JSON.
- **Keyboard shortcuts**: Ctrl+K (search), Ctrl+D (dark mode), Ctrl+L (my location).

## Features

### Core Pages

| Page | Description |
|------|-------------|
| **Overview** | Map, provider scores, tower list, fiber checker |
| **Compare** | Side-by-side provider comparison (overview, mobile, fiber, routers, range) |
| **Plans** | Mobile recharge, fiber, AirFiber, routers/modems, signal range data |
| **Speed Test** | Real speed test with server picker, history tracking, provider detection |
| **Community** | Crowd-sourced speed submissions and provider reviews |
| **AI Advisor** | Groq AI-powered recommendations based on your location |
| **SIM Compare** | Visual side-by-side comparison tool by use case |
| **BharatNet** | Government rural broadband project data |
| **Analytics** | Charts and statistics from your measurements |
| **Saved Locations** | Save and revisit your favorite locations |
| **About** | Provider support links, data sources, keyboard shortcuts |

### Data Included

- **8-9 mobile recharge plans per provider** (₹99–₹3,399)
- **4 fiber plans** with speed and pricing
- **4 AirFiber plans** with speed and pricing
- **10+ WiFi routers/modems** (free to ₹3,499)
- **Mobile signal range data** (5G/4G/3G frequency, range km, coverage %)
- **4 providers**: Airtel, Jio, Vi, BSNL + local providers

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────┐  │
│  │  NetReachApp │  │   MapView    │  │ Charts │  │
│  │  (main shell)│  │  (Leaflet)   │  │(recharts│  │
│  └──────┬──────┘  └──────┬───────┘  └────────┘  │
│         │                │                       │
│  ┌──────┴────────────────┴──────────────────┐   │
│  │              API Routes                   │   │
│  │  /api/towers  /api/ai  /api/speed         │   │
│  │  /api/coverage  /api/feedback              │   │
│  └──────────────────┬───────────────────────┘   │
│                     │                           │
│  ┌──────────────────┴───────────────────────┐   │
│  │           External APIs                   │   │
│  │  Overpass API (towers)                    │   │
│  │  Nominatim (geocoding)                    │   │
│  │  Cloudflare (speed test)                  │   │
│  │  Groq API (AI advisor)                    │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/towers` | GET | Fetch real tower data from Overpass API |
| `/api/ai` | POST | AI advisor via Groq API (Llama 3.1) |
| `/api/speed` | POST | Store speed test results |
| `/api/coverage` | GET | Provider coverage data by location |
| `/api/feedback` | GET/POST | Community reviews and ratings |
| `/api/providers` | GET | Provider information and scores |

All API routes include:
- **Rate limiting**: 10 requests per minute per IP
- **Input validation**: Sanitized and type-checked
- **Error handling**: Graceful fallbacks

## Data Sources

| Data | Source | Method |
|------|--------|--------|
| Tower locations | OpenStreetMap | Overpass API (real `telecom=tower` nodes) |
| Geocoding | OpenStreetMap | Nominatim API |
| Speed tests | Cloudflare, OVH, Tele2, ThinkBroadband | Direct HTTP download/upload |
| AI recommendations | Groq | Llama 3.1 via Groq API |
| Provider coverage | TRAI-mandated pages | Links to official coverage checkers |
| Plans & pricing | Provider websites | Clearly labelled as sourced data (updated periodically from official sources) |

### Provider Coverage Map Links (TRAI-mandated)

- **Airtel**: https://www.airtel.in/wirelesscoverage/
- **Jio**: https://www.jio.com/selfcare/coverage-map/
- **Vi**: https://www.myvi.in/vicoverage/
- **BSNL**: https://www.trai.gov.in/consumer-info/mobile-coverage-map/service-providers

## PWA Features

- **manifest.webmanifest**: Full PWA manifest with icons
- **Service worker**: Caches app shell, API responses, map tiles
- **Install prompt**: "Add to Home Screen" banner
- **Offline support**: Works without internet after first load
- **Responsive**: Mobile-first with bottom navigation
- **Dark mode**: Full theme with localStorage persistence
- **Geolocation**: Browser API for real-time location

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search bar |
| `Ctrl+D` | Toggle dark mode |
| `Ctrl+L` | Use my current location |

## Safety and Privacy

- **No login required**: Everything works in your browser. No accounts, no tracking.
- **Location data**: Stored only in your browser (localStorage). Never sent to any server.
- **Speed test results**: Stored locally. Community submissions are anonymous.
- **AI advisor**: Queries are sent to Groq API. No personal data is stored.
- **Open source**: Full source code available. No hidden analytics or trackers.

## License

MIT License. Use it freely.

## Community and Support

- **Issues**: [Report bugs](https://github.com/yourname/NetReach-Vercel-PWA/issues)
- **Features**: [Suggest features](https://github.com/yourname/NetReach-Vercel-PWA/discussions)

Provider support links (toll-free numbers):

| Provider | Phone | Support |
|----------|-------|---------|
| Jio | 199 | [Contact](https://www.jio.com/selfcare/jio-care/contact-us) |
| Airtel | 121 | [Contact](https://www.airtel.in/contactUs) |
| Vi | 199 | [Contact](https://www.myvi.in/contact-us) |
| BSNL | 1800-345-1503 | [Contact](https://www.bsnl.co.in/complaint) |

## Common Questions

### Does NetReach sell my data?

No. NetReach stores everything locally in your browser. No accounts, no analytics, no tracking. The source code is fully open source.

### Why is tower data sometimes slow?

Tower data comes from OpenStreetMap's Overpass API, which can time out under heavy load. NetReach includes retry logic and falls back to alternative servers automatically.

### Which providers are supported?

Airtel, Jio, Vi (Vodafone Idea), and BSNL. Local providers are also shown when tower data is available.

### Can I use NetReach offline?

Yes. After the first load, NetReach caches the app shell, tower data, speed test results, and provider information. It works on slow connections or without internet.

### How accurate is the speed test?

Speed tests measure real download/upload/latency against global servers (Cloudflare, OVH, Tele2, ThinkBroadband). Results depend on your actual connection and server distance. Community submissions provide crowd-sourced accuracy.

---

**Built for India 🇮🇳** — Real data, not guesses.

---

**Developed by JOJIN JOHN** — [GitHub](https://github.com/jojin1709)
