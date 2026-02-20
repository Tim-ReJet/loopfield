# Phase 1: Foundation — Data Extraction, Scaffold, Core Engine

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract data from the existing HTML into JSON, scaffold the Svelte + Vite + TypeScript app, and build the core graph/causal engine with tests.

**Architecture:** JSON data files feed a reactive Svelte store. graph.ts handles traversal and structural scoring. causal.ts traces the five-level causal stack. All testable with Vitest independent of UI.

**Tech Stack:** Svelte 5, Vite, TypeScript, Vitest

---

### Task 1: Initialize Git Repository

**Files:**
- Create: `.gitignore`

**Step 1: Initialize git**

Run: `cd /Users/lcladmin/Projects/audhd_map && git init`

**Step 2: Create .gitignore**

```
node_modules/
dist/
.DS_Store
*.local
```

Write this to `/Users/lcladmin/Projects/audhd_map/.gitignore`.

**Step 3: Initial commit**

Run:
```bash
git add adhd_asd_interaction_map.html CLAUDE.md docs/ .gitignore
git commit -m "feat: initial commit with original map and design docs"
```

---

### Task 2: Extract Node Data from HTML

**Files:**
- Create: `hypothesis-engine/data/nodes.json`
- Read: `adhd_asd_interaction_map.html:1289-1994`

**Step 1: Create extraction script**

Create `scripts/extract-data.mjs`. This script reads the HTML file, extracts each `const` data block using regex, evaluates it, and writes JSON files.

```javascript
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const html = readFileSync('adhd_asd_interaction_map.html', 'utf-8');
const outDir = 'hypothesis-engine/data';
mkdirSync(outDir, { recursive: true });

function extractArray(varName) {
  // Match: const varName = [ ... ];
  const regex = new RegExp(`const ${varName} = (\\[[\\s\\S]*?\\]);`, 'm');
  const match = html.match(regex);
  if (!match) throw new Error(`Could not find ${varName}`);
  return eval(match[1]);
}

function extractObject(varName) {
  // Match: const varName = { ... };
  const regex = new RegExp(`const ${varName} = (\\{[\\s\\S]*?\\});\\n`, 'm');
  const match = html.match(regex);
  if (!match) throw new Error(`Could not find ${varName}`);
  return eval(`(${match[1]})`);
}

// Extract arrays
const nodes = extractArray('nodes');
const loops = extractArray('loops');
const brainAtlas = extractArray('brainAtlas');
const layerDefinitions = extractArray('layerDefinitions');

// Extract objects
const nodeTagsById = extractObject('nodeTagsById');
const mechanismExpressionLinks = extractObject('mechanismExpressionLinks');
const pathwayHighlights = extractObject('pathwayHighlights');

// Write JSON files
const write = (name, data) => {
  writeFileSync(`${outDir}/${name}`, JSON.stringify(data, null, 2) + '\n');
  console.log(`Wrote ${outDir}/${name} (${Array.isArray(data) ? data.length + ' items' : Object.keys(data).length + ' keys'})`);
};

write('nodes.json', nodes);
write('loops.json', loops);
write('atlas.json', brainAtlas);
write('layers.json', layerDefinitions);
write('node-tags.json', nodeTagsById);
write('mechanism-expression-links.json', mechanismExpressionLinks);
write('pathway-highlights.json', pathwayHighlights);

console.log('\nExtraction complete.');
console.log(`Nodes: ${nodes.length}`);
console.log(`Loops: ${loops.length}`);
console.log(`Brain regions: ${brainAtlas.length}`);
console.log(`Layers: ${layerDefinitions.length}`);
```

**Step 2: Run extraction**

Run: `cd /Users/lcladmin/Projects/audhd_map && node scripts/extract-data.mjs`

Expected output:
```
Wrote hypothesis-engine/data/nodes.json (XX items)
Wrote hypothesis-engine/data/loops.json (XX items)
...
Extraction complete.
```

**Step 3: Verify extracted data**

Run: `node -e "const d = require('./hypothesis-engine/data/nodes.json'); console.log(d.length + ' nodes'); console.log(d[0].id, d[0].title);"`

Expected: Node count and first node id/title.

**Step 4: Verify all connections are bidirectional**

Run:
```bash
node -e "
const nodes = require('./hypothesis-engine/data/nodes.json');
const issues = [];
for (const node of nodes) {
  for (const conn of node.connects) {
    const target = nodes.find(n => n.id === conn);
    if (!target) { issues.push(node.id + ' -> ' + conn + ' (missing)'); continue; }
    if (!target.connects.includes(node.id)) {
      issues.push(node.id + ' -> ' + conn + ' (not bidirectional)');
    }
  }
}
if (issues.length) { console.log('Issues:'); issues.forEach(i => console.log('  ' + i)); }
else { console.log('All connections bidirectional'); }
"
```

