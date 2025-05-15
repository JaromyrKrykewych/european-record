import { join } from "path";
import { normalizeClubName } from "./normalizeClubName";
import { readFileSync } from "fs";

function generateSeasonTable() {
  const filePath = join(process.cwd(), "data", "teamsData.json");
  const rawData = readFileSync(filePath, "utf8");
  const teamsData = JSON.parse(rawData);

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

    // for (const { opponent, headtohead } of opponents) {
    //   const normalizedOpponent = normalizeClubName(opponent);

    //   const pairKey = [team, normalizedOpponent].sort().join("-");
    //   if (processedPairs.has(pairKey)) continue;
    //   processedPairs.add(pairKey);

    //   const opponentCountry = teamsData[opponent]?.country ?? "Unknown";

    //   if (!table[opponent]) {
    //     table[opponent] = {
    //       team: opponent,
    //       country: opponentCountry,
    //       played: 0,
    //       won: 0,
    //       drawn: 0,
    //       lost: 0,
    //       goalsFor: 0,
    //       goalsAgainst: 0,
    //       goalDifference: 0,
    //       points: 0,
    //     };
    //   }

    // const [teamWins, opponentWins] = headtohead.split("-").map(Number);

    // const teamRow = table[team];
    // const oppRow = table[opponent];

    // teamRow.played += 1;
    // oppRow.played += 1;

    // teamRow.goalsFor += teamWins;
    // teamRow.goalsAgainst += opponentWins;
    // teamRow.goalDifference = teamRow.goalsFor - teamRow.goalsAgainst;

    // oppRow.goalsFor += opponentWins;
    // oppRow.goalsAgainst += teamWins;
    // oppRow.goalDifference = oppRow.goalsFor - oppRow.goalsAgainst;

    // if (teamWins > opponentWins) {
    //   teamRow.won += 1;
    //   teamRow.points += 3;
    //   oppRow.lost += 1;
    // } else if (teamWins < opponentWins) {
    //   oppRow.won += 1;
    //   oppRow.points += 3;
    //   teamRow.lost += 1;
    // } else {
    //   teamRow.drawn += 1;
    //   oppRow.drawn += 1;
    //   teamRow.points += 1;
    //   oppRow.points += 1;
    // }
  }

  // Ordenar la tabla
  const sortedTable = Object.values(table)
    .filter((row) => row.team && row.team.trim())
    .sort((a, b) => b.seasons - a.seasons);

  // Asignar posiciones con empate
  // let lastStats = null;
  // let lastPosition = 0;
  // let tieCount = 0;

  // const tableWithPositions = sortedTable.map((row) => {
  //   const { seasons } = row;

  //   if (currentStats === lastStats) {
  //     tieCount++;
  //   } else {
  //     lastPosition = lastPosition + 1 + tieCount;
  //     tieCount = 0;
  //   }

  //   lastStats = currentStats;

  //   return {
  //     ...row,
  //     position: String(lastPosition).padStart(2, "0"),
  //   };
  // });

  return sortedTable;
}

export default generateSeasonTable;
