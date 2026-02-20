# Neurodivergent Hypothesis Engine — Design Document

**Date:** 2026-02-20
**Status:** Draft
**Companion doc:** `neurochemistry-models-extended.md` (full receptor/pathway/pharmacology models)

---

## Vision

A data-driven, interactive hypothesis engine that helps neurodivergent people find themselves among documented lived experiences — and discover, articulate, and name new ones that have always been felt but never had words.

The existing ADHD x ASD Interaction Map is a reference. This is a mirror.

The system models six commonly co-occurring neurodivergent conditions — ADHD, ASD, OCD, CPTSD, GAD, MDD — and traces every lived experience from felt language down through functional patterns, mechanisms, brain regions, neural pathways, to neurochemistry. It surfaces unnamed experiences at the intersections between conditions, within single conditions, beneath diagnostic categories entirely, and from the lived experience of real people.

---

## Core Principles

1. **Recognition over analysis.** The primary interaction is someone seeing themselves reflected back. The graph theory, neurochemistry, and mechanism mapping serve that — they don't lead.
2. **Clinical precision, warm language.** Name the machinery clearly (RSD, interoception, D1 tonic signaling) but make it feel like being understood, not diagnosed.
3. **The unnamed becomes named.** Experiences enter raw, accumulate resonance from real people, and graduate into first-class named nodes. The map grows from lived experience.
4. **Full causal depth.** Every experience traces from felt language down through functional patterns, mechanisms, brain regions, neural pathways, to neurochemistry. Understanding *why* something happens is part of being seen.
5. **Negative signal is data.** When someone says "Not me" on a predicted experience, that's a gap in the model — and gaps are where unnamed experiences live.

---

## The Six Conditions

These six conditions co-occur frequently because they share overlapping neurochemical substrates. That overlap is exactly why the lived experiences at their intersections are so hard to untangle — and so rarely named.

| Condition | Core domain | Key systems |
|-----------|-------------|-------------|
| **ADHD** | Executive, reward, temporal | DA (core), NE (core), eCB |
| **ASD** | Social, sensory, predictive | OT (core), DA, GABA/Glu (E/I), 5-HT |
| **OCD** | Compulsive loops, doubt, threat | 5-HT (core), Glu (core), GABA, DA |
| **CPTSD** | Nervous system, hypervigilance | HPA (core), NE (core), opioid, OT |
| **GAD** | Threat prediction, rumination | NE (core), 5-HT (core), GABA (core), HPA |
| **MDD** | Anhedonia, withdrawal | 5-HT (core), DA, HPA (core), opioid |

The model is designed so additional conditions can be added later without restructuring.

---

## Architecture

### Three-Layer System

```
+-------------------------------------+
|         Svelte Frontend              |
|  (Find Yourself, The Unnamed,       |
|   Constellations, Causal Trace)      |
+----------------+--------------------+
                 | reads
+----------------v--------------------+
|         data/ (shared JSON)          |
|  nodes, loops, atlas, mechanisms,    |
|  pathways, receptors, systems,       |
|  hypotheses, layers, prompts,        |
|  submissions, constellations         |
+----------------^--------------------+
                 | writes
+----------------+--------------------+
|         Claude Code                  |
|  (reads data, reasons about          |
|   connections, generates hypotheses, |
|   maps raw submissions, names        |
|   graduated experiences, detects     |
|   new feedback loops)                |
+-------------------------------------+
```

- **Svelte frontend** displays and enables interaction
- **JSON data files** are the shared state
- **Claude Code** is the intelligence layer — no API keys, no backend
- **Vite dev server** watches data files; HMR pushes changes to the frontend live
- **localStorage** persists user constellations and votes (no server)

### Data Flow

```
User interacts with frontend
       |
       v
You bring request to Claude Code
  "Generate candidates for sensory-social intersections"
  "Map this raw submission: '...'"
  "Refine unnamed-017 based on these 'close but' responses"
  "Process the generation queue"
       |
       v
Claude Code reads data/, reasons, writes to data/
       |
       v
Vite detects file change -> HMR -> frontend updates
```

---

## The Five-Level Causal Stack

Every experience in the system can be traced through five levels:

