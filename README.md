# Contractor Marketplace

Full-stack marketplace that connects customers with local contractors. Customers can register, search contractors, post jobs, accept bids, request a specific contractor, message, confirm completed work, leave a review, and start a Stripe test checkout. Contractors can publish a profile, bid on jobs, accept service requests, message, and move a job through completion.

Payments stay pending until a verified Stripe webhook arrives. The project is prepared for Vercel, but it has not been deployed to a live URL in this repository.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL and Prisma
- NextAuth.js Credentials and bcrypt
- Stripe Checkout in test mode

## Local setup

1. Install Node.js and PostgreSQL. Docker Desktop is optional.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to your local database.
4. Set `NEXTAUTH_SECRET` to a long random string and `NEXTAUTH_URL` to `http://localhost:3000`.
5. For payments, set `STRIPE_SECRET_KEY` to a test key (`sk_test_...`). Do not use a live key.
6. Create the database if it does not exist:

```sql
CREATE DATABASE contractor_marketplace;
```

7. Install dependencies, apply migrations, and start the app:

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Local PostgreSQL with Docker

If PostgreSQL is already using port 5432, this repo's Compose file maps the container to port 5433:

```bash
docker compose up -d
```

Use the Docker `DATABASE_URL` in `.env.example`.

### Local Stripe webhooks

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli), then run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook --events checkout.session.completed,checkout.session.async_payment_failed,checkout.session.expired,payment_intent.payment_failed
```

Put the printed `whsec_...` value in `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`. Use test card `4242 4242 4242 4242`.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run dev
node scripts/test-auth.mjs
node scripts/test-profiles.mjs
node scripts/test-jobs.mjs
node scripts/test-hire-requests.mjs
node scripts/test-messages.mjs
node scripts/test-payments.mjs
```

The test scripts create temporary accounts and delete them afterward. The dev server must be running.

## Production database

Use a hosted PostgreSQL database, such as Amazon RDS for PostgreSQL. Do not point production at a laptop database.

1. Create an RDS PostgreSQL instance.
2. Allow the Vercel connection path. For a first deployment, RDS can be publicly accessible with SSL required and a security group restricted to Vercel egress addresses, or use a private network later.
3. Create the application database and user.
4. Build `DATABASE_URL`:

```text
postgresql://USER:PASSWORD@HOST:5432/contractor_marketplace?sslmode=require
```

5. From your machine, apply migrations once:

```bash
npx prisma migrate deploy
```

Use the production `DATABASE_URL` for that command. Do not run `prisma migrate dev` against production.

## Vercel

1. Import the Git repository as a Next.js project.
2. Set these environment variables for Production:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (the production `https` URL)
- `STRIPE_SECRET_KEY` (`sk_test_...` until you intentionally switch to live payments)
- `STRIPE_WEBHOOK_SECRET` (from the Stripe Dashboard endpoint, not from `stripe listen`)

3. The build script runs `prisma generate` and `next build`.
4. After the first deploy, add a Stripe webhook endpoint:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe to `checkout.session.completed`, `checkout.session.async_payment_failed`, `checkout.session.expired`, and `payment_intent.payment_failed`.

5. Open the deployed site, register a user, and complete a test checkout. Confirm the payment stays pending until the webhook marks it paid.

Deployment is not finished until those production checks succeed on the live URL.

## Docs

- `docs/PRODUCT_SPEC.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/PROGRESS.md`
