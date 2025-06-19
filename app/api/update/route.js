import buildHeadToHead from "@/lib/buildHeadToHead";
import fs from "fs";
import { getSheetData } from "@/lib/googleSheet";
import { normalizeClubName } from "@/lib/normalizeClubName";
import path from "path";

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = "2012-13!A1:J348";
  const rawMatches = await getSheetData(sheetId, range);

  const headers = rawMatches[0];
  const rows = rawMatches.slice(1);

  const matches = rows.map((row) => {
    const match = {};
    headers.forEach((header, index) => {
      match[header] = row[index];
    });
    return match;
  });

  const newData = buildHeadToHead(matches);

  const filePath = path.join(process.cwd(), "data", "teamsData.json");
  const existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Merge logic
  for (const rawTeam in newData) {
    const team = normalizeClubName(rawTeam);

    if (!existingData[team]) {
      existingData[team] = newData[rawTeam];
    } else {
      existingData[team].seasons = [
        ...new Set([
          ...(existingData[team].seasons || []),
          ...newData[team].seasons,
        ]),
      ];
      for (const newOpponentData of newData[team].opponents) {
        const opponent = normalizeClubName(newOpponentData.opponent);

        const existingOpponent = existingData[team].opponents.find(
          (r) => normalizeClubName(r.opponent) === opponent
        );

        if (existingOpponent) {
          // Filtrar partidos que ya existen
          const existingMatchKeys = new Set(
            existingOpponent.matches.map(
              (m) =>
                `${m.season}-${m.instance}-${normalizeClubName(
                  m.home
                )}-${normalizeClubName(m.away)}`
            )
          );

          const newUniqueMatches = newOpponentData.matches.filter((m) => {
            const key = `${m.season}-${m.instance}-${normalizeClubName(
              m.home
            )}-${normalizeClubName(m.away)}`;
            return !existingMatchKeys.has(key);
          });

          // Agregar solo los nuevos
          existingOpponent.matches.push(...newUniqueMatches);

          // Recalcular headtohead
          let wins = 0;
          let losses = 0;

          for (const match of existingOpponent.matches) {
            const [g1, g2] = match.result.split("-").map(Number);

            if (normalizeClubName(match.home) === team && g1 > g2) wins++;
            else if (normalizeClubName(match.away) === team && g2 > g1) wins++;
            else if (
              (normalizeClubName(match.home) === opponent && g1 > g2) ||
              (normalizeClubName(match.away) === opponent && g2 > g1)
            ) {
              losses++;
            }
          }

          existingOpponent.headtohead = `${wins}-${losses}`;
        } else {
          // Si no existía el oponente, lo agregamos
          newOpponentData.opponent = opponent; // actualizamos oponente normalizado
          existingData[team].opponents.push(newOpponentData);
        }
      }
    }
  }

  // Guardamos el nuevo JSON actualizado
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  return Response.json({
    success: true,
    message: "Archivo generado",
  });
}
