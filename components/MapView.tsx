/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type Tower = {
  id: string;
  provider: string;
  type: "mobile" | "fiber" | "airfiber";
  tech: string;
  lat: number;
  lng: number;
  radius: number;
};

type Props = {
  lat: number;
  lng: number;
  label: string;
  towers: Tower[];
  activeFilter: string;
};

const providerColors: Record<string, string> = {
  airtel: "#e51f3d",
  jio: "#1767d5",
  vi: "#f03655",
  bsnl: "#0872ad",
  local: "#888888"
};

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 13); }, [lat, lng, map]);
  return null;
}

function TowerMarker({ tower }: { tower: Tower }) {
  const color = providerColors[tower.provider] || "#888";
  const markerSize = tower.tech.includes("5G") ? 8 : tower.tech.includes("4G") ? 7 : 6;
  const label = tower.provider === "local" ? "Unknown Provider" : tower.provider.toUpperCase();

  return (
    <>
      <Circle
        center={[tower.lat, tower.lng]}
        radius={tower.radius}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.2,
          weight: 2,
          opacity: 0.5
        }}
      >
        <Popup>
          <div style={{fontSize:12,lineHeight:1.6}}>
            <strong style={{color}}>{label}</strong><br/>
            Technology: {tower.tech}<br/>
            Coverage: {(tower.radius/1000).toFixed(1)} km radius
          </div>
        </Popup>
      </Circle>
      <CircleMarker
        center={[tower.lat, tower.lng]}
        radius={markerSize}
        pathOptions={{
          color: "#fff",
          fillColor: color,
          fillOpacity: 0.95,
          weight: 2
        }}
      >
        <Popup>
          <div style={{fontSize:12,lineHeight:1.6}}>
            <strong style={{color}}>{label}</strong><br/>
            {tower.tech} cell tower
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}

export default function MapView({ lat, lng, label, towers, activeFilter }: Props) {
  const filteredTowers = useMemo(() => {
    if (activeFilter === "All networks") return towers;
    if (activeFilter === "Fiber availability") return [];
    return towers.filter(t => t.provider.toLowerCase() === activeFilter.toLowerCase());
  }, [towers, activeFilter]);

  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom className="map">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={lat} lng={lng} />
      {filteredTowers.map(tower => (
        <TowerMarker key={tower.id} tower={tower} />
      ))}
      <CircleMarker
        center={[lat, lng]}
        radius={10}
        pathOptions={{ color: "#fff", fillColor: "#1479ff", fillOpacity: 1, weight: 3 }}
      >
        <Popup><strong>{label}</strong><br/>Your selected location</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
