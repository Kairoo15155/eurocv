# Accounts: Supabase setup

Accounts let students keep their CVs across devices. They are
optional: without the Supabase variables the app runs anonymously with browser storage.

Stack: [Supabase](https://supabase.com) free tier for Auth (email code, optional Google) and
Postgres (CVs). Row Level Security ensures users only ever see their own rows.

## 1. Create the project

1. Sign up at https://supabase.com and create a project (any region close to Europe, e.g. Frankfurt).
2. In **Project settings → API** copy the **Project URL** and the **anon public** key.

## 2. Create the tables

Open **SQL Editor** and run each file in `supabase/migrations/` in order.

## 3. Configure Auth

**Authentication → URL configuration**

- Site URL: `https://eurocv.vercel.app`
- Redirect URLs: `https://eurocv.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`

**Authentication → Email templates → Magic Link** (only editable once custom SMTP is set;
the free tier's built-in sender keeps the default link-only template). The default link works
as is. To also let students type a code, include `{{ .Token }}` in the template and set
`NEXT_PUBLIC_AUTH_EMAIL_CODE=true`. Example:

```html
<h2>Your EuroCV sign-in code</h2>
<p>Enter this code on the sign-in page:</p>
<p style="font-size:28px;letter-spacing:6px"><strong>{{ .Token }}</strong></p>
<p>It expires in one hour. If you didn't request it, ignore this email.</p>
```

**Authentication → Providers → Email**: enabled (default). Turn **Confirm email** off so the
code alone signs users in.

**SMTP (recommended for real users)**: Supabase's built-in email sender is rate-limited to a
few messages per hour. Under **Project settings → Authentication → SMTP settings** add any
SMTP provider. Gmail works for a small launch: host `smtp.gmail.com`, port `465`, your Gmail
address as user, and an [App Password](https://myaccount.google.com/apppasswords) as password.

**Google sign-in (optional)**: create an OAuth client in Google Cloud Console (Web
application) with authorised redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`,
paste its ID and secret under **Providers → Google**, then set `NEXT_PUBLIC_AUTH_GOOGLE=true`.

## 4. Environment variables

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `NEXT_PUBLIC_AUTH_GOOGLE` | `true` once Google is configured |

## How it works in the app

- `src/proxy.ts` refreshes the session cookie on each request.
- `src/lib/auth/session.ts` reads the user on the server; `AuthProvider` exposes it to the UI.
- `src/lib/store/cv-sync.ts` loads the account's CVs on sign-in, uploads CVs created
  anonymously in that browser, then writes every change through to the `cvs` table.
