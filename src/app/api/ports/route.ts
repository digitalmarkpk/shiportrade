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
    const filePath = path.join(process.cwd(), 'public/data/ports-full.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let ports = JSON.parse(fileContent);

    // Filter
    if (search || country) {
      ports = ports.filter((port: any) => {
        const matchesSearch = !search || 
          port.name.toLowerCase().includes(search) || 
          port.unlocode.toLowerCase().includes(search);
        
        const matchesCountry = !country || 
          (port.country_name && port.country_name.toLowerCase().includes(country)) ||
          (port.country_code && port.country_code.toLowerCase() === country);
          
        return matchesSearch && matchesCountry;
      });
    }

    const total = ports.length;
    const paginatedPorts = ports.slice(offset, offset + limit);

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
