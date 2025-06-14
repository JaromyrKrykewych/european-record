"use client";

import { useEffect, useState } from "react";

import LeagueTable from "@/components/Standings";
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
    <>
      {/* <div className="flex justify-around items-center mt-8 mb-4 text-lg">
        <Link href="/update" className="text-blue-500 hover:underline">
          Update Data
        </Link>
        <Link href={"/personalized"} className="text-blue-500 hover:underline">
          Personalized Table
        </Link>
        <Link href={"/crosstable"} className="text-blue-500 hover:underline">
          Global Head-to-Head
        </Link>
        <Link href={"/progression"} className="text-blue-500 hover:underline">
          Progression Table
        </Link>
      </div> */}
      <div className="flex justify-around mb-4">
        {table.length > 0 && <LeagueTable data={table} />}
        {seasons.length > 0 && <SeasonsTable data={seasons} />}
      </div>
    </>
  );
}
