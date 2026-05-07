# True Lies — Tournament Portal

Web portal za upravljanje turnirima školske kviz-igre **True Lies**. Korisnici pregledaju raspored mečeva, prate bracket i direktno iz pregledača pokréću Unity igru.

---

## Trenutna tehnologija (Phase 1 — MVP)

| Sloj         | Tehnologija                                                    |
| ------------ | -------------------------------------------------------------- |
| Markup       | HTML5                                                          |
| Stilovi      | [Tailwind CSS](https://tailwindcss.com/) via CDN               |
| Logika       | Vanilla JavaScript (ES6 moduli)                                |
| Podaci       | Statički JSON mock fajlovi                                     |
| Jezik UI-a   | Srpski (`sr-RS`)                                               |
| Deployment   | Statički fajlovi, Apache server (`.htaccess` URL rewrite)      |

Nema build tooling-a, nema npm zavisnosti, nema transpajliranja — sve radi direktno u pregledaču.

**Live:** [3bitdiy.github.io/true-lies](https://3bitdiy.github.io/true-lies/)

---

## Planirana tehnologija

### Phase 2 — Backend integracija

| Sloj               | Tehnologija                                              |
| ------------------ | -------------------------------------------------------- |
| Backend            | REST API (implementacija TBD — Node.js / .NET / drugi)   |
| Autentifikacija    | TBD (JWT ili session-based)                              |
| Web ↔ Unity        | Custom URL scheme `trueLiesGame://`                      |
| Promena u portalu  | Samo `API_MODE = "live"` u `assets/js/api.js`            |

### Phase 3 — Live ažuriranja

| Sloj      | Tehnologija                                                        |
| --------- | ------------------------------------------------------------------ |
| Real-time | WebSocket                                                          |
| Cilj      | Rezultati se prikazuju u realnom vremenu bez osvežavanja stranice  |

---

## Stranice

| Stranica  | Fajl                        | Opis                                  |
| --------- | --------------------------- | ------------------------------------- |
| Početna   | `index.html`                | Pregled projekta, navigacija          |
| Turniri   | `tournaments.html`          | Lista svih turnira                    |
| Turnir    | `tournament.html?id=:id`    | Detalji turnira, bracket po rundama   |
| Meč       | `match.html?id=:id`         | Detalji meča, pokretanje igre         |

---

## Struktura projekta

```text
/
├── index.html
├── tournaments.html
├── tournament.html
├── match.html
├── assets/
│   ├── js/
│   │   ├── api.js          # API apstrakcioni sloj (mock ↔ live switch)
│   │   ├── ui.js           # Deljeni helperi (qs, fmtDate, badge)
│   │   ├── tournaments.js
│   │   ├── tournament.js
│   │   └── match.js
│   └── css/
│       └── app.css
└── mock/
    ├── tournaments.json
    ├── tournament-123.json
    └── match-999.json
```

---

## Pokretanje lokalno

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server
```

Otvori `http://localhost:8000/` u pregledaču.

---

## Game flow (web portal ↔ Unity igra)

```text
Korisnik otvori match.html
        ↓
Portal: GET /api/matches/:id
        ↓
Backend vraća gameJoinUrl
(npr. trueLiesGame://join?matchId=999&token=abc123)
        ↓
Korisnik klikne "Pokreni igru"
        ↓
OS pokrene Unity aplikaciju
        ↓
Unity: GET /api/matches/:id  →  igra se
        ↓
Unity: POST /api/matches/:id/result
        ↓
Portal prikaže rezultat
```

---

## API endpointi (Phase 2)

| Method   | Endpoint                    | Opis                                         |
| -------- | --------------------------- | -------------------------------------------- |
| `GET`    | `/api/tournaments`          | Lista svih turnira                           |
| `GET`    | `/api/tournaments/:id`      | Detalji turnira sa bracketom                 |
| `GET`    | `/api/matches/:id`          | Detalji meča sa `gameJoinUrl`                |
| `POST`   | `/api/matches/:id/result`   | Unity šalje rezultat po završetku igre       |

Detaljan API kontrakt je u `:0/api-kontrakt.md`.

---

## Roadmap

- [x] **Phase 1** — Statički portal sa mock podacima
- [ ] **Phase 2** — Integracija sa REST backendom, pokretanje Unity igre
- [ ] **Phase 3** — WebSocket live ažuriranja rezultata
