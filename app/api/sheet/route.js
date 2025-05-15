import buildHeadToHead from "@/lib/buildHeadToHead";
import fs from "fs";
import { getSheetData } from "@/lib/googleSheet";
import path from "path";

function transformToObjects(matrix) {
  const [headers, ...rows] = matrix;
  return rows.map((row) =>
    Object.fromEntries(headers.map((key, i) => [key, row[i] || ""]))
  );
}

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = "1955-56!A1:J16";

  try {
    const matrix = await getSheetData(sheetId, range);
    const matches = transformToObjects(matrix);
    const teamsData = buildHeadToHead(matches);

    const filePath = path.join(process.cwd(), "data", "teamsData.json");
    fs.writeFileSync(filePath, JSON.stringify(teamsData, null, 2));

    return Response.json({
      success: true,
      message: "Archivo generado",
      totalTeams: Object.keys(teamsData).length,
    });
  } catch (error) {
    console.error("Error leyendo Google Sheets:", error);
    return Response.json({ success: false, error: error.message });
  }
}
