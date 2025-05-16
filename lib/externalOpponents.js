export default function getExternalOpponentsMatchCount(
  originalData,
  selectedTeams
) {
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
