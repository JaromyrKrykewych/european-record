"use client";

import { useEffect, useState } from "react";

import LeagueTable from "@/components/Standings";
import Link from "next/link";
import SeasonsTable from "@/components/SeasonStandings";

export default function Home() {
  const [table, setTable] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    fetch("/api/standings")
      .then((res) => res.json())
      .then((data) => {
        setTable(data.table);
        setSeasons(data.seasons);
      });
  }, []);

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/update" className="text-blue-500 hover:underline">
          Update Data
        </Link>
        <Link href={"/personalized"} className="text-blue-500 hover:underline">
          Personalized Table
        </Link>
        <Link href={"/progression"} className="text-blue-500 hover:underline">
          Progression Table
        </Link>
      </div>
      <div className="flex justify-around mb-4">
        {table.length > 0 && <LeagueTable data={table} />}
        {seasons.length > 0 && <SeasonsTable data={seasons} />}
      </div>
    </main>
  );
}
