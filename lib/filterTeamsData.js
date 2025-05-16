export default function filterTeamsData(originalData, selectedTeams) {
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
