import filterTeamsData from "@/lib/filterTeamsData";
import generateLeagueTableFromData from "@/lib/generateLeagueTableFromData"; // Versión modificada
import { join } from "path";
import { normalizeClubName } from "@/lib/normalizeClubName";
import { readFileSync } from "fs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const selected = searchParams.getAll("teams");

  const filePath = join(process.cwd(), "data", "teamsData.json");
  const rawData = readFileSync(filePath, "utf8");
  const teamsData = JSON.parse(rawData);

  const filteredData = filterTeamsData(teamsData, selected);
  const customTable = generateLeagueTable(filteredData);

  return Response.json(customTable);
}
