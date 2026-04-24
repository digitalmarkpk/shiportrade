import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/ports.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ports = JSON.parse(fileContent);

    const geojson = {
      type: 'FeatureCollection',
      features: ports.map((port: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [port.longitude, port.latitude],
        },
        properties: {
          unlocode: port.unlocode,
          name: port.name,
          country: port.country_name || port.country_code,
          port_type: port.port_type,
          terminals: port.terminals
        },
      })),
    };

    return NextResponse.json(geojson);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate GeoJSON' }, { status: 500 });
  }
}
