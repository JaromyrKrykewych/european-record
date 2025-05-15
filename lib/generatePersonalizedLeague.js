import { join } from "path";
import { normalizeClubName } from "./normalizeClubName";
import { readFileSync } from "fs";

function filterTeamsData(originalData, selectedTeams) {
  const filteredData = {};

  for (const team of selectedTeams) {
    const teamData = originalData[team];
    if (!teamData) continue;

    // Filtrar solo los opponents que están también en los equipos seleccionados
    const filteredOpponents = teamData.opponents
      .filter((op) => selectedTeams.includes(op.opponent))
      .map((op) => {
        const filteredMatches = op.matches.filter(
          (m) =>
            selectedTeams.includes(m.home) && selectedTeams.includes(m.away)
        );

        return {
          ...op,
          matches: filteredMatches,
        };
      })
      .filter((op) => op.matches.length > 0); // quitar oponentes sin partidos válidos

    filteredData[team] = {
      country: teamData.country,
      seasons: teamData.seasons, // puedes dejarlo igual o filtrar si quieres
      opponents: filteredOpponents,
    };
  }

  return filteredData;
}

function getExternalOpponentsMatchCount(originalData, selectedTeams) {
  const externalOpponentTracker = {};

  for (const selectedTeam of selectedTeams) {
    const teamData = originalData[selectedTeam];
    if (!teamData) continue;

    for (const op of teamData.opponents) {
      const opponentName = op.opponent;

      // Ignorar si también está en los seleccionados
      if (selectedTeams.includes(opponentName)) continue;

      if (!externalOpponentTracker[opponentName]) {
        externalOpponentTracker[opponentName] = {
          country: op.country,
          selectedFaced: new Set(),
        };
      }

      const played = op.matches.some(
        (match) =>
          selectedTeams.includes(match.home) ||
          selectedTeams.includes(match.away)
      );

      if (played) {
        externalOpponentTracker[opponentName].selectedFaced.add(selectedTeam);
      }
    }
  }

  const result = Object.entries(externalOpponentTracker).map(
    ([team, data]) => ({
      team,
      country: data.country,
      count: data.selectedFaced.size,
    })
  );

  result.sort((a, b) => b.count - a.count);

  return result;
}

function generatePersonalizedTable() {
  const filePath = join(process.cwd(), "data", "teamsData.json");
  const rawData = readFileSync(filePath, "utf8");
  const teamsData = JSON.parse(rawData);

  const realMadrid = [
    "FC Barcelona",
    "Real Madrid",
    "AC Milan",
    "Benfica",
    "Feyenoord",
    "Celtic",
    // "Internazionale",
    // "Liverpool",
    // "Ajax",
  ];

  const selectedTeams = [
    "Real Madrid",
    "FC Barcelona",
    "Benfica",
    "AC Milan",
    "Internazionale",
    "Rapid Wien",
    "Glasgow Rangers",
    "Fiorentina",
    "Red Star Belgrade",
    "Manchester United",
    "CSKA Sofia",
    "CDNA Sofia",
    "Anderlecht",
    "Celtic",
    "Valencia",
    "Dinamo Zagreb",
    "Atlético Madrid",
    "Bayern München",
    "Juventus",
    "Liverpool",
    "Ferencváros",
    "Leeds United",
    "Újpest FC",
    "Újpest Dózsa",
    "Ajax",
    "1.FC Köln",
    "Athletic Bilbao",
    "Eintracht Frankfurt",
    "Dynamo Dresden",
    "FC Porto",
    "Borussia Mönchengladbach",
    "Hamburger SV",
    "FC Zürich",
    "Club Brugge",
    "AS Saint-Étienne",
    "Standard Liège",
    "Tottenham Hotspur",
    "Dukla Praha",
    "Dynamo Kyiv",
    "Dinamo Kiev",
    "Olympiakos Piraeus",
    "Sporting CP Lisbon",
    "Partizan Belgrade",
    "Aberdeen",
    "Austria Wien",
    "Dinamo Bucuresti",
    "PSV Eindhoven",
    "Levski Sofia",
    "Levski-Spartak Sofia",
    "Nottingham Forest",
    "Malmö FF",
    "Feyenoord",
    "Vasas Budapest",
    "Hibernian",
    "AS Roma",
    "1.FC Magdeburg",
    "Górnik Zabrze",
    "Carl Zeiss Jena",
    "Sparta Praha",
    "Wolverhampton Wanderers",
    "Hajduk Split",
    "Dundee United",
    "Honvéd Budapest",
    "FC Nantes",
    "FCSB",
    "Steaua Bucuresti",
    "Universitatea Craiova",
    "Galatasaray",
    "AEK Athens",
    "Vitória Setúbal",
    "Panathinaikos",
    "Grasshoppers Zürich",
    "Real Zaragoza",
    "Arsenal",
    "VfB Stuttgart",
    "FC Basel",
    "Ipswich Town",
    "Spartak Moscow",
    "Glentoran",
    "Baník Ostrava",
    "Wacker Innsbruck",
    "Napoli",
    "1.FC Kaiserslautern",
    "Vorwärts Berlin",
    "Newcastle United",
    "BFC Dynamo Berlin",
    "Jeunesse d'Esch",
    "Cardiff City",
    "Aston Villa",
    "Valur Reykjavik",
    "Torpedo Moscow",
    "Dinamo Tbilisi",
    "Lausanne Sports",
    "Slovan Bratislava",
    "Legia Warsaw",
    "Torino",
    "FC Twente Enschede",
    "IFK Göteborg",
    "OFK Belgrade",
    "Spartak Trnava",
    "Hertha BSC",
  ];

  const filteredData = filterTeamsData(teamsData, selectedTeams);
  // const filteredData = filterTeamsData(teamsData, realMadrid);

  const externalOpponents = getExternalOpponentsMatchCount(
    teamsData,
    selectedTeams
  );

  // const externalOpponents = getExternalOpponentsMatchCount(
  //   teamsData,
  //   realMadrid
  // );

  const table = {};
  const processedPairs = new Set();

  for (let team in filteredData) {
    const teamCountry = filteredData[team].country;
    const opponents = filteredData[team].opponents;

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

      const opponentCountry = filteredData[opponent]?.country ?? "Unknown";

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

  return { tableWithPositions, externalOpponents };
}

export default generatePersonalizedTable;
