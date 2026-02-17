// assets/js/api.js
const API_MODE = "mock"; // "mock" | "live"
const BASE_URL = ""; // npr. "https://api.example.com" kad pređeš na live

async function apiGet(path) {
  if (API_MODE === "mock") {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Mock fetch failed: ${path}`);
    return res.json();
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API GET failed: ${path}`);
  return res.json();
}

export async function getTournaments() {
  return apiGet("./mock/tournaments.json");
}

export async function getTournamentById(id) {
  return apiGet(`./mock/tournament-${id}.json`);
}

export async function getMatchById(id) {
  return apiGet(`./mock/match-${id}.json`);
}

// Kasnije (Faza 2): POST result, JOIN endpoint itd.
