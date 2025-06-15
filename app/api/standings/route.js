import { NextResponse } from "next/server";
import generateLeagueTable from "@/lib/generateLeagueTable";
import generateSeasonTable from "@/lib/generateSeasons";
import getTeamsFromJson from "@/lib/getTeamsFromJson";
import updateProgression from "@/lib/generateProgretion";

export async function GET() {
  const teamsData = getTeamsFromJson();
  const table = generateLeagueTable(teamsData);
  const seasons = generateSeasonTable(teamsData);
  updateProgression(table, "2006-07");
  return NextResponse.json({ table, seasons }, { status: 200 });
}
