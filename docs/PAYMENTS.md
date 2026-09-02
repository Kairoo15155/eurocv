# Getting paid: Paddle setup

EuroCV sells **Pro** as a one-time €4.99 purchase through [Paddle](https://www.paddle.com).
Paddle is the merchant of record: it charges the student's card, handles VAT for every
country, sends the receipt, and pays you out by bank transfer. You never touch card data.

Paddle accepts sellers based in Georgia and has no monthly fee; it keeps 5% + $0.50 per sale.

## 1. Create your Paddle account

1. Sign up at https://www.paddle.com (choose *Paddle Billing*).
2. Complete the business verification form. Describe the product honestly: "AI-assisted CV
   builder for students, one-time purchase of a Pro upgrade". Approval usually takes a few days.
3. Under **Payouts**, add the bank account that should receive the money.

You can do steps 2 and 3 in parallel with everything below using Paddle's **sandbox**.

## 2. Create the product and price

In the Paddle dashboard (sandbox first, then live):

1. **Catalog → Products → New product**: name `EuroCV Pro`, tax category *Standard digital goods*.
2. Add a **price**: one-time, `EUR 4.99`, name `Pro (one-time)`.
3. Copy the price ID. It starts with `pri_`.

## 3. Get your keys

**Developer tools → Authentication**:

- Create an **API key** (server-side). Copy it once; it is only shown once.
- Create a **client-side token**. This one is safe to expose in the browser.

## 4. Configure EuroCV

Add these to Vercel (Settings → Environment Variables) or `.env.local` for local runs:

| Variable | Value |
| --- | --- |
| `PADDLE_ENVIRONMENT` | `sandbox` while testing, `production` when live |
| `PADDLE_API_KEY` | the API key |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | the client-side token |
| `NEXT_PUBLIC_PADDLE_PRICE_ID` | the `pri_…` id |
| `EUROCV_SESSION_SECRET` | any random string of 32+ characters (`openssl rand -hex 32`) |

Redeploy after changing them.

Also add your site's domain under **Checkout → Website approval** in Paddle
(`eurocv.vercel.app`, plus your custom domain later). Paddle refuses to open the checkout
on unapproved domains.

Then set the **default payment link** (dashboard only, it cannot be set by API):
**Checkout → Checkout settings → Default payment link** = `https://eurocv.vercel.app/checkout`.
On live this must be a real, approved domain, not localhost; on sandbox localhost is fine.

`PADDLE_ENVIRONMENT` is mandatory whenever any other Paddle variable is set. The app refuses
to start with a missing or misspelled value rather than guessing, so live keys can never be
sent to the sandbox or vice versa.

Prices shown on the pricing page and in checkout come from `Paddle.PricePreview()`, so
visitors see their local currency with tax included where Paddle applies it. The country is
taken from Vercel's `x-vercel-ip-country` header when present; otherwise Paddle detects it.
The app never formats or converts prices itself.

## 5. Test in sandbox

With `PADDLE_ENVIRONMENT=sandbox`, open `/checkout`, and pay with Paddle's test card
`4242 4242 4242 4242`, any future expiry, any CVC. After payment the app confirms the
transaction with Paddle's API and unlocks Pro. Then try **Restore purchase** in a private
window with the same email.

## 6. Go live

Repeat steps 2 and 3 in the live dashboard, swap the four Paddle variables in Vercel for the
live values, set `PADDLE_ENVIRONMENT=production`, and redeploy.

## How it works inside the app

- `src/components/pricing/checkout-view.tsx` opens Paddle's overlay checkout and, on
  `checkout.completed`, calls `POST /api/checkout/confirm` with the transaction id.
- `src/lib/payments/paddle.ts` asks Paddle whether that transaction is paid and for the
  EuroCV Pro price.
- `src/lib/payments/entitlement.ts` then issues a signed, httpOnly cookie. The PDF and AI
  routes check it on every request, so Pro cannot be faked from the browser.
- `POST /api/checkout/restore` looks up past purchases by email so students can unlock Pro on
  another device.

When accounts are added, the cookie becomes a database record tied to the user; the checkout
and routes do not need to change.
