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
- Supabase (free tier) for accounts: email-code and optional Google sign-in, Postgres for CVs and purchases (see `docs/ACCOUNTS.md`). Anonymous use still works with browser storage.
- Paddle Billing for the one-time Pro purchase, verified server-side and stored in a signed cookie (see `docs/PAYMENTS.md`)

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
  app/                 routes (landing, builder, cv result, dashboard, pricing, checkout, legal, api/*)
  components/
    builder/           multi-step form, live preview shell, loading screen
    cv/                HTML template renderer, scaled A4 preview, PDF renderer
    result/            template switching, download, AI review panel
    dashboard/ pricing/ landing/ layout/ brand/ ui/
  lib/
    cv/                data model (types.ts), option lists, validation, mapping to render-ready document, example profile
    ai/                Gemini client, prompts, generation/review/apply functions (server-only)
    store/             zustand stores (cvs, entitlement cache)
    payments/          Paddle client, entitlement cookie, config
    auth/              session helpers (Supabase)
    supabase/          browser/server/admin clients
    api/               typed fetch client + route helpers
public/fonts/          TTFs used by the PDF renderer
```

## How AI generation works

1. The builder data (`CVData`) is mapped deterministically to a `CVDocument` (dates formatted, bullets split).
2. The document is sent to Gemini with a system prompt that only allows rewriting, never inventing.
3. The response is validated against a Zod schema (structured outputs) and then hardened server-side: contact
   details, languages, test scores and skills are copied back from the student's own data, and any section whose entry
   count changed is replaced by the original.

## Roadmap seams

- **Auth & database**: live via Supabase once the variables in `docs/ACCOUNTS.md` are set.
- **Payments**: live via Paddle once the variables in `docs/PAYMENTS.md` are set. Pro-only routes are enforced
  server-side in `src/lib/payments/entitlement.ts`.
