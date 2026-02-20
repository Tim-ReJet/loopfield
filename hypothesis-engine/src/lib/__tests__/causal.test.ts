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
