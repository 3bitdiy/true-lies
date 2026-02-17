// assets/js/match.js
import { getMatchById } from "./api.js";
import { qs, fmtDate, badge } from "./ui.js";

const matchId = qs("matchId");

const statusEl = document.querySelector("#status");
const titleEl = document.querySelector("#title");
const metaEl = document.querySelector("#meta");
const startBtn = document.querySelector("#startBtn");
const joinLinkEl = document.querySelector("#joinLink");
const resultBox = document.querySelector("#resultBox");

let matchData = null;

function render(m) {
  titleEl.textContent = `${m.teamA} vs ${m.teamB}`;
  metaEl.innerHTML = `
    <div class="flex flex-wrap gap-2 items-center">
      <div class="text-sm text-gray-600">${fmtDate(m.scheduledAt)}</div>
      ${badge(m.status)}
      <div class="text-sm text-gray-500">Match ID: ${m.id}</div>
    </div>
  `;

  if (m.status === "finished") {
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div class="font-semibold">Result</div>
        <div class="mt-1 text-sm text-gray-700">${m.teamA} ${m.scoreTeamA} : ${m.scoreTeamB} ${m.teamB}</div>
        <div class="mt-1 text-sm text-gray-700">Winner: <span class="font-semibold">${m.winner}</span></div>
      </div>
    `;
  } else {
    resultBox.classList.add("hidden");
    resultBox.innerHTML = "";
  }

  // Faza 1: join URL je samo placeholder (kasnije /api/matches/:id/join)
  joinLinkEl.textContent = m.gameJoinUrl || "(not generated yet)";
}

(async function init() {
  if (!matchId) {
    statusEl.textContent = "Missing matchId.";
    return;
  }

  try {
    statusEl.textContent = "Loading…";
    matchData = await getMatchById(matchId);
    render(matchData);
    statusEl.textContent = "";
  } catch (e) {
    statusEl.textContent = `Error: ${e.message}`;
  }
})();

startBtn.addEventListener("click", () => {
  if (!matchData?.gameJoinUrl) {
    alert(
      "Faza 1: gameJoinUrl još nije povezan. Kasnije dolazi iz /api/matches/:id/join.",
    );
    return;
  }
  // Opcija A: redirect
  window.location.href = matchData.gameJoinUrl;

  // Opcija B: iframe (ako hoćeš) — tada bi ovde setovao iframe src.
});
