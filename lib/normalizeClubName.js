import { CLUB_ALIASES } from "@/data/clubAliases";

export function normalizeClubName(name) {
  return CLUB_ALIASES[name] || name;
}