```
Level 0: Neurochemistry
         systems.json     — DA, 5-HT, NE, GABA, Glu, eCB, OT, HPA, opioid
         receptors.json   — D1, D2, D4, 5-HT1A, 5-HT2A, 5-HT2C, SERT,
                            alpha-1, alpha-2, beta, GABA-A, GABA-B, NMDA,
                            AMPA, mGluR5, CB1, CB2, OXTR, GR, MR, CRHR1,
                            MOR, KOR, DOR
         pathways.json    — mesocortical, mesolimbic, nigrostriatal,
                            ceruleocortical, raphe projections, CSTC loops,
                            amygdala-PFC circuits, HPA axis
              |
              | modulates
              v
Level 1: Brain Regions
         atlas.json       — PFC, amygdala, ACC, TPJ, VTA, LC, NAcc,
                            OFC, striatum, thalamus, hippocampus,
                            dorsal raphe, hypothalamus, BNST...
              |
              | produces
              v
Level 2: Mechanisms
         mechanisms.json  — top-down-inhibition, salience-weighting,
              |              reward-prediction, social-prediction,
              |              temporal-discounting, sensory-gating,
              |              emotional-braking, cortical-loop-disinhibition,
              |              fear-extinction, stress-response-calibration...
              | generates
              v
Level 3: Functional Patterns (nodes)
         nodes.json       — ~45 existing nodes + new nodes as they graduate,
              |              tagged with condition weights, mechanisms,
              |              receptors, pathways
              | compounds into
              v
Level 4: Unnamed / Emergent Experiences
         hypotheses.json  — generated experiences with full
                            causal trace back to chemistry
```

### Example: Full Causal Trace

**Unnamed Experience: "Activation Grief"**
*The mourning for the version of yourself that could just start things.*

```
Nodes: initiation-friction + RSD + demand-avoidance

Mechanisms:
  <- reduced tonic activation (PFC can't sustain task-start signal)
  <- salience mis-weighting (task cost inflated by prior failure memory)
  <- emotional braking failure (shame response fires at full intensity)

Regions:
  <- PFC (dorsolateral) — activation maintenance
  <- Amygdala — threat/shame signal
  <- ACC — effort-reward computation

Pathways:
  <- mesocortical (VTA -> PFC): reduced DA weakens initiation drive
  <- amygdala -> PFC backprojection: threat signal suppresses activation

Neurochemistry:
  <- DA D1 tonic (PFC): insufficient sustained signal for task entry
  <- NE alpha-2 (LC -> PFC): noradrenergic arousal dysregulation under stress
  <- 5-HT2A (amygdala): altered serotonergic modulation of threat response
```

---

## Data Model

### Nodes (Level 3)

The `source` field from the original map (`"adhd" | "asd" | "both"`) is replaced by a multi-condition model. Each node carries independent weights and descriptions for all six conditions, plus pre-generated combination descriptions for common co-occurrences.

**nodes.json:**
```json
{
  "id": "rsd",
  "title": "Rejection Sensitive Dysphoria",
  "brief": "Perceived rejection triggers an immediate emotional crisis — not proportionate annoyance, but something closer to a full-body emergency.",
  "conditions": {
    "adhd": {
      "weight": 0.9,
      "description": "Dysregulated dopamine/norepinephrine means the PFC can't brake the amygdala's emotional response. The signal arrives at full intensity without moderation."
    },
    "asd": {
      "weight": 0.8,
      "description": "Difficulty reading social signals creates a hypersensitive threat-detection system with a high false-positive rate. Scanning constantly but interpreting ambiguously."
    },
    "ocd": {
      "weight": 0.6,
      "description": "Rejection triggers intrusive doubt loops — 'did I cause this? could I have prevented it?' — that persist as compulsive rumination far beyond the event."
    },
    "cptsd": {
      "weight": 0.85,
      "description": "Rejection maps onto early relational trauma patterns. The nervous system responds as though current social rupture is the original wound recurring."
    },
    "gad": {
      "weight": 0.5,
      "description": "Anticipatory anxiety about rejection becomes its own constant signal — the threat prediction system runs rejection scenarios even in safe contexts."
    },
    "mdd": {
      "weight": 0.4,
      "description": "Rejection accumulation feeds the depressive attribution model — 'I am the kind of person this happens to' — deepening withdrawal."
    }
  },
  "combinations": {
    "adhd+asd": "Social uncertainty remains high while emotional braking is low, so rejection cues are interpreted under maximum threat.",
    "adhd+ocd": "The emotional spike can't be braked AND can't be released — it enters a compulsive replay loop that burns energy without resolution.",
    "asd+cptsd": "Social misreading triggers trauma responses calibrated to early relational injury. The nervous system can't tell the difference between now and then.",
    "adhd+asd+ocd": "Unbraked emotional spike from ambiguous social input enters doubt-loop processing with no exit condition."
  },
  "neuro": {
    "regions": "Amygdala, ACC, PFC",
    "normal": "The ACC detects social 'errors'; the Amygdala generates an emotional signal; the PFC provides top-down regulation.",
    "adhd": "Reduced PFC inhibition allows the amygdala to fire at full volume.",
    "asd": "Hyper-sensitive Salience Network registers social uncertainty as a high-level threat."
  },
  "connects": ["interoception", "masking", "emotional-permanence", "continuity-of-self"],
  "mechanisms": ["emotional-braking-failure", "salience-miscalibration"],
  "receptors": ["da-d1-tonic", "ne-alpha2", "5ht-2a", "mor"],
  "pathways": ["mesocortical", "amygdala-pfc-backprojection"]
}
```

