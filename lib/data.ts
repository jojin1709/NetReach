export type Plan = {
  id: string;
  provider: string;
  name: string;
  type: "home_broadband" | "airfiber" | "mobile" | "fiber";
  speed: string;
  price: number;
  validity: string;
  data: string;
  features: string[];
};

export type ProviderInfo = {
  id: string;
  name: string;
  color: string;
  logo: string;
  website: string;
  support: string;
  supportPhone: string;
  coverageUrl: string;
  plans: Plan[];
  technologies: string[];
  rating: number;
  speedAvg: number;
  coverageScore: number;
};

export type SpeedMeasurement = {
  id: string;
  provider: string;
  download: number;
  upload: number;
  latency: number;
  location: string;
  timestamp: number;
  device: string;
};

export type FeedbackEntry = {
  id: string;
  provider: string;
  rating: number;
  comment: string;
  location: string;
  timestamp: number;
};

export type Modem = {
  id: string;
  provider: string;
  name: string;
  type: "router" | "ont" | "mesh" | "extender";
  price: number;
  features: string[];
  speed: string;
  wifi: string;
};

export type MobileRange = {
  provider: string;
  generation: string;
  frequency: string;
  rangeKm: number;
  indoorPenetration: string;
  speed: string;
  coveragePercent: number;
};

