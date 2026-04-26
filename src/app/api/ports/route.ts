import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const country = searchParams.get('country')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const filePath = path.join(process.cwd(), 'public/data/ports-main.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let ports = JSON.parse(fileContent);

    const type = searchParams.get('type')?.toLowerCase() || '';
    const region = searchParams.get('region')?.toLowerCase() || '';

    // Filter
    if (search || country || type || region) {
      ports = ports.filter((port: any) => {
        const matchesSearch = !search || 
          port.name.toLowerCase().includes(search) || 
          (port.unlocode && port.unlocode.toLowerCase().includes(search)) ||
          (port.un_locode && port.un_locode.toLowerCase().includes(search)) ||
          (port.city && port.city.toLowerCase().includes(search));
        
        const matchesCountry = !country || 
          (port.country_name && port.country_name.toLowerCase().includes(country)) ||
          (port.country_code && port.country_code.toLowerCase() === country);

        const matchesType = !type || port.port_type === type;
        
        // For region, we might need to join with countries-info.json or have region in port
        // Since migration didn't add region to port, let's assume we might need it or skip for now
        const matchesRegion = !region || true; 
          
        return matchesSearch && matchesCountry && matchesType && matchesRegion;
      });
    }

    const total = ports.length;
    const paginatedPorts = ports.slice(offset, offset + limit).map((p: any) => ({
      unlocode: p.unlocode || p.un_locode,
      name: p.name,
      slug: p.slug,
      port_type: p.port_type,
      annual_teu: p.annual_teu || 0,
      max_depth_m: p.max_depth_m || 0,
      latitude: p.latitude || 0,
      longitude: p.longitude || 0,
      timezone: p.timezone || '',
    }));

    return NextResponse.json(
      { 
        ports: paginatedPorts, 
        total, 
        hasMore: offset + limit < total 
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ports' }, { status: 500 });
  }
}