Combination descriptions are pre-generated by Claude Code for the most common co-occurring pairs and triples (~10-12). Rarer combinations are generated on demand when a user's constellation reveals them.

### Neurochemistry (Level 0)

Full models documented in `neurochemistry-models-extended.md`. Summary of structure:

**systems.json** — Neurotransmitter systems:
```json
{
  "id": "dopamine",
  "name": "Dopamine",
  "abbreviation": "DA",
  "role": "Reward prediction, motivation, working memory, motor initiation",
  "conditions": {
    "adhd": { "weight": 0.95, "description": "Core deficit: reduced tonic DA in PFC, altered phasic signaling in striatum..." },
    "asd": { "weight": 0.6, "description": "Altered DA signaling in striatal circuits..." },
    "ocd": { "weight": 0.5, "description": "..." },
    "cptsd": { "weight": 0.6, "description": "Chronic stress suppresses mesocortical DA..." },
    "gad": { "weight": 0.3, "description": "..." },
    "mdd": { "weight": 0.65, "description": "Reduced DA underlies anhedonia and motivational symptoms..." }
  }
}
```

**receptors.json** — Receptor subtypes with condition weights and pharmacology:
```json
{
  "id": "da-d1-tonic",
  "system": "dopamine",
  "receptor": "D1",
  "pattern": "tonic",
  "role": "Sustained working memory maintenance and top-down inhibition in PFC",
  "conditions": {
    "adhd": { "weight": 0.9, "description": "Reduced tonic D1 in PFC weakens sustained working memory and inhibitory control." },
    "asd": { "weight": 0.5, "description": "Altered D1 signaling in striatum affects reward prediction and behavioral flexibility." },
    "ocd": { "weight": 0.3, "description": "..." },
    "cptsd": { "weight": 0.6, "description": "Chronic cortisol suppresses D1 signaling in PFC via mesocortical pathway." },
    "gad": { "weight": 0.2, "description": "..." },
    "mdd": { "weight": 0.6, "description": "Reduced motivation signal." }
  },
  "regions": ["pfc", "striatum"],
  "mechanisms": ["top-down-inhibition", "working-memory-maintenance"],
  "pharmacology": {
    "agonists": ["methylphenidate (indirect)", "amphetamine (indirect)"],
    "antagonists": [],
    "modulators": ["guanfacine (indirect via alpha-2, improves D1 signal-to-noise in PFC)"],
    "notes": "Stimulant medications primarily increase DA availability in PFC, improving D1 tonic signaling. This is why working memory and inhibition improve on medication but reward sensitivity (D2 phasic, striatal) may change differently."
  }
}
```

**pathways.json** — Neural pathways with condition weights and pharmacology:
```json
{
  "id": "mesocortical",
  "name": "Mesocortical Pathway",
  "from": "VTA",
  "to": "PFC",
  "neurotransmitter": "dopamine",
  "receptors": ["da-d1-tonic", "da-d2"],
  "conditions": {
    "adhd": { "weight": 0.95, "description": "Reduced DA transmission underlies PFC hypoactivation..." },
    "cptsd": { "weight": 0.7, "description": "Chronic stress suppresses mesocortical DA, compounding executive deficits..." },
    "mdd": { "weight": 0.75, "description": "Reduced mesocortical DA drives motivational and cognitive symptoms..." }
  },
  "mechanisms": ["top-down-inhibition", "working-memory-maintenance", "temporal-discounting"],
  "pharmacology": {
    "affected_by": ["stimulants", "bupropion", "chronic stress (suppressive)", "SSRIs (indirect interaction)"],
    "notes": "DA-5HT interaction in PFC is bidirectional — SSRIs can alter DA dynamics here, which is why some people experience cognitive blunting or motivational changes on SSRIs."
  }
}
```

### Mechanisms (Level 2)

**mechanisms.json:**
```json
{
  "id": "top-down-inhibition",
  "name": "Top-Down Inhibition",
  "role": "PFC exerts regulatory control over subcortical emotional and impulse signals",
  "conditions": {
    "adhd": { "weight": 0.9, "description": "Reduced PFC activation weakens inhibitory braking — signals arrive unmoderated." },
    "asd": { "weight": 0.5, "description": "May be intact for focused interests but impaired under social cognitive load." },
    "ocd": { "weight": 0.6, "description": "OFC-striatal circuit disinhibition drives compulsive loops." },
    "cptsd": { "weight": 0.7, "description": "Amygdala override during threat state bypasses PFC regulation." },
    "gad": { "weight": 0.5, "description": "Chronic worry degrades PFC regulatory capacity." },
    "mdd": { "weight": 0.4, "description": "PFC hypoactivation reduces emotional regulation." }
  },
  "regions": ["pfc", "amygdala", "acc"],
  "pathways": ["mesocortical"],
  "receptors": ["da-d1-tonic", "ne-alpha2"]
}
```

