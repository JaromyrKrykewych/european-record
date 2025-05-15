"use client";

import { useEffect, useState } from "react";

import LeagueTable from "@/components/Standings";
import Link from "next/link";
import SeasonsTable from "@/components/SeasonStandings";

const presets = [
  { id: "10matches", label: "+10 Matches" },
  { id: "15matches", label: "+15 Matches" },
  // { id: "champions", label: "Champions League Only" },
  // { id: "vsSpain", label: "Vs Spanish Teams" },
];

export default function PersonalizedPage() {
  const [table, setTable] = useState([]);
  const [externalOpponents, setExternalOpponents] = useState([]);
  const [activePreset, setActivePreset] = useState("10matches");

  useEffect(() => {
    fetch("/api/personalized")
      .then((res) => res.json())
      .then((data) => {
        setTable(data.tableWithPositions);
        setExternalOpponents(data.externalOpponents);
      });
  }, []);

  return (
    <main className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Home
        </Link>
        <Link href={"/progression"} className="text-blue-500 hover:underline">
          Progression Table
        </Link>
      </div>
      {/* Cards */}
      <div className="w-[85%] mt-[50px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setActivePreset(preset.id)}
            className={`cursor-pointer rounded-xl border px-2 py-3 text-center font-semibold transition 
              ${
                activePreset === preset.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      {/* Table */}
      <div className="flex justify-around mb-4">
        {table.length > 0 && <LeagueTable data={table} />}
        {externalOpponents.length > 0 && (
          <SeasonsTable data={externalOpponents} />
        )}
      </div>
    </main>
  );
}
