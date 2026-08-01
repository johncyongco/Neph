# Neph

A Journey Book of People — a Vite + React web app that remembers the people who
become part of your story. Belongs to the same design family as Agapetoi /
Custody / regula / chronoa / Flee.

## Stack

- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `@theme inline`)
- react-router-dom v7 (5 tabs: Home / People / Discover / Journey / More)
- zustand (persisted to localStorage) — local-first; Supabase scaffolded behind env placeholders
- framer-motion (subtle fade / tap), lucide-react icons
- Fonts: Mulish (headings) + Inter (body), self-hosted via `@fontsource`

## Commands

```bash
npm run dev        # vite dev server (port 8081)
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npx tsc -b         # typecheck only
```

Always run `npx tsc -b` and `npm run build` after non-trivial changes.

## Architecture (feature-first)

```
src/
  app/            App.tsx — router + routes
  components/      layout/ ui/ cards/ timeline/ person/
  features/        home/ people/ discover/ journey/ more/
  store/           usePeopleStore.ts (zustand + persist)
  services/        harvest.ts, supabase.ts
  lib/             theme.ts, types.ts, constants.ts, format.ts, selectors.ts, tw.ts
  data/            seed.ts, discoveries.ts
```

## Design system

Tokens live in `src/index.css` under `:root` and `@theme inline`. The app
column is centered (`--page-width: 720px`). **All custom CSS is wrapped in
`@layer base` / `@layer components`** so Tailwind utilities (in `@layer
utilities`) can override base resets — do NOT write unlayered CSS rules, they
will silently override every utility class.