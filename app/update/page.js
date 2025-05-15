"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdatePage() {
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/update", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // const data = await response.json();
      router.push("/");
    };

    fetchData().catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Update</h1>
      <p>Updating data...</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </main>
  );
}
