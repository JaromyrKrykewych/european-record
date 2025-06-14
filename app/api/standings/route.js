import { NextResponse } from "next/server";
import generateLeagueTable from "@/lib/generateLeagueTable";
import generateSeasonTable from "@/lib/generateSeasons";
import getTeamsFromJson from "@/lib/getTeamsFromJson";
import updateProgression from "@/lib/generateProgretion";

export async function GET() {
  const teamsData = getTeamsFromJson();
  const table = generateLeagueTable(teamsData);
  const seasons = generateSeasonTable(teamsData);
  updateProgression(table, "2004-05");
  return NextResponse.json({ table, seasons }, { status: 200 });
}
