"use client";

import {
  elevenMatches,
  mainLeague,
  tenMatches,
  thirteenMatches,
  twelveMatches,
} from "@/data/selectedTeams";
import { useEffect, useState } from "react";

import LeagueTable from "@/components/Standings";
import Link from "next/link";
import SeasonsTable from "@/components/SeasonStandings";

const presets = [
  { id: "10matches", label: "+10 Matches", selectedTeams: tenMatches }, //165
  { id: "11matches", label: "+11 Matches", selectedTeams: elevenMatches }, //143
  { id: "12matches", label: "+12 Matches", selectedTeams: twelveMatches }, //100
  { id: "13matches", label: "+13 Matches", selectedTeams: thirteenMatches }, //91
  { id: "mainLeague", label: "Main League", selectedTeams: mainLeague }, // 7
];

export default function PersonalizedPage() {
  const [table, setTable] = useState([]);
  const [externalOpponents, setExternalOpponents] = useState([]);
  const [activePreset, setActivePreset] = useState("10matches");

  useEffect(() => {
    if (!activePreset) return;

    const preset = presets.find((p) => p.id === activePreset);
    if (!preset) return;

    const fetchTable = async () => {
      try {
        const res = await fetch("/api/personalized", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teams: preset.selectedTeams,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.log("Error de API:", errorData);
          return;
        }

        const data = await res.json();
        setTable(data.customTable);
        setExternalOpponents(data.externalOpponents);
      } catch (err) {
        console.error("Error al obtener la tabla personalizada:", err);
      }
    };

    fetchTable();
  }, [activePreset]);

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
        {table.length === 0 ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : (
          <>
            <LeagueTable data={table} />
            <SeasonsTable data={externalOpponents} />
          </>
        )}
      </div>
    </main>
  );
}
