"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Anchor, Plane, Truck, MapPin } from "lucide-react";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type PortType = "sea" | "air" | "dry";

interface Port {
  name: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  type: PortType;
  unlocode?: string;
  teu?: number;
}

// Built‑in port data (50+ sea ports + airports + dry ports)
const portsData: Port[] = [
  { name: "Shanghai", country: "China", city: "Shanghai", lat: 31.2304, lng: 121.4737, type: "sea", teu: 47000000, unlocode: "CNSHA" },
  { name: "Singapore", country: "Singapore", city: "Singapore", lat: 1.264, lng: 103.822, type: "sea", teu: 37000000, unlocode: "SGSIN" },
  { name: "Rotterdam", country: "Netherlands", city: "Rotterdam", lat: 51.9225, lng: 4.4792, type: "sea", teu: 14800000, unlocode: "NLRTM" },
  { name: "Ningbo-Zhoushan", country: "China", city: "Ningbo", lat: 29.868, lng: 121.544, type: "sea", teu: 28700000, unlocode: "CNNGB" },
  { name: "Guangzhou", country: "China", city: "Guangzhou", lat: 23.089, lng: 113.336, type: "sea", teu: 23600000, unlocode: "CNGZH" },
  { name: "Busan", country: "South Korea", city: "Busan", lat: 35.1028, lng: 129.0403, type: "sea", teu: 21800000, unlocode: "KRPUS" },
  { name: "Hong Kong", country: "China", city: "Hong Kong", lat: 22.3193, lng: 114.1694, type: "sea", teu: 18000000, unlocode: "HKHKG" },
  { name: "Qingdao", country: "China", city: "Qingdao", lat: 36.066, lng: 120.382, type: "sea", teu: 22000000, unlocode: "CNQDG" },
  { name: "Tianjin", country: "China", city: "Tianjin", lat: 38.992, lng: 117.79, type: "sea", teu: 18000000, unlocode: "CNTNG" },
  { name: "Jebel Ali", country: "UAE", city: "Dubai", lat: 25.004, lng: 55.064, type: "sea", teu: 13700000, unlocode: "AEJEA" },
  { name: "Los Angeles", country: "USA", city: "Los Angeles", lat: 33.7439, lng: -118.275, type: "sea", teu: 9200000, unlocode: "USLAX" },
  { name: "Long Beach", country: "USA", city: "Long Beach", lat: 33.749, lng: -118.192, type: "sea", teu: 8100000, unlocode: "USLGB" },
  { name: "Antwerp", country: "Belgium", city: "Antwerp", lat: 51.219, lng: 4.403, type: "sea", teu: 12000000, unlocode: "BEANR" },
  { name: "Hamburg", country: "Germany", city: "Hamburg", lat: 53.551, lng: 9.994, type: "sea", teu: 8700000, unlocode: "DEHAM" },
  { name: "Mumbai", country: "India", city: "Mumbai", lat: 18.957, lng: 72.825, type: "sea", teu: 5100000, unlocode: "INBOM" },
  { name: "Colombo", country: "Sri Lanka", city: "Colombo", lat: 6.927, lng: 79.861, type: "sea", teu: 7200000, unlocode: "LKCMB" },
  { name: "Manila", country: "Philippines", city: "Manila", lat: 14.592, lng: 120.975, type: "sea", teu: 5300000, unlocode: "PHMNL" },
  { name: "Jakarta", country: "Indonesia", city: "Jakarta", lat: -6.125, lng: 106.894, type: "sea", teu: 7600000, unlocode: "IDJKT" },
  { name: "New York/New Jersey", country: "USA", city: "New York", lat: 40.7128, lng: -74.006, type: "sea", teu: 7400000, unlocode: "USNYC" },
  { name: "Valencia", country: "Spain", city: "Valencia", lat: 39.47, lng: -0.376, type: "sea", teu: 5400000, unlocode: "ESVLC" },
  { name: "Piraeus", country: "Greece", city: "Piraeus", lat: 37.943, lng: 23.646, type: "sea", teu: 5600000, unlocode: "GRPIR" },
  { name: "Santos", country: "Brazil", city: "Santos", lat: -23.961, lng: -46.334, type: "sea", teu: 4300000, unlocode: "BRSSZ" },
  { name: "Melbourne", country: "Australia", city: "Melbourne", lat: -37.814, lng: 144.963, type: "sea", teu: 3200000, unlocode: "AUMEL" },
  { name: "Vancouver", country: "Canada", city: "Vancouver", lat: 49.283, lng: -123.121, type: "sea", teu: 3500000, unlocode: "CAVAN" },
  { name: "Tokyo", country: "Japan", city: "Tokyo", lat: 35.6895, lng: 139.6917, type: "sea", teu: 4400000, unlocode: "JPTYO" },
  { name: "Yokohama", country: "Japan", city: "Yokohama", lat: 35.443, lng: 139.638, type: "sea", teu: 3000000, unlocode: "JPYOK" },
  { name: "Kobe", country: "Japan", city: "Kobe", lat: 34.69, lng: 135.195, type: "sea", teu: 2900000, unlocode: "JPUKB" },
  { name: "Kaohsiung", country: "Taiwan", city: "Kaohsiung", lat: 22.616, lng: 120.279, type: "sea", teu: 10400000, unlocode: "TWKHH" },
  { name: "Xiamen", country: "China", city: "Xiamen", lat: 24.479, lng: 118.089, type: "sea", teu: 11200000, unlocode: "CNXMN" },
  { name: "Shenzhen", country: "China", city: "Shenzhen", lat: 22.543, lng: 114.058, type: "sea", teu: 25700000, unlocode: "CNSNZ" },
  // Airports
  { name: "Hong Kong Intl", country: "Hong Kong", city: "Hong Kong", lat: 22.308, lng: 113.918, type: "air" },
  { name: "Dubai Intl", country: "UAE", city: "Dubai", lat: 25.253, lng: 55.365, type: "air" },
  { name: "Singapore Changi", country: "Singapore", city: "Singapore", lat: 1.364, lng: 103.991, type: "air" },
  { name: "Heathrow", country: "UK", city: "London", lat: 51.47, lng: -0.454, type: "air" },
  { name: "JFK", country: "USA", city: "New York", lat: 40.641, lng: -73.778, type: "air" },
  { name: "LAX", country: "USA", city: "Los Angeles", lat: 33.942, lng: -118.408, type: "air" },
  { name: "Frankfurt", country: "Germany", city: "Frankfurt", lat: 50.037, lng: 8.562, type: "air" },
  { name: "Paris CDG", country: "France", city: "Paris", lat: 49.009, lng: 2.548, type: "air" },
  { name: "Amsterdam Schiphol", country: "Netherlands", city: "Amsterdam", lat: 52.308, lng: 4.764, type: "air" },
  // Dry ports
  { name: "Alashankou", country: "China", city: "Xinjiang", lat: 45.17, lng: 82.56, type: "dry" },
  { name: "Khorgos", country: "Kazakhstan", city: "Khorgos", lat: 44.16, lng: 80.37, type: "dry" },
  { name: "Torkham", country: "Pakistan", city: "Khyber", lat: 34.12, lng: 71.08, type: "dry" },
];

