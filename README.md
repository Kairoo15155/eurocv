# EuroCV

**Your European University CV, made simple.**

Live at **https://eurocv.vercel.app**. Pushes to `main` deploy automatically via Vercel.

An AI-powered CV builder for Georgian students applying to universities in Europe. Students enter their education,
languages, projects, experience, achievements and activities; Gemini rewrites it into professional European-style CV
content; the result is previewed live and exported as an A4 PDF.

## Stack

- Next.js 16 (App Router, TypeScript) · React 19
- Tailwind CSS 4 · shadcn/ui (Base UI)
- Google Gemini SDK (`@google/genai`) with structured JSON output — server-side only, free tier
- `@react-pdf/renderer` for A4 PDF generation with bundled Inter / Source Serif 4
- Supabase (free tier) for accounts: email-code and optional Google sign-in, Postgres for CVs (see `docs/ACCOUNTS.md`). Anonymous use still works with browser storage.

## Getting started

```bash
cp .env.example .env.local   # add your GEMINI_API_KEY
npm install
npm run dev
```

Open http://localhost:3000.

## Project layout

```
src/
  app/                 routes (landing, builder, cv result, dashboard, legal, api/*)
  components/
    builder/           multi-step form, live preview shell, loading screen
    cv/                HTML template renderer, scaled A4 preview, PDF renderer
    result/            template switching, download, AI review panel
    dashboard/ landing/ layout/ brand/ ui/
  lib/
    cv/                data model (types.ts), option lists, validation, mapping to render-ready document, example profile
    ai/                Gemini client, prompts, generation/review/apply functions (server-only)
    store/             zustand stores (cvs, session cache)
    auth/              session helpers (Supabase)
    supabase/          browser/server clients
    api/               typed fetch client + route helpers
public/fonts/          TTFs used by the PDF renderer
```

## Brand assets

`public/brand/` holds the logo as SVG (text outlined, so no font is needed) and PNG: `eurocv-logo*.svg|png`
(horizontal lockup, dark and white versions), `eurocv-mark*.svg|png` (mark only) and `icon-*.png`. The favicon
(`favicon.ico`) and the social preview (`opengraph-image.png`, `twitter-image.png`)
live in `src/app/` and are picked up by Next.js automatically. `src/components/brand/logo.tsx` renders the same
mark inline.

## How AI generation works

1. The builder data (`CVData`) is mapped deterministically to a `CVDocument` (dates formatted, bullets split).
2. The document is sent to Gemini with a system prompt that only allows rewriting, never inventing.
3. The response is validated against a Zod schema (structured outputs) and then hardened server-side: contact
   details, languages, test scores and skills are copied back from the student's own data, and any section whose entry
   count changed is replaced by the original.

## Roadmap seams

- **Auth & database**: live via Supabase once the variables in `docs/ACCOUNTS.md` are set.
- **Payments**: none. EuroCV is free; every feature (PDF, all templates, AI review) is open to everyone.
