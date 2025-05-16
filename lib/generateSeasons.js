import { normalizeClubName } from "./normalizeClubName";

function generateSeasonTable(teamsData) {
  const table = {};

  for (let team in teamsData) {
    const teamCountry = teamsData[team].country;
    const teamSeasons = teamsData[team].seasons.length;

    if (!team.trim()) continue;
    team = normalizeClubName(team);

    if (!table[team]) {
      table[team] = {
        team,
        country: teamCountry,
        seasons: teamSeasons,
      };
    }
  }

  // Ordenar la tabla
  const sortedTable = Object.values(table)
    .filter((row) => row.team && row.team.trim())
    .sort((a, b) => b.seasons - a.seasons);

  return sortedTable;
}

export default generateSeasonTable;
