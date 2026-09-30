# Contractor Marketplace

## Product Requirements Document + Technical Specification

**Document purpose:**
This document defines the product, technical architecture, functionality, database design, user experience, deployment strategy, and implementation requirements for a full-stack contractor marketplace web application.

The document is intended to be supplied to another AI coding agent or software engineer and should be treated as the primary specification for rebuilding the project from scratch.

The goal is not to create an unnecessarily complicated enterprise application. The goal is to build a **realistic, polished, portfolio-quality full-stack marketplace** that feels like something a small software team could actually ship.

The final product should be functional end-to-end, visually polished, easy to understand, and simple enough that a single developer can maintain it.

---

# 1. Product Overview

## 1.1 Product Name

Working name:

**Contractor Marketplace**

The name can be changed later. The application should be structured so branding can easily be changed without rewriting the application.

---

# 2. Problem

Finding a reliable contractor for home and property-related work is often fragmented.

Customers may need help with:

* Plumbing
* Electrical work
* Carpentry
* HVAC
* Painting
* Landscaping
* General repairs
* Appliance installation
* Roofing
* Flooring
* Moving
* Handyman work
* Other local services

The traditional process is inconvenient:

1. A customer realizes they need work done.
2. They search Google, social media, or ask friends.
3. They contact multiple contractors separately.
4. They wait for responses.
5. Prices and availability are difficult to compare.
6. There is little consistency in how contractor information is presented.
7. Communication becomes scattered across text, email, and phone calls.

Contractors have the opposite problem.

They need a way to:

* Find customers
* Advertise their services
* Show their experience
* Receive job opportunities
* Submit bids
* Communicate with customers
* Manage active work
* Receive payment
* Build a reputation through reviews

The application should provide a centralized marketplace for both sides.

---

# 3. Product Solution

The application is a two-sided marketplace connecting:

**Customers ↔ Contractors**

Customers should be able to:

* Search for contractors
* Browse contractor profiles
* Search job postings
* Post jobs
* Receive contractor bids
* Hire contractors
* Message contractors
* Pay contractors
* Track active and completed jobs
* Leave reviews

Contractors should be able to:

* Create a professional profile
* Describe their trade and services
* Display experience and hourly rate
* Search customer job postings
* Submit bids
* Receive direct service requests
* Message customers
* Accept work
* Track jobs
* Receive payments
* Build a review history
* Display completed/past work

The platform should support two primary workflows:

### Marketplace workflow

Customer posts a job → Contractors discover job → Contractor submits bid → Customer reviews bids → Customer accepts bid → Job becomes active → Messaging → Payment → Completion → Review.

### Direct-hire workflow

Customer discovers contractor → Customer requests service → Contractor accepts → Job is created → Messaging → Payment → Completion → Review.

Both workflows should eventually converge into the same active job system.

---

# 4. Product Goals

The application should accomplish the following:

### Primary goals

1. Make it easy for a customer to find a contractor.
2. Make it easy for a contractor to find jobs.
3. Give both users a central place to communicate.
4. Provide enough profile information to establish trust.
5. Support a complete job lifecycle.
6. Support real payment processing.
7. Provide a clean, modern web experience.
8. Be technically credible as a full-stack software engineering portfolio project.

### Secondary goals

* Demonstrate authentication and authorization.
* Demonstrate relational database design.
* Demonstrate API development.
* Demonstrate server-side rendering.
* Demonstrate client-side interactivity.
* Demonstrate payment integration.
* Demonstrate deployment.
* Demonstrate real-world application architecture.
* Demonstrate Git/GitHub development practices.

---

# 5. Product Philosophy

The project should intentionally remain **simple but complete**.

Do not build:

* A social network.
* A complicated recommendation engine.
* An unnecessarily abstract microservice architecture.
* A custom payment system.
* A huge admin platform.
* Dozens of unnecessary user settings.
* Excessive animations.
* Overly complicated frontend component systems.

The application should feel like a **small startup MVP that has been thoughtfully designed**.

Every feature should have a clear reason to exist.

---

# 6. Target Users

There are two primary user roles.

## 6.1 Customer

A customer is someone looking to hire a contractor.

Examples:

* Homeowner
* Renter
* Property manager
* Small business owner
* Landlord

Customer capabilities include:

* Create account
* Browse contractors
* Search contractors
* View contractor profiles
* Post jobs
* Receive bids
* Accept/reject bids
* Message contractors
* Hire contractors
* Pay contractors
* Track jobs
* Leave reviews

---

## 6.2 Contractor

A contractor provides services.

Examples:

* Plumber
* Electrician
* Carpenter
* HVAC technician
* Painter
* Landscaper
* Handyman
* Roofer

Contractor capabilities include:

* Create account
* Create profile
* Specify trade
* Specify service area
* Set hourly rate
* Describe experience
* Search jobs
* View job details
* Submit bids
* Receive direct service requests
* Message customers
* Accept/reject requests
* Manage active jobs
* Receive payment
* View reviews

---

# 7. Authentication

Authentication should use:

**NextAuth.js**

Users register using:

* Email
* Password
* Role

Passwords must never be stored in plaintext.

Use:

**bcrypt**

for password hashing.

The authentication system should support:

* Registration
* Login
* Logout
* Persistent sessions
* Protected pages
* Role-based authorization

Roles:

```text
CUSTOMER
CONTRACTOR
```

A user should not be able to access functionality intended exclusively for another role.

Examples:

* A customer cannot submit a contractor bid.
* A contractor cannot create a customer job under the customer workflow.
* A customer cannot accept another customer's bid.
* A contractor can only respond to hire requests addressed to that contractor.

---

# 8. Recommended Technical Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Use the Next.js App Router.

Prefer server components where appropriate.

Use client components only when interactivity requires them.

---

## Backend

The backend should remain inside the Next.js application.

Use:

* Next.js Route Handlers
* Next.js Server Actions where appropriate
* Prisma
* PostgreSQL
* NextAuth.js

There is no need to build a separate Express or NestJS backend.

---

## Database

**PostgreSQL**

ORM:

**Prisma**

The database should use foreign keys and relational integrity.

Use Prisma migrations for schema changes.

---

## Authentication

**NextAuth.js**

Credentials-based authentication should be used for the initial implementation.

