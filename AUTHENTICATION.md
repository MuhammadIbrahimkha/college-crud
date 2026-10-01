# Authentication and authorization

This project uses Better Auth with email/password authentication, Drizzle ORM, and PostgreSQL-backed sessions. Better Auth handles password hashing, credential checks, session creation, and cookie management. Server components, server actions, and API handlers verify the session independently; UI hiding is not used as an authorization boundary.

New users can register at `/sign-up` and sign in at `/sign-in`. Passwords must be 8 to 128 characters. Email verification is not enabled in this development setup.

## Local setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL database.
2. Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"` and set it as `BETTER_AUTH_SECRET`.
3. Set `BETTER_AUTH_URL=http://localhost:3000` locally. In production, use the canonical HTTPS origin.
4. Apply the checked-in migration with `npm run db:migrate`.
5. Run `npm run dev`, then register at `/sign-up`.

## Authorization model

Each course has an `owner_id`. The authenticated user's ID is assigned by the server on create, and every read, update, and delete is scoped by that ID. Submitted form data cannot choose or change ownership. `/api/test-db` also requires a valid session and returns only the current user's courses.

Migration `0001_auth.sql` adds a nullable owner column to preserve pre-existing rows. Unowned legacy rows are intentionally hidden. Assign them to a chosen user's ID with a reviewed database update if they should be retained; do not expose unowned rows to all accounts.

For production, configure email verification and appropriate rate limits before enabling public registration. Rotate any database credentials that may have been exposed outside the ignored `.env` file.