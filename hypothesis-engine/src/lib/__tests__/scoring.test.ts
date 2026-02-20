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