---

## Password Security

**bcrypt**

---

## Payments

**Stripe**

Stripe should handle payment processing.

Never store raw credit card information in PostgreSQL.

Use Stripe Checkout or Stripe Payment Intents rather than attempting to implement custom card handling.

Stripe webhooks should be used for confirming payment events.

---

## File/Image Storage

For production:

**AWS S3**

can be used for contractor profile pictures and future portfolio images.

For an initial MVP, profile images may also support externally hosted URLs if implementing S3 would significantly complicate the first version.

The architecture should make it possible to switch to S3 without redesigning the database.

---

# 9. Deployment Architecture

The recommended deployment architecture is:

```text
User
  |
  v
Vercel
  |
  +--> Next.js Application
  |
  +--> Stripe
  |
  +--> AWS RDS PostgreSQL
  |
  +--> AWS S3
```

## Vercel

Vercel should host the Next.js application.

This handles:

* Next.js deployment
* HTTPS
* Production builds
* Environment variables
* Serverless/server-rendered application infrastructure
* Preview deployments

---

## AWS RDS

PostgreSQL should ideally be hosted using:

**AWS RDS for PostgreSQL**

This provides a production database separate from the local development environment.

The application should use an environment variable for the production database URL.

Example:

```env
DATABASE_URL="postgresql://..."
```

Do not commit this value to GitHub.

---

## AWS S3

Use S3 for production image storage if profile images are implemented as uploaded files.

Example use cases:

* Contractor profile images
* Portfolio images
* Future job attachments

---

## Docker

Docker should be part of the development infrastructure.

Docker can be used for:

* Local PostgreSQL
* Consistent development environments
* Application containerization
* Future migration to AWS ECS or another container platform

A Docker Compose setup is recommended for local development.

Example:

```text
docker-compose.yml
```

containing a PostgreSQL service.

The application does **not** need to run inside Docker on Vercel.

Docker should therefore be viewed as:

1. Local environment standardization
2. Reproducible infrastructure
3. Optional future production deployment

This prevents unnecessary complexity while still giving the project legitimate Docker experience.

---

# 10. Environment Variables

The application should use environment variables for secrets and environment-specific configuration.

Example:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
```

Only variables that actually need to be exposed to the browser should use the appropriate `NEXT_PUBLIC_` prefix.

Secrets must never be committed to Git.

A `.env.example` file should be included.

Example:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
```

---

# 11. Application Structure

Recommended structure:

```text
src/
  app/
    page.tsx

    login/
      page.tsx

    register/
      page.tsx

    dashboard/
      page.tsx

    jobs/
      page.tsx
      [id]/
        page.tsx

    contractors/
      page.tsx
      [id]/
        page.tsx

    messages/
      page.tsx
      [conversationId]/
        page.tsx

    payments/
      success/
        page.tsx
      cancel/
        page.tsx

    api/
      auth/
        [...nextauth]/
          route.ts

      register/
        route.ts

      login/
        route.ts

      jobs/
        route.ts

      bids/
        route.ts

      contractors/
        route.ts

      hire-requests/
        route.ts

      messages/
        route.ts

      payments/
        route.ts

      stripe/
        webhook/
          route.ts

  components/
  lib/
  types/
```

The exact structure can change if Next.js conventions make another arrangement cleaner, but the application should remain organized around features.

---

# 12. Homepage

The homepage is one of the most important parts of the application.

It should immediately explain:

**What the application does and how to use it.**

The homepage should contain:

## Navigation

Left:

**Contractor Marketplace**

Center/right navigation:

* Find Contractors
* Find Jobs
* Post a Job
* Messages

Right:

* Log In
* Sign Up

When logged in:

* Dashboard
* Messages
* Profile
* Log Out

Navigation should change based on role where appropriate.

---

## Hero section

Example messaging:

**Find the right contractor for the job.**

Supporting text:

**Connect with local contractors, compare bids, communicate directly, and manage your project from one place.**

Primary button:

**Find a Contractor**

Secondary button:

**Post a Job**

Avoid exaggerated startup-style marketing language.

The website should feel like a real practical service rather than an AI-generated landing page.

---

# 13. Homepage Search

The homepage should include a prominent search interface.

Search fields:

```text
What service do you need?
Where?
```

Example:

```text
[ Plumbing, electrical, landscaping... ] [ City ] [ Search ]
```

Search should eventually allow:

* Trade
* City
* State

Search results can redirect to:

```text
/contractors?trade=plumbing&city=college-park
```

or the equivalent implementation.

---

# 14. Homepage Content

Below the hero/search area, show practical content.

Possible sections:

### Popular Services

Examples:

* Plumbing
* Electrical
* HVAC
* Landscaping
* Painting
* Carpentry

### Featured Contractors

Show a small number of contractor cards.

Each card can show:

* Company name
* Trade
* Location
* Rating
* Hourly rate
* Verification badge

### Recent Jobs

Show a few recent public jobs.

Each job displays:

* Job title
* Location
* Budget
* Posted date
* Number of bids

### How It Works

For customers:

1. Post a job
2. Compare bids
3. Hire a contractor

For contractors:

1. Find jobs
2. Submit a bid
3. Get hired

Keep this section visually simple.

---

# 15. Contractor Directory

Route:

```text
/contractors
```

Purpose:

Allow customers to discover contractors.

The directory should support:

* Search
* Trade filtering
* City filtering
* State filtering
* Optional rating filtering
* Optional price filtering

A contractor card should show:

```text
[Profile image]

ABC Plumbing

Plumbing

College Park, MD

★★★★★ 4.8

$75/hr

5 years experience

✓ Verified

[View Profile]
```

Do not overload the cards with every database field.

---

# 16. Contractor Profile

Route:

```text
/contractors/[id]
```

A contractor's public profile should include:

* Profile image
* Company name
* Trade
* City
* State
* Verification status
* Years of experience
* Hourly rate
* Bio
* Average rating
* Reviews
* Completed work / past jobs
* Service request button

Example:

```text
ABC Plumbing
Plumbing
✓ Verified

College Park, MD

5 years experience
$75/hr

About
Home repair specialist...

Rating
4.8 / 5

Reviews
...

Past Work
...
```

Primary CTA:

**Request Service**

The user must be logged in to make a request.

