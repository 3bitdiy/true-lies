// assets/js/ui.js
export function qs(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("sr-RS", { dateStyle: "medium", timeStyle: "short" });
}

export function badge(status) {
  const map = {
    scheduled: "bg-blue-100 text-blue-700",
    in_progress: "bg-amber-100 text-amber-700",
    finished: "bg-emerald-100 text-emerald-700",
  };
  const cls = map[status] || "bg-gray-100 text-gray-700";
  return `<span class="px-2 py-1 rounded-full text-xs font-medium ${cls}">${status}</span>`;
}
