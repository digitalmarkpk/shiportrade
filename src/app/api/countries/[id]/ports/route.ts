import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const countryId = parseInt(params.id);

  try {
    const filePath = path.join(process.cwd(), 'public/data/ports-main.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ports = JSON.parse(fileContent);

    const countryPorts = ports.filter((p: any) => p.country_id === countryId);

    return NextResponse.json(countryPorts, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch country ports' }, { status: 500 });
  }
}
