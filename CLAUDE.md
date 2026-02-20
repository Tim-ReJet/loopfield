# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Two applications sharing extracted data:

1. **Original Map** (`adhd_asd_interaction_map.html`) — Single-file interactive ADHD x ASD interaction map. ~3400 lines of self-contained HTML/CSS/JS. No build system. Open directly in browser.

2. **Hypothesis Engine** (`hypothesis-engine/`) — Svelte + Vite + TypeScript app. An interactive hypothesis machine that models neurodivergent experiences across 6 conditions (ADHD, ASD, OCD, CPTSD, GAD, MDD) with a 5-level causal stack from neurochemistry to lived experience.

## Commands

```bash
# Hypothesis Engine
cd hypothesis-engine
npm run dev          # Dev server with HMR (watches data/*.json)
npm run build        # Production build
npm test             # Run tests (Vitest)
npx vitest run       # Run tests once
npx vitest           # Watch mode
```

## Architecture

### Hypothesis Engine

**Three-layer system:**
- **Svelte frontend** — displays views (Find Yourself, The Unnamed, Constellations)
- **data/ JSON files** — shared state, the bridge between Claude Code and frontend
- **Claude Code** — intelligence layer: generates hypotheses, maps submissions, writes to data/

**Data files** (`hypothesis-engine/data/`):
- `nodes.json` — 44 nodes extracted from original map (will be enriched with condition weights)
- `loops.json` — 13 feedback loops
- `atlas.json` — 10 brain regions
- `layers.json` — 4 layer definitions
- `node-tags.json`, `mechanism-expression-links.json`, `pathway-highlights.json`
- Future: `systems.json`, `receptors.json`, `pathways.json`, `mechanisms.json`, `hypotheses.json`

**Core engine** (`hypothesis-engine/src/lib/`):
- `types.ts` — Full type system: conditions, nodes, receptors, pathways, mechanisms, hypotheses, scoring
- `data.ts` — `loadData()` loads JSON, builds indexes (nodeById, connectionMap, nodeLayerMap, nodeTagsMap). Dual-mode: fs for Vitest, fetch for browser.
- `graph.ts` — Traversal (getDirectConnections, findAllPaths, getCommonNeighbors) + structural scoring (scoreCandidate, findTopCandidates) with 6 weighted signals + cross-system bonus
- `causal.ts` — `traceNode()` and `traceNodePair()` trace node → regions → layer (neurochemistry depth in Phase 2)

**5-level causal stack:**
```
Level 0: Neurochemistry  (systems, receptors, pathways)
Level 1: Brain Regions    (atlas)
Level 2: Mechanisms       (mechanism definitions)
Level 3: Functional Nodes (nodes — the 44 extracted patterns)
Level 4: Unnamed/Emergent (hypotheses — generated experiences)
```

### Original Map

Single HTML file, three sections: CSS (lines ~7–1287), HTML markup, JavaScript (lines ~1289–3365). Vanilla JS, no frameworks. Data embedded as JS constants.

## Conventions

- Node IDs: kebab-case (`rsd`, `sleep-wake-conflict`, `time-blindness`)
- 6 conditions: `adhd`, `asd`, `ocd`, `cptsd`, `gad`, `mdd`
- Source values in original data: `"adhd"` | `"asd"` | `"both"`
- Color coding: orange=ADHD, blue=ASD, purple=Both, red=Loops
- Connections in extracted data are NOT all bidirectional — `areDirectlyConnected()` checks both directions
- Commits: conventional format `type(scope): message`

## Design Documents

- `docs/plans/2026-02-20-hypothesis-engine-design.md` — Full design: vision, data model, views, inference engine
- `docs/plans/neurochemistry-models-extended.md` — Receptor/pathway/pharmacology models for GABA/Glu, eCB, OT, HPA, opioid
- `docs/plans/2026-02-20-phase1-implementation.md` — Phase 1 plan (completed)