### Extracted from existing HTML (unchanged structure)

**loops.json** — Feedback loops (extracted as-is from existing map).

**layers.json** — Layer definitions (extracted as-is).

**atlas.json** — Brain regions (extracted, enriched with receptor and pathway links).

### Hypotheses / Unnamed Experiences

**hypotheses.json:**
```json
{
  "id": "unnamed-017",
  "status": "unnamed",
  "zone": "between-conditions",
  "vignette": "You can't start the thing, but you also can't stop thinking about not starting the thing. The paralysis has a narrator — a voice documenting your failure to act in real-time, and that documentation becomes its own task you can't stop doing.",
  "mechanism": "DA D1 tonic deficit (ADHD) reduces PFC activation for task initiation while 5-HT2A overactivity (OCD) drives intrusive cortical loops. The PFC is simultaneously under-activated for starting and over-activated for doubting.",
  "nodes": ["initiation-friction", "demand-avoidance"],
  "mechanisms": ["top-down-inhibition", "cortical-loop-disinhibition"],
  "regions": ["pfc", "ofc", "striatum"],
  "pathways": ["mesocortical", "cstc-loop"],
  "receptors": ["da-d1-tonic", "5ht-2a", "gaba-a"],
  "crossSystemInteraction": "DA-5HT interaction in PFC",
  "candidateName": "The Commentator Paralysis",
  "confidence": {
    "structural": 0.65,
    "signals": ["shared-regions", "cross-system-interaction", "condition-overlap"]
  },
  "conditionProfile": { "adhd": 0.9, "ocd": 0.8, "gad": 0.4 },
  "resonance": { "exact": 0, "close": 0, "not-me": 0 },
  "refinements": [],
  "submissions": [],
  "created": "2026-02-20"
}
```

**Status lifecycle:** `unnamed` -> `refining` (has close-but feedback) -> `naming` (threshold reached, Claude Code proposes final name) -> `graduated` (promoted to nodes.json as a full node).

**Discovery zones** (the `zone` field):
- `between-conditions` — experiences at the intersection of 2+ conditions that no single community names
- `within-condition` — experiences well-known mechanistically but never put into felt language at the resolution people live them
- `beneath-conditions` — experiences from the mechanism/neurochemistry layer that don't map to any diagnostic category
- `lived-submission` — human-submitted, unmapped, raw experiences flowing upward into the model

### Submissions

**submissions.json:**
```json
{
  "id": "sub-042",
  "rawText": "Sometimes after a full day of being around people I get home and I can't speak. Not won't — can't. The words are there somewhere but the connection between thinking them and saying them is just... offline.",
  "conversation": [
    { "question": "Does this feel more like...", "answer": "A cognitive/processing wall" },
    { "question": "Is it specific to...", "answer": "Specifically after social effort" },
    { "question": "When it's happening...", "answer": "Everything goes flat — feelings included" }
  ],
  "selfMappedDomains": ["cognitive", "social"],
  "selfMappedNodes": ["shutdown-latency", "masking"],
  "status": "awaiting-mapping",
  "created": "2026-02-20"
}
```

### Constellations

**Stored in localStorage, exportable as JSON:**
```json
{
  "id": "constellation-anon-0042",
  "confirmed": ["rsd", "masking", "emotional-permanence", "sleep-wake-conflict"],
  "rejected": ["executive"],
  "predictedButRejected": [
    {
      "nodeId": "executive",
      "reason": "3 confirmed neighbors predicted connection",
      "neighbors": ["rsd", "masking", "emotional-permanence"]
    }
  ],
  "conditionProfile": {
    "adhd": 0.72,
    "asd": 0.68,
    "ocd": 0.15,
    "cptsd": 0.45,
    "gad": 0.30,
    "mdd": 0.20
  },
  "created": "2026-02-20",
  "promptsShown": 12,
  "promptsConfirmed": 7
}
```

### Prompts (for Find Yourself)

**prompts.json:**
```json
{
  "nodeId": "time-blindness",
  "prompts": [
    {
      "text": "You make a plan for tomorrow that you fully believe in. Tomorrow-you has no memory of making it.",
      "depth": "broad",
      "conditions": { "adhd": 0.9, "asd": 0.3 }
    },
    {
      "text": "Time doesn't flow for you. It exists in disconnected blocks. The gap between 'just now' and '3 hours ago' has no felt texture.",
      "depth": "specific",
      "conditions": { "adhd": 0.95, "cptsd": 0.4 }
    }
  ]
}
```

### Unnamed Loops

