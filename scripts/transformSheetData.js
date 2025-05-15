import fs from "fs";
import path from "path";
import rawData from "./rawData.json"; // o donde la tengas guardada como matriz

// Suponiendo que esta sea la data de Google Sheets

const [, ...rows] = rawData; // Ignoramos encabezado

const teamsData = {};

function parseScore(score) {
  if (!score) return [0, 0];
  const [a, b] = score.split("-").map((n) => parseInt(n.trim()));
  return [a, b];
}

function addMatch(team, opponent, matchData, teamGoals, opponentGoals, season) {
  if (!teamsData[team]) teamsData[team] = [];

  let record = teamsData[team].find((r) => r.opponent === opponent);
  if (!record) {
    record = {
      opponent: opponent,
      matches: [],
      headtohead: "0-0",
      seasons: [],
    };
    teamsData[team].push(record);
  }

  record.matches.push(matchData);

  if (!record.seasons.includes(season)) {
    record.seasons.push(season);
  }

  // Actualizamos head-to-head
  const [teamWins, opponentWins] = record.headtohead.split("-").map(Number);
  if (teamGoals > opponentGoals) {
    record.headtohead = `${teamWins + 1}-${opponentWins}`;
  } else if (opponentGoals > teamGoals) {
    record.headtohead = `${teamWins}-${opponentWins + 1}`;
  } // empates no cuentan
}

for (const row of rows) {
  const [season, cup, instance, teamA, , teamB, , leg1, leg2] = row;

  const [a1, b1] = parseScore(leg1);
  const [a2, b2] = parseScore(leg2);

  const totalA = a1 + a2;
  const totalB = b1 + b2;

  const result = leg2 ? `${leg1} / ${leg2}` : `${leg1}`;

  const matchA = {
    season,
    cup,
    instance,
    home: teamA,
    away: teamB,
    result,
  };

  const matchB = {
    season,
    cup,
    instance,
    home: teamB,
    away: teamA,
    result,
  };

  addMatch(teamA, teamB, matchA, totalA, totalB, season);
  addMatch(teamB, teamA, matchB, totalB, totalA, season);
}

// Guardar el resultado en teamsData.json
const filePath = path.join(process.cwd(), "teamsData.json");
fs.writeFileSync(filePath, JSON.stringify(teamsData, null, 2));

console.log("✅ Archivo teamsData.json generado correctamente");
