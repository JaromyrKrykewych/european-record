"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import ProgressionStandings from "@/components/ProgressionStandings";

export default function ProgressionTable() {
  const [data, setData] = useState({});
  const [allYears, setAllYears] = useState([]);
  const [yearRange, setYearRange] = useState({ start: 0, end: 10 });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/progression");
      const json = await res.json();
      setData(json);

      // Extraer y ordenar todos los años
      const yearsSet = new Set();
      Object.values(json).forEach((team) => {
        team.positions.forEach((entry) => yearsSet.add(entry.year));
      });

      const sortedYears = [...yearsSet].sort();
      setAllYears(sortedYears);
      setYearRange({ start: sortedYears.length - 5, end: sortedYears.length });
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="w-3xl mx-auto mt-10 bg-gray-900 rounded-lg shadow-lg p-4">
        <ProgressionStandings
          data={data}
          allYears={allYears}
          yearRange={yearRange}
          setYearRange={setYearRange}
        />
      </div>
    </>
  );
}