**Step 5: Commit**

```bash
git add scripts/ hypothesis-engine/data/
git commit -m "feat: extract data from HTML into JSON files"
```

---

### Task 3: Scaffold Svelte + Vite + TypeScript App

**Files:**
- Create: `hypothesis-engine/package.json`
- Create: `hypothesis-engine/vite.config.ts`
- Create: `hypothesis-engine/svelte.config.js`
- Create: `hypothesis-engine/tsconfig.json`
- Create: `hypothesis-engine/index.html`
- Create: `hypothesis-engine/src/main.ts`
- Create: `hypothesis-engine/src/App.svelte`
- Create: `hypothesis-engine/src/vite-env.d.ts`

**Step 1: Scaffold with Vite**

Run:
```bash
cd /Users/lcladmin/Projects/audhd_map && npm create vite@latest hypothesis-engine-scaffold -- --template svelte-ts
```

Then move scaffold contents into existing hypothesis-engine dir (preserving data/):

```bash
cp hypothesis-engine-scaffold/package.json hypothesis-engine/
cp hypothesis-engine-scaffold/vite.config.ts hypothesis-engine/
cp hypothesis-engine-scaffold/svelte.config.js hypothesis-engine/
cp hypothesis-engine-scaffold/tsconfig.json hypothesis-engine/
cp hypothesis-engine-scaffold/tsconfig.node.json hypothesis-engine/ 2>/dev/null || true
cp hypothesis-engine-scaffold/index.html hypothesis-engine/
cp -r hypothesis-engine-scaffold/src hypothesis-engine/
cp -r hypothesis-engine-scaffold/public hypothesis-engine/ 2>/dev/null || true
rm -rf hypothesis-engine-scaffold
```

**Step 2: Configure Vite to watch data/ for HMR**

Read `hypothesis-engine/vite.config.ts` and update it:

```typescript
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'watch-data',
      configureServer(server) {
        server.watcher.add('data/**/*.json');
        server.watcher.on('change', (path) => {
          if (path.endsWith('.json') && path.includes('data/')) {
            server.ws.send({ type: 'full-reload' });
          }
        });
      },
    },
  ],
});
```

**Step 3: Add Vitest**

Run:
```bash
cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npm install && npm install -D vitest
```

Add to `hypothesis-engine/package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Create minimal App.svelte**

Replace `hypothesis-engine/src/App.svelte` with:

```svelte
<script lang="ts">
</script>

<main>
  <h1>Hypothesis Engine</h1>
  <p>Loading...</p>
</main>

<style>
  :root {
    --bg: #0f1119;
    --text: #c8cdd8;
  }
  main {
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }
</style>
```

**Step 5: Verify dev server starts**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npm run dev -- --open`

Expected: Browser opens with "Hypothesis Engine" on dark background. Kill the server after verifying.

**Step 6: Verify tests run**

Create `hypothesis-engine/src/lib/__tests__/smoke.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('smoke test', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: 1 test passes.

**Step 7: Commit**

```bash
cd /Users/lcladmin/Projects/audhd_map
echo "hypothesis-engine/node_modules/" >> .gitignore
git add hypothesis-engine/ .gitignore
git commit -m "feat: scaffold Svelte + Vite + TypeScript app with Vitest"
```

---

### Task 4: Build TypeScript Types

**Files:**
- Create: `hypothesis-engine/src/lib/types.ts`
- Test: `hypothesis-engine/src/lib/__tests__/types.test.ts`

**Step 1: Write the type definitions**

Create `hypothesis-engine/src/lib/types.ts`:

```typescript
// --- Condition model ---

export const CONDITIONS = ['adhd', 'asd', 'ocd', 'cptsd', 'gad', 'mdd'] as const;
export type ConditionId = typeof CONDITIONS[number];

export interface ConditionEntry {
  weight: number;       // 0–1 relevance
  description: string;
}

export type ConditionMap = Partial<Record<ConditionId, ConditionEntry>>;

// --- Level 3: Nodes (Functional Patterns) ---

export interface NeuroInfo {
  regions: string;
  normal: string;
  adhd: string;
  asd: string;
}

/** Original extracted node — the shape in data/nodes.json */
export interface OriginalNode {
  id: string;
  title: string;
  source: 'adhd' | 'asd' | 'both';
  brief: string;
  adhd: string;
  asd: string;
  combined: string;
  neuro: NeuroInfo;
  connects: string[];
}

/** Enriched node — the target shape after condition weight enrichment */
export interface Node extends OriginalNode {
  conditions?: ConditionMap;
  combinations?: Record<string, string>;
  mechanisms?: string[];
  receptors?: string[];
  pathways?: string[];
}

// --- Level 0: Neurochemistry ---

export interface Pharmacology {
  agonists: string[];
  antagonists: string[];
  modulators: string[];
  notes: string;
}