export const providers: ProviderInfo[] = [
  {
    id: "jio",
    name: "Jio",
    color: "#1767d5",
    logo: "JIO",
    website: "https://www.jio.com",
    support: "https://www.jio.com/selfcare/jio-care/contact-us",
    supportPhone: "199",
    coverageUrl: "https://www.jio.com/selfcare/coverage-map/",
    technologies: ["Fiber", "AirFiber", "4G", "5G"],
    rating: 4.2,
    speedAvg: 214,
    coverageScore: 95,
    plans: [
      { id: "jio-fiber-399", provider: "jio", name: "JioFiber 399", type: "fiber", speed: "30 Mbps", price: 399, validity: "30 days", data: "Unlimited (Fair Usage 1200GB)", features: ["Free OTT Apps", "Free Voice Calls", "Wi-Fi 6 Router"] },
      { id: "jio-fiber-699", provider: "jio", name: "JioFiber 699", type: "fiber", speed: "100 Mbps", price: 699, validity: "30 days", data: "Unlimited (Fair Usage 2400GB)", features: ["Free OTT Apps", "Free Voice Calls", "Wi-Fi 6 Router", "TV Video Calling"] },
      { id: "jio-fiber-999", provider: "jio", name: "JioFiber 999", type: "fiber", speed: "150 Mbps", price: 999, validity: "30 days", data: "Unlimited (Fair Usage 3600GB)", features: ["14 OTT Apps", "Free Voice Calls", "Wi-Fi 6 Router", "TV Video Calling"] },
      { id: "jio-fiber-1499", provider: "jio", name: "JioFiber 1499", type: "fiber", speed: "300 Mbps", price: 1499, validity: "30 days", data: "Unlimited (Fair Usage 5000GB)", features: ["15 OTT Apps", "Free Voice Calls", "Wi-Fi 6 Router", "TV Video Calling"] },
      { id: "jio-airfiber-399", provider: "jio", name: "JioAirFiber 399", type: "airfiber", speed: "30 Mbps", price: 399, validity: "30 days", data: "Unlimited", features: ["No installation needed", "Portable", "5G Ready"] },
      { id: "jio-airfiber-699", provider: "jio", name: "JioAirFiber 699", type: "airfiber", speed: "100 Mbps", price: 699, validity: "30 days", data: "Unlimited", features: ["No installation needed", "Portable", "5G Ready", "OTT Apps"] },
      { id: "jio-mobile-179", provider: "jio", name: "Jio 179", type: "mobile", speed: "4G/5G", price: 179, validity: "24 days", data: "1GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "jio-mobile-199", provider: "jio", name: "Jio 199", type: "mobile", speed: "4G/5G", price: 199, validity: "28 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "JioTV, JioCinema"] },
      { id: "jio-mobile-239", provider: "jio", name: "Jio Unlimited 239", type: "mobile", speed: "5G/4G", price: 239, validity: "28 days", data: "2GB/day + unlimited 5G", features: ["Unlimited Calls", "100 SMS/day", "JioTV, JioCinema"] },
      { id: "jio-mobile-299", provider: "jio", name: "Jio Unlimited 299", type: "mobile", speed: "5G/4G", price: 299, validity: "28 days", data: "2GB/day + unlimited 5G", features: ["Unlimited Calls", "100 SMS/day", "JioCloud"] },
      { id: "jio-mobile-349", provider: "jio", name: "Jio 349", type: "mobile", speed: "5G/4G", price: 349, validity: "30 days", data: "2.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "Jio Apps"] },
      { id: "jio-mobile-399", provider: "jio", name: "Jio 399", type: "mobile", speed: "5G/4G", price: 399, validity: "56 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "jio-mobile-599", provider: "jio", name: "Jio 599", type: "mobile", speed: "5G/4G", price: 599, validity: "84 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "jio-mobile-2899", provider: "jio", name: "Jio 2899", type: "mobile", speed: "5G/4G", price: 2899, validity: "365 days", data: "2.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "Jio Apps", "Disney+ Hotstar"] },
    ]
  },
  {
    id: "airtel",
    name: "Airtel",
    color: "#e51f3d",
    logo: "AIR",
    website: "https://www.airtel.in",
    support: "https://www.airtel.in/contactUs",
    supportPhone: "121",
    coverageUrl: "https://www.airtel.in/wirelesscoverage/",
    technologies: ["Fiber", "AirFiber", "4G", "5G"],
    rating: 4.1,
    speedAvg: 186,
    coverageScore: 92,
    plans: [
      { id: "airtel-fiber-499", provider: "airtel", name: "Airtel Xstream 499", type: "fiber", speed: "40 Mbps", price: 499, validity: "30 days", data: "Unlimited (Fair Usage 1500GB)", features: ["Airtel Xstream Premium", "Free Voice Calls", "Wi-Fi Router"] },
      { id: "airtel-fiber-799", provider: "airtel", name: "Airtel Xstream 799", type: "fiber", speed: "100 Mbps", price: 799, validity: "30 days", data: "Unlimited (Fair Usage 2000GB)", features: ["Airtel Xstream Premium", "Free Voice Calls", "Wi-Fi 6 Router", "Amazon Prime"] },
      { id: "airtel-fiber-999", provider: "airtel", name: "Airtel Xstream 999", type: "fiber", speed: "200 Mbps", price: 999, validity: "30 days", data: "Unlimited (Fair Usage 3000GB)", features: ["All OTT Apps", "Free Voice Calls", "Wi-Fi 6 Router", "Amazon Prime", "Disney+ Hotstar"] },
      { id: "airtel-fiber-1499", provider: "airtel", name: "Airtel Xstream 1499", type: "fiber", speed: "300 Mbps", price: 1499, validity: "30 days", data: "Unlimited (Fair Usage 5000GB)", features: ["All OTT Apps", "Free Voice Calls", "Wi-Fi 6 Router", "Priority Support"] },
      { id: "airtel-mobile-179", provider: "airtel", name: "Airtel 179", type: "mobile", speed: "4G/5G", price: 179, validity: "24 days", data: "1GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "airtel-mobile-199", provider: "airtel", name: "Airtel Unlimited 199", type: "mobile", speed: "5G/4G", price: 199, validity: "28 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "Airtel Xstream"] },
      { id: "airtel-mobile-239", provider: "airtel", name: "Airtel 239", type: "mobile", speed: "5G/4G", price: 239, validity: "28 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day", "Airtel Xstream"] },
      { id: "airtel-mobile-299", provider: "airtel", name: "Airtel Unlimited 299", type: "mobile", speed: "5G/4G", price: 299, validity: "28 days", data: "2GB/day + unlimited 5G", features: ["Unlimited Calls", "100 SMS/day", "Disney+ Hotstar Mobile"] },
      { id: "airtel-mobile-349", provider: "airtel", name: "Airtel 349", type: "mobile", speed: "5G/4G", price: 349, validity: "30 days", data: "2.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "Hotstar"] },
      { id: "airtel-mobile-399", provider: "airtel", name: "Airtel 399", type: "mobile", speed: "5G/4G", price: 399, validity: "56 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "airtel-mobile-599", provider: "airtel", name: "Airtel 599", type: "mobile", speed: "5G/4G", price: 599, validity: "84 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day", "Hotstar"] },
      { id: "airtel-mobile-3399", provider: "airtel", name: "Airtel 3399", type: "mobile", speed: "5G/4G", price: 3399, validity: "365 days", data: "2.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "Hotstar", "Amazon Prime"] },
    ]
  },
  {
    id: "vi",
    name: "Vi",
    color: "#f03655",
    logo: "VI",
    website: "https://www.myvi.in",
    support: "https://www.myvi.in/contact-us",
    supportPhone: "199",
    coverageUrl: "https://www.myvi.in/vicoverage/",
    technologies: ["4G", "5G"],
    rating: 3.5,
    speedAvg: 72,
    coverageScore: 78,
    plans: [
      { id: "vi-mobile-149", provider: "vi", name: "Vi 149", type: "mobile", speed: "4G", price: 149, validity: "14 days", data: "1GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "vi-mobile-179", provider: "vi", name: "Vi 179", type: "mobile", speed: "4G/5G", price: 179, validity: "28 days", data: "0.5GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "vi-mobile-199", provider: "vi", name: "Vi Unlimited 199", type: "mobile", speed: "4G/5G", price: 199, validity: "28 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "Vi Movies & TV"] },
      { id: "vi-mobile-299", provider: "vi", name: "Vi Unlimited 299", type: "mobile", speed: "4G/5G", price: 299, validity: "28 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day", "Vi Movies & TV", "Binge All Night"] },
      { id: "vi-mobile-399", provider: "vi", name: "Vi 399", type: "mobile", speed: "4G/5G", price: 399, validity: "56 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "vi-mobile-449", provider: "vi", name: "Vi Unlimited 449", type: "mobile", speed: "4G/5G", price: 449, validity: "56 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day", "Vi Movies & TV"] },
      { id: "vi-mobile-599", provider: "vi", name: "Vi 599", type: "mobile", speed: "4G/5G", price: 599, validity: "84 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "vi-mobile-1799", provider: "vi", name: "Vi 1799", type: "mobile", speed: "4G/5G", price: 1799, validity: "365 days", data: "1.5GB/day", features: ["Unlimited Calls", "100 SMS/day", "Vi Movies & TV"] },
    ]
  },
  {
    id: "bsnl",
    name: "BSNL",
    color: "#0872ad",
    logo: "BSN",
    website: "https://www.bsnl.co.in",
    support: "https://www.bsnl.co.in/complaint",
    supportPhone: "1800-345-1503",
    coverageUrl: "https://www.trai.gov.in/consumer-info/mobile-coverage-map/service-providers",
    technologies: ["4G", "Fiber"],
    rating: 3.2,
    speedAvg: 38,
    coverageScore: 85,
    plans: [
      { id: "bsnl-fiber-329", provider: "bsnl", name: "BSNL Bharat Fiber 329", type: "fiber", speed: "30 Mbps", price: 329, validity: "30 days", data: "Unlimited", features: ["Free Voice Calls", "Basic OTT"] },
      { id: "bsnl-fiber-499", provider: "bsnl", name: "BSNL Bharat Fiber 499", type: "fiber", speed: "60 Mbps", price: 499, validity: "30 days", data: "Unlimited", features: ["Free Voice Calls", "OTT Apps", "Wi-Fi Router"] },
      { id: "bsnl-fiber-799", provider: "bsnl", name: "BSNL Bharat Fiber 799", type: "fiber", speed: "100 Mbps", price: 799, validity: "30 days", data: "Unlimited", features: ["Free Voice Calls", "All OTT Apps", "Wi-Fi 6 Router"] },
      { id: "bsnl-mobile-99", provider: "bsnl", name: "BSNL 99", type: "mobile", speed: "4G", price: 99, validity: "22 days", data: "Unlimited (1GB/day high speed)", features: ["Unlimited Calls", "BSNL Tunes"] },
      { id: "bsnl-mobile-107", provider: "bsnl", name: "BSNL 107", type: "mobile", speed: "4G", price: 107, validity: "35 days", data: "2GB total", features: ["Unlimited Calls", "Free PRBT"] },
      { id: "bsnl-mobile-187", provider: "bsnl", name: "BSNL 187", type: "mobile", speed: "4G", price: 187, validity: "28 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "bsnl-mobile-247", provider: "bsnl", name: "BSNL 247", type: "mobile", speed: "4G", price: 247, validity: "30 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day", "Free PRBT"] },
      { id: "bsnl-mobile-349", provider: "bsnl", name: "BSNL 349", type: "mobile", speed: "4G", price: 349, validity: "56 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day"] },
      { id: "bsnl-mobile-599", provider: "bsnl", name: "BSNL 599", type: "mobile", speed: "4G", price: 599, validity: "84 days", data: "2GB/day", features: ["Unlimited Calls", "100 SMS/day", "Free PRBT"] },
    ]
  }
];

export const coverageData: Record<string, { cities: string[]; states: string[]; ruralCoverage: number; urbanCoverage: number }> = {
  jio: { cities: ["All 28 state capitals", "All 7 UTs", "700+ districts", "6000+ towns"], states: ["All 28 states + 7 UTs"], ruralCoverage: 85, urbanCoverage: 98 },
  airtel: { cities: ["All 28 state capitals", "All 7 UTs", "650+ districts", "5500+ towns"], states: ["All 28 states + 7 UTs"], ruralCoverage: 80, urbanCoverage: 96 },
  vi: { cities: ["22 state capitals", "All 7 UTs", "400+ districts", "3000+ towns"], states: ["Most states"], ruralCoverage: 60, urbanCoverage: 88 },
  bsnl: { cities: ["All 28 state capitals", "All 7 UTs", "600+ districts", "5000+ towns"], states: ["All 28 states + 7 UTs"], ruralCoverage: 75, urbanCoverage: 85 }
};

export const bharatNetData = {
  totalGPs: 250000,
  connectedGPs: 195000,
  states: [
    { name: "Kerala", connected: 95, total: 3500 },
    { name: "Tamil Nadu", connected: 88, total: 3200 },
    { name: "Karnataka", connected: 82, total: 3800 },
    { name: "Andhra Pradesh", connected: 78, total: 4200 },
    { name: "Maharashtra", connected: 75, total: 5100 },
    { name: "Gujarat", connected: 72, total: 3400 },
    { name: "Rajasthan", connected: 68, total: 4800 },
    { name: "Madhya Pradesh", connected: 65, total: 4500 },
    { name: "Uttar Pradesh", connected: 60, total: 8200 },
    { name: "West Bengal", connected: 58, total: 3600 }
  ]
};

export const modems: Modem[] = [
  { id: "jio-router-1", provider: "jio", name: "JioFiber Home Gateway", type: "router", price: 0, features: ["Dual Band", "4 Ethernet Ports", "USB Port", "VoIP"], speed: "Up to 1 Gbps", wifi: "Wi-Fi 6" },
  { id: "jio-router-2", provider: "jio", name: "JioAirFiber Home Router", type: "router", price: 2999, features: ["5G Ready", "Dual Band", "4 Ethernet Ports", "Plug & Play"], speed: "Up to 1 Gbps", wifi: "Wi-Fi 6" },
  { id: "jio-mesh-1", provider: "jio", name: "Jio Mesh Extender", type: "mesh", price: 1999, features: ["Seamless Roaming", "Easy Setup", "Dual Band"], speed: "Up to 866 Mbps", wifi: "Wi-Fi 5" },
  { id: "airtel-router-1", provider: "airtel", name: "Airtel Xstream Fiber Router", type: "router", price: 0, features: ["Dual Band", "4 Ethernet Ports", "VoIP", "IPTV"], speed: "Up to 1 Gbps", wifi: "Wi-Fi 6" },
  { id: "airtel-router-2", provider: "airtel", name: "Airtel Black Router", type: "router", price: 3499, features: ["5G Ready", "Tri Band", "8 Ethernet Ports", "VPN"], speed: "Up to 2 Gbps", wifi: "Wi-Fi 6E" },
  { id: "airtel-ext-1", provider: "airtel", name: "Airtel Wi-Fi Extender", type: "extender", price: 1499, features: ["Plug & Play", "Dual Band", "OneMesh Compatible"], speed: "Up to 300 Mbps", wifi: "Wi-Fi 5" },
  { id: "vi-router-1", provider: "vi", name: "Vi Gigafiber Router", type: "router", price: 0, features: ["Dual Band", "4 Ethernet Ports", "VoIP"], speed: "Up to 1 Gbps", wifi: "Wi-Fi 5" },
  { id: "bsnl-router-1", provider: "bsnl", name: "BSNL BharatFiber ONT", type: "ont", price: 0, features: ["Single Band", "2 Ethernet Ports", "Basic"], speed: "Up to 100 Mbps", wifi: "Wi-Fi 4" },
  { id: "bsnl-router-2", provider: "bsnl", name: "BSNL Fiber Router", type: "router", price: 1999, features: ["Dual Band", "4 Ethernet Ports", "VoIP"], speed: "Up to 1 Gbps", wifi: "Wi-Fi 5" },
];

export const mobileRanges: MobileRange[] = [
  { provider: "jio", generation: "5G NR", frequency: "3500 MHz (n78)", rangeKm: 1.5, indoorPenetration: "Moderate", speed: "500-1000 Mbps", coveragePercent: 72 },
  { provider: "jio", generation: "4G LTE", frequency: "1800/2300 MHz", rangeKm: 3, indoorPenetration: "Good", speed: "30-150 Mbps", coveragePercent: 98 },
  { provider: "jio", generation: "3G", frequency: "2100 MHz", rangeKm: 5, indoorPenetration: "Very Good", speed: "1-10 Mbps", coveragePercent: 85 },
  { provider: "airtel", generation: "5G NR", frequency: "3500 MHz (n78)", rangeKm: 1.5, indoorPenetration: "Moderate", speed: "400-900 Mbps", coveragePercent: 68 },
  { provider: "airtel", generation: "4G LTE", frequency: "900/1800/2300 MHz", rangeKm: 3.5, indoorPenetration: "Good", speed: "25-120 Mbps", coveragePercent: 96 },
  { provider: "airtel", generation: "3G", frequency: "2100 MHz", rangeKm: 5, indoorPenetration: "Very Good", speed: "1-8 Mbps", coveragePercent: 80 },
  { provider: "vi", generation: "5G NR", frequency: "3500 MHz (n78)", rangeKm: 1.5, indoorPenetration: "Moderate", speed: "300-800 Mbps", coveragePercent: 45 },
  { provider: "vi", generation: "4G LTE", frequency: "900/1800/2100 MHz", rangeKm: 3.5, indoorPenetration: "Good", speed: "20-80 Mbps", coveragePercent: 88 },
  { provider: "vi", generation: "3G", frequency: "2100 MHz", rangeKm: 5, indoorPenetration: "Very Good", speed: "1-7 Mbps", coveragePercent: 65 },
  { provider: "bsnl", generation: "4G LTE", frequency: "900/1800 MHz", rangeKm: 4, indoorPenetration: "Very Good", speed: "15-60 Mbps", coveragePercent: 75 },
  { provider: "bsnl", generation: "3G", frequency: "900/2100 MHz", rangeKm: 5, indoorPenetration: "Excellent", speed: "1-5 Mbps", coveragePercent: 85 },
];

export const supportedCities = [
  { name: "Thrissur", state: "Kerala", lat: 10.5276, lng: 76.2144 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Kozhikode", state: "Kerala", lat: 11.2588, lng: 75.7804 },
  { name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 }
];

export function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch { return fallback; }
}

export function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
