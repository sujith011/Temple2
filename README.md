# Kodungallur Sree Kurumba Bhagavathy Temple — new website

A modern website for devotees of Kodungallur Sree Kurumba Bhagavathy Temple.

## What is here

- `index.html` — home
- `history.html` — Parasurama / Darika, Kannagi / Senguttuvan, Shankara, the compound
- `festivals.html` — Bharani, Thalappoli, Navaratri, Chandattam
- `darshan.html` — timings, vazhipadu, dress, pooja request
- `visit.html` — how to reach, map, Muziris, contact
- `donate.html` — annadanam, charity, renovation
- `js/config.js` — website configuration for email delivery
- `research/kodungallur-temple-research.md` — cited research used to write the copy

## Email Delivery for Forms

Form submissions from **Darshan** (vazhipadu requests), **Donate** (donation pledges), and **Visit** (office messages) are delivered directly to your email inbox.

To set or change your recipient email address:
1. Open [`js/config.js`](file:///d:/Newone/Temple%202/js/config.js)
2. Change `adminEmail: "your-temple-email@example.com"` to your desired email address.

*(Note: On the first submission to a new email address, FormSubmit sends a 1-click confirmation link to your inbox to activate delivery).*

The header has an **EN / മല** switch. The choice is saved in the browser and applies on every page.

## How to open locally

This is a static site. From this folder:

```powershell
py -3 -m http.server 8080
```

Then open http://127.0.0.1:8080/

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Other** (static HTML)
4. Leave build command empty, output directory empty
5. Deploy

`vercel.json` enables clean URLs (`/history` as well as `/history.html`).

## Sources

See `research/kodungallur-temple-research.md`. Photographs of the courtyard and festivals come from the present official site and Kerala Tourism. The lamp emblem and the Kannagi mural are newly made for this site. Sanctum photography is not used.
