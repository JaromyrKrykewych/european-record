import { CLUB_COUNTRY_HISTORY } from "@/data/clubOrigins";

export default function getHistoricalCountry(teamName, year, defaultCountry) {
  const history = CLUB_COUNTRY_HISTORY[teamName];
  if (!history) return defaultCountry;

  const period = history.find((p) => {
    return parseInt(p.from) <= year && year <= parseInt(p.to);
  });

  return period ? period.country : defaultCountry;
}
