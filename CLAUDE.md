# Loopfield (Claude / agent notes)

## Commands

```bash
npm install
npm run dev                 # Next.js at apps/web
cd apps/web && npx convex dev
npm test                    # packages/engine
npm run build               # engine typecheck + web build
```

## Layout

- `apps/web` — Next.js App Router product
- `packages/engine` — portable corpus + graph/causal/scoring (no Node fs in browser entry)
- `archive/` — original single-file map + Svelte hypothesis-engine scaffold
- Convex functions live in `apps/web/convex`

## Conventions

- Node IDs: kebab-case
- Sources in corpus: `adhd` | `asd` | `both`
- Colors: peach ADHD, cyan ASD, mist both
- Intensity: full | calm | reduced (store + prefers-reduced-motion CSS)

## Deploy

- Vercel root: `apps/web`
- Env: `NEXT_PUBLIC_CONVEX_URL` (+ Convex deploy key for CI)
- Optional Convex env: `ADMIN_SECRET`
