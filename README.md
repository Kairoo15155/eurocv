# EuroCV

**Your European University CV, made simple.**

Live at **https://eurocv.vercel.app**. Pushes to `main` deploy automatically via Vercel.

An AI-powered CV builder for Georgian students applying to universities in Europe. Students enter their education,
languages, projects, experience, achievements and activities; Claude rewrites it into professional European-style CV
content; the result is previewed live and exported as an A4 PDF.

## Stack

- Next.js 16 (App Router, TypeScript) · React 19
- Tailwind CSS 4 · shadcn/ui (Base UI)
- Anthropic SDK (`@anthropic-ai/sdk`) with structured outputs — server-side only
- `@react-pdf/renderer` for A4 PDF generation with bundled Inter / Source Serif 4
- Zustand (persisted to localStorage) for CVs in the MVP
- Paddle Billing for the one-time Pro purchase, verified server-side and stored in a signed cookie (see `docs/PAYMENTS.md`)

## Getting started

```bash
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
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
    ai/                Claude client, prompts, generation/review/apply functions (server-only)
    store/             zustand stores (cvs, entitlement cache)
    payments/          Paddle client, entitlement cookie, config
    auth/              session seam for future Google/email login
    api/               typed fetch client + route helpers
public/fonts/          TTFs used by the PDF renderer
```

## How AI generation works

1. The builder data (`CVData`) is mapped deterministically to a `CVDocument` (dates formatted, bullets split).
2. The document is sent to Claude with a system prompt that only allows rewriting, never inventing.
3. The response is validated against a Zod schema (structured outputs) and then hardened server-side: contact
   details, languages, test scores and skills are copied back from the student's own data, and any section whose entry
   count changed is replaced by the original.

## Roadmap seams

- **Auth**: `src/lib/auth/session.ts` — implement `getSession()` and flip `AUTH_ENABLED`.
- **Database**: `src/lib/store/cv-store.ts` exposes a repository-like API; replace persistence with server calls.
- **Payments**: live via Paddle once the variables in `docs/PAYMENTS.md` are set. Pro-only routes are enforced
  server-side in `src/lib/payments/entitlement.ts`.
