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

/** Build indexes from already-loaded corpus arrays (browser + server). */
export function buildStore(input: {
  nodes: OriginalNode[];
  loops: Loop[];
  atlas: BrainRegion[];
  layers: LayerDefinition[];
  nodeTags: Record<string, string[]>;
  mechanismExpressionLinks: Record<string, { kind: string; targetId: string; text: string }>;
  pathwayHighlights: Record<string, string>;
}): DataStore {
  const nodes = input.nodes as Node[];
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const connectionMap = new Map(nodes.map((n) => [n.id, new Set(n.connects)]));

  const nodeLayerMap = new Map<string, string>();
  for (const layer of input.layers) {
    for (const id of layer.nodeIds) {
      nodeLayerMap.set(id, layer.level);
    }
  }

  return {
    nodes,
    nodeById,
    connectionMap,
    nodeLayerMap,
    nodeTagsMap: new Map(Object.entries(input.nodeTags)),
    loops: input.loops,
    atlas: input.atlas,
    layers: input.layers,
    mechanismExpressionLinks: input.mechanismExpressionLinks,
    pathwayHighlights: input.pathwayHighlights,
  };
}
