import { NextResponse } from "next/server";
import generateLeagueTable from "@/lib/generateLeagueTable";
import generateSeasonTable from "@/lib/generateSeasons";
import updateProgression from "@/lib/generateProgretion";

export async function GET() {
  const table = generateLeagueTable();
  const seasons = generateSeasonTable();
  updateProgression(table, "1983-84");
  return NextResponse.json({ table, seasons }, { status: 200 });
}
