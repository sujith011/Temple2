# Kodungallur Sree Kurumba Bhagavathy Temple — new website

A modern website for devotees of Kodungallur Sree Kurumba Bhagavathy Temple.

## What is here

- `index.html` — home
- `history.html` — Parasurama / Darika, Kannagi / Senguttuvan, Shankara, the compound
- `festivals.html` — Bharani, Thalappoli, Navaratri, Chandattam
- `darshan.html` — timings, vazhipadu, dress, pooja request
- `visit.html` — how to reach, map, Muziris, contact
- `donate.html` — annadanam, charity, renovation
- `api/submit.js` — validates forms, stores submissions, and sends email notifications
- `js/config.js` — FormSubmit fallback used only when `/api/submit` is unavailable

## Temple Guide chatbot

The floating Temple Guide is available on every page. It answers common questions in English and Malayalam using information already published on this website, then links visitors to the relevant page or form. It runs entirely in the browser, stores no conversation data, and does not require an AI API key.

## Supabase and Resend setup

The three forms submit to `/api/submit`. The endpoint stores each request in Supabase and sends an admin notification plus a devotee auto-reply through Resend.

### 1. Create the database

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the private database schema supplied separately in the SQL Editor.
4. Confirm that these tables exist in **Table Editor**:
   - `pooja_requests`
   - `donation_pledges`
   - `inquiries`

The schema enables Row Level Security and removes direct access from browser roles. The serverless API writes with a server-only Supabase secret key. Never put that key in HTML or browser JavaScript.

### 2. Configure Resend

1. Add and verify your sending domain in Resend.
2. Create a Resend API key.
3. Choose a sender on the verified domain, such as `Kodungallur Temple <forms@yourdomain.com>`.

`onboarding@resend.dev` is suitable only for testing to the email address associated with your Resend account. A verified domain is required to send auto-replies to devotees.

### 3. Add Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

```text
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_server_only_key
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=Kodungallur Temple <forms@yourdomain.com>
ADMIN_EMAIL=temple-office@yourdomain.com
```

Use [`.env.example`](.env.example) as the template. Add the variables to Production, Preview, and Development as needed, then redeploy the project. Do not commit real values.

For an older Supabase project, `SUPABASE_SERVICE_ROLE_KEY` is accepted as a legacy fallback, but new projects should use `SUPABASE_SECRET_KEY`.

### 4. Test each form

Submit one Darshan request, one donation pledge, and one Visit message. Verify:

- the corresponding row appears in Supabase;
- the admin receives a notification;
- a valid devotee email receives the confirmation message;
- no secret key appears in browser source or network request headers.

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
5. Add the environment variables listed above
6. Deploy

`vercel.json` enables clean URLs (`/history` as well as `/history.html`).

## Content note

Photographs of the courtyard and festivals come from the present official site and Kerala Tourism. The lamp emblem and the Kannagi mural are newly made for this site. Sanctum photography is not used.
