"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue for Next.js
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom Blue Dot Icon
const blueDotIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #0F4C81; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

// Component to handle map centering and flying
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5
      });
    }
  }, [center, zoom, map]);
  return null;
}

interface Port {
  unlocode: string;
  name: string;
  country_name?: string;
  country_code: string;
  latitude: number;
  longitude: number;
  terminals?: number;
}

interface PortsMapProps {
  ports: Port[];
  selectedPort: Port | null;
  onSelect: (port: Port) => void;
}

export default function PortsMap({ ports, selectedPort, onSelect }: PortsMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fixLeafletIcon();
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl">
        <span className="text-slate-400 font-medium">Loading map...</span>
      </div>
    );
  }

  const center: [number, number] = selectedPort 
    ? [selectedPort.latitude, selectedPort.longitude] 
    : [20, 0];
  const zoom = selectedPort ? 6 : 2;

  return (
    <div className="h-full w-full relative overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={center} zoom={zoom} />

        {ports.map((port) => (
          <Marker
            key={port.unlocode}
            position={[port.latitude, port.longitude]}
            icon={blueDotIcon}
            eventHandlers={{
              click: () => onSelect(port),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-[#0F4C81] m-0">{port.name}</h3>
                <p className="text-xs text-slate-500 m-0">{port.country_name || port.country_code}</p>
                <div className="mt-2 flex flex-col gap-1 text-[10px] text-slate-600">
                  <span><strong>UNLOCODE:</strong> {port.unlocode}</span>
                  {port.terminals !== undefined && (
                    <span><strong>Terminals:</strong> {port.terminals}</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
