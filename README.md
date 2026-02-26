# Startup Simulation — Convergent Take-Home

A single-player, turn-based startup simulation (Next.js + Supabase). Each turn is one business quarter. The player sets decisions, advances the turn, and reviews outcomes.

## Setup (under 5 commands)

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key
npx supabase db push   # or run supabase/migrations/001_initial.sql in Supabase SQL editor
npm run dev
```

**Supabase setup:**
1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in **SQL Editor**: paste contents of `supabase/migrations/001_initial.sql`
3. Enable **Email** auth in Authentication → Providers
4. Add redirect URL: `http://localhost:3000/auth/callback`
5. Copy Project URL and anon key to `.env.local`

## What Was Built

- **Auth** — Email/password sign up and sign in via Supabase Auth; session persists across reloads
- **Quarterly Decision Panel** — Unit price, new engineers, new sales staff, salary % (default 100)
- **Advance Turn** — `POST /api/advance` runs the simulation server-side and persists state
- **Dashboard** — Cash, revenue, net income, headcount, current quarter, last 4 quarters table
- **Office Visualization** — Desks for engineers (blue) and sales (amber), empty desks visible
- **Win/Lose** — Cash = 0 → lose; Year 10 with positive cash → win (shows cumulative profit)
- **New Game** — After win/lose, player can start a new game

## What Was Cut

- **Chart for history** — Table used instead; faster to implement and meets “chart or table” requirement
- **Email confirmation** — Disabled for easier testing; can be enabled in Supabase
- **Multiplayer or undo** — Out of scope

## Known Issues / Notes

- If Supabase is not configured, the app will show auth errors; ensure `.env.local` is set
- Salary cost formula uses `salary_pct/100 * 30_000` per person per quarter as specified

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, RLS)

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/game` | GET | Current game state (or initial) |
| `/api/game/history` | GET | Last 4 quarters |
| `/api/advance` | POST | Advance turn (body: `unit_price`, `new_engineers`, `new_sales_staff`, `salary_pct`) |
| `/api/auth/reset-game` | POST | Delete current game and start fresh |
