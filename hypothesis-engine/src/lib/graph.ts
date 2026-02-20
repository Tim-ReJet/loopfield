import type { DataStore } from './data';
import type { CandidateScore, ScoringSignals } from './types';

export function getDirectConnections(nodeId: string, store: DataStore): Set<string> {
  return store.connectionMap.get(nodeId) ?? new Set();
}

export function areDirectlyConnected(a: string, b: string, store: DataStore): boolean {
  // Connections in the data are not all bidirectional — check both directions
  return getDirectConnections(a, store).has(b) || getDirectConnections(b, store).has(a);
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

// --- Structural Scoring ---

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
  // Nodes with different source types that share neighbors get a small bonus
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
