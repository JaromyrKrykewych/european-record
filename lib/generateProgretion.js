import { existsSync, readFileSync, writeFileSync } from "fs";

import getHistoricalCountry from "./getHistoricalCountry";
import { join } from "path";

export default function updateProgression(standings, season) {
  const filePath = join(process.cwd(), "data", "progression.json");

  let existingData = {};

  // Leer y analizar el archivo existente
  if (existsSync(filePath)) {
    try {
      const fileContent = readFileSync(filePath, "utf-8");
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.error("Error al leer o analizar progression.json:", error);
      existingData = {}; // Inicializar como objeto vacío en caso de error
    }
  }

  // Validar que standings sea un array
  if (!Array.isArray(standings)) {
    console.error("Error: 'standings' no es un array válido.");
    return;
  }

  for (let i = 0; i < standings.length; i++) {
    const { team, position, country } = standings[i];

    // Validar campos obligatorios
    if (!team || !position || !country) {
      console.log(
        `Advertencia: Datos incompletos en la entrada ${i + 1}. Se omite.`
      );
      continue;
    }

    const actualCountry = getHistoricalCountry(team, 2025, country);

    if (!existingData[team]) {
      existingData[team] = {
        actualCountry,
        positions: [],
      };
    }

    // Evitar duplicados para la misma temporada
    const alreadyExists = existingData[team].positions.some(
      (entry) => entry.year === season
    );

    if (!alreadyExists) {
      existingData[team].positions.push({ year: season, position });
    }
  }

  // Escribir el archivo actualizado
  try {
    writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
  } catch (error) {
    console.error("Error al escribir progression.json:", error);
  }
}
