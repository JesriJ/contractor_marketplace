# Contractor Marketplace

A full-stack marketplace where customers can find local contractors, post work, compare bids, hire, communicate, pay, and review completed jobs.

Built with Next.js, TypeScript, PostgreSQL, Prisma, and Stripe. The application is deployed on Vercel and uses Stripe test mode for payment demonstrations.

**[View the live application](https://contractor-marketplace-seven.vercel.app/)**

## Product overview

**Customers can**

- Search public contractor profiles by trade and location
- Post jobs, review bids, and assign a contractor
- Send a direct service request from a contractor profile
- Message the assigned contractor within a job
- Pay through Stripe Checkout and review completed work

**Contractors can**

- Publish and update a business profile
- Browse open jobs and submit one bid per job
- Accept or reject direct service requests
- Manage assigned work and mark jobs ready for customer confirmation
- Message customers and build a rating history from completed jobs

## Engineering highlights

- **Authorization at every boundary:** role, ownership, and job-participant checks run on the server rather than relying on hidden UI controls.
- **Transactional marketplace workflows:** bid acceptance and direct-hire acceptance update related records atomically and prevent duplicate assignments.
- **Explicit state transitions:** jobs, bids, service requests, and payments use constrained statuses with validated transitions.
- **Secure payment handling:** amounts are calculated server-side; Stripe webhook signatures are verified; processed event IDs make webhook handling idempotent.
- **Data integrity:** Prisma relations and unique constraints prevent duplicate bids, duplicate reviews, duplicate job conversations, and duplicate job payments.
- **Database-backed messaging:** conversations are limited to job participants and include unread state with periodic refresh.
- **Server-side validation:** Zod schemas validate account, profile, job, bid, message, and review inputs before database writes.

See [Architecture](docs/ARCHITECTURE.md) for the main workflows and security decisions.

## Technology

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- PostgreSQL, Prisma ORM and versioned migrations
- NextAuth.js Credentials authentication and bcrypt
- Stripe Checkout and signed webhooks
- Vercel

## Run locally

Prerequisites: Node.js, npm, and PostgreSQL. Docker Desktop is optional.

```bash
git clone https://github.com/JesriJ/contractor_marketplace.git
cd contractor_marketplace
npm install
```

Copy `.env.example` to `.env`, replace the placeholder values, then initialize the database:

```bash
docker compose up -d
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The repository does not seed sample accounts or marketplace content.

### Stripe webhooks

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli), sign in, and forward the events used by the application:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook --events checkout.session.completed,checkout.session.async_payment_failed,checkout.session.expired,payment_intent.payment_failed
```

Copy the printed `whsec_...` secret into `STRIPE_WEBHOOK_SECRET` and restart the development server.

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
```

With the development server running, the workflow scripts exercise authentication, profiles, jobs and bids, direct hiring, messaging, reviews, and payments:

```bash
node scripts/test-auth.mjs
node scripts/test-profiles.mjs
node scripts/test-jobs.mjs
node scripts/test-hire-requests.mjs
node scripts/test-messages.mjs
node scripts/test-reviews.mjs
node scripts/test-payments.mjs
```

The scripts create temporary records and remove them when complete.

## Deployment notes

Production requires a PostgreSQL connection string, a strong authentication secret, the public application URL, and Stripe credentials. Apply committed migrations with `npm run db:deploy`; never use `prisma migrate dev` against production. The Vercel build command generates the Prisma client before building Next.js.
