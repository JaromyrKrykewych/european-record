import getTeamsFromJson from '@/lib/getTeamsFromJson';
import { NextResponse } from 'next/server';

export async function GET() {
  const teams = Object.keys(getTeamsFromJson());
  console.log('Teams data fetched successfully:', teams);
  return NextResponse.json(names, {
    headers: { 'Cache-Control': 'max-age=86400' },
  });
}