---

# 17. Contractor Profile Creation

After registering as a contractor, the contractor should be able to create a profile.

Fields:

```text
Company Name
Trade
Bio
Hourly Rate
Years Experience
City
State
Profile Image
```

Verification must **not** be a field the contractor can simply set to true.

Verification is platform-controlled.

Default:

```text
verified = false
```

An administrator or future verification system can change it.

---

# 18. Customer Profile

A separate customer profile system is optional for the initial implementation.

The primary identity can remain the `User` model.

Customer information can initially be:

* Email
* Optional name
* Optional location

A full CustomerProfile model can be introduced later without restructuring the rest of the platform.

This is intentional.

The project should not create unnecessary models simply for architectural completeness.

---

# 19. Job Posting System

Customers should be able to create public job postings.

Example:

```text
Fix leaking kitchen sink

The kitchen sink has been leaking from the pipe underneath.
Looking for someone who can inspect and repair it.

Budget: $300
Location: College Park, MD
```

Job fields:

* Title
* Description
* Budget
* Location
* Status
* Customer
* Contractor
* Created date
* Updated date

---

# 20. Job Status

Recommended statuses:

```text
OPEN
BIDDING
ASSIGNED
IN_PROGRESS
COMPLETED
CANCELLED
```

The exact number can be reduced during implementation if needed.

Typical progression:

```text
OPEN
  ↓
BIDDING
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
COMPLETED
```

A job can also become:

```text
CANCELLED
```

---

# 21. Job Discovery

Contractors need a dedicated page for finding jobs.

Route:

```text
/jobs
```

It should display public/open jobs.

Filters:

* Search keyword
* Trade/category
* Location
* Budget range

Each job card:

```text
Fix leaking kitchen sink

Plumbing
College Park, MD

Budget: $300

Posted 2 hours ago

12 bids

[View Job]
```

---

# 22. Job Details

Route:

```text
/jobs/[id]
```

Display:

* Job title
* Description
* Budget
* Location
* Posted date
* Customer information where appropriate
* Number of bids
* Current status

Contractors should see:

**Submit Bid**

Customers should see:

**Manage Job**

A contractor should not be able to bid on:

* Their own job
* Closed jobs
* Completed jobs
* Cancelled jobs

---

# 23. Bidding

Contractors can submit a bid on an open job.

Bid fields:

```text
Amount
Message
Estimated timeline
```

Example:

```text
Bid Amount: $250

Message:
I can complete this repair this weekend and will bring the required
materials.

Estimated time:
2 hours
```

---

# 24. Bid Rules

A contractor may submit only one active bid per job unless editing/revising is explicitly supported.

A customer can:

* View bids
* Compare bids
* Accept one bid
* Reject bids

Once a bid is accepted:

* The selected contractor becomes assigned to the job.
* The job status becomes `ASSIGNED`.
* Other pending bids should become rejected or otherwise closed.
* The contractor should be notified in the UI.

---

# 25. Direct Hiring

Customers should also be able to hire contractors without posting a public job first.

From a contractor profile:

```text
Request Service
```

The customer should provide a short message/project description.

Example:

```text
I need help replacing two bathroom faucets sometime this week.
```

This creates a `HireRequest`.

Status:

```text
PENDING
```

---

# 26. Hire Request Workflow

Contractor receives:

```text
New Service Request

From: customer@example.com

I need help replacing two bathroom faucets...

[Accept] [Reject]
```

Accepting should:

1. Mark the request `ACCEPTED`.
2. Create or assign a job.
3. Associate the contractor.
4. Associate the customer.
5. Give both users a place to manage the resulting job.
6. Allow messaging.
7. Allow payment.

Rejecting:

1. Changes status to `REJECTED`.
2. Keeps the request in the contractor/customer history.
3. Does not create an active job.

Only the contractor the request was addressed to can accept/reject it.

---

# 27. Active Jobs

Once a contractor is hired, the resulting job appears in both users' dashboards.

Customer:

```text
My Active Jobs
```

Contractor:

```text
My Active Jobs
```

Information:

* Job title
* Other party
* Status
* Budget
* Location
* Last activity
* Message button
* Job details button

---

# 28. Job Lifecycle

A job should have a clear lifecycle.

Example:

```text
OPEN
↓
BIDDING
↓
ASSIGNED
↓
IN_PROGRESS
↓
COMPLETED
```

For direct hires:

```text
REQUEST
↓
ACCEPTED
↓
ASSIGNED
↓
IN_PROGRESS
↓
COMPLETED
```

Either party can cancel under appropriate conditions.

Completed jobs should become eligible for reviews.

---

# 29. Messaging

The platform must support direct messaging between customers and contractors.

Messaging should be associated with a job or hiring relationship whenever possible.

Avoid building a completely unrestricted social messaging platform.

Recommended structure:

```text
Conversation
    |
    +-- Customer
    +-- Contractor
    +-- Job
    |
    +-- Messages
```

A conversation can be created automatically when:

* A bid is accepted
* A hire request is accepted
* A customer starts messaging a contractor regarding a job

---

# 30. Messaging Interface

Route:

```text
/messages
```

show conversation list.

Example:

```text
Messages

ABC Plumbing
Last message: I can come by tomorrow afternoon.

Mike's Electrical
Last message: The quote has been updated.
```

Clicking a conversation opens:

```text
/messages/[conversationId]
```

Display:

* Header with contractor/customer
* Associated job
* Message history
* Text input
* Send button

Messages should be timestamped.

The current user's messages should visually differ from the other user's messages.

Do not overdesign the messaging UI.

---

# 31. Messaging Requirements

Users should only be able to view conversations they belong to.

Users should not be able to guess a conversation ID and access another user's messages.

Every message must have:

* Conversation ID
* Sender ID
* Content
* Created timestamp

Messages should be stored in PostgreSQL.

For the initial MVP, simple HTTP-based message loading is acceptable.

Real-time WebSocket infrastructure is not required.

A polling or refresh-based implementation is sufficient.

---

# 32. Reviews and Ratings

Reviews should only become available after a job is completed.

A customer should be able to rate a contractor.

Review fields:

```text
Rating: 1-5
Comment
Job
Customer
Contractor
CreatedAt
```

A customer should not be able to review a contractor unless:

