"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { Anchor, Ship } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Fix for default marker icon
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Ports Data
const mapPortsData = [
  { id: 1, name: "Shanghai", country: "China", code: "CNSHA", lat: 31.2304, lng: 121.4737, volume: "43.5M TEU" },
  { id: 2, name: "Singapore", country: "Singapore", code: "SGSIN", lat: 1.2644, lng: 103.8200, volume: "37.2M TEU" },
  { id: 3, name: "Rotterdam", country: "Netherlands", code: "NLRTM", lat: 51.9225, lng: 4.4792, volume: "15.3M TEU" },
  { id: 4, name: "Jebel Ali", country: "UAE", code: "AEJEA", lat: 25.0072, lng: 55.0376, volume: "14.1M TEU" },
  { id: 5, name: "Los Angeles", country: "USA", code: "USLAX", lat: 33.7361, lng: -118.2628, volume: "10.7M TEU" },
  { id: 6, name: "Hamburg", country: "Germany", code: "DEHAM", lat: 53.5511, lng: 9.9937, volume: "8.5M TEU" },
];

export default function WorldMap() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-border h-[500px] relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapPortsData.map((port) => (
          <Marker key={port.id} position={[port.lat, port.lng]}>
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <Anchor className="h-4 w-4 text-blue-600" />
                  <span className="font-bold text-blue-600">{port.name}</span>
                </div>
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">Country:</span> {port.country}</p>
                  <p><span className="font-medium">Code:</span> {port.code}</p>
                  <p><span className="font-medium">Volume:</span> {port.volume}</p>
                </div>
                <Link 
                  href={`/tools/ocean-freight/port-code-finder?code=${port.code}`}
                  className="text-xs text-blue-600 hover:underline mt-2 block"
                >
                  View Port Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Overlay Info */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-border max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Ship className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-sm">Top Ports Mapped</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Click markers to view port details.
        </p>
        <div className="flex gap-2 flex-wrap">
          {mapPortsData.slice(0, 4).map(p => (
            <Badge key={p.id} variant="secondary" className="text-[10px]">{p.name}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}