export default function WorldMap() {
  const [isClient, setIsClient] = useState(false);
  const [filter, setFilter] = useState<PortType | "all">("sea");
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("leaflet/dist/leaflet.css");
    import("leaflet").then((leaflet) => setL(leaflet));
  }, []);

  if (!isClient || !L) {
    return <div className="h-[520px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">Loading Map...</div>;
  }

  const filtered = portsData.filter(p => filter === "all" || p.type === filter);

  const getIcon = (type: PortType) => {
    const color = type === "sea" ? "#0F4C81" : type === "air" ? "#8B5CF6" : "#F59E0B";
    return L.divIcon({
      html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      className: "",
      iconSize: [12, 12],
    });
  };

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border shadow-md">
      <div className="absolute top-3 left-3 z-[1000] flex gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2 py-1.5 rounded-lg shadow-lg">
        {[
          { key: "sea", label: "Sea Ports", icon: Anchor, count: portsData.filter(p => p.type === "sea").length },
          { key: "air", label: "Airports", icon: Plane, count: portsData.filter(p => p.type === "air").length },
          { key: "dry", label: "Dry Ports", icon: Truck, count: portsData.filter(p => p.type === "dry").length },
          { key: "all", label: "All", icon: MapPin, count: portsData.length },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key as any)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${filter === f.key ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-800 text-slate-700 hover:bg-slate-100"}`}>
            <f.icon className="h-3.5 w-3.5" /> {f.label} <span className="opacity-70">({f.count})</span>
          </button>
        ))}
      </div>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} minZoom={2} maxZoom={12}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OSM & CartoDB' />
        {filtered.map((port, idx) => (
          <Marker key={idx} position={[port.lat, port.lng]} icon={getIcon(port.type)}>
            <Popup><div className="min-w-[160px]"><div className="font-semibold">{port.name}</div><div className="text-xs text-slate-600">{port.city}, {port.country}</div>{port.unlocode && <div className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">{port.unlocode}</div>}{port.teu && <div className="text-xs mt-1">📦 {(port.teu/1e6).toFixed(1)}M TEU</div>}</div></Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium">{filtered.length} locations shown</div>
    </div>
  );
}