**unnamed-loops.json:**
```json
{
  "id": "loop-unnamed-003",
  "name": "The Paralysis-Doubt-Withdrawal Cycle",
  "status": "unnamed",
  "steps": [
    {
      "nodeId": "commentator-paralysis",
      "label": "Task paralysis with real-time self-narration",
      "conditions": { "adhd": 0.9, "ocd": 0.8 },
      "feedsNext": "Each episode becomes evidence"
    },
    {
      "nodeId": "competence-doubt-spiral",
      "label": "Accumulated evidence of incapacity",
      "conditions": { "ocd": 0.85, "mdd": 0.6 },
      "feedsNext": "Doubt raises stakes of next attempt"
    },
    {
      "nodeId": "preemptive-withdrawal",
      "label": "Stop attempting to avoid the sequence",
      "conditions": { "cptsd": 0.5, "adhd": 0.7, "gad": 0.6 },
      "feedsNext": "Withdrawal increases stakes when attempt finally happens"
    }
  ],
  "ratchet": "competence-doubt-spiral — each cycle adds to the evidence pile, making the loop tighter",
  "exitVulnerabilities": [
    "Between paralysis and doubt: if the narrative can be interrupted before it becomes 'evidence'",
    "Between withdrawal and paralysis: if re-entry can happen with low enough stakes"
  ],
  "crossConditionPath": "ADHD+OCD -> OCD+MDD -> CPTSD+ADHD+GAD -> back",
  "resonance": { "exact": 0, "close": 0, "not-me": 0 },
  "created": "2026-02-20"
}
```

---

## Frontend Views

### Stack

- **Svelte** (SvelteKit not needed — single page, no routing beyond hash nav)
- **Vite** build tool
- **TypeScript** for the data model and graph logic
- **No UI framework** — custom components using the existing map's design language

### Visual Identity