1. They were associated with the job.
2. The job is completed.

A customer should not be able to submit multiple reviews for the same completed job.

---

# 33. Contractor Ratings

Contractor profiles should display:

```text
4.8 / 5
```

and:

```text
23 reviews
```

The average can be calculated from the Review table.

Avoid permanently storing a calculated average unless there is a performance reason.

---

# 34. Past Jobs

Past jobs should be derived from actual completed jobs rather than creating a completely separate redundant system.

A contractor's profile can show:

```text
Past Work

Kitchen Sink Repair
College Park, MD
Completed

Bathroom Faucet Replacement
Greenbelt, MD
Completed
```

Later, these jobs can include images.

For the first implementation, text-based past jobs are enough.

---

# 35. Verification

Contractor verification should be represented by:

```text
verified: Boolean
```

Default:

```text
false
```

Public profile:

```text
✓ Verified
```

Do not create a fake automated verification system.

For the MVP, verification can be manually controlled through a database/admin mechanism.

The UI should make it clear that the badge means the account has been verified by the platform.

---

# 36. Payments

Payments should use:

**Stripe**

The marketplace should not directly process or store card information.

Potential workflow:

```text
Customer
   ↓
Active Job
   ↓
Pay Contractor
   ↓
Stripe Checkout
   ↓
Stripe
   ↓
Webhook
   ↓
Payment marked successful
```

---

# 37. Stripe Implementation

Recommended initial implementation:

Use Stripe Checkout.

The application creates a Checkout Session using the server-side Stripe SDK.

The customer is redirected to Stripe.

After payment:

```text
Stripe → webhook → application
```

The webhook verifies the Stripe event.

The payment record is updated.

Never trust only the frontend success page to mark a payment successful.

---

# 38. Payment Data Model

Potential fields:

```text
Payment
- id
- jobId
- customerId
- contractorId
- amount
- currency
- stripePaymentIntentId
- stripeCheckoutSessionId
- status
- createdAt
- updatedAt
```

Payment statuses:

```text
PENDING
SUCCEEDED
FAILED
REFUNDED
```

---

# 39. Marketplace Payment Scope

For the initial version, the simplest payment architecture is:

**Customer pays through Stripe → platform records the transaction.**

A true marketplace payout system using Stripe Connect can be added later.

The first implementation does not need to build a complicated multi-party payment infrastructure.

The architecture should, however, avoid making Stripe Connect impossible later.

---

# 40. Payment Security

Never:

* Store card numbers
* Store CVV
* Store raw payment credentials
* Trust arbitrary client-side payment amounts

The amount charged should be determined by server-side job/payment data.

Stripe webhook signatures must be verified.

---

# 41. Dashboard

The dashboard should adapt to the user's role.

---

## Customer Dashboard

Sections:

```text
Customer Dashboard

Active Jobs
My Job Posts
Incoming Bids
Hire Requests
Completed Jobs
Recent Messages
```

A simple dashboard can prioritize:

1. Active Jobs
2. My Jobs
3. Recent Messages
4. Completed Jobs

---

## Contractor Dashboard

Sections:

```text
Contractor Dashboard

Active Jobs
My Bids
Hire Requests
Completed Jobs
Recent Messages
```

The contractor should also have a link to:

```text
Edit Profile
```

---

# 42. Search

Search should be a central feature.

Primary contractor search fields:

* Trade
* City
* State
* Keyword

Potential filters:

* Rating
* Hourly rate
* Years experience
* Verified only

Do not build every filter immediately.

Start with:

```text
Trade
City
```

Then add additional filtering once the basic system works.

---

# 43. Search UX

Search should feel fast and simple.

Avoid giant filter panels.

Example:

```text
Find a Contractor

[ Plumber... ] [ College Park ] [ Search ]
```

Results appear underneath.

Search query parameters should be reflected in the URL so pages can be shared.

---

# 44. Database Design

The following is the recommended conceptual database design.

---

## User

```text
User
----
id
email
password
role
createdAt
updatedAt
```

Relationships:

```text
User
 ├── ContractorProfile?
 ├── Jobs
 ├── Bids
 ├── HireRequests
 ├── Reviews
 ├── Conversations
 ├── Messages
 └── Payments
```

Roles:

```text
CUSTOMER
CONTRACTOR
```

---

# 45. ContractorProfile

```text
ContractorProfile
-----------------
id
userId
companyName
trade
bio
hourlyRate
yearsExperience
city
state
profileImage
verified
createdAt
updatedAt
```

Potential future fields:

```text
phone
website
serviceRadius
availability
```

Do not require these for the MVP.

---

# 46. Job

```text
Job
---
id
title
description
budget
location
status
customerId
contractorId
createdAt
updatedAt
```

Relationships:

```text
Job
 ├── Customer
 ├── Contractor?
 ├── Bids
 ├── Conversation?
 ├── Payments
 └── Review?
```

---

# 47. Bid

```text
Bid
---
id
jobId
contractorId
amount
message
estimatedDuration
status
createdAt
updatedAt
```

Statuses:

```text
PENDING
ACCEPTED
REJECTED
WITHDRAWN
```

Important architectural detail:

`contractorId` should reference the contractor profile where appropriate, rather than relying on an ambiguous user ID.

---

# 48. HireRequest

```text
HireRequest
-----------
id
customerId
contractorId
message
status
createdAt
updatedAt
```

Statuses:

```text
PENDING
ACCEPTED
REJECTED
CANCELLED
```

---

# 49. Conversation

```text
Conversation
------------
id
customerId
contractorId
jobId?
createdAt
updatedAt
```

A conversation can optionally reference a Job.

---

# 50. Message

```text
Message
-------
id
conversationId
senderId
content
createdAt
```

---

# 51. Review

```text
Review
------
id
jobId
customerId
contractorId
rating
comment
createdAt
updatedAt
```

A database constraint should prevent duplicate reviews for the same job/customer relationship.

---

# 52. Payment

```text
Payment
-------
id
jobId
customerId
contractorId
amount
currency
stripeCheckoutSessionId
stripePaymentIntentId
status
createdAt
updatedAt
```

---

# 53. Optional Notification Model

A simple notification system can be added if useful:

```text
Notification
------------
id
userId
type
message
read
createdAt
```

