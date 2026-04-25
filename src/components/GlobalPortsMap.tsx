"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icon definitions for different port types
const createIcon = (color: string, size: number = 10) => L.divIcon({
  html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
  className: '',
  iconSize: [size + 4, size + 4],
  iconAnchor: [(size + 4) / 2, (size + 4) / 2]
});

const icons = {
  sea_port: createIcon('#3b82f6'), // blue-500
  airport: createIcon('#f59e0b'), // amber-500
  container_terminal: createIcon('#10b981'), // emerald-500
  dry_port: createIcon('#f43f5e'), // rose-500
  rail_terminal: createIcon('#f43f5e'), // rose-500
  selected: createIcon('#2E8B57', 14) // green
};

interface Port {
  un_locode: string;
  name: string;
  country_name?: string;
  city?: string;
  latitude: number;
  longitude: number;
  port_type: string;
}

interface GlobalPortsMapProps {
  ports: Port[];
  selectedId?: string;
  onSelect?: (port: Port) => void;
  height?: string;
  maxMarkers?: number;
  center?: [number, number];
  zoom?: number;
}

// Component to handle map centering and bounds
function MapController({ selectedPort, ports, center, zoom }: { 
  selectedPort: Port | undefined; 
  ports: Port[];
  center?: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    } else if (selectedPort) {
      map.flyTo([selectedPort.latitude, selectedPort.longitude], 10, {
        duration: 1.5
      });
    } else if (ports.length === 1) {
      map.setView([ports[0].latitude, ports[0].longitude], 12);
    } else if (ports.length > 1) {
      const bounds = L.latLngBounds(ports.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [selectedPort, ports, map, center, zoom]);
  
  return null;
}

export default function GlobalPortsMap({ 
  ports, 
  selectedId, 
  onSelect, 
  height = "500px", 
  maxMarkers = 500,
  center,
  zoom
}: GlobalPortsMapProps) {
  const selectedPort = ports.find(p => p.un_locode === selectedId);

  const getIcon = (port: Port) => {
    if (selectedId === port.un_locode) return icons.selected;
    return icons[port.port_type as keyof typeof icons] || icons.sea_port;
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }} className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
      <MapContainer 
        center={center || [20, 0]} 
        zoom={zoom || 2} 
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} 
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        />
        <MapController selectedPort={selectedPort} ports={ports} center={center} zoom={zoom} />
        {ports.slice(0, maxMarkers).map(p => (
          <Marker 
            key={p.un_locode} 
            position={[p.latitude, p.longitude]} 
            icon={getIcon(p)}
            eventHandlers={{
              click: () => onSelect?.(p)
            }}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ 
                    backgroundColor: 
                      p.port_type === 'sea_port' ? '#3b82f6' : 
                      p.port_type === 'airport' ? '#f59e0b' : 
                      p.port_type === 'container_terminal' ? '#10b981' : '#f43f5e' 
                  }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {p.port_type.replace('_', ' ')}
                  </span>
                </div>
                <strong className="text-slate-900 block text-sm leading-tight mb-0.5">{p.name}</strong>
                <span className="text-slate-500 text-xs block mb-2">{p.city}, {p.country_name}</span>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-[11px] font-mono text-slate-400">{p.un_locode}</span>
                  <a 
                    href={`/directories/ports/${p.un_locode}`}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