export interface NTSystem {
  id: string;
  name: string;
  abbreviation: string;
  role: string;
  conditions: ConditionMap;
}

export interface Receptor {
  id: string;
  system: string;
  receptor: string;
  pattern: string;
  role: string;
  conditions: ConditionMap;
  regions: string[];
  mechanisms: string[];
  pharmacology: Pharmacology;
}

export interface Pathway {
  id: string;
  name: string;
  from: string;
  to: string;
  neurotransmitter: string;
  receptors: string[];
  conditions: ConditionMap;
  mechanisms: string[];
  pharmacology: {
    affected_by: string[];
    notes: string;
  };
}

// --- Level 2: Mechanisms ---

export interface Mechanism {
  id: string;
  name: string;
  role: string;
  conditions: ConditionMap;
  regions: string[];
  pathways: string[];
  receptors: string[];
}

// --- Level 1: Brain Regions ---

export interface BrainRegion {
  id: string;
  name: string;
  role: string;
  desc: string;
  impacts: string[];
}

// --- Layers ---

export interface LayerDefinition {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  nodeIds: string[];
}

// --- Loops ---

export interface LoopStep {
  label: string;
  source: string;
}

export interface Loop {
  id: string;
  role: string;
  name: string;
  steps: LoopStep[];
  desc: string;
  impacts: string[];
}

// --- Hypotheses / Unnamed Experiences ---

export type HypothesisStatus = 'unnamed' | 'refining' | 'naming' | 'graduated';
export type DiscoveryZone = 'between-conditions' | 'within-condition' | 'beneath-conditions' | 'lived-submission';

export interface Hypothesis {
  id: string;
  status: HypothesisStatus;
  zone: DiscoveryZone;
  vignette: string;
  mechanism: string;
  nodes: string[];
  mechanisms: string[];
  regions: string[];
  pathways: string[];
  receptors: string[];
  crossSystemInteraction?: string;
  candidateName: string;
  confidence: {
    structural: number;
    signals: string[];
  };
  conditionProfile: Partial<Record<ConditionId, number>>;
  resonance: { exact: number; close: number; 'not-me': number };
  refinements: string[];
  submissions: string[];
  created: string;
}

// --- Structural scoring ---

export interface ScoringSignals {
  sharedMechanisms: number;
  sharedPathways: number;
  sharedReceptors: number;
  commonNeighbors: number;
  conditionOverlap: number;
  layerAdjacency: number;
  crossSystemBonus: number;
}

export interface CandidateScore {
  nodeA: string;
  nodeB: string;
  score: number;
  signals: ScoringSignals;
}
```

**Step 2: Write type validation test**

Create `hypothesis-engine/src/lib/__tests__/types.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { CONDITIONS } from '../types';
import type { OriginalNode, Node, Hypothesis, CandidateScore } from '../types';

describe('types', () => {
  it('CONDITIONS has all 6 conditions', () => {
    expect(CONDITIONS).toEqual(['adhd', 'asd', 'ocd', 'cptsd', 'gad', 'mdd']);
    expect(CONDITIONS.length).toBe(6);
  });

  it('OriginalNode shape matches extracted data', () => {
    const node: OriginalNode = {
      id: 'test',
      title: 'Test Node',
      source: 'both',
      brief: 'A test node',
      adhd: 'ADHD description',
      asd: 'ASD description',
      combined: 'Combined description',
      neuro: { regions: 'PFC', normal: '...', adhd: '...', asd: '...' },
      connects: ['other-node'],
    };
    expect(node.id).toBe('test');
    expect(node.connects).toHaveLength(1);
  });

  it('CandidateScore has all scoring signals', () => {
    const score: CandidateScore = {
      nodeA: 'a',
      nodeB: 'b',
      score: 0.55,
      signals: {
        sharedMechanisms: 0.2,
        sharedPathways: 0.1,
        sharedReceptors: 0.05,
        commonNeighbors: 0.1,
        conditionOverlap: 0.05,
        layerAdjacency: 0.05,
        crossSystemBonus: 0.0,
      },
    };
    expect(score.score).toBeCloseTo(0.55);
  });
});
```

**Step 3: Run tests**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: All tests pass.

**Step 4: Commit**

```bash
cd /Users/lcladmin/Projects/audhd_map
git add hypothesis-engine/src/lib/types.ts hypothesis-engine/src/lib/__tests__/types.test.ts
git commit -m "feat: add TypeScript type definitions for data model"
```

---

### Task 5: Build Data Store

**Files:**
- Create: `hypothesis-engine/src/lib/data.ts`
- Test: `hypothesis-engine/src/lib/__tests__/data.test.ts`

**Step 1: Write failing test for data loading + indexing**

Create `hypothesis-engine/src/lib/__tests__/data.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { loadData, type DataStore } from '../data';

