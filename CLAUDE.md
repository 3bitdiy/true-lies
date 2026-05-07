# True Lies — Tournament Portal

Web portal za upravljanje turnirima školskog kviz-igre "True Lies". Korisnici pregledaju raspored mečeva, prate bracket i pokréću Unity igru direktno iz pregledača.

## Tech stack

- **HTML5** — statičke stranice, bez server-side renderinga
- **Vanilla JavaScript** — ES6 moduli, bez framework-a
- **Tailwind CSS** — via CDN, bez build stepa
- **Jezik UI-a** — srpski (`sr-RS`)
- **Deployment** — GitHub Pages iz `main` grane (`https://3bitdiy.github.io/true-lies/`)

Nema npm-a, nema TypeScript-a, nema build tooling-a. Sve radi direktno u pregledaču.

## Pokretanje lokalno

```bash
python3 -m http.server 8000
# ili
npx http-server
```

Zatim otvori `http://localhost:8000/`.

## Struktura fajlova

```text
/
├── index.html            # Početna stranica (MVP info, navigacija)
├── tournaments.html      # Lista svih turnira
├── tournament.html       # Detalji turnira (bracket po rundama)
├── match.html            # Detalji meča + dugme za pokretanje igre
├── assets/
│   ├── js/
│   │   ├── api.js        # API apstrakcioni sloj (mock ↔ live switch)
│   │   ├── ui.js         # Helperi: qs(), fmtDate(), badge()
│   │   ├── tournaments.js
│   │   ├── tournament.js
│   │   └── match.js
│   └── css/
│       └── app.css       # Minimalni custom CSS (uglavnom Tailwind)
├── mock/
│   ├── tournaments.json
│   ├── tournament-123.json
│   └── match-999.json
└── :0/                   # Dokumentacija (nije deo sajta)
    └── api-kontrakt.md   # API kontrakt između web portala i Unity igre
```

## JS arhitektura

**`api.js`** — jedino mesto gde se menja `API_MODE`:

- `"mock"` → učitava JSON iz `/mock/` foldera
- `"live"` → poziva pravi REST backend (BASE_URL se konfiguriše tu)

Exported funkcije: `getTournaments()`, `getTournamentById(id)`, `getMatchById(id)`.

**`ui.js`** — deljeni helperi:

- `qs(name)` — čita query string parametar iz URL-a
- `fmtDate(iso)` — formatira ISO datum u srpski lokalni format
- `badge(status)` — vraća HTML string sa Tailwind badge klasama za status (`scheduled` / `in_progress` / `finished`)

**Page skripte** — svaka stranica ima sopstveni JS fajl. Koriste IIFE pattern, pozivaju `api.js`, renderuju HTML via template literals.

## Mock data

Fajlovi u `/mock/` simuliraju backend odgovore dok ne postoji pravi server. Struktura odgovara planiranom API kontraktu.

## API kontrakt (Phase 2)

Planirani REST endpointi:

| Method   | Endpoint                  | Opis                                  |
| -------- | ------------------------- | ------------------------------------- |
| `GET`    | `/api/tournaments`        | Lista svih turnira                    |
| `GET`    | `/api/tournaments/:id`    | Detalji turnira sa bracketom          |
| `GET`    | `/api/matches/:id`        | Detalji meča sa `gameJoinUrl`         |
| `POST`   | `/api/matches/:id/result` | Unity igra šalje rezultat             |

**Game flow:**

1. Korisnik otvori stranicu meča → portal poziva `GET /api/matches/:id`
2. Backend vraća `gameJoinUrl` oblika `trueLiesGame://join?matchId=999&token=abc123`
3. Korisnik klikne "Pokreni igru" → pregledač otvori custom URL scheme
4. OS pokrene Unity aplikaciju; igra poziva `GET /api/matches/:id` i igra se
5. Po završetku Unity poziva `POST /api/matches/:id/result`
6. Portal se osveži i prikaže rezultat

## Roadmap

- **Phase 1** (trenutna) — mock podaci, statički HTML, bez backenda
- **Phase 2** — promena `API_MODE` na `"live"`, povez sa REST backendom
- **Phase 3** — WebSocket za live ažuriranje rezultata

## Konvencije

- HTML se generiše template literalima direktno u JS (bez template engine-a)
- Tailwind klase se pišu inline u JS stringovima
- Datumi se formatiraju via `fmtDate()` iz `ui.js`, uvek srpski locale
- Query string parametri se čitaju via `qs()` iz `ui.js`
- Status badge se generiše via `badge()` iz `ui.js`
- Greške se prikazuju korisniku direktno u main elementu stranice

## Šta izbegavati

- Ne dodavati npm pakete ni build tooling bez dogovora
- Ne uvoditi TypeScript dok projekat ne pređe na Phase 2
- Ne duplirati logiku koja već postoji u `api.js` ili `ui.js`
- Ne koristiti `document.write` niti inline event handlere u HTML-u
