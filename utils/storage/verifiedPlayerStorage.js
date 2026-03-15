const STORAGE_KEY = "mlbb_verified_players";
const MAX_RECORDS = 20;

export function saveVerifiedPlayer(player) {
  if (typeof window === "undefined") return;

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // remove duplicate
  const filtered = existing.filter(
    (p) => !(p.playerId === player.playerId && p.zoneId === player.zoneId)
  );

  filtered.unshift(player);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered.slice(0, MAX_RECORDS))
  );
}

export function getVerifiedPlayers(limit = 10) {
  if (typeof window === "undefined") return [];
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all.slice(0, limit);
}
