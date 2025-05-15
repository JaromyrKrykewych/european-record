"use client";

import { useState } from "react";

export default function SeasonsTable({ data }) {
  const [visibleCount, setVisibleCount] = useState(20);

  const showMore = () => setVisibleCount((prev) => prev + 20);
  const showLess = () => setVisibleCount((prev) => Math.max(prev - 20, 20));

  const tableData = data.slice(0, visibleCount);

  return (
    <div className="max-w-xl mx-auto h-fit my-8 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-lg dark:shadow-zinc-800 transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-center text-zinc-800 dark:text-white">
        Tabla de Posiciones
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden">
          <thead className="bg-zinc-800 text-white dark:bg-zinc-700">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Equipo</th>
              <th className="p-2 text-left">País</th>
              <th className="p-2 text-center">Seasons</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((team, index) => (
              <tr
                key={team.team}
                className="odd:bg-white even:bg-zinc-100 dark:odd:bg-zinc-800 dark:even:bg-zinc-700 hover:bg-yellow-50 dark:hover:bg-zinc-600 transition"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{team.team}</td>
                <td className="p-2">{team.country}</td>
                <td className="p-2 text-center">
                  {team?.seasons || team?.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 19 && (
        <div className="flex justify-center gap-4 mt-6">
          {visibleCount > 39 && (
            <button
              onClick={showLess}
              className="bg-zinc-300 hover:bg-zinc-400 text-black dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              Mostrar menos
            </button>
          )}
          <button
            onClick={showMore}
            disabled={visibleCount >= data.length}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            Mostrar más
          </button>
        </div>
      )}
    </div>
  );
}
