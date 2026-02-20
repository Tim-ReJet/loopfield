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
    const { fileURLToPath } = await import('url');
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    const dataDir = resolve(__dirname, '../../data');
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
