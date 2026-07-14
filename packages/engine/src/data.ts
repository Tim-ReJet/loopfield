import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { OriginalNode, Loop, BrainRegion, LayerDefinition } from './types';
import { buildStore, type DataStore } from './store';

export type { DataStore } from './store';
export { buildStore } from './store';

function readJsonSync<T>(file: string): T {
  const root = dirname(fileURLToPath(import.meta.url));
  const dataDir = resolve(root, '../data');
  return JSON.parse(readFileSync(resolve(dataDir, file), 'utf-8')) as T;
}

/** Load corpus from disk (Vitest / Node only — not for browser bundles). */
export async function loadData(): Promise<DataStore> {
  return buildStore({
    nodes: readJsonSync<OriginalNode[]>('nodes.json'),
    loops: readJsonSync<Loop[]>('loops.json'),
    atlas: readJsonSync<BrainRegion[]>('atlas.json'),
    layers: readJsonSync<LayerDefinition[]>('layers.json'),
    nodeTags: readJsonSync<Record<string, string[]>>('node-tags.json'),
    mechanismExpressionLinks: readJsonSync('mechanism-expression-links.json'),
    pathwayHighlights: readJsonSync('pathway-highlights.json'),
  });
}