Examples:

* New bid
* Bid accepted
* Hire request
* Hire request accepted
* New message
* Payment completed
* Job completed

This is useful, but not required for the first functional version.

---

# 54. Authorization Rules

Authorization is critical.

Every server-side action must verify:

1. The user is authenticated.
2. The user has the correct role.
3. The user owns or is associated with the resource.

Never rely only on buttons being hidden in the UI.

---

## Job authorization examples

Customer can edit a job only if:

```text
job.customerId === session.user.id
```

Contractor can bid only if:

```text
job.status is open
AND contractor belongs to current user
```

---

## Bid authorization

Customer may accept a bid only if:

```text
bid.job.customerId === currentUser.id
```

Contractor may withdraw a bid only if:

```text
bid.contractor belongs to currentUser
```

---

## Hire request authorization

Contractor can accept/reject only when:

```text
request.contractor belongs to currentUser
```

Customer can cancel only when:

```text
request.customerId === currentUser.id
```

---

## Messaging authorization

A user may read a conversation only when:

```text
conversation.customerId === currentUser.id
OR
conversation.contractorId === currentUser's contractor profile
```

---

# 55. Preventing Duplicate Actions

Important state-changing operations should be protected against duplicate submissions.

Examples:

A contractor should not be able to:

* Accept the same hire request twice.
* Accept a rejected request.
* Create duplicate jobs through repeated clicks.

A customer should not be able to:

* Accept two bids for the same job.
* Review the same job twice.

Use database transactions where multiple related records must change together.

---

# 56. Transaction Requirements

Use Prisma transactions for important multi-step operations.

Example:

Accepting a bid:

```text
1. Verify customer owns job.
2. Verify bid belongs to job.
3. Verify job is still open.
4. Set selected bid = ACCEPTED.
5. Set other bids = REJECTED.
6. Assign contractor to job.
7. Set job status = ASSIGNED.
8. Create conversation.
```

All of these should happen together.

If any step fails, the transaction should roll back.

---

# 57. API / Server Action Principles

Use server-side code for anything sensitive.

Examples:

* Authentication
* Password hashing
* Authorization
* Stripe operations
* Database mutations
* Payment verification

Do not put secrets in client components.

Do not trust:

```text
customerId
contractorId
role
payment amount
```

supplied by the browser without verifying them against the authenticated session and database.

---

# 58. Error Handling

The application should return understandable errors.

Examples:

```text
Not authenticated
```

```text
Unauthorized
```

```text
Job not found
```

```text
Contractor profile not found
```

```text
This job is no longer accepting bids
```

The UI should display useful messages rather than generic crashes whenever possible.

---

# 59. Loading States

Pages that fetch data should have appropriate loading states.

Examples:

```text
Loading contractors...
```

```text
Loading job...
```

```text
Loading messages...
```

Buttons should prevent accidental duplicate submissions while an action is processing.

Example:

```text
Accepting...
```

instead of immediately allowing another click.

---

# 60. Empty States

Empty states should be intentional.

Examples:

### No contractors

```text
No contractors found.

Try searching for another trade or location.
```

### No jobs

```text
No jobs posted yet.
```

### No bids

```text
No bids yet.

Contractors will appear here once they respond.
```

### No messages

```text
No conversations yet.
```

Avoid blank screens.

---

# 61. Design Direction

The application should look:

* Clean
* Modern
* Professional
* Practical
* Slightly understated
* Human-designed

It should **not** look like a generic AI-generated SaaS landing page.

Avoid excessive:

* Gradients
* Glassmorphism
* Giant floating blobs
* Neon colors
* Excessive rounded cards
* Huge headings
* Random icons everywhere
* Marketing buzzwords

---

# 62. Visual Style

Recommended style:

### Colors

Use a restrained palette.

Example:

* Dark charcoal text
* White/light backgrounds
* Blue as the main accent
* Light gray borders
* Green for successful/verified states
* Red for destructive actions

The application should not look like every generic Tailwind template.

---

# 63. Typography

Use a clean modern sans-serif.

Prefer:

* Inter
* Geist
* System UI

Typography should have a clear hierarchy but avoid oversized text.

---

# 64. Components

Reusable components should include:

```text
Navbar
Button
Input
SearchBar
ContractorCard
JobCard
BidCard
ReviewCard
ProfileHeader
StatusBadge
Modal
EmptyState
LoadingState
MessageBubble
```

Do not create a component for every tiny `<div>`.

---

# 65. Contractor Card

Example structure:

```text
ABC Plumbing
Plumbing

College Park, MD

★★★★★ 4.8
$75/hr

5 years experience

✓ Verified

View Profile
```

Keep it compact.

---

# 66. Job Card

Example:

```text
Kitchen Sink Repair

Plumbing
College Park, MD

Budget: $300

8 bids
Posted 3 hours ago

View Job
```

---

# 67. Dashboard Layout

The dashboard should not feel like a giant analytics dashboard.

A simple layout is better.

Example:

```text
Dashboard

Welcome back, James.

[ Active Jobs ]

[ Job cards ]

[ Recent Messages ]

[ My Bids ]
```

Prioritize actual work over charts.

There is no reason to create meaningless graphs for:

* Number of messages
* Total jobs
* Average rate

unless those metrics become genuinely useful.

---

# 68. Mobile Responsiveness

The site must work on:

* Desktop
* Tablet
* Mobile

Mobile should not simply shrink the desktop layout.

Examples:

Desktop:

```text
[Search] [City] [Button]
```

Mobile:

```text
[Search]
[City]
[Search]
```

Navigation should collapse appropriately.

---

# 69. Accessibility

At minimum:

* Buttons must have accessible labels.
* Forms must have labels.
* Inputs should be associated with labels.
* Color should not be the only way to communicate status.
* Keyboard navigation should work.
* Images should have alt text.
* Errors should be understandable.

Do not sacrifice accessibility purely for visual appearance.

---

# 70. SEO

Public pages should have useful metadata.

Examples:

Contractor profile:

```text
ABC Plumbing | Contractor Marketplace
```

Job:

```text
Kitchen Sink Repair | Contractor Marketplace
```

Homepage:

```text
Contractor Marketplace | Find Local Contractors
```

Public contractor profiles should ideally be indexable.

