"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icons in Next.js
const blueIcon = L.divIcon({ 
  html: '<div style="background:#0F4C81;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>', 
  className: '',
  iconSize: [14, 14], 
  iconAnchor: [7, 7] 
});

const greenIcon = L.divIcon({ 
  html: '<div style="background:#2E8B57;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>', 
  className: '',
  iconSize: [18, 18], 
  iconAnchor: [9, 9] 
});

interface Port {
  unlocode: string;
  name: string;
  country_name?: string;
  latitude: number;
  longitude: number;
}

interface GlobalPortsMapProps {
  ports: Port[];
  selectedId?: string;
  onSelect?: (port: Port) => void;
  height?: string;
  maxMarkers?: number;
}

// Component to handle map centering and bounds
function MapController({ selectedPort, ports }: { selectedPort: Port | undefined; ports: Port[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedPort) {
      map.flyTo([selectedPort.latitude, selectedPort.longitude], 6, {
        duration: 1.5
      });
    } else if (ports.length > 1) {
      const bounds = L.latLngBounds(ports.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [selectedPort, ports, map]);
  
  return null;
}

export default function GlobalPortsMap({ 
  ports, 
  selectedId, 
  onSelect, 
  height = "500px", 
  maxMarkers = 300 
}: GlobalPortsMapProps) {
  const selectedPort = ports.find(p => p.unlocode === selectedId);

  return (
    <div style={{ height, width: '100%', position: 'relative' }} className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} 
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        />
        <MapController selectedPort={selectedPort} ports={ports} />
        {ports.slice(0, maxMarkers).map(p => (
          <Marker 
            key={p.unlocode} 
            position={[p.latitude, p.longitude]} 
            icon={selectedId === p.unlocode ? greenIcon : blueIcon}
            eventHandlers={{
              click: () => onSelect?.(p)
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-slate-900">{p.name}</strong>
                <br />
                <span className="text-slate-600">{p.country_name}</span>
                <br />
                <span className="text-xs text-slate-400 font-mono">{p.unlocode}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
