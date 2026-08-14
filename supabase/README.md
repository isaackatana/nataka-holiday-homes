# Supabase setup — Nataka Holiday Homes

This covers Steps 5–7 of the build plan: creating the Supabase project,
applying the schema, and getting your first admin account working.

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Pick a region close to Kenya (e.g. `eu-west-1`/London or `ap-south-1`/Mumbai —
   Supabase doesn't have an Africa region yet; either gives reasonable latency).
3. Save the generated database password somewhere safe — you'll need it if
   you ever connect a non-Supabase Postgres client directly.

## 2. Apply the migrations

You have two options. Either works — pick whichever you're comfortable with.

### Option A — SQL Editor (fastest, no CLI install)

In the Supabase dashboard, open **SQL Editor** and run each file in
`supabase/migrations/` **in order**, one at a time:

1. `0001_initial_schema.sql` — enums, tables, indexes
2. `0002_functions_triggers.sql` — `is_admin()`, `handle_new_user()`, `updated_at` triggers
3. `0003_rls_policies.sql` — Row Level Security policies for every table
4. `0004_storage.sql` — `property-images` / `experience-images` buckets + policies

Then optionally run `supabase/seed.sql` for sample properties/experiences
to develop against.

### Option B — Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push          # applies everything in supabase/migrations/
psql "$(supabase db remote-url)" -f supabase/seed.sql   # optional sample data
```

## 3. Connect the app

Copy your project's API credentials (**Project Settings → API**) into `.env.local`:

```bash
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

Only ever use the **anon/public** key in the frontend. The `service_role`
key must never appear in client code — it bypasses RLS entirely.

## 4. Generate real TypeScript types

Replace the placeholder `src/types/database.types.ts` stub with the real
generated types once the schema above is live:

```bash
npx supabase login
npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts
```

Re-run this any time the schema changes.

## 5. Creating your first admin account

There is deliberately no public sign-up flow that grants `admin` — every
new user starts as `role = 'customer'` (enforced by the `handle_new_user()`
trigger). To make yourself an admin:

1. Sign up normally through the app (or **Authentication → Add user** in
   the dashboard) to create your `auth.users` + `profiles` row.
2. In the SQL Editor, run:
   ```sql
   update profiles set role = 'admin' where id = '<your-user-uuid>';
   ```
   (Find your UUID under **Authentication → Users**.)
3. Log out and back in — the app reads `profiles.role` to decide whether
   to show `/admin`.

## 6. Verifying RLS is doing its job

A couple of quick sanity checks once the schema is live:

- As an anonymous/logged-out user, querying `properties` should only
  return rows where `is_published = true`.
- Trying to `insert` into `properties` without being an admin should fail
  with a policy violation.
- A logged-in customer querying `bookings` should only see rows where
  `customer_id` matches their own `auth.uid()`.

If any of these don't hold, re-check that RLS is *enabled* on the table
(`alter table ... enable row level security`) — a table with policies but
RLS not enabled ignores the policies entirely and stays wide open.

## What's next

With the schema and RLS live, Step 7 (authentication in the React app —
sign up/in/out, `AuthProvider`, `RequireAuth`/`RequireAdmin` route guards)
is next.
