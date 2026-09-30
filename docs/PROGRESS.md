# Progress

## Current phase

Phase 8 — Polish, testing, and deployment preparation

Deployment to a live URL has not been verified.

## Completed

### Phases 0–7

- Accounts, contractor profiles, job bidding, direct hiring, messaging, completion, reviews, and Stripe test checkout
- Payment status changes only after a verified Stripe webhook
- Job completion requires the contractor to mark the work finished and the customer to confirm it

### Phase 8

- Health check no longer returns raw database error text
- Contractor, job, message, and review lists stay on a valid page instead of requesting an unbounded offset
- Reviews on a contractor profile are paginated
- Shared focus outline, skip link, loading text, and a generic error page
- Login and registration pages are marked not to be indexed
- Message refresh shows an error when polling fails
- README covers local setup, tests, production PostgreSQL, and Vercel
- `npm run build` generates the Prisma client before the Next.js build
- `npm run db:deploy` runs `prisma migrate deploy`

## Local verification

These checks passed locally. They do not verify a live Vercel deployment.

```bash
npx tsc --noEmit
npm run lint
npm run build
node scripts/test-auth.mjs
node scripts/test-profiles.mjs
node scripts/test-jobs.mjs
node scripts/test-hire-requests.mjs
node scripts/test-messages.mjs
node scripts/test-payments.mjs
```

## Deployment checklist

Use this before calling the project deployed. None of these production steps have been completed from this repository.

1. Create a Git remote and push `main`.
2. Create Amazon RDS for PostgreSQL, or another hosted PostgreSQL instance.
3. Set `DATABASE_URL` with `sslmode=require`.
4. Run `npx prisma migrate deploy` against that database.
5. Create a Vercel project from the repository.
6. Set production environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` as the production `https` origin
   - `STRIPE_SECRET_KEY` as an `sk_test_` key until live payments are intentional
   - `STRIPE_WEBHOOK_SECRET` from a Stripe Dashboard webhook endpoint
7. Confirm the Vercel build runs `prisma generate && next build`.
8. Add the Stripe endpoint `https://YOUR_DOMAIN/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_failed`, `checkout.session.expired`, and `payment_intent.payment_failed`.
9. On the live site, register, post or accept a job, send a message, and pay with test card `4242 4242 4242 4242`.
10. Confirm the payment record becomes `SUCCEEDED` only after the webhook, not after the browser returns from Checkout.

## Not started

- A verified production deployment
