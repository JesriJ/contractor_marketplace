# Architecture

## Application structure

Contractor Marketplace is a Next.js application. Pages, server-rendered views, route handlers, and server actions share one TypeScript codebase.

```text
src/app/                 Routes, pages, layouts, and API handlers
src/components/          Reusable UI and form components
src/lib/actions/         Server actions for authenticated mutations
src/lib/validations/     Zod input schemas
src/lib/                 Authentication and domain-specific data access
prisma/                  Database schema and migration history
scripts/                 End-to-end workflow checks
```

PostgreSQL is the source of truth. Prisma provides typed database access, relations, constraints, migrations, and transactions. The UI does not decide whether an operation is authorized; server actions and API handlers validate the session, role, record ownership, current status, and input before writing.

## Core domain model

- `User` stores credentials and a `CUSTOMER` or `CONTRACTOR` role.
- `ContractorProfile` stores public business information separately from account data.
- `Job` belongs to a customer and may be assigned to one contractor.
- `Bid` joins a contractor to a job, with a unique constraint on that pair.
- `HireRequest` represents a direct request and links to its resulting job after acceptance.
- `Conversation` is unique per job; `Message` records its sender and timestamp.
- `Review` is unique per job and links the customer, contractor, and completed work.
- `Payment` is unique per job and stores Stripe identifiers and payment state.
- `StripeWebhookEvent` records processed Stripe event IDs for idempotency.

## Authentication and authorization

NextAuth.js uses the Credentials provider. Passwords are hashed with bcrypt before storage and compared on the server during login. Sessions carry the user ID and role needed for authorization checks.

The application applies three levels of access control:

1. Protected routes require an authenticated session.
2. Role checks separate customer and contractor operations.
3. Resource checks verify ownership or participation before returning data or accepting a mutation.

Registration never accepts an authoritative role value indirectly from a profile or session. Role-specific operations re-read the authenticated identity on the server. Public pages expose contractor and job information intended for discovery, not private account or conversation data.

## Marketplace workflows

### Bid acceptance

A customer can accept a pending bid only on a job they own. The transaction assigns the contractor, accepts the selected bid, rejects competing bids, and updates the job status together. Database constraints and status checks prevent a second assignment.

### Direct hiring

A customer creates a request for a specific contractor. Only that contractor can respond. Acceptance runs in a transaction that creates one assigned job and links it back to the request; the unique job relation prevents repeated acceptance from creating duplicate work.

### Messaging

A conversation is associated with an assigned job. Reads and writes require the current user to be either the job's customer or assigned contractor. Per-participant read timestamps support unread indicators, while the client periodically requests new conversation state.

### Completion and reviews

The contractor marks active work ready for confirmation, then the customer confirms completion. Reviews require a completed job, the owning customer, and the assigned contractor. A unique job constraint allows one review per completed job. Public ratings are calculated from stored reviews rather than cached or seeded statistics.

### Payments

The server calculates the checkout amount from job and bid data, creates a Stripe Checkout Session, and stores a pending payment. Returning from Stripe does not mark the payment successful.

Stripe sends payment results to the webhook endpoint. The handler:

1. Verifies the signature against the raw request body.
2. Checks whether the event ID was already processed.
3. Verifies the referenced payment and expected amount.
4. Updates payment state and records the event transactionally.

This keeps browser input and redirect URLs outside the payment trust boundary.

## Production

The live application runs on Vercel with PostgreSQL and Stripe. Account credentials and Stripe secrets stay in the deployment environment.
