Part 1: Project roadmap from scratch
Phase 0
Project setup and architecture

Goal: Establish a clean, working project before building features.

Create Next.js project with TypeScript and Tailwind.
Set up Git and GitHub repository.
Configure PostgreSQL.
Install and configure Prisma.
Configure environment variables.
Establish project folder structure.
Create basic layout, navigation, and homepage.
Confirm development server and database connection work.

Checkpoint: A clean Next.js app runs locally and connects to PostgreSQL.

Phase 1
Database and authentication

Goal: Establish users and secure access.

Create User model.
Create CUSTOMER and CONTRACTOR roles.
Configure NextAuth Credentials authentication.
Implement registration with bcrypt password hashing.
Implement login and logout.
Add session handling.
Protect authenticated pages and server actions.
Enforce role-based access control.

Checkpoint: Customers and contractors can register, log in, and access their respective protected areas.

Phase 2
Contractor profiles and discovery

Goal: Allow contractors to advertise their services and customers to find them.

Contractor profile creation.
Profile editing.
Company name, trade, bio, city, state, experience, and hourly rate.
Public contractor directory.
Search by trade and location.
Contractor profile detail page.
Customer and contractor dashboards.

Checkpoint: A contractor can create a public profile, and customers can search and view it.

Phase 3
Job marketplace and bidding

Goal: Build the primary marketplace workflow.

Customers create job postings.
Contractors browse available jobs.
Job detail pages.
Contractors submit bids.
Customers view bids.
Customers accept or reject bids.
Accepted bid assigns contractor to job.
Job status tracking.
Prevent duplicate bids and unauthorized actions.

Checkpoint: A customer can post a job, receive bids, and hire a contractor through the bidding workflow.

Phase 4
Direct hiring

Goal: Support customers who already know which contractor they want.

Request service from a contractor profile.
Customer includes a description of the requested work.
Contractor views incoming requests.
Contractor accepts or rejects requests.
Accepted requests create an assigned job.
Display request and job statuses.

Checkpoint: A customer can request a specific contractor without posting a public job.

Phase 5
Messaging
Conversation and Message database models.
Conversation list.
Message interface.
Send and receive messages.
Associate conversations with jobs.
Restrict access to conversation participants.
Add timestamps and unread indicators.

Checkpoint: Customers and assigned contractors can communicate securely.

Phase 6
Job completion and reviews
Start and complete job workflow.
Customer completion confirmation.
Review and rating submission.
Prevent reviews for incomplete jobs.
Prevent duplicate reviews.
Contractor average ratings.
Completed work history.

Checkpoint: Completed jobs can generate reviews visible on contractor profiles.

Phase 7
Stripe payments
Stripe Checkout integration.
Payment database model.
Secure server-side payment creation.
Webhook verification.
Payment status updates.
Payment history.
Test transactions.

Checkpoint: Test payments update the correct job and payment record.

Phase 8
Polish, testing, and deployment
Responsive design.
Consistent visual design.
Form validation and error handling.
Loading and empty states.
Security and authorization review.
End-to-end workflow testing.
README and screenshots.
Deploy application to Vercel.
Configure production PostgreSQL.
Verify production workflows.

Checkpoint: The application is deployed and usable as a portfolio project.