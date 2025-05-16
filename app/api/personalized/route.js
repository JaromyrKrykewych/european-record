import { NextResponse } from "next/server";
import filterTeamsData from "@/lib/filterTeamsData";
import generateLeagueTable from "@/lib/generateLeagueTable";
import getExternalOpponentsMatchCount from "@/lib/externalOpponents";
import getTeamsFromJson from "@/lib/getTeamsFromJson";

export async function POST(req) {
  try {
    const body = await req.json();
    const teamsRequest = body.teams;
    const teamsData = getTeamsFromJson();
    const selectedTeams = filterTeamsData(teamsData, teamsRequest);

    const customTable = generateLeagueTable(selectedTeams);
    const externalOpponents = getExternalOpponentsMatchCount(
      teamsData,
      teamsRequest
    );

    return NextResponse.json(
      { customTable, externalOpponents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/personalized:", error);
    return Response.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
