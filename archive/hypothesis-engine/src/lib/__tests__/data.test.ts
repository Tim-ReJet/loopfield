import { describe, it, expect, beforeAll } from 'vitest';
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
