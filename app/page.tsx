"use client";

import dynamic from "next/dynamic";

const NetReachApp = dynamic(() => import("../components/NetReachApp"), { ssr: false });
const ErrorBoundary = dynamic(() => import("../components/ErrorBoundary"), { ssr: false });

export default function Home() {
  return (
    <ErrorBoundary>
      <NetReachApp />
    </ErrorBoundary>
  );
}
