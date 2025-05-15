import { JWT } from "google-auth-library";
import credentials from "./credentials.json"; // ajusta la ruta según tu estructura
import { google } from "googleapis";

const auth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function getSheetData(sheetId, range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  return res.data.values; // devuelve una matriz de datos
}
