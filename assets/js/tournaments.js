// assets/js/tournaments.js
import { getTournaments } from "./api.js";
import { fmtDate } from "./ui.js";

const listEl = document.querySelector("#tournamentList");
const statusEl = document.querySelector("#status");

function card(t) {
  return `
  <a href="./tournament?id=${t.id}" class="block rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-sm transition">
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="text-lg font-semibold">${t.title}</div>
        <div class="text-sm text-gray-600 mt-1">${t.subtitle || ""}</div>
        <div class="text-sm text-gray-500 mt-3">
          ${fmtDate(t.startDate)} → ${fmtDate(t.endDate)}
        </div>
      </div>
      <div class="text-xs text-gray-500">${t.mode}</div>
    </div>
  </a>`;
}

(async function init() {
  try {
    statusEl.textContent = "Loading…";
    const data = await getTournaments();
    listEl.innerHTML = data.tournaments.map(card).join("");
    statusEl.textContent = "";
  } catch (e) {
    statusEl.textContent = `Error: ${e.message}`;
  }
})();
