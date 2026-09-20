import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetReach — Indian Connectivity Checker",
  description: "Find the best internet options at your exact location in India. Compare Jio, Airtel, Vi, BSNL coverage, plans, and speed. Community-powered data.",
  keywords: ["india", "internet", "broadband", "coverage", "jio", "airtel", "vi", "bsnl", "fiber", "speed test", "connectivity", "TRAI", "BharatNet"],
  authors: [{ name: "NetReach" }],
  creator: "NetReach",
  publisher: "NetReach",
  applicationName: "NetReach",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://netreach.app",
    title: "NetReach — Indian Connectivity Checker",
    description: "Find the best internet options at your exact location in India.",
    siteName: "NetReach"
  },
  twitter: {
    card: "summary_large_image",
    title: "NetReach — Indian Connectivity Checker",
    description: "Find the best internet options at your exact location in India."
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://netreach.app" }
};

export const viewport: Viewport = {
  themeColor: "#0b74ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml"/>
        <link rel="apple-touch-icon" href="/icon.svg"/>
        <meta name="theme-color" content="#0b74ff"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="msapplication-TileColor" content="#0b74ff"/>
        <meta name="msapplication-tap-highlight" content="no"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
