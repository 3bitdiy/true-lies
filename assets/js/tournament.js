// assets/js/tournament.js
import { getTournamentById } from "./api.js";
import { qs, fmtDate, badge } from "./ui.js";

const id = qs("id");
const statusEl = document.querySelector("#status");
const titleEl = document.querySelector("#title");
const metaEl = document.querySelector("#meta");
const roundsEl = document.querySelector("#rounds");

function matchRow(m) {
  const score =
    m.status === "finished"
      ? `<span class="font-semibold">${m.scoreTeamA}:${m.scoreTeamB}</span>`
      : `<span class="text-gray-500">—</span>`;

  return `
  <a href="./match?matchId=${m.id}" class="grid grid-cols-12 gap-3 items-center rounded-xl border border-gray-200 bg-white px-4 py-3 hover:shadow-sm transition">
    <div class="col-span-4 font-medium">${m.teamA}</div>
    <div class="col-span-1 text-center">${score}</div>
    <div class="col-span-4 font-medium text-right">${m.teamB}</div>
    <div class="col-span-2 text-sm text-gray-600 text-right">${fmtDate(m.scheduledAt)}</div>
    <div class="col-span-1 text-right">${badge(m.status)}</div>
  </a>`;
}

function roundBlock(r) {
  return `
  <section class="mt-8">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">${r.name}</h3>
      <div class="text-sm text-gray-500">${r.matches.length} matches</div>
    </div>
    <div class="mt-3 space-y-3">
      ${r.matches.map(matchRow).join("")}
    </div>
  </section>`;
}

(async function init() {
  if (!id) {
    statusEl.textContent = "Missing tournament id.";
    return;
  }

  try {
    statusEl.textContent = "Loading…";
    const data = await getTournamentById(id);

    titleEl.textContent = data.title;
    metaEl.textContent = `${data.mode} • ${fmtDate(data.startDate)} → ${fmtDate(data.endDate)}`;

    roundsEl.innerHTML = data.rounds.map(roundBlock).join("");
    statusEl.textContent = "";
  } catch (e) {
    statusEl.textContent = `Error: ${e.message}`;
  }
})();
