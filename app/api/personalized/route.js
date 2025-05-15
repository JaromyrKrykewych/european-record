import { NextResponse } from "next/server";
import generatePersonalizedTable from "@/lib/generatePersonalizedLeague";

export async function GET() {
  const { tableWithPositions, externalOpponents } = generatePersonalizedTable();
  return NextResponse.json(
    { tableWithPositions, externalOpponents },
    { status: 200 }
  );
}
