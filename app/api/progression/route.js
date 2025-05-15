import { NextResponse } from "next/server";
import { join } from "path";
import { readFileSync } from "fs";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "progression.json");
    const fileContents = readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al leer progression.json:", error);
    return NextResponse.json(
      { error: "Error al leer progression.json" },
      { status: 500 }
    );
  }
}
