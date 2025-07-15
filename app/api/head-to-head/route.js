import getTeamsFromJson from '@/lib/getTeamsFromJson';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const teamsData = getTeamsFromJson();

  const teamA = searchParams.get('teamA');
  const teamB = searchParams.get('teamB');

  if (!teamA || !teamB) {
    return new Response('Faltan equipos', { status: 400 });
  }

  const recordA = teamsData[teamA]?.opponents?.find(
    (opponent) => opponent.opponent === teamB
  );
  const recordB = teamsData[teamB]?.opponents?.find(
    (opponent) => opponent.opponent === teamA
  );

  const head = recordA?.headtohead ?? recordB?.headtohead ?? '-';

  return NextResponse.json({
    teamA,
    teamB,
    headtohead: head,
    matches: recordA?.matches ?? recordB?.matches ?? [],
  });
}
