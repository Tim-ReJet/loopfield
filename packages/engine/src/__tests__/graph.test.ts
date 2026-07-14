import { describe, it, expect, beforeAll } from 'vitest';
import { loadData } from '../data';
import type { DataStore } from '../store';
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
