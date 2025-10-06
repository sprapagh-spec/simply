# SimplyGift Guests (MVP)

Production-grade Next.js (App Router) app for guest imports, campaigns, and gifts.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind + shadcn/ui-ready tokens
- Prisma (SQLite dev, Postgres-ready)
- Zod
- NextAuth (email magic links) – to be wired
- Stripe (test mode) – to be wired

## Getting Started

1) Prereqs: Node 18+ and npm installed

2) Install deps
```bash
npm install
```

3) Environment
Create `.env` using the template below:
```ini
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeme-in-prod
EMAIL_FROM=hello@example.com
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4) Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

5) Dev server
```bash
npm run dev
```
Open `http://localhost:3000`.

## Features implemented (MVP)
- **Guest Import**: CSV and Google Sheets import with column mapping, validation, and deduplication
- **Guest Management**: View and manage guest information with lifetime gift tracking
- **Gift Tracking**: Track gifts with detailed fee calculations and breakdowns
- **Export**: Export guest data and gift ledger as CSV
- **Beautiful UI**: Joyful Minimalism design system with Open Sans typography
- Fee calculation util with tests (`npm run test`).
- Seed script with sample data.

## Design System

This app uses a "Joyful Minimalism" design system inspired by WithJoy, featuring:

### Colors
- **Primary**: Sage green (#7FA28A) for a calming, natural feel
- **Background**: Warm cream (#FFFBF6) for comfort
- **Surface**: Pure white (#FFFFFF) for content areas
- **Brand Scale**: 50-900 sage color variations for subtle accents

### Typography
- **Font**: Open Sans (weights 400/600/700) loaded via next/font/google
- **Display**: `.display` class for headings with tighter letter spacing
- **Scale**: Responsive typography with proper line heights

### Components
- **Cards**: Rounded corners (rounded-2xl), subtle shadows, brand borders
- **Buttons**: Primary, secondary, and ghost variants with hover states
- **Links**: Underlined with offset for better readability
- **Forms**: Consistent styling with focus rings and transitions

### Dark Mode
Enable dark mode by setting `data-theme="dark"` on the html element. The theme preview page (`/theme-preview`) demonstrates all design tokens and components.

### Customization
- Edit CSS variables in `globals.css` to change colors
- Use Tailwind classes like `bg-primary`, `text-ink`, `border-brand-200`
- All components use semantic color tokens for consistency

## Examples
See `examples/guests_minimal.csv` and `examples/guests_messy.csv`.

## Running Stripe webhooks locally (to be hooked up)
- Install Stripe CLI and log in
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Set `STRIPE_WEBHOOK_SECRET` to the secret printed by the CLI.

## Architecture
- `src/app` – routes and server actions
- `src/lib` – domain logic (fees, fuzzy, csv, dedupe, prisma)
- `src/components` – UI building blocks (sidebar)
- `prisma` – schema and seed

## Next up
- NextAuth email magic links with dev preview inbox
- Campaign creation and send (mock transport + preview)
- Guest portal with RSVP + Stripe checkout
