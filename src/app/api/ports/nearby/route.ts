import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const radius = parseFloat(searchParams.get('radius') || '200');

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'public/data/ports.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ports = JSON.parse(fileContent);

    const nearbyPorts = ports
      .map((port: any) => ({
        ...port,
        distance: getDistance(lat, lon, port.latitude, port.longitude)
      }))
      .filter((port: any) => port.distance <= radius)
      .sort((a: any, b: any) => a.distance - b.distance);

    return NextResponse.json(nearbyPorts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch nearby ports' }, { status: 500 });
  }
}