describe('data store', () => {
  let store: DataStore;

  // Load once for all tests — uses real extracted JSON
  beforeAll(async () => {
    store = await loadData();
  });

  it('loads all nodes', () => {
    expect(store.nodes.length).toBeGreaterThan(30);
  });

  it('builds nodeById index', () => {
    const rsd = store.nodeById.get('rsd');
    expect(rsd).toBeDefined();
    expect(rsd!.title).toBe('Rejection Sensitive Dysphoria');
  });

  it('builds connectionMap index', () => {
    const rsdConnections = store.connectionMap.get('rsd');
    expect(rsdConnections).toBeDefined();
    expect(rsdConnections!.size).toBeGreaterThan(3);
    expect(rsdConnections!.has('masking')).toBe(true);
  });

  it('builds nodeLayerMap index', () => {
    const layer = store.nodeLayerMap.get('time-blindness');
    expect(layer).toBe('Layer 0');
    const layer2 = store.nodeLayerMap.get('burnout');
    expect(layer2).toBe('Layer 3');
  });

  it('builds nodeTagsMap index', () => {
    const tags = store.nodeTagsMap.get('rsd');
    expect(tags).toBeDefined();
    expect(tags!.includes('Emotional')).toBe(true);
  });

  it('loads loops', () => {
    expect(store.loops.length).toBeGreaterThan(0);
    expect(store.loops[0].steps.length).toBeGreaterThan(2);
  });

  it('loads brain atlas', () => {
    expect(store.atlas.length).toBeGreaterThan(5);
    const pfc = store.atlas.find(r => r.id === 'pfc');
    expect(pfc).toBeDefined();
    expect(pfc!.impacts.length).toBeGreaterThan(10);
  });

  it('loads layers', () => {
    expect(store.layers).toHaveLength(4);
    expect(store.layers[0].level).toBe('Layer 0');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: FAIL — cannot find module `../data`.

**Step 3: Write data.ts**

Create `hypothesis-engine/src/lib/data.ts`:

```typescript
import type { OriginalNode, Node, Loop, BrainRegion, LayerDefinition } from './types';

export interface DataStore {
  nodes: Node[];
  nodeById: Map<string, Node>;
  connectionMap: Map<string, Set<string>>;
  nodeLayerMap: Map<string, string>;
  nodeTagsMap: Map<string, string[]>;
  loops: Loop[];
  atlas: BrainRegion[];
  layers: LayerDefinition[];
  mechanismExpressionLinks: Record<string, { kind: string; targetId: string; text: string }>;
  pathwayHighlights: Record<string, string>;
}

async function loadJson<T>(path: string): Promise<T> {
  const mod = await import(/* @vite-ignore */ path);
  return mod.default as T;
}

export async function loadData(): Promise<DataStore> {
  // In Vitest, use fs; in browser, use fetch
  let nodes: OriginalNode[];
  let loops: Loop[];
  let atlas: BrainRegion[];
  let layers: LayerDefinition[];
  let nodeTags: Record<string, string[]>;
  let mechanismExpressionLinks: Record<string, { kind: string; targetId: string; text: string }>;
  let pathwayHighlights: Record<string, string>;

  if (typeof window === 'undefined') {
    // Node/Vitest environment
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');
    const dataDir = resolve(import.meta.dirname, '../../data');
    const read = <T>(file: string): T => JSON.parse(readFileSync(resolve(dataDir, file), 'utf-8'));
    nodes = read<OriginalNode[]>('nodes.json');
    loops = read<Loop[]>('loops.json');
    atlas = read<BrainRegion[]>('atlas.json');
    layers = read<LayerDefinition[]>('layers.json');
    nodeTags = read<Record<string, string[]>>('node-tags.json');
    mechanismExpressionLinks = read('mechanism-expression-links.json');
    pathwayHighlights = read('pathway-highlights.json');
  } else {
    // Browser environment
    const fetchJson = async <T>(file: string): Promise<T> => {
      const resp = await fetch(`/data/${file}`);
      return resp.json();
    };
    [nodes, loops, atlas, layers, nodeTags, mechanismExpressionLinks, pathwayHighlights] = await Promise.all([
      fetchJson<OriginalNode[]>('nodes.json'),
      fetchJson<Loop[]>('loops.json'),
      fetchJson<BrainRegion[]>('atlas.json'),
      fetchJson<LayerDefinition[]>('layers.json'),
      fetchJson<Record<string, string[]>>('node-tags.json'),
      fetchJson('mechanism-expression-links.json'),
      fetchJson('pathway-highlights.json'),
    ]);
  }

  // Build indexes
  const nodeById = new Map(nodes.map(n => [n.id, n as Node]));
  const connectionMap = new Map(nodes.map(n => [n.id, new Set(n.connects)]));

  const nodeLayerMap = new Map<string, string>();
  for (const layer of layers) {
    for (const id of layer.nodeIds) {
      nodeLayerMap.set(id, layer.level);
    }
  }

  const nodeTagsMap = new Map<string, string[]>(Object.entries(nodeTags));

  return {
    nodes: nodes as Node[],
    nodeById,
    connectionMap,
    nodeLayerMap,
    nodeTagsMap,
    loops,
    atlas,
    layers,
    mechanismExpressionLinks,
    pathwayHighlights,
  };
}
```

**Step 4: Run tests**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: All tests pass.

**Step 5: Commit**

```bash
cd /Users/lcladmin/Projects/audhd_map
git add hypothesis-engine/src/lib/data.ts hypothesis-engine/src/lib/__tests__/data.test.ts
git commit -m "feat: data store with JSON loading and index building"
```

---

### Task 6: Build Graph Engine — Traversal and Path-Finding

**Files:**
- Create: `hypothesis-engine/src/lib/graph.ts`
- Test: `hypothesis-engine/src/lib/__tests__/graph.test.ts`

**Step 1: Write failing tests**

Create `hypothesis-engine/src/lib/__tests__/graph.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { loadData, type DataStore } from '../data';
import {
  getDirectConnections,
  getSecondDegreeConnections,
  findAllPaths,
  getCommonNeighbors,
  areDirectlyConnected,
} from '../graph';

describe('graph traversal', () => {
  let store: DataStore;

  beforeAll(async () => {
    store = await loadData();
  });

  it('getDirectConnections returns connected node ids', () => {
    const conns = getDirectConnections('rsd', store);
    expect(conns.size).toBeGreaterThan(3);
    expect(conns.has('masking')).toBe(true);
  });

  it('getDirectConnections returns empty set for unknown node', () => {
    const conns = getDirectConnections('nonexistent', store);
    expect(conns.size).toBe(0);
  });

  it('areDirectlyConnected checks both directions', () => {
    expect(areDirectlyConnected('rsd', 'masking', store)).toBe(true);
    expect(areDirectlyConnected('rsd', 'nonexistent', store)).toBe(false);
  });

  it('getSecondDegreeConnections excludes direct connections', () => {
    const second = getSecondDegreeConnections('rsd', store);
    const direct = getDirectConnections('rsd', store);
    for (const id of second) {
      expect(direct.has(id)).toBe(false);
    }
    expect(second.size).toBeGreaterThan(0);
  });

  it('getCommonNeighbors finds shared connections', () => {
    const common = getCommonNeighbors('rsd', 'masking', store);
    expect(common.size).toBeGreaterThan(0);
  });

  it('findAllPaths finds paths between connected nodes', () => {
    const paths = findAllPaths('rsd', 'burnout', store, 4);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path[0]).toBe('rsd');
      expect(path[path.length - 1]).toBe('burnout');
      expect(path.length).toBeLessThanOrEqual(5); // maxDepth + 1
    }
  });

  it('findAllPaths returns empty for unreachable nodes', () => {
    // All nodes should be reachable in this connected graph,
    // but with maxDepth=1 some won't be
    const paths = findAllPaths('rsd', 'burnout', store, 1);
    // RSD and burnout are not directly connected
    if (!areDirectlyConnected('rsd', 'burnout', store)) {
      expect(paths.length).toBe(0);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: FAIL — cannot find module `../graph`.

**Step 3: Write graph.ts**

Create `hypothesis-engine/src/lib/graph.ts`:

```typescript
import type { DataStore } from './data';

export function getDirectConnections(nodeId: string, store: DataStore): Set<string> {
  return store.connectionMap.get(nodeId) ?? new Set();
}

export function areDirectlyConnected(a: string, b: string, store: DataStore): boolean {
  return getDirectConnections(a, store).has(b);
}

export function getSecondDegreeConnections(nodeId: string, store: DataStore): Set<string> {
  const direct = getDirectConnections(nodeId, store);
  const second = new Set<string>();

  for (const neighbor of direct) {
    const neighborConns = getDirectConnections(neighbor, store);
    for (const id of neighborConns) {
      if (id !== nodeId && !direct.has(id)) {
        second.add(id);
      }
    }
  }

  return second;
}

export function getCommonNeighbors(a: string, b: string, store: DataStore): Set<string> {
  const connsA = getDirectConnections(a, store);
  const connsB = getDirectConnections(b, store);
  const common = new Set<string>();

  for (const id of connsA) {
    if (connsB.has(id)) {
      common.add(id);
    }
  }

  return common;
}

export function findAllPaths(
  from: string,
  to: string,
  store: DataStore,
  maxDepth: number,
): string[][] {
  const results: string[][] = [];

  function dfs(current: string, target: string, path: string[], visited: Set<string>) {
    if (current === target) {
      results.push([...path]);
      return;
    }
    if (path.length > maxDepth) return;

    const neighbors = getDirectConnections(current, store);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);
        dfs(neighbor, target, path, visited);
        path.pop();
        visited.delete(neighbor);
      }
    }
  }

  const visited = new Set([from]);
  dfs(from, to, [from], visited);
  return results;
}
```

**Step 4: Run tests**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: All tests pass.

**Step 5: Commit**

```bash
cd /Users/lcladmin/Projects/audhd_map
git add hypothesis-engine/src/lib/graph.ts hypothesis-engine/src/lib/__tests__/graph.test.ts
git commit -m "feat: graph traversal and path-finding engine"
```

---

### Task 7: Build Graph Engine — Structural Scoring

**Files:**
- Modify: `hypothesis-engine/src/lib/graph.ts`
- Test: `hypothesis-engine/src/lib/__tests__/scoring.test.ts`

**Step 1: Write failing tests**

Create `hypothesis-engine/src/lib/__tests__/scoring.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { loadData, type DataStore } from '../data';
import { scoreCandidate, findTopCandidates } from '../graph';

describe('structural scoring', () => {
  let store: DataStore;

  beforeAll(async () => {
    store = await loadData();
  });

  it('scoreCandidate returns score between 0 and 1', () => {
    const result = scoreCandidate('rsd', 'burnout', store);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
    expect(result.nodeA).toBe('rsd');
    expect(result.nodeB).toBe('burnout');
  });

  it('scoreCandidate has all signal fields', () => {
    const result = scoreCandidate('rsd', 'burnout', store);
    expect(result.signals).toHaveProperty('sharedMechanisms');
    expect(result.signals).toHaveProperty('sharedPathways');
    expect(result.signals).toHaveProperty('sharedReceptors');
    expect(result.signals).toHaveProperty('commonNeighbors');
    expect(result.signals).toHaveProperty('conditionOverlap');
    expect(result.signals).toHaveProperty('layerAdjacency');
    expect(result.signals).toHaveProperty('crossSystemBonus');
  });

  it('directly connected nodes are excluded from candidates', () => {
    // RSD and masking are directly connected — should not be scored as candidates
    const result = scoreCandidate('rsd', 'masking', store);
    expect(result.score).toBe(0);
  });

  it('common neighbors increase score', () => {
    const result = scoreCandidate('rsd', 'burnout', store);
    expect(result.signals.commonNeighbors).toBeGreaterThan(0);
  });

  it('layer adjacency detected for neighboring layers', () => {
    // time-blindness is Layer 0, executive is Layer 1 — adjacent
    const result = scoreCandidate('time-blindness', 'burnout', store);
    // Layer 0 and Layer 3 — not adjacent
    expect(result.signals.layerAdjacency).toBeDefined();
  });

  it('findTopCandidates returns ranked list', () => {
    const candidates = findTopCandidates(store, 10, 0.0);
    expect(candidates.length).toBeLessThanOrEqual(10);
    // Should be sorted descending
    for (let i = 1; i < candidates.length; i++) {
      expect(candidates[i].score).toBeLessThanOrEqual(candidates[i - 1].score);
    }
  });

  it('findTopCandidates respects threshold', () => {
    const candidates = findTopCandidates(store, 100, 0.3);
    for (const c of candidates) {
      expect(c.score).toBeGreaterThanOrEqual(0.3);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: FAIL — `scoreCandidate` not exported from `../graph`.

**Step 3: Add scoring functions to graph.ts**

Append to `hypothesis-engine/src/lib/graph.ts`:

```typescript
import type { CandidateScore, ScoringSignals, Node } from './types';

const WEIGHTS = {
  sharedMechanisms: 0.25,
  sharedPathways: 0.20,
  sharedReceptors: 0.20,
  commonNeighbors: 0.15,
  conditionOverlap: 0.10,
  layerAdjacency: 0.10,
} as const;

const CROSS_SYSTEM_BONUS = 0.15;

function setOverlap(a: string[] | undefined, b: string[] | undefined): number {
  if (!a?.length || !b?.length) return 0;
  const setB = new Set(b);
  const shared = a.filter(x => setB.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union > 0 ? shared / union : 0;
}

function layerDistance(layerA: string | undefined, layerB: string | undefined): number {
  if (!layerA || !layerB) return Infinity;
  const numA = parseInt(layerA.replace('Layer ', ''), 10);
  const numB = parseInt(layerB.replace('Layer ', ''), 10);
  return Math.abs(numA - numB);
}

export function scoreCandidate(nodeAId: string, nodeBId: string, store: DataStore): CandidateScore {
  const zeroSignals: ScoringSignals = {
    sharedMechanisms: 0,
    sharedPathways: 0,
    sharedReceptors: 0,
    commonNeighbors: 0,
    conditionOverlap: 0,
    layerAdjacency: 0,
    crossSystemBonus: 0,
  };

  // Directly connected nodes are not candidates
  if (areDirectlyConnected(nodeAId, nodeBId, store)) {
    return { nodeA: nodeAId, nodeB: nodeBId, score: 0, signals: zeroSignals };
  }

  const nodeA = store.nodeById.get(nodeAId);
  const nodeB = store.nodeById.get(nodeBId);
  if (!nodeA || !nodeB) {
    return { nodeA: nodeAId, nodeB: nodeBId, score: 0, signals: zeroSignals };
  }

  // Shared mechanisms, pathways, receptors (from enriched nodes — fallback to 0 if not enriched yet)
  const sharedMechanisms = setOverlap(nodeA.mechanisms, nodeB.mechanisms);
  const sharedPathways = setOverlap(nodeA.pathways, nodeB.pathways);
  const sharedReceptors = setOverlap(nodeA.receptors, nodeB.receptors);

  // Common neighbors
  const common = getCommonNeighbors(nodeAId, nodeBId, store);
  const maxNeighbors = Math.max(
    getDirectConnections(nodeAId, store).size,
    getDirectConnections(nodeBId, store).size,
    1,
  );
  const commonNeighbors = common.size / maxNeighbors;

  // Condition overlap (using source field from original data for now)
  const sourceScore = nodeA.source === nodeB.source ? 1.0 :
    (nodeA.source === 'both' || nodeB.source === 'both') ? 0.7 : 0.3;
  const conditionOverlap = sourceScore;

  // Layer adjacency
  const layerA = store.nodeLayerMap.get(nodeAId);
  const layerB = store.nodeLayerMap.get(nodeBId);
  const dist = layerDistance(layerA, layerB);
  const layerAdjacency = dist <= 1 ? 1.0 : dist === 2 ? 0.5 : 0.0;

  // Cross-system bonus — placeholder until neurochemistry data is enriched
  // For now, nodes with different source types that share neighbors get a small bonus
  const crossSystemBonus = (nodeA.source !== nodeB.source && common.size > 0) ? 1.0 : 0.0;

  const signals: ScoringSignals = {
    sharedMechanisms,
    sharedPathways,
    sharedReceptors,
    commonNeighbors,
    conditionOverlap,
    layerAdjacency,
    crossSystemBonus,
  };

  const score =
    signals.sharedMechanisms * WEIGHTS.sharedMechanisms +
    signals.sharedPathways * WEIGHTS.sharedPathways +
    signals.sharedReceptors * WEIGHTS.sharedReceptors +
    signals.commonNeighbors * WEIGHTS.commonNeighbors +
    signals.conditionOverlap * WEIGHTS.conditionOverlap +
    signals.layerAdjacency * WEIGHTS.layerAdjacency +
    signals.crossSystemBonus * CROSS_SYSTEM_BONUS;

  return { nodeA: nodeAId, nodeB: nodeBId, score: Math.min(score, 1.0), signals };
}

export function findTopCandidates(
  store: DataStore,
  limit: number,
  threshold: number,
): CandidateScore[] {
  const candidates: CandidateScore[] = [];
  const nodeIds = store.nodes.map(n => n.id);

  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const result = scoreCandidate(nodeIds[i], nodeIds[j], store);
      if (result.score >= threshold) {
        candidates.push(result);
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, limit);
}
```

**Step 4: Run tests**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: All tests pass.

**Step 5: Commit**

```bash
cd /Users/lcladmin/Projects/audhd_map
git add hypothesis-engine/src/lib/graph.ts hypothesis-engine/src/lib/__tests__/scoring.test.ts
git commit -m "feat: structural scoring engine for hypothesis candidates"
```

---

### Task 8: Build Causal Trace Engine

**Files:**
- Create: `hypothesis-engine/src/lib/causal.ts`
- Test: `hypothesis-engine/src/lib/__tests__/causal.test.ts`

This task builds a simplified causal tracer that works with the *currently extracted data* (nodes, atlas, layers). Once the neurochemistry JSON files are built (Phase 2), the tracer gains its full depth. For now it traces: node -> brain regions -> layer.

**Step 1: Write failing tests**

Create `hypothesis-engine/src/lib/__tests__/causal.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { loadData, type DataStore } from '../data';
import { traceNode, traceNodePair } from '../causal';

describe('causal trace', () => {
  let store: DataStore;

  beforeAll(async () => {
    store = await loadData();
  });

  it('traceNode returns node info with regions and layer', () => {
    const trace = traceNode('rsd', store);
    expect(trace.node).toBeDefined();
    expect(trace.node!.id).toBe('rsd');
    expect(trace.layer).toBeDefined();
    expect(trace.regions.length).toBeGreaterThan(0);
  });

  it('traceNode returns null node for unknown id', () => {
    const trace = traceNode('nonexistent', store);
    expect(trace.node).toBeNull();
  });

  it('traceNode finds brain regions that impact this node', () => {
    const trace = traceNode('rsd', store);
    // PFC should impact RSD
    const regionIds = trace.regions.map(r => r.id);
    expect(regionIds).toContain('pfc');
  });

  it('traceNodePair finds shared and unique regions', () => {
    const trace = traceNodePair('rsd', 'masking', store);
    expect(trace.shared.regions.length).toBeGreaterThan(0);
    expect(trace.nodeA.node).toBeDefined();
    expect(trace.nodeB.node).toBeDefined();
  });

  it('traceNodePair identifies shared layer when same layer', () => {
    // Both Layer 1 nodes
    const trace = traceNodePair('rsd', 'masking', store);
    if (trace.nodeA.layer === trace.nodeB.layer) {
      expect(trace.shared.sameLayer).toBe(true);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: FAIL — cannot find module `../causal`.

**Step 3: Write causal.ts**

Create `hypothesis-engine/src/lib/causal.ts`:

```typescript
import type { DataStore } from './data';
import type { Node, BrainRegion } from './types';

export interface NodeTrace {
  node: Node | null;
  layer: string | undefined;
  regions: BrainRegion[];
  // Future: mechanisms, pathways, receptors (once neurochemistry data exists)
  mechanisms: string[];
  pathways: string[];
  receptors: string[];
}

export interface PairTrace {
  nodeA: NodeTrace;
  nodeB: NodeTrace;
  shared: {
    regions: BrainRegion[];
    sameLayer: boolean;
    // Future: sharedMechanisms, sharedPathways, sharedReceptors
  };
}

export function traceNode(nodeId: string, store: DataStore): NodeTrace {
  const node = store.nodeById.get(nodeId) ?? null;

  if (!node) {
    return {
      node: null,
      layer: undefined,
      regions: [],
      mechanisms: [],
      pathways: [],
      receptors: [],
    };
  }

  const layer = store.nodeLayerMap.get(nodeId);

  // Find all brain regions whose impacts list includes this node
  const regions = store.atlas.filter(region => region.impacts.includes(nodeId));

  return {
    node,
    layer,
    regions,
    mechanisms: node.mechanisms ?? [],
    pathways: node.pathways ?? [],
    receptors: node.receptors ?? [],
  };
}

export function traceNodePair(nodeAId: string, nodeBId: string, store: DataStore): PairTrace {
  const traceA = traceNode(nodeAId, store);
  const traceB = traceNode(nodeBId, store);

  const regionIdsA = new Set(traceA.regions.map(r => r.id));
  const sharedRegions = traceB.regions.filter(r => regionIdsA.has(r.id));

  return {
    nodeA: traceA,
    nodeB: traceB,
    shared: {
      regions: sharedRegions,
      sameLayer: !!(traceA.layer && traceB.layer && traceA.layer === traceB.layer),
    },
  };
}
```

**Step 4: Run tests**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: All tests pass.

**Step 5: Commit**

```bash
cd /Users/lcladmin/Projects/audhd_map
git add hypothesis-engine/src/lib/causal.ts hypothesis-engine/src/lib/__tests__/causal.test.ts
git commit -m "feat: causal trace engine (node -> regions -> layer)"
```

---

### Task 9: Clean Up and Verify Full Test Suite

**Step 1: Delete smoke test**

Delete `hypothesis-engine/src/lib/__tests__/smoke.test.ts` — it was just scaffolding.

**Step 2: Run full test suite**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vitest run`

Expected: All tests pass across types.test.ts, data.test.ts, graph.test.ts, scoring.test.ts, causal.test.ts.

**Step 3: Verify build**

Run: `cd /Users/lcladmin/Projects/audhd_map/hypothesis-engine && npx vite build`

Expected: Build succeeds with no TypeScript errors.

**Step 4: Commit**

```bash
cd /Users/lcladmin/Projects/audhd_map
git add -A
git commit -m "chore: clean up scaffolding, verify full test suite and build"
```

---

## Summary

After Phase 1 completes, you have:

- **Git repo** initialized with the original map + design docs
- **Extracted JSON data** — nodes, loops, atlas, layers, tags, mechanism links, pathway highlights
- **Svelte + Vite + TypeScript** app scaffolded with HMR data file watching
- **Type system** covering all five causal stack levels + scoring
- **Data store** loading JSON with indexed lookups (nodeById, connectionMap, nodeLayerMap, nodeTagsMap)
- **Graph engine** — traversal, path-finding, structural scoring with 6 weighted signals
- **Causal trace engine** — node → regions → layer (ready for neurochemistry enrichment in Phase 2)
- **Test suite** covering all core logic

**Phase 2 will cover:**
- Building the neurochemistry JSON files (systems, receptors, pathways, mechanisms)
- Enriching nodes with condition weights and mechanism/receptor/pathway links
- Extending the causal tracer to full 5-level depth
- Extending the scoring engine to use neurochemistry signals
- Building the CausalTrace UI component
