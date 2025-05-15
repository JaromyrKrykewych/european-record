const ProgressionStandings = ({ data, yearRange, allYears, setYearRange }) => {
  const visibleYears = allYears.slice(yearRange.start, yearRange.end);
  const latestYear = visibleYears[visibleYears.length - 1];

  const handlePrevious = () => {
    if (yearRange.start > 0) {
      setYearRange((prev) => ({
        start: Math.max(0, prev.start - 5),
        end: Math.max(5, prev.end - 5),
      }));
    }
  };

  const handleNext = () => {
    if (yearRange.end < allYears.length) {
      setYearRange((prev) => ({
        start: prev.start + 5,
        end: prev.end + 5,
      }));
    }
  };

  const sortedTeams = Object.entries(data).sort(
    ([teamA, infoA], [teamB, infoB]) => {
      const posA =
        infoA.positions.find((p) => p.year === latestYear)?.position || "999";
      const posB =
        infoB.positions.find((p) => p.year === latestYear)?.position || "999";
      return parseInt(posA) - parseInt(posB);
    }
  );

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-700 bg-gray-900 shadow-lg">
      {/* Botones de navegación */}
      <div className="flex justify-between px-4 py-3 bg-gray-800">
        <button
          onClick={handlePrevious}
          disabled={yearRange.start === 0}
          className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600 disabled:opacity-40"
        >
          ← 5 años atrás
        </button>
        <button
          onClick={handleNext}
          disabled={yearRange.end >= allYears.length}
          className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600 disabled:opacity-40"
        >
          5 años adelante →
        </button>
      </div>

      {/* Tabla de posiciones */}
      <table className="min-w-full text-sm text-gray-300">
        <thead className="bg-gray-800 text-xs uppercase text-white">
          <tr>
            <th className="px-4 py-3 text-left">Pos.</th>
            <th className="px-4 py-3 text-left">Equipo</th>
            <th className="px-4 py-3 text-left">País</th>
            {visibleYears.map((year) => (
              <th key={year} className="px-4 py-3 text-center">
                {`${year.split("").splice(2, 2).join("")}/${
                  year.split("-")[1]
                }`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map(([teamName, { country, positions }], idx) => {
            const positionsMap = Object.fromEntries(
              positions.map(({ year, position }) => [year, position])
            );

            return (
              <tr
                key={teamName}
                className={idx % 2 === 0 ? "bg-gray-950" : "bg-gray-800"}
              >
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{teamName}</td>
                <td className="px-4 py-2">{country}</td>
                {visibleYears.map((year) => (
                  <td key={year} className="px-4 py-2 text-center">
                    {positionsMap[year] || "-"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressionStandings;