Private dashboards and messages should not be publicly indexed.

---

# 71. Performance

Avoid unnecessary database calls.

Use Prisma `include` and `select` thoughtfully.

Do not retrieve:

```text
every user
every message
every job
every review
```

when a page only needs a subset.

Public directory pages should be paginated when the number of contractors becomes large.

The MVP can use simple pagination.

---

# 72. Pagination

Recommended for:

* Contractors
* Jobs
* Reviews
* Messages

Initial implementation can use:

```text
page=1
page=2
```

or cursor pagination.

Do not build infinite scrolling unless there is a real need.

---

# 73. Data Validation

Use server-side validation.

A validation library such as **Zod** is recommended.

Validate:

* Email
* Password
* Bid amount
* Job budget
* Review rating
* Message content
* Required profile fields

Example:

```text
rating must be between 1 and 5
```

```text
bid amount must be greater than 0
```

```text
message cannot be empty
```

Client-side validation can improve UX but must not replace server-side validation.

---

# 74. Registration Flow

Customer:

```text
Register
↓
Select CUSTOMER
↓
Account created
↓
Login
↓
Dashboard
```

Contractor:

```text
Register
↓
Select CONTRACTOR
↓
Account created
↓
Login
↓
Create Contractor Profile
↓
Dashboard
```

Do not automatically pretend that a registration is already a complete contractor profile.

The contractor must provide the profile information separately.

---

# 75. Contractor Registration UX

After contractor login, if no ContractorProfile exists:

Redirect to:

```text
/contractor-profile/create
```

After profile creation:

```text
/dashboard
```

If a profile already exists:

```text
/dashboard
```

---

# 76. Profile Editing

Contractors must be able to edit:

* Company name
* Trade
* Bio
* Hourly rate
* Years experience
* City
* State
* Profile image

Changing verification status should not be available to the contractor.

---

# 77. Customer Job Creation

Customer page:

```text
/jobs/create
```

Fields:

```text
Title
Description
Budget
Location
```

After creation:

```text
/dashboard
```

or:

```text
/jobs/[id]
```

---

# 78. Customer Job Management

Customer should see:

```text
Job Status
Number of Bids
Bid List
Assigned Contractor
Messages
Payment
```

Once completed:

```text
Leave Review
```

---

# 79. Contractor Job Management

Contractor should see:

```text
Job
Customer
Description
Location
Budget
Status
Messages
Payment status
```

They can update status when appropriate.

Example:

```text
Start Job
```

changes:

```text
ASSIGNED → IN_PROGRESS
```

Then:

```text
Mark Complete
```

changes:

```text
IN_PROGRESS → COMPLETED
```

Whether customers can also mark completion can be added later.

---

# 80. Completion Rules

A job should not immediately become completed just because payment succeeds.

Payment and job state are separate concepts.

Example:

```text
Job Status:
IN_PROGRESS

Payment:
SUCCEEDED
```

The job can still need to be marked complete.

This keeps the system logically correct.

---

# 81. Review Eligibility

Customer can review only when:

```text
job.status === COMPLETED
```

and:

```text
job.customerId === currentUser.id
```

and:

```text
job.contractorId is not null
```

and:

```text
no existing review for job
```

---

# 82. Future Expansion

The system should be designed so these can be added later:

* Contractor availability
* Scheduling
* Calendar
* Push notifications
* Email notifications
* SMS
* Portfolio galleries
* Contractor certifications
* Saved contractors
* Saved jobs
* Favorites
* Advanced search
* Stripe Connect
* Contractor payouts
* Admin dashboard
* Dispute management
* Job attachments
* Image uploads
* Location/map integration
* Reviews from contractors about customers
* Two-sided ratings
* Service categories
* Multiple service areas

These are explicitly **not required for the first version**.

---

# 83. Admin Functionality

The MVP can have a minimal admin system.

An admin can eventually:

* View users
* Disable users
* Verify contractors
* View jobs
* Review reports
* Manage problematic content

For the first version, admin functionality can be basic and database-driven.

Do not spend significant development time building a full enterprise admin panel before the core marketplace is complete.

---

# 84. Security Requirements

Minimum security requirements:

### Authentication

* Secure password hashing
* Secure session handling
* HTTPS in production

### Authorization

Every protected database mutation checks ownership.

### Database

Use Prisma parameterized queries.

Never construct SQL using raw user input unless there is a specific reason.

### Secrets

All secrets stored in environment variables.

### Stripe

Verify webhook signatures.

### File uploads

When implemented:

* Validate file type
* Validate file size
* Do not trust client-provided filenames
* Store files outside the main application filesystem in production

---

# 85. Git and GitHub

The project should use Git from the beginning.

Repository should contain:

```text
README.md
.env.example
.gitignore
docker-compose.yml
package.json
prisma/
src/
```

Never commit:

```text
.env
```

or:

```text
node_modules
```

or build artifacts.

---

# 86. Git Commit Style

Use meaningful commits.

Examples:

```text
feat: add contractor profiles
feat: add job bidding
feat: add hire requests
feat: add messaging
feat: integrate stripe checkout
fix: prevent duplicate bid acceptance
refactor: simplify dashboard queries
```

Avoid:

```text
stuff
update
final
test
changes
```

---

# 87. Local Development

Recommended setup:

```text
Node.js
npm
PostgreSQL
Docker
VS Code
Git
```

Docker Compose should simplify PostgreSQL setup.

Example conceptual environment:

```text
Application
localhost:3000

PostgreSQL
localhost:5432
```

---

# 88. Prisma Workflow

Typical development process:

```bash
npm install
```

```bash
npx prisma migrate dev
```

```bash
npx prisma generate
```

```bash
npm run dev
```

Prisma Studio can be used during development:

```bash
npx prisma studio
```

---

# 89. Production Database

Do not use a developer's local PostgreSQL server in production.

Production should use:

**AWS RDS PostgreSQL**

The deployed application receives the production database connection through:

```text
DATABASE_URL
```

---

# 90. Production Deployment

Recommended deployment:

### Application

Vercel

### Database

AWS RDS PostgreSQL

### File storage

AWS S3

### Payments

Stripe

### Source control

GitHub

### Local containerization

Docker

Architecture:

