# The Braid Atelier

A full-stack salon booking website built with Next.js, Supabase, Stripe, and Resend.

## Features

- Public site: home, services, gallery, about, reviews, contact
- Client accounts: register, login (email/password and Google), password reset
- Booking system: service selection, date/time picker with duration-based conflict checking
- Payments: Stripe Checkout for booking deposits
- Email notifications: booking received, status updates (via Resend)
- Admin dashboard: manage bookings, services, gallery, testimonials, and contact messages
- Client reviews: submitted after a completed appointment, approved by admin before going public

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database & Auth:** Supabase (Postgres, Row Level Security, Auth, Storage)
- **Payments:** Stripe
- **Email:** Resend
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/braid-atelier.git
cd braid-atelier
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your own values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |

1. `NEXT_PUBLIC_SUPABASE_URL` -> Your Supabase project URL |
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> Supabase anon/public key |
3. `SUPABASE_SERVICE_ROLE_KEY` -> Supabase service role key (server-only) |
4. `RESEND_API_KEY` -> Resend API key for sending emails |
5. `STRIPE_SECRET_KEY` -> Stripe secret key |
6. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` -> Stripe publishable key |
7. `STRIPE_WEBHOOK_SECRET` -> Stripe webhook signing secret |
8. `NEXT_PUBLIC_SITE_URL` -> The deployed site URL |
9. `DEPOSIT_AMOUNT` -> Booking deposit amount in Rand |

### 4. Set up the database

Run the SQL migrations in the `supabase/` folder (or the Supabase SQL Editor) to create the required tables, policies, and functions.

### 5. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000`.


## Admin Access

Admin access is controlled by an `is_admin` flag on the `profiles` table. There is no separate admin signup flow — an existing account must be manually flagged as an admin in the database.

