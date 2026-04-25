import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region')?.toLowerCase() || '';

  try {
    const filePath = path.join(process.cwd(), 'public/data/countries-info.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let countries = JSON.parse(fileContent);

    if (region) {
      countries = countries.filter((c: any) => c.region?.toLowerCase() === region);
    }

    return NextResponse.json(countries, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
