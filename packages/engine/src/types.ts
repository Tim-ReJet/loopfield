// --- Condition model ---

export const CONDITIONS = ['adhd', 'asd', 'ocd', 'cptsd', 'gad', 'mdd'] as const;
export type ConditionId = typeof CONDITIONS[number];

export interface ConditionEntry {
  weight: number;       // 0–1 relevance
  description: string;
}

export type ConditionMap = Partial<Record<ConditionId, ConditionEntry>>;

// --- Level 3: Nodes (Functional Patterns) ---

export interface NeuroInfo {
  regions: string;
  normal: string;
  adhd: string;
  asd: string;
}

/** Original extracted node — the shape in data/nodes.json */
export interface OriginalNode {
  id: string;
  title: string;
  source: 'adhd' | 'asd' | 'both';
  brief: string;
  adhd: string;
  asd: string;
  combined: string;
  neuro: NeuroInfo;
  connects: string[];
}

/** Enriched node — the target shape after condition weight enrichment */
export interface Node extends OriginalNode {
  conditions?: ConditionMap;
  combinations?: Record<string, string>;
  mechanisms?: string[];
  receptors?: string[];
  pathways?: string[];
}

// --- Level 0: Neurochemistry ---

export interface Pharmacology {
  agonists: string[];
  antagonists: string[];
  modulators: string[];
  notes: string;
}

export interface NTSystem {
  id: string;
  name: string;
  abbreviation: string;
  role: string;
  conditions: ConditionMap;
}

export interface Receptor {
  id: string;
  system: string;
  receptor: string;
  pattern: string;
  role: string;
  conditions: ConditionMap;
  regions: string[];
  mechanisms: string[];
  pharmacology: Pharmacology;
}

export interface Pathway {
  id: string;
  name: string;
  from: string;
  to: string;
  neurotransmitter: string;
  receptors: string[];
  conditions: ConditionMap;
  mechanisms: string[];
  pharmacology: {
    affected_by: string[];
    notes: string;
  };
}

// --- Level 2: Mechanisms ---

export interface Mechanism {
  id: string;
  name: string;
  role: string;
  conditions: ConditionMap;
  regions: string[];
  pathways: string[];
  receptors: string[];
}

// --- Level 1: Brain Regions ---

export interface BrainRegion {
  id: string;
  name: string;
  role: string;
  desc: string;
  impacts: string[];
}

// --- Layers ---

export interface LayerDefinition {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  nodeIds: string[];
}

// --- Loops ---

export interface LoopStep {
  label: string;
  source: string;
}

export interface Loop {
  id: string;
  role: string;
  name: string;
  steps: LoopStep[];
  desc: string;
  impacts: string[];
}

// --- Hypotheses / Unnamed Experiences ---

export type HypothesisStatus = 'unnamed' | 'refining' | 'naming' | 'graduated';
export type DiscoveryZone = 'between-conditions' | 'within-condition' | 'beneath-conditions' | 'lived-submission';

export interface Hypothesis {
  id: string;
  status: HypothesisStatus;
  zone: DiscoveryZone;
  vignette: string;
  mechanism: string;
  nodes: string[];
  mechanisms: string[];
  regions: string[];
  pathways: string[];
  receptors: string[];
  crossSystemInteraction?: string;
  candidateName: string;
  confidence: {
    structural: number;
    signals: string[];
  };
  conditionProfile: Partial<Record<ConditionId, number>>;
  resonance: { exact: number; close: number; 'not-me': number };
  refinements: string[];
  submissions: string[];
  created: string;
}

// --- Structural scoring ---

export interface ScoringSignals {
  sharedMechanisms: number;
  sharedPathways: number;
  sharedReceptors: number;
  commonNeighbors: number;
  conditionOverlap: number;
  layerAdjacency: number;
  crossSystemBonus: number;
}

export interface CandidateScore {
  nodeA: string;
  nodeB: string;
  score: number;
  signals: ScoringSignals;
}
