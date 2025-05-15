const { countryBySeason } = require("@/data/countryBySeasons");

function seasonToYear(season) {
  return parseInt(season.split("/")[0]);
}

export default function getCountryBySeason(team, season, fallback) {
  const year = seasonToYear(season);

  const history = countryBySeason[team];
  if (history) {
    for (const period of history) {
      const from = seasonToYear(period.from);
      const to = seasonToYear(period.to);

      if (year >= from && year <= to) {
        return period.country;
      }
    }
  }

  return fallback || "Unknown";
}
