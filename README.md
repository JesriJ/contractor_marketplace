# Contractor Marketplace

Customers use Contractor Marketplace to find local contractors, post work, compare bids, hire, message, pay, and review completed jobs. Contractors publish a profile, bid on open work, accept service requests, and manage jobs through completion.

**[Open Contractor Marketplace](https://contractor-marketplace-seven.vercel.app/)**

## For customers

- Search contractors by trade and location
- Post a job and compare incoming bids
- Request service directly from a contractor profile
- Message the assigned contractor
- Pay with Stripe
- Confirm completed work and leave a review

## For contractors

- Publish a business profile with trade, location, experience, and rate
- Browse open jobs and submit a bid
- Accept or decline direct service requests
- Track assigned work through completion
- Message customers and collect ratings from finished jobs

## Payments

Checkout is handled by Stripe. The payment amount is determined by the job, and a payment is recorded as successful only after Stripe confirms it. A browser return from Checkout does not change the payment status.

## How it works

Customer and contractor permissions are enforced on the server. A user can change only the jobs, bids, requests, conversations, and reviews that belong to them.

Hiring is transactional. Accepting a bid assigns that contractor and closes the other bids together. Accepting a direct request creates one assigned job, and a repeated acceptance cannot create another.

Each job has one conversation, one payment, and one review. Ratings shown on contractor profiles are calculated from submitted reviews.

[Architecture](docs/ARCHITECTURE.md) describes the data model, access rules, and main workflows.

## Stack

Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, NextAuth.js, and Stripe. The application is hosted on Vercel.
