# Nataka Holiday Homes

Full-stack holiday rental platform for Diani Beach & the Kenyan Coast.
React + TypeScript + Vite + Tailwind CSS v4 + Supabase.

## Status

Step 4 of the build plan complete: project scaffold, folder structure,
design tokens, and the full route tree (public site, auth, account, admin)
wired with placeholder pages. `npm run build` and `npm run lint` both pass.

No Supabase project is connected yet — `src/lib/supabase.ts` will throw at
runtime until you copy `.env.example` to `.env.local` and fill in your
project's URL/anon key (Step 5/6/7).

## Getting started

\`\`\`bash
npm install
cp .env.example .env.local   # fill in Supabase credentials once you have a project
npm run dev
\`\`\`

## Scripts

- \`npm run dev\` — local dev server
- \`npm run build\` — type-check (\`tsc -b\`) then production build
- \`npm run lint\` — oxlint
- \`npm run preview\` — preview the production build locally

## Architecture

See the accompanying `nataka-holiday-homes-architecture.md` document for
the full folder structure rationale, database schema, and RLS policy plan.
