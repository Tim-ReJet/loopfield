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