```text
GitHub
   |
   v
Vercel
   |
   +----------------------+
   |                      |
   v                      v
Next.js                Stripe
   |
   +----------+
   |          |
   v          v
AWS RDS     AWS S3
Postgres    Images
```

---

# 91. CI/CD

Vercel can automatically deploy from GitHub.

Recommended workflow:

```text
Developer
   ↓
Git commit
   ↓
GitHub
   ↓
Vercel
   ↓
Build
   ↓
Deployment
```

Pull requests should ideally create preview deployments.

---

# 92. Testing

The application should have at least basic testing.

Important tests:

### Authentication

* User can register.
* Password is hashed.
* User can log in.
* Invalid credentials fail.

### Jobs

* Customer can create job.
* Contractor can view public jobs.
* Contractor can submit bid.
* Customer can accept bid.

### Authorization

* Customer cannot submit contractor bids.
* Contractor cannot accept another contractor's hire request.
* Users cannot access another user's messages.

### Payments

* Checkout session is created server-side.
* Webhook verifies payment.
* Successful Stripe event updates the payment record.

### Reviews

* Only completed jobs are reviewable.
* Duplicate review is prevented.

The project does not need 100% test coverage.

Focus tests on important business logic.

---

# 93. Seed Data

Development should include realistic seed data.

Examples:

### Contractors

```text
ABC Plumbing
Mike's Electrical
GreenLine Landscaping
Capital HVAC
College Park Handyman
```

### Jobs

```text
Fix leaking kitchen sink
Install ceiling fan
Repair backyard fence
Replace AC unit
Paint living room
```

### Reviews

Create realistic example reviews.

Do not use absurdly enthusiastic marketing language.

Example:

```text
"Showed up on time and fixed the leak quickly. Would hire again."
```

---

# 94. Realistic Data

The application should avoid obvious fake-AI-demo content.

Avoid dozens of entries like:

```text
Elite Pro Solutions
Premium Home Experts
Trusted Excellence LLC
Best-in-Class Contractors
```

Use normal names and realistic service descriptions.

This is particularly important for the appearance of the portfolio project.

---

# 95. Design Principle: Don't Look AI Generated

The visual design should avoid common generated-template patterns.

Specifically avoid:

* Huge centered gradient hero
* Three meaningless feature cards
* Excessive pill-shaped buttons
* Every element being rounded
* Excessive shadows
* Fake testimonial sections
* Fake statistics
* “Revolutionize your workflow”
* “Empowering the future of...”
* Buzzword-heavy marketing copy

Instead:

* Use straightforward language.
* Use practical labels.
* Use realistic data.
* Keep spacing consistent.
* Use subtle borders.
* Use restrained colors.
* Let content drive the layout.

The application should feel like someone actually designed a local contractor marketplace.

---

# 96. Example Homepage Copy

Suggested:

## Header

**Contractor Marketplace**

Navigation:

```text
Find Contractors
Find Jobs
Post a Job
Messages
```

## Hero

**Find the right contractor for the job.**

Connect with local contractors, compare bids, and manage your project from one place.

Buttons:

```text
Find a Contractor
Post a Job
```

Search:

```text
What service do you need?
City

Search
```

## How It Works

**Post a job**
Tell contractors what you need done.

**Compare bids**
Review pricing, experience, and contractor profiles.

**Get it done**
Hire, message, pay, and manage the project in one place.

This language is intentionally straightforward.

---

# 97. Example Contractor Profile Copy

```text
ABC Plumbing

Plumbing
✓ Verified

College Park, MD

5 years experience
$75/hr

About

Home repair specialist focused on residential plumbing repairs,
fixture replacements, and general maintenance.

4.8 ★
23 reviews

[Request Service]
```

Then:

```text
Past Work
```

and:

```text
Reviews
```

---

# 98. Example Job

```text
Fix leaking kitchen sink

Plumbing

College Park, MD

Budget: $300

The kitchen sink has started leaking underneath the cabinet.
Looking for someone who can inspect the connection and make
the repair.

8 bids

[View Job]
```

---

# 99. Notifications

Initial notifications can be simple.

Examples:

```text
You received a new bid.
```

```text
Your bid was accepted.
```

```text
You received a new service request.
```

```text
Your service request was accepted.
```

```text
You received a new message.
```

They do not need to be push notifications initially.

An in-app notification system is sufficient.

---

# 100. Core User Journeys

## Customer Journey A — Finding a Contractor

```text
Homepage
↓
Search
↓
Contractor Directory
↓
Contractor Profile
↓
Request Service
↓
Hire Request
↓
Contractor Accepts
↓
Active Job
↓
Messages
↓
Payment
↓
Completion
↓
Review
```

---

## Customer Journey B — Posting a Job

```text
Homepage
↓
Post a Job
↓
Create Job
↓
Job becomes OPEN
↓
Contractors discover job
↓
Contractors submit bids
↓
Customer views bids
↓
Customer accepts bid
↓
Job becomes ASSIGNED
↓
Messaging
↓
Work
↓
Payment
↓
Completion
↓
Review
```

---

## Contractor Journey A — Finding Work

```text
Login
↓
Dashboard
↓
Find Jobs
↓
Search
↓
Job Details
↓
Submit Bid
↓
Customer Accepts
↓
Active Job
↓
Messaging
↓
Work
↓
Completion
↓
Payment
↓
Review
```

---

## Contractor Journey B — Direct Hire

```text
Contractor Profile
↓
Customer clicks Request Service
↓
Hire Request
↓
Contractor Dashboard
↓
Accept Request
↓
Job Created
↓
Messaging
↓
Work
↓
Payment
↓
Completion
```

---

# 101. MVP Definition

The first complete version must have:

### Authentication

* Register
* Login
* Logout
* Roles

### Contractor system

* Contractor profile
* Contractor directory
* Search
* Contractor detail page
* Reviews
* Verification badge
* Past jobs

### Jobs

* Create job
* Browse jobs
* Job details
* Active jobs
* Job status

### Bids

* Submit bid
* View bids
* Accept bid
* Reject bids

### Direct hiring

* Request service
* Accept request
* Reject request

### Messaging

* Conversations
* Messages
* Access control

### Payments

* Stripe Checkout
* Payment record
* Stripe webhook

### Reviews

* Submit review
* Average rating

