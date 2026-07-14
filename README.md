# Loopfield

**Find the loops you already live in.**

Live: [https://loopfield.vercel.app](https://loopfield.vercel.app)
Repo: [https://github.com/Tim-ReJet/loopfield](https://github.com/Tim-ReJet/loopfield)

A high-stimulus exploratory map of AuDHD (ADHD × autism) patterns and feedback loops — scientific grounding with felt language, plus a light community path for naming the unnamed.

Hobby / passion project. Not a diagnostic tool.

## What you can do

- **Enter the field** — drive a 3D force graph of 44 patterns
- **Ride a loop** — cinematic scroll stories for rejection–withdrawal, capacity collapse, hyperfocus debt, and more
- **Build a constellation** — mark “I know this,” sync across sessions
- **Contribute** — submit unnamed experiences for curated mapping into the corpus

## Stack

- Next.js + React + TypeScript + Tailwind
- Three.js / react-force-graph-3d + R3F shader hero
- Motion + GSAP + Lenis
- Convex (submissions, resonance, constellations)
- Shared corpus engine in `packages/engine` (graph traversal, causal trace, scoring)

## Monorepo layout

```
apps/web              Next.js product (Vercel)
packages/engine       Corpus JSON + graph/causal/scoring + tests
archive/              Original HTML map + early Svelte scaffold
docs/plans/           Design history
```

## Local development

```bash
npm install
# Terminal 1 — Convex (from apps/web)
cd apps/web && npx convex dev
# Terminal 2 — Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # engine Vitest suite
npm run build     # production build
```

### Intensity control

Use **Full / Calm / Still** in the nav. Still mode swaps the 3D field for an accessible card grid and reduces motion.

### Admin moderation

Set `ADMIN_SECRET` in Convex dashboard env, then open `/admin` with that secret to map or reject pending submissions.

### Convex cloud (production sync)

Configured via Convex CLI against project `loopfield` (team `tim-a6744`).

```bash
cd apps/web
npx convex login          # if needed
npx convex dev --once     # push functions to the linked deployment
npx convex deploy         # when a prod deployment exists
npx convex env set ADMIN_SECRET 'your-secret'
```

**Important:** the Convex team must be within Free plan limits (or on Pro). If you see
`You have exceeded the free plan limits`, open
[Team usage](https://dashboard.convex.dev/t/tim-a6744/settings/usage) /
[Billing](https://dashboard.convex.dev/t/tim-a6744/settings/billing), reduce usage or upgrade,
then redeploy. Until then, client calls reach Convex but function execution stays disabled.

Vercel already has `NEXT_PUBLIC_CONVEX_URL` for production when the deployment is re-enabled.


## Ethics

Recognition over diagnosis. Clinical precision, warm language. Negative signal (“Not me”) is data — gaps are where unnamed experiences live.

## Credits

Patterns and loops originated in the ADHD × ASD Interaction Map corpus archived under `archive/`.
