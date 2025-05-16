import { normalizeClubName } from "./normalizeClubName";

function generateLeagueTable(teamsData) {
  const table = {};
  const processedPairs = new Set();

  for (let team in teamsData) {
    const teamCountry = teamsData[team].country;
    const opponents = teamsData[team].opponents;

    if (!team.trim() || !Array.isArray(opponents)) continue;
    team = normalizeClubName(team);

    if (!table[team]) {
      table[team] = {
        team,
        country: teamCountry,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    }

    for (const { opponent, headtohead } of opponents) {
      const normalizedOpponent = normalizeClubName(opponent);

      const pairKey = [team, normalizedOpponent].sort().join("-");
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      const opponentCountry = teamsData[opponent]?.country ?? "Unknown";

      if (!table[opponent]) {
        table[opponent] = {
          team: opponent,
          country: opponentCountry,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      }

      const [teamWins, opponentWins] = headtohead.split("-").map(Number);

      const teamRow = table[team];
      const oppRow = table[opponent];

      teamRow.played += 1;
      oppRow.played += 1;

      teamRow.goalsFor += teamWins;
      teamRow.goalsAgainst += opponentWins;
      teamRow.goalDifference = teamRow.goalsFor - teamRow.goalsAgainst;

      oppRow.goalsFor += opponentWins;
      oppRow.goalsAgainst += teamWins;
      oppRow.goalDifference = oppRow.goalsFor - oppRow.goalsAgainst;

      if (teamWins > opponentWins) {
        teamRow.won += 1;
        teamRow.points += 3;
        oppRow.lost += 1;
      } else if (teamWins < opponentWins) {
        oppRow.won += 1;
        oppRow.points += 3;
        teamRow.lost += 1;
      } else {
        teamRow.drawn += 1;
        oppRow.drawn += 1;
        teamRow.points += 1;
        oppRow.points += 1;
      }
    }
  }

  // Ordenar la tabla
  const sortedTable = Object.values(table)
    .filter((row) => row.team && row.team.trim())
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor
    );

  // Asignar posiciones con empate
  let lastStats = null;
  let lastPosition = 0;
  let tieCount = 0;

  const tableWithPositions = sortedTable.map((row) => {
    const { points, goalDifference, goalsFor } = row;
    const currentStats = `${points}-${goalDifference}-${goalsFor}`;

    if (currentStats === lastStats) {
      tieCount++;
    } else {
      lastPosition = lastPosition + 1 + tieCount;
      tieCount = 0;
    }

    lastStats = currentStats;

    return {
      ...row,
      position: String(lastPosition).padStart(2, "0"),
    };
  });

  return tableWithPositions;
}

export default generateLeagueTable;
