import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ unlocode: string }> }
) {
  const { unlocode: unlocodeParam } = await params;
  const unlocode = unlocodeParam.toUpperCase();

  try {
    const filePath = path.join(process.cwd(), 'public/data/ports-main.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ports = JSON.parse(fileContent);

    const port = ports.find((p: any) => p.un_locode === unlocode);

    if (!port) {
      return NextResponse.json({ error: 'Port not found' }, { status: 404 });
    }

    return NextResponse.json(port);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch port' }, { status: 500 });
  }
}
