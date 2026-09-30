# Progress

## Current phase

Phase 4 — Direct hiring

## Completed

### Phase 0

- Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL
- Shared layout, navigation, and homepage

### Phase 1

- Customer and contractor accounts
- Registration, bcrypt hashing, NextAuth login and logout
- Protected routes

### Phase 2

- Contractor profiles, public directory, and search
- Verification stays platform-controlled

### Phase 3

- Customers post jobs, contractors bid, and accepting a bid assigns that contractor
- Duplicate bids and bids after assignment are rejected
- Related bid and job updates run in a transaction

### Phase 4

- Customers request service from a contractor profile
- `HireRequest` statuses: `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`
- Migration `20260930015813_add_hire_requests`
- Only the addressed contractor can accept or reject
- Only the customer who sent the request can view it as the customer or cancel it while it is pending
- Accepting a pending request creates one `ASSIGNED` job in the same transaction
- A second accept does not create another job
- Rejecting or cancelling does not create a job
- Customer and contractor dashboards list service requests
- Direct-hire jobs have no budget until a later payment phase

## How to verify Phase 4

```bash
npx prisma migrate deploy
npm run dev
node scripts/test-hire-requests.mjs
```

The script checks validation, the wrong contractor, the wrong customer, acceptance, a repeated accept, rejection, cancellation, and cleanup of the temporary accounts.

In the browser:

1. Log in as a customer and request service from a contractor profile.
2. Log in as that contractor and accept the request from the dashboard or `/hire-requests`.
3. Confirm one assigned job appears for both accounts.
4. Confirm another contractor cannot accept it.

## Not started

- Phase 5: messaging
- Reviews, Stripe, and marking jobs in progress or completed

## Next phase

Phase 5 — Messaging between customers and contractors on an assigned job.
