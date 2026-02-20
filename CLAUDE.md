# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-file interactive web application (`adhd_asd_interaction_map.html`) that maps the interaction patterns between ADHD and ASD traits. No build system, no dependencies, no package manager — just one self-contained HTML file with embedded CSS, data, and JavaScript (~3400 lines).

## Development

Open the HTML file directly in a browser. No build step, no server required.

```bash
open adhd_asd_interaction_map.html
```

There are no tests, linting, or CI. Validate changes by opening the file in a browser.

## Architecture

The file has three sections in order:

1. **CSS** (lines ~7–1287): Custom properties in `:root` define the color system (`--adhd`, `--asd`, `--both`, `--loop` and their dim/glow variants). Dark theme only. Uses DM Sans + Fraunces from Google Fonts.

2. **HTML** (lines ~1288–1288): Minimal structural markup — container divs, modal backdrop, filter toolbar, layer sections, brain atlas panel, feedback loops panel. Most content is rendered by JS.

3. **JavaScript** (lines ~1289–3365): All logic is vanilla JS with no frameworks or libraries.

### Data Model

All content lives in JS constants at the top of the script:

- **`nodes[]`** — Each node represents an ADHD/ASD trait/experience. Fields: `id`, `title`, `source` (adhd|asd|both), `brief`, `adhd`/`asd`/`combined` descriptions, `neuro` (brain region info), `connects[]` (edge list to other node IDs).
- **`loops[]`** — Feedback loops with `steps[]` (each has `label` + `source`) and `impacts[]` (node IDs).
- **`brainAtlas[]`** — Brain regions with `name`, `role`, `desc`, `impacts[]` (node IDs).

### Layer System

Nodes are organized into 4 layers via `layerDefinitions[]`:
- **Layer 0**: Core Functional Primitives (processing-level)
- **Layer 1**: Primary Lived Patterns (day-to-day)
- **Layer 2**: Compounding Loop States (recurring cycles)
- **Layer 3**: Downstream Consequences (long-horizon outcomes)

### Key Lookup Structures

- `nodeById` — Map of node ID → node object
- `directConnectionMap` — Map of node ID → Set of connected node IDs
- `nodeLayerById` — Map of node ID → layer label
- `nodeTagsById` — Map of node ID → tag array (Emotional, Cognitive, Social, etc.)
- `mechanismExpressionLinks` — Maps Layer 0 primitives to their Layer 1+ expressions
- `pathwayHighlights` — Named multi-hop pathways through the graph

### Rendering

All rendering is imperative DOM manipulation:
- `renderCards()` — Main card grid with filtering by source type and tag chips
- `renderAtlas()` — Brain region explorer panel
- `renderLoop()` — Feedback loop visualizer
- `showPathModal()` / `navigateToCard()` — Modal for connection pathways between nodes
- Discovery panel shows pre-defined multi-hop pathways

### Interaction Patterns

- Filter chips toggle by source (ADHD/ASD/Both) and by tag
- Clicking a card opens a detail modal with ADHD/ASD/Combined/Neuro tabs
- Connection badges on cards link to pathway modals showing direct + second-degree connections
- "Discover Pathways" button opens curated multi-hop pathway explorer

## Conventions

- Node IDs are kebab-case strings (e.g., `rejection-sensitive-dysphoria` → `rsd`, `sleep-wake-conflict`)
- Connections are bidirectional in the data — if A lists B in `connects`, B should list A
- Source values: `"adhd"`, `"asd"`, `"both"` — used for both data classification and CSS class names
- Color coding is consistent: orange=ADHD, blue=ASD, purple=Both, red=Loops
