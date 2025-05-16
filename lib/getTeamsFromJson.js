import { join } from "path";
import { readFileSync } from "fs";

export default function getTeamsFromJson() {
  const filePath = join(process.cwd(), "data", "teamsData.json");
  const rawData = readFileSync(filePath, "utf8");
  const teamsData = JSON.parse(rawData);

  return teamsData;
}
