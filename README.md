# Contractor Marketplace

Full-stack marketplace connecting customers with local contractors.

Current implementation is through Phase 1: project setup and authentication. Contractor profiles, jobs, bids, messaging, and payments are not built yet.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL and Prisma
- NextAuth.js Credentials and bcrypt
- Stripe later

## Local setup

1. Install Node.js and PostgreSQL (or Docker Desktop for the Compose database).
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Set `NEXTAUTH_SECRET` to a long random string and `NEXTAUTH_URL` to `http://localhost:3000`.
4. Create the database:

```sql
CREATE DATABASE contractor_marketplace;
```

5. Install dependencies, generate the Prisma client, and run migrations:

```bash
npm install
npx prisma migrate dev
```

6. Confirm the database connection:

```bash
npm run db:check
```

7. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional Docker PostgreSQL

If PostgreSQL is already running on port 5432, Compose maps the container to **5433**:

```bash
docker compose up -d
```

Then use the Docker `DATABASE_URL` from `.env.example`.

## Docs

- `docs/PRODUCT_SPEC.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/PROGRESS.md`
