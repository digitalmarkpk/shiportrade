import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { unlocode: string } }
) {
  const unlocode = params.unlocode.toUpperCase();

  try {
    const filePath = path.join(process.cwd(), 'public/data/ports.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ports = JSON.parse(fileContent);

    const port = ports.find((p: any) => p.unlocode === unlocode);

    if (!port) {
      return NextResponse.json({ error: 'Port not found' }, { status: 404 });
    }

    return NextResponse.json(port);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch port' }, { status: 500 });
  }
}
