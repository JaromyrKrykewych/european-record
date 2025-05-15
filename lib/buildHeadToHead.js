import { COUNTRY_CODES } from "@/data/countryCodes";
import getCountryBySeason from "./countryBySeason";
import { normalizeClubName } from "./normalizeClubName";

export default function buildHeadToHead(matches) {
  const headToHead = {};

  for (const match of matches) {
    const {
      Year: season,
      Competition: competition,
      Instance: instance,
      "Team A": teamA,
      "Team B": teamB,
      "Country A": teamACountry,
      "Country B": teamBCountry,
      "First Leg": firstLeg,
      "Second Leg": secondLeg,
    } = match;

    const legs = [];

    if (firstLeg) {
      legs.push({
        season,
        competition,
        instance,
        home: teamA,
        away: teamB,
        result: firstLeg,
      });
    }

    if (secondLeg) {
      const [g1, g2] = secondLeg.split("-").map(Number);
      legs.push({
        season,
        competition,
        instance,
        home: teamB,
        away: teamA,
        result: `${g2}-${g1}`,
      });
    }

    function updateTeamData(
      teamOriginal,
      opponentOriginal,
      teamACountry,
      teamBCountry
    ) {
      const team = normalizeClubName(teamOriginal);
      const opponent = normalizeClubName(opponentOriginal);
      const teamCountry = getCountryBySeason(
        teamOriginal,
        season,
        COUNTRY_CODES[teamACountry] || teamACountry
      );
      const opponentCountry = getCountryBySeason(
        opponentOriginal,
        season,
        COUNTRY_CODES[teamBCountry] || teamBCountry
      );

      if (!headToHead[team]) {
        headToHead[team] = {
          country: teamCountry,
          seasons: [],
          opponents: [],
        };
      }

      const teamData = headToHead[team];

      if (!teamData.seasons.includes(season)) {
        teamData.seasons.push(season);
      }

      let record = teamData.opponents.find((r) => r.opponent === opponent);

      if (!record) {
        record = {
          opponent: opponent,
          country: opponentCountry,
          matches: [],
          headtohead: "0-0",
        };
        teamData.opponents.push(record);
      }

      for (const leg of legs) {
        record.matches.push({ ...leg });
      }

      // Calcular victorias
      let wins = 0;
      let losses = 0;

      for (const m of record.matches) {
        const [g1, g2] = m.result.split("-").map(Number);

        if (m.home === teamOriginal && g1 > g2) wins++;
        else if (m.away === teamOriginal && g2 > g1) wins++;
        else if (
          (m.home === opponentOriginal && g1 > g2) ||
          (m.away === opponentOriginal && g2 > g1)
        ) {
          losses++;
        }
      }

      record.headtohead = `${wins}-${losses}`;
    }

    updateTeamData(teamA, teamB, teamACountry, teamBCountry);
    updateTeamData(teamB, teamA, teamBCountry, teamACountry);
  }

  return headToHead;
}
