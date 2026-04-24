"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { popularPorts } from '@/lib/data';

// Default icon fix for Leaflet in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});

export default function MapBanner() {
  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {popularPorts.map((port) => (
          <Marker key={port.code} position={[port.lat, port.lng]} icon={icon}>
            <Popup>
              <div className="font-bold text-blue-900">{port.name}</div>
              <div className="text-sm">{port.country}</div>
              <div className="text-xs text-gray-500">Code: {port.code}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}