Carries forward from the original map:
- Dark theme: `#0f1119` bg, `#171a25` surfaces
- Color coding: orange (#e8935a) = ADHD, blue (#5a9ee8) = ASD, purple (#a87ed4) = Both, red (#e85a7a) = Loops — extended with new colors for OCD, CPTSD, GAD, MDD
- Typography: Fraunces (headings), DM Sans (body)
- Card-based interaction patterns

### View 1: Find Yourself

The entry point. Not a dashboard. Designed for three arrival states simultaneously — newly questioning, recently diagnosed, long-known seeking depth — without asking which.

**Phase 1: Just prompts (first 4-5 responses)**

Full screen. Dark. One felt-language vignette at a time, centered. Fraunces heading weight, generous whitespace. Nothing else competes for attention.

Each vignette is drawn from a node's prompts (prompts.json), rewritten as a second-person felt moment. The first few are deliberately drawn from different clusters to cast a wide net:

- One from executive/temporal cluster
- One from sensory/body cluster
- One from social/emotional cluster
- One from compulsive/threat cluster (OCD/GAD territory)

Below each vignette, two subtle responses: **"I know this"** / **"Not me"**

Binary recognition. No scales, no frequency questions.

"I know this" walks the graph outward — the system pulls next prompts from that node's connections. "Not me" pivots to an unvisited cluster. The person's experience *is* the navigation. Each recognition opens a door to adjacent experiences. No two paths are the same.

**Phase 2: The constellation appears (after 4-5 responses)**

The prompt area slides left. On the right, a soft-glow graph fades in — confirmed nodes lit in their condition colors, connections drawn between them. Unconfirmed adjacent nodes are present but dim, like stars you can almost see.

The prompts continue, but now each "I know this" has a visible consequence — a node brightens, a connection draws in. The person sees their pattern growing.

**Phase 3: The constellation speaks (after 8-12 responses)**

The system has enough signal. Below the graph, a short narrative appears — not a diagnosis, not a score. A reflection:

*"Your pattern clusters around executive initiation and emotional permanence, with rejection sensitivity as the amplifier. The sensory and social dimensions are quieter for you — your experience is more internal, more temporal. You lose time, you lose felt connection when people aren't present, and the gap between intending and doing is where most of your distress lives."*

Pre-written by Claude Code — a library of pattern narratives for common constellation shapes, stored in patterns.json. For unusual constellations, the frontend shows a simpler summary and flags it for Claude Code to generate a custom one.

**Phase 4: The door opens**

Below the narrative, three paths forward:

- **"Go deeper"** — Opens the CausalTrace for their highest-weight nodes
- **"The Unnamed"** — Filtered to show hypotheses relevant to *their* constellation
- **"See your constellation"** — Full Constellations view

**"Not me" as signal:**

When a user says "Not me" on an experience the graph *predicts* should resonate (because 2+ confirmed neighbors connect to it), this is recorded as a predicted-but-rejected gap. These gaps feed into the hypothesis engine — they indicate either a variant the model doesn't capture or a missing node.

### View 2: The Unnamed

**Four discovery zones:**

1. **Between conditions** — experiences at the intersection of 2+ conditions that no single community names
2. **Within a condition** — experiences well-known mechanistically but never put into felt language at the resolution people live them
3. **Beneath conditions** — experiences from the mechanism/neurochemistry layer that predate diagnostic labels
4. **From lived experience** — human-submitted, unmapped, raw

Zones 1-3 flow downward from the model into language. Zone 4 flows upward from language into the model.

**Layout:**

**Left — Browse the Almost-Named:**
A feed of Claude Code-generated candidate experiences. Each card shows:
- The felt-language vignette (2-3 sentences)
- Discovery zone badge
- Condition tags with weights
- Resonance buttons: **"Yes, exactly"** / **"Close, but..."** / **"Not for me"**
- Expandable CausalTrace drill-down
- Candidate name (subtle, not leading)
- Structural confidence score

"Close, but..." opens a refinement text box. These responses accumulate and feed back to Claude Code for refinement.

**Right — Describe What Happens (conversational submission):**

Not a form. A conversation. One question at a time, adapting based on previous answers.

```
[Raw text box]
"Describe something you experience that you've never seen named."

> User writes raw description

[Beat. Then:]
"Does this feel more like..."
  - Something in your body shutting down
  - A cognitive/processing wall
  - An emotional response
  - Hard to tell

[Adapts based on answer:]
"Is it specific to after social situations, or other contexts too?"
  - Specifically after social effort
  - After any kind of sustained effort
  - Unpredictable

[One more adaptive question, then:]
"Does any of this feel familiar?"
  [Node A] [Node B] [Node C] [None of these]

[Submission saved with conversational context + self-mapping]
```

Three to five questions max. The question bank is generated from the data model — domains, contexts, conditions, nodes — but the path is adaptive. Claude Code then gets the full conversational context plus the self-mapping tags for richer causal trace generation.

**Below both — The Lifecycle Pipeline:**
A visual showing unnamed experiences progressing through stages: unnamed -> refining -> naming -> graduated. Users can see the living process of experiences becoming named.

### View 3: Constellations

Your personal map. Shows your resonated nodes as a focused graph with only *your* connections highlighted. Everything else is dimmed, not hidden — context remains but your pattern is foregrounded.

Each node in your constellation is tappable -> CausalTrace drill-down. Over time, as you validate unnamed experiences, your constellation grows. The system may surface: *"Based on your pattern, this unnamed experience might resonate with you."*

Predicted-but-rejected gaps are visible as dashed outlines — places where the model expected a connection but you said "Not me." These are invitations: "We don't have words for what lives here for you yet."

### Shared Component: CausalTrace

The vertical drill-down that appears in multiple views. Expandable accordion:

```
[Felt Experience]
  "You can't start the thing, but you also can't stop
   thinking about not starting the thing..."
    |
[Nodes]
  initiation-friction + demand-avoidance
    |
[Mechanisms]
  top-down-inhibition + cortical-loop-disinhibition
    |
[Brain Regions]
  PFC (initiation) + OFC (doubt loops) + Striatum (compulsive drive)
    |
[Pathways]
  mesocortical (VTA -> PFC) + CSTC loop (cortex -> striatum -> thalamus -> cortex)
    |
[Neurochemistry]
  DA D1 tonic (PFC) + 5-HT2A (OFC) + GABA-A (striatal gating)
    |
[Pharmacology context]
  "DA-5HT interaction in PFC is bidirectional — changes to one
   system affect the other. This may shift with stimulants or SSRIs."
```

Each level is clickable for more detail. The trace reads top-down as "here's what you feel and why" or bottom-up as "here's the chemistry and what it produces." The pharmacology level is informational context, not medical advice.

---

## The Graph Inference Engine

The engine that discovers unnamed experiences. Four layers:

### Layer 1: Structural Scoring (client-side, graph.ts)

The cheapest, fastest filter. Scores all unconnected node pairs/triples to rank candidates before Claude Code reasons about them.

**Six signals, weighted:**

| Signal | Weight | What it detects |
|--------|--------|-----------------|
| Shared mechanisms | 0.25 | Same upstream cause |
| Shared pathways | 0.20 | Same neural wiring |
| Shared receptors | 0.20 | Same chemical substrate |
| Common neighbors | 0.15 | Graph-structural proximity |
| Condition overlap | 0.10 | Both relevant to same conditions |
| Layer adjacency | 0.10 | Functional proximity in the stack |

**Cross-system interaction bonus:** When two nodes involve different neurotransmitter systems with a documented interaction (e.g., DA-5HT in PFC, NE-HPA, OT-DA in social reward), add +0.15 to the structural score. These produce the most interesting hypotheses because the compounding experience is genuinely emergent.

Threshold: >0.3 = worth investigating. >0.5 = strong candidate. >0.7 = almost certainly real.

### Layer 2: Generation Queue

Two triggers:

- **Batch:** You ask Claude Code to generate hypotheses for the top N structural candidates. Used for initial seeding and periodic expansion.
- **Event-driven:** Gaps from Find Yourself (predicted-but-rejected), raw submissions from The Unnamed, "close but" refinement signals, and new nodes that create new unconnected pairs all feed a generation queue (generation-queue.json). You process this periodically.

### Layer 3: Causal Reasoning (Claude Code)

For each candidate, Claude Code:

**Step 1:** Reads full context for all involved nodes — descriptions, mechanisms, pathways, receptors, existing connections.

**Step 2:** Traces the causal chain through the shared substrate. Asks: "If these are happening in the same nervous system simultaneously, what is the *compounding* experience?" Not "A and also B" but "A changes the way B feels, or B prevents recovery from A, or they create a third state that neither produces alone."

**Step 3:** Applies three tests:

| Test | Question | Fail = discard |
|------|----------|----------------|
| **Mechanistic plausibility** | Is there a real neurochemical/pathway basis? | Shared substrate is superficial |
| **Experiential distinctness** | Does the compound feel different from either alone? | It's just "A and also B" |
| **Recognition potential** | Would someone living this go "yes, that's a *thing*"? | Too abstract to be felt as a single experience |

**Step 4:** If all tests pass, writes: vignette, mechanism, full causal trace, candidate name. If any test fails, discards with a note (training data for refining structural weights).

### Layer 4: Loop Detection (Claude Code)

Discovers new feedback loops, including loops that run through unnamed experiences.

**Step 1: Directional edge inference.** The current graph has undirected connections. Claude Code adds directionality — "A feeds B" vs "B feeds A" vs "bidirectional" — with mechanism explanations for each direction.

**Step 2: Cycle detection.** Standard graph algorithm on directed edges. Priorities:
- Short loops (3-4 steps) — most felt as a single stuck pattern
- Cross-condition loops — steps involving different conditions are the most unnamed
- Loops including unnamed experiences — new discoveries the existing map couldn't see

**Step 3: Loop characterization.** Claude Code writes:
- **Loop name** — compact description of the cycle
- **Entry points** — where people typically enter (multiple possible)
- **The ratchet** — which step makes the loop self-tightening over time
- **Exit vulnerabilities** — where the loop is weakest, where intervention or self-awareness could interrupt

### Cross-System Interaction Table

Primary hypothesis-generating interactions:

| Interaction | Effect | Key conditions |
|-------------|--------|----------------|
| DA <-> 5-HT in PFC | Serotonin modulates DA release; SSRIs can blunt DA-driven motivation | ADHD+OCD, ADHD+MDD |
| NE <-> HPA axis | Chronic cortisol suppresses LC regulation; stress worsens executive function | ADHD+CPTSD, ADHD+GAD |
| 5-HT <-> GABA in amygdala | Both disrupted = unbraked anxiety | OCD+GAD, ASD+GAD |
| DA <-> endocannabinoid | eCB buffers DA signaling; chronic stress depletes eCB | ADHD+CPTSD, ADHD+GAD |
| OT <-> DA in social reward | OT modulates social reward via DA in NAcc | ASD+MDD, ASD+CPTSD |
| HPA <-> DA mesocortical | Chronic cortisol suppresses mesocortical DA | CPTSD+ADHD, CPTSD+MDD |
| NE alpha-2 <-> 5-HT1A | Both modulate PFC arousal state; dual disruption = arousal instability | GAD+ADHD, GAD+CPTSD |
| KOR <-> MOR (opioid) | Social pain and numbing/dissociation balance | CPTSD+ASD, CPTSD+MDD |

### Full Inference Pipeline

```
1. STRUCTURAL SCORING (graph.ts, client-side)
   Score all unconnected node pairs/triples
   Filter: score > 0.3
   Rank by score
   Flag cross-system interactions (bonus)
        |
        v
2. GENERATION QUEUE
   Batch: top N candidates on request
   Event: gaps from Find Yourself,
          raw submissions from The Unnamed,
          "close but" refinement signals
        |
        v
3. CAUSAL REASONING (Claude Code)
   For each candidate:
     Read full context
     Trace the causal chain
     Apply three tests:
       mechanistic plausibility
       experiential distinctness
       recognition potential
     Write or discard
        |
        v
4. LOOP DETECTION (Claude Code)
   For new hypotheses:
     Infer directional edges
     Run cycle detection across
       named + unnamed nodes
     Characterize any new loops:
       name, entry points,
       ratchet, exit vulnerabilities
        |
        v
5. OUTPUT -> hypotheses.json / unnamed-loops.json
   Frontend picks up via HMR
   New cards appear in The Unnamed
   New loops appear in loop explorer
   Relevant hypotheses surface in
     Find Yourself constellations
```

---

## Claude Code Interaction Patterns

### Generate candidate unnamed experiences

```
"Generate 5 candidate unnamed experiences focusing on
the intersection of sensory nodes and social nodes.
Read the full data model for context."
```

Claude Code reads all data files, finds unconnected node pairs with shared mechanisms/pathways/receptors, generates felt-language vignettes with full causal traces, writes to hypotheses.json.

### Generate cross-condition hypotheses

```
"Generate hypotheses for ADHD+OCD intersections.
Focus on DA-5HT cross-system interactions in PFC.
Use the cross-system interaction table as a guide."
```

### Map a raw user submission

```
"A user submitted this experience with conversational context:
[raw text + conversation log from submissions.json]
Map it to the node graph with full causal trace."
```

Claude Code identifies the node intersection, traces downward through the causal stack, writes a structured entry to hypotheses.json with candidate name. If the submission doesn't fit the existing model, Claude Code notes what's missing.

### Refine based on "close but" feedback

```
"unnamed-017 has 3 'close but' refinements:
[refinement texts]. Update the vignette and mechanism."
```

### Graduate an unnamed experience

```
"unnamed-017 has reached naming threshold.
Finalize the name and write a full node entry to nodes.json."
```

Claude Code writes a complete node object with all six condition descriptions, mechanism links, receptor/pathway traces, and connection edges.

### Detect new loops

```
"Analyze the last 10 graduated nodes + unnamed hypotheses
for potential feedback loops. Infer edge directionality
and run cycle detection."
```

### Generate constellation narrative

```
"Generate a pattern narrative for this constellation:
[constellation JSON]. Write in second person, clinical
precision with warm language."
```

### Process predicted-but-rejected gaps

```
"Find Yourself recorded these predicted-but-rejected gaps:
[gap data]. Investigate what might live at these intersections
that the model doesn't capture."
```

---

## Project Structure

```
hypothesis-engine/
  +-- data/
  |   +-- nodes.json              (extracted + enriched with condition weights)
  |   +-- loops.json              (extracted from original map)
  |   +-- atlas.json              (brain regions, extracted + enriched)
  |   +-- layers.json             (layer definitions, extracted)
  |   +-- mechanisms.json         (new — mechanism definitions)
  |   +-- pathways.json           (new — neural pathways)
  |   +-- receptors.json          (new — receptor subtypes + pharmacology)
  |   +-- systems.json            (new — neurotransmitter systems)
  |   +-- cross-system.json       (new — cross-system interaction table)
  |   +-- hypotheses.json         (new — generated unnamed experiences)
  |   +-- unnamed-loops.json      (new — discovered feedback loops)
  |   +-- prompts.json            (new — felt-language prompts for Find Yourself)
  |   +-- patterns.json           (new — constellation narrative templates)
  |   +-- submissions.json        (new — raw user submissions)
  |   +-- generation-queue.json   (new — event-driven generation triggers)
  +-- src/
  |   +-- lib/
  |   |   +-- data.ts             (loads + indexes all JSON, reactive store)
  |   |   +-- graph.ts            (traversal, path-finding, structural scoring)
  |   |   +-- causal.ts           (traces up/down the 5-level stack)
  |   +-- components/
  |   |   +-- FindYourself.svelte  (entry experience, constellation building)
  |   |   +-- TheUnnamed.svelte    (browse + conversational submission)
  |   |   +-- Constellation.svelte (personal pattern map)
  |   |   +-- CausalTrace.svelte   (shared drill-down component)
  |   |   +-- LoopExplorer.svelte  (feedback loop visualization)
  |   |   +-- NodeCard.svelte      (reusable node display)
  |   |   +-- ResonanceButton.svelte
  |   |   +-- ConversationFlow.svelte (guided self-mapping for submissions)
  |   +-- App.svelte
  |   +-- main.ts
  +-- index.html
  +-- svelte.config.js
  +-- vite.config.ts
  +-- tsconfig.json
  +-- package.json
```

---

## What's Out of Scope (for now)

- Backend / database / user accounts
- Community aggregation (local-only votes)
- Refactoring the original HTML map to use shared data
- Mobile-native app
- Accessibility audit (will do before any public release)

---

## Implementation Sequence

1. **Extract data** from existing HTML into JSON files (nodes, loops, atlas, layers)
2. **Build neurochemistry layer** — systems, receptors, pathways, mechanisms, cross-system interaction JSON files (guided by neurochemistry-models-extended.md)
3. **Enrich nodes** with condition weights, mechanism/receptor/pathway links
4. **Write felt-language prompts** for Find Yourself (prompts.json)
5. **Scaffold Svelte app** with Vite + TypeScript
6. **Build data layer** — data.ts, graph.ts (structural scoring), causal.ts
7. **Build CausalTrace component** — the shared drill-down, since all views use it
8. **Build Find Yourself** — prompt engine, constellation building, progressive reveal, pattern narratives
9. **Build The Unnamed** — browse feed, conversational submission, lifecycle pipeline
10. **Build Constellations** — personal pattern map with gap visualization
11. **Build Loop Explorer** — feedback loop visualization for named and unnamed loops
12. **Seed initial hypotheses** — Claude Code generates first batch of unnamed experiences across all four discovery zones
13. **Seed initial loops** — Claude Code detects feedback loops including unnamed nodes
14. **Visual polish** — match and extend original map's design language for 6 conditions