### Deployment

* GitHub
* Vercel
* PostgreSQL production database
* Environment variables
* Docker development setup

---

# 102. Features That Should Not Delay MVP

The following should wait until the core application works:

* Real-time WebSockets
* Mobile application
* Advanced maps
* Push notifications
* Complex admin dashboard
* AI recommendations
* Contractor scheduling engine
* Stripe Connect payouts
* Complex dispute system
* Advanced analytics
* Social login
* Multi-language support

The application should first become a coherent product.

---

# 103. Implementation Order

The coding AI should implement the application in roughly this order.

## Phase 1 — Foundation

1. Initialize Next.js + TypeScript.
2. Configure Tailwind.
3. Configure Prisma.
4. Connect PostgreSQL.
5. Create environment variables.
6. Create User model.
7. Create authentication.
8. Create login/register pages.

---

## Phase 2 — User Roles

1. Implement CUSTOMER role.
2. Implement CONTRACTOR role.
3. Implement protected routes.
4. Implement role-aware dashboards.

---

## Phase 3 — Contractor Profiles

1. Create ContractorProfile.
2. Create profile form.
3. Create public profile.
4. Create contractor directory.
5. Add search.
6. Add verification.
7. Add ratings.

---

## Phase 4 — Jobs

1. Create Job model.
2. Create customer job form.
3. Create job listing page.
4. Create job detail page.
5. Add job search.
6. Add job status.
7. Add contractor assignment.

---

## Phase 5 — Bids

1. Create Bid model.
2. Contractor submits bid.
3. Customer sees bids.
4. Customer accepts bid.
5. Update job assignment.
6. Reject other bids.

---

## Phase 6 — Direct Hiring

1. Create HireRequest.
2. Add Request Service button.
3. Create contractor request list.
4. Accept/reject workflow.
5. Create job on acceptance.

---

## Phase 7 — Messaging

1. Create Conversation.
2. Create Message.
3. Build conversation list.
4. Build conversation page.
5. Add authorization.

---

## Phase 8 — Active Jobs

1. Customer active jobs.
2. Contractor active jobs.
3. Status transitions.
4. Complete job functionality.

---

## Phase 9 — Reviews

1. Review model.
2. Review form.
3. Review restrictions.
4. Contractor average rating.
5. Past work display.

---

## Phase 10 — Payments

1. Configure Stripe.
2. Create Checkout Sessions.
3. Create Payment model.
4. Add Stripe webhook.
5. Show payment status.
6. Connect payments to jobs.

---

## Phase 11 — UI Polish

1. Improve homepage.
2. Improve navigation.
3. Improve responsive layouts.
4. Improve forms.
5. Improve error states.
6. Improve loading states.
7. Improve empty states.
8. Make typography consistent.
9. Remove visual clutter.

---

## Phase 12 — Deployment

1. Create production database.
2. Configure AWS RDS.
3. Configure S3 if needed.
4. Configure Stripe production keys.
5. Configure Vercel.
6. Configure production environment variables.
7. Run Prisma migrations.
8. Test production deployment.
9. Configure custom domain if desired.

---

# 104. Definition of Done

The project should not be considered complete merely because pages render.

It is complete when a user can perform the full workflow.

### Customer:

```text
Register
→ Login
→ Find Contractor
→ View Profile
→ Request Service
→ Contractor Accepts
→ View Active Job
→ Message Contractor
→ Pay
→ Job Completed
→ Leave Review
```

and:

```text
Register
→ Login
→ Post Job
→ Receive Bid
→ Accept Bid
→ Message Contractor
→ Pay
→ Complete
→ Review
```

### Contractor:

```text
Register
→ Login
→ Create Profile
→ Find Jobs
→ Submit Bid
→ Get Hired
→ Message Customer
→ Complete Job
→ Receive Payment
→ Build Review History
```

These flows must work without manually editing the database.

---

# 105. Quality Standard

The final application should feel like a legitimate small product rather than a collection of CRUD pages.

Specifically:

* Pages should connect logically.
* Buttons should actually perform useful actions.
* User data should persist.
* Authentication should work.
* Authorization should work.
* Errors should be handled.
* Database relationships should be correct.
* Payment state should be handled server-side.
* The UI should look consistent.
* Mobile layouts should work.
* URLs should be intuitive.
* The application should be deployable.

---

# 106. Important Implementation Guidance for the Coding AI

When making architectural decisions, prefer the simplest solution that satisfies the requirements.

Do not introduce another library just because an alternative exists.

Do not introduce microservices.

Do not introduce Redis unless an actual requirement develops.

Do not add GraphQL unless the API becomes difficult to manage using standard Route Handlers.

Do not build a custom authentication system when NextAuth.js handles the requirement.

Do not build a custom payment system when Stripe handles it.

Do not create redundant database models.

Do not make every component a client component.

Do not use client-side state for data that can safely be rendered server-side.

Do not expose database IDs or sensitive information unnecessarily.

Favor maintainability over cleverness.

---

# 107. Expected Technology List for the Resume

After successful implementation and deployment, the project can reasonably be represented as:

**Contractor Marketplace — Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, NextAuth.js, Stripe, Docker, AWS, Vercel**

Potential resume description:

> Built and deployed a full-stack contractor marketplace connecting customers with local service providers through contractor profiles, job postings, bidding, direct hiring, messaging, payments, and reviews.

A more technical description:

> Developed a full-stack marketplace using Next.js, TypeScript, PostgreSQL, Prisma, NextAuth.js, Stripe, Docker, and AWS, implementing role-based authentication, job workflows, contractor bidding, messaging, reviews, and production payment processing.

Only list technologies that were actually implemented.

---

# 108. Final Product Character

The finished website should feel like:

> A straightforward local marketplace where customers can find contractors, post jobs, compare bids, communicate, and pay for completed work.

It should not feel like:

> A giant hypothetical startup platform attempting to solve every possible aspect of the construction industry.

The project should have enough functionality to demonstrate real software engineering ability while remaining understandable.

The strongest version of this project is one where someone can visit the website, create an account, find a contractor or post a job, communicate with another user, complete the hiring process, and make a real test payment.

The product should look polished enough that it could plausibly be an early-stage startup MVP, while the implementation should remain simple enough for one developer to understand and maintain.
