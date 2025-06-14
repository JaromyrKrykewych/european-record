"use client";

import clsx from "clsx";
import { normalizeClubName } from "@/lib/normalizeClubName";

const IGNORED_TEAMS = ["Dinamo Kiev"];

const GlobalHeadToHeadTable = ({ data, teams }) => {
  // Función que busca el headtohead entre dos equipos
  const getResult = (teamA, teamB) => {
    if (teamA === teamB) return "—";

    const normalizedA = normalizeClubName(teamA);
    const normalizedB = normalizeClubName(teamB);

    const aToB = data[normalizedA]?.opponents?.find(
      (o) => o.opponent === normalizedB
    );
    const bToA = data[normalizedB]?.opponents?.find(
      (o) => o.opponent === normalizedA
    );

    return aToB?.headtohead || bToA?.headtohead || null;
  };

  const getCellColor = (rowTeam, colTeam, result) => {
    if (!result || result === "—") return "";

    const [aWinsStr, bWinsStr] = result.split("-");
    const aWins = parseInt(aWinsStr);
    const bWins = parseInt(bWinsStr);

    if (isNaN(aWins) || isNaN(bWins)) return "";
    if (rowTeam === colTeam) return "";

    if (aWins > bWins)
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 font-medium";
    if (aWins < bWins)
      return "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100 font-medium";
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100 font-medium";
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden">
        <thead className="bg-zinc-800 text-white dark:bg-zinc-700">
          <tr>
            <th>Club</th>
            {teams
              .filter((team) => !IGNORED_TEAMS.includes(team.name))
              .map((team) => (
                <th key={team.name} title={team.name}>
                  {team.abr}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {teams
            .filter((team) => !IGNORED_TEAMS.includes(team.name))
            .map((rowTeam) => (
              <tr
                key={rowTeam.name}
                className="odd:bg-white even:bg-zinc-100 dark:odd:bg-zinc-800 dark:even:bg-zinc-700 hover:bg-yellow-50 dark:hover:bg-zinc-600 transition"
              >
                <th className="pl-2.5 text-left">{rowTeam.name}</th>
                {teams
                  .filter((team) => !IGNORED_TEAMS.includes(team.name))
                  .map((colTeam) => {
                    const result = getResult(rowTeam.name, colTeam.name);
                    const cellColor = getCellColor(
                      rowTeam.name,
                      colTeam.name,
                      result
                    );

                    return (
                      <td
                        key={colTeam.name}
                        className={clsx(
                          "border px-2 py-1 text-center",
                          !result &&
                            "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-400",
                          result === "—" &&
                            "bg-gray-50 text-gray-400 dark:bg-gray-700 dark:text-gray-300",
                          cellColor
                        )}
                      >
                        {result || "N/P"}
                      </td>
                    );
                  })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalHeadToHeadTable;
