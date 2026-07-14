import type { DataStore } from './store';
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
