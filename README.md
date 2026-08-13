# Kodungallur Sree Kurumba Bhagavathy Temple — new website

A public site for devotees, replacing the thin current pages at [kodungallursreekurumbabhagavathytemple.org](https://kodungallursreekurumbabhagavathytemple.org/).

## What is here

- `index.html` — home
- `history.html` — Parasurama / Darika, Kannagi / Senguttuvan, Shankara, the compound
- `festivals.html` — Bharani, Thalappoli, Navaratri, Chandattam
- `darshan.html` — timings, vazhipadu, dress, pooja request
- `visit.html` — how to reach, map, Muziris, contact
- `donate.html` — annadanam, charity, renovation
- `research/kodungallur-temple-research.md` — cited research used to write the copy

Pooja and donation forms work in the browser (they confirm the request). They are not yet wired to the Cochin Devaswom Board payment or booking APIs. Links to the current official booking and donation pages are kept.

## How to open locally

This is a static site. From this folder:

```powershell
py -3 -m http.server 8080
```

Then open http://127.0.0.1:8080/

## Deploy on Vercel

Repo: [github.com/sujith011/teemp](https://github.com/sujith011/teemp)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `sujith011/teemp`
3. Framework preset: **Other** (static HTML)
4. Leave build command empty, output directory empty
5. Deploy

`vercel.json` enables clean URLs (`/history` as well as `/history.html`).

## Sources

See `research/kodungallur-temple-research.md`. Photographs of the courtyard and festivals come from the present official site and Kerala Tourism. The lamp emblem and the Kannagi mural are newly made for this site. Sanctum photography is not used.
