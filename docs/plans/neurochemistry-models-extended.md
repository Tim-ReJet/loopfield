# Neurochemistry Models — Extended Systems

**Date:** 2026-02-20
**Status:** Draft
**Companion to:** `2026-02-20-hypothesis-engine-design.md`

This document covers the five remaining neurochemical systems for the AuDHD hypothesis engine neurochemistry layer. Dopamine, Norepinephrine, and Serotonin receptor/pathway models were designed previously. This file is the authoritative reference for GABA/Glutamate, Endocannabinoid, Oxytocin, HPA Axis, and Opioid systems.

All JSON blocks are copy-ready into the appropriate data files (`systems.json`, `receptors.json`, `pathways.json`). Conditions weights are on a 0.0–1.0 scale indicating the strength of that receptor/pathway's involvement in that condition's neurobiology (0.0 = minimal documented relevance, 1.0 = central/defining mechanism).

---

## 1. GABA / Glutamate (Excitatory/Inhibitory Balance)

### Overview

The brain's fundamental on/off architecture. GABA (gamma-aminobutyric acid) is the primary inhibitory neurotransmitter; glutamate is the primary excitatory one. Their ratio — the E/I (excitatory/inhibitory) balance — governs noise tolerance, sensory filtering, pattern rigidity, anxiety threshold, and the signal-to-noise ratio of all other systems. When the balance tips toward excess excitation or insufficient inhibition, the nervous system runs loud.

The E/I imbalance hypothesis is one of the most empirically supported mechanistic accounts of ASD, and has strong relevance across all six conditions — manifesting differently depending on where in the brain the imbalance lives and which direction it tips.

**CSTC loops:** The cortico-striatal-thalamo-cortical loop is the brain's checking circuit — a re-entrant feedback pathway connecting prefrontal cortex → striatum → globus pallidus → thalamus → back to cortex. Under healthy glutamatergic/GABAergic tone, this loop runs a check, finds resolution, and terminates. In OCD, thalamic gating fails: the loop doesn't terminate. The "checking" continues as a compulsion. This is why glutamate modulators (like riluzole) are being explored as OCD treatments — they quiet the runaway excitatory signal.

**Cross-system interactions:**
- GABAergic tone directly modulates HPA axis reactivity: low GABA → lower inhibition of CRH release → higher stress reactivity
- NMDA receptor function is sensitive to cortisol: chronic stress downregulates NMDA-dependent long-term potentiation, affecting learning and emotional memory
- DA and GABA interact critically in the striatum: GABAergic interneurons regulate dopaminergic output; in ADHD, reduced GABAergic control of striatal DA may contribute to impulsive phasic bursts
- Endocannabinoids (CB1 receptors) are the primary retrograde modulators of both GABA and glutamate release — meaning the eCB system is a real-time fine-tuner of E/I balance

---

### `systems.json` entry

```json
{
  "id": "gaba-glutamate",
  "name": "GABA / Glutamate",
  "abbreviation": "GABA/Glu",
  "role": "Primary inhibitory/excitatory balance; sets the nervous system's signal-to-noise ratio, sensory filtering threshold, anxiety baseline, and the gating of repetitive neural circuits.",
  "adhd": "GABAergic deficits in PFC and striatum reduce inhibitory control of impulse and distractor signals. Altered NMDA function affects working memory consolidation and temporal processing. E/I imbalance tends toward insufficiently damped excitation in frontal circuits.",
  "asd": "Core E/I imbalance hypothesis: excess glutamatergic excitation and/or reduced GABAergic inhibition in cortical networks. Produces sensory hypersensitivity (noise reaches threshold too easily), repetitive behaviors (pattern-locking without adequate dampening), and social-processing overload. mGluR5 and GABA-A subunit differences are documented.",
  "ocd": "Glutamate excess in CSTC (cortico-striatal-thalamo-cortical) loops is the dominant mechanistic account of OCD. Thalamic gating fails: checking loops don't terminate. GABA-B autoreceptor function in corticostriatal projections is implicated in loop termination failure.",
  "cptsd": "Chronic trauma alters GABA-A receptor expression in amygdala and hippocampus, reducing inhibition of fear circuits. Low GABAergic tone contributes to hypervigilance, intrusive memory consolidation, and failure to extinguish threat responses.",
  "gad": "GAD is characterized by reduced GABAergic tone globally — the inhibitory brake on worry-loop initiation is chronically underperforming. GABA-A modulation is the mechanism of benzodiazepine efficacy. Altered GABA-B function contributes to inability to terminate anxious rumination.",
  "mdd": "Glutamatergic dysfunction is increasingly recognized in MDD, particularly in PFC. Ketamine's rapid antidepressant action via NMDA antagonism reframes depression partly as a glutamate disorder. GABAergic deficits contribute to anhedonia and emotional blunting."
}
```

---

### `receptors.json` entries

```json
{
  "id": "gaba-a",
  "system": "gaba-glutamate",
  "receptor": "GABA-A",
  "pattern": "fast-inhibitory",
  "role": "Ionotropic chloride channel; produces rapid, millisecond-scale inhibition. The primary mechanism by which the brain damps excitatory signals. Subunit composition determines regional expression pattern and pharmacological sensitivity.",
  "conditions": {
    "adhd": {
      "weight": 0.55,
      "description": "Reduced GABA-A tone in PFC and ACC contributes to insufficient inhibition of distractors and impulse signals. Stimulant medications indirectly increase GABAergic interneuron activity by enhancing DA signaling onto GABAergic cells."
    },
    "asd": {
      "weight": 0.80,
      "description": "Altered GABA-A subunit expression (particularly alpha and delta subunits) is documented in postmortem ASD brain tissue. Reduced cortical GABAergic interneuron density is among the most replicated neuroanatomical findings. This is foundational to the E/I imbalance hypothesis."
    },
    "ocd": {
      "weight": 0.65,
      "description": "GABA-A dysfunction in orbitofrontal cortex and caudate reduces the brain's ability to terminate checking loops. Reduced inhibitory control allows the CSTC loop to continue cycling. Benzodiazepine augmentation has modest efficacy, supporting a GABAergic component."
    },
    "cptsd": {
      "weight": 0.75,
      "description": "Trauma alters GABA-A receptor subunit expression in the amygdala and hippocampus, reducing inhibitory tone in fear-processing circuits. This is a mechanism for persistent hypervigilance and impaired fear extinction — the amygdala's alarm stays on because inhibitory control is insufficient."
    },
    "gad": {
      "weight": 0.85,
      "description": "The most direct receptor involvement in GAD. Chronically reduced GABA-A tone throughout limbic and cortical anxiety circuits is the pharmacological basis for benzodiazepine efficacy. GABA-A allosteric potentiation at the benzodiazepine binding site is the mechanism of anxiolytic action."
    },
    "mdd": {
      "weight": 0.50,
      "description": "Reduced GABA-A signaling in PFC and cingulate contributes to emotional dysregulation and rumination. The GABA deficit in MDD may be downstream of chronic stress (cortisol suppresses GABAergic interneuron function). Brexanolone (a GABA-A modulator) is effective in postpartum depression."
    }
  },
  "regions": ["pfc", "amygdala", "hippocampus", "acc", "caudate", "cortex-broad"],
  "mechanisms": ["top-down-inhibition", "fear-extinction", "sensory-gating", "loop-termination"],
  "pharmacology": {
    "agonists": ["muscimol"],
    "antagonists": ["bicuculline", "picrotoxin"],
    "modulators": ["benzodiazepines (positive allosteric)", "barbiturates", "alcohol", "neurosteroids (allopregnanolone)", "z-drugs (zolpidem, eszopiclone)", "brexanolone", "ganaxolone"],
    "notes": "Benzodiazepines bind the BZD site between alpha and gamma subunits — they enhance GABA's effect rather than replacing it. Subunit composition determines response: alpha-1 subunits → sedation/amnesia; alpha-2/alpha-3 → anxiolysis; alpha-5 → memory consolidation. Z-drugs are selective for alpha-1. Neurosteroids modulate via a distinct transmembrane site."
  }
}
```

```json
{
  "id": "gaba-b",
  "system": "gaba-glutamate",
  "receptor": "GABA-B",
  "pattern": "slow-inhibitory",
  "role": "Metabotropic G-protein-coupled receptor producing slow, sustained inhibition via K+ channel activation and Ca2+ channel inhibition. Acts as an autoreceptor (controlling GABA's own release) and as a heteroreceptor (suppressing glutamate release at presynaptic terminals). Essential for loop termination and sustained dampening.",
  "conditions": {
    "adhd": {
      "weight": 0.40,
      "description": "GABA-B autoreceptor function influences sustained inhibitory tone in PFC circuits. Baclofen (GABA-B agonist) has some evidence for reducing impulsivity and hyperactivity, though not a primary target. Presynaptic GABA-B on glutamate terminals may modulate NMDA-dependent working memory circuits."
    },
    "asd": {
      "weight": 0.60,
      "description": "GABA-B receptors modulate glutamate release via presynaptic heteroreceptors — directly relevant to the E/I balance theory. Arbaclofen (R-baclofen, a GABA-B agonist) showed promise in early ASD trials for reducing social withdrawal and sensory sensitivity, though Phase 3 results were mixed."
    },
    "ocd": {
      "weight": 0.70,
      "description": "GABA-B autoreceptors in corticostriatal projections regulate the sustained inhibitory signal that should terminate CSTC loop cycling. Impaired GABA-B function means the brake that should end compulsive checking doesn't engage fully. Baclofen has anecdotal and small-study evidence in treatment-resistant OCD."
    },
    "cptsd": {
      "weight": 0.55,
      "description": "GABA-B-mediated slow inhibition modulates the sustained dampening of amygdala threat responses. In CPTSD, where rapid fear responses don't extinguish, this slow-inhibitory system is chronically underperforming. Presynaptic GABA-B on glutamate terminals may reduce excitotoxic stress on hippocampal memory circuits."
    },
    "gad": {
      "weight": 0.65,
      "description": "GABA-B mediates the slow, sustained anxiety-dampening that benzodiazepines (GABA-A modulators) don't cover. The inability to maintain inhibition of worry loops between acute anxiety peaks may reflect GABA-B insufficiency. This is part of why anxiolysis from BZDs is shorter-lived than clinical anxiety needs."
    },
    "mdd": {
      "weight": 0.45,
      "description": "Reduced GABA-B tone contributes to glutamate dysregulation, which is increasingly implicated in treatment-resistant depression. Baclofen is sometimes used adjunctively for depression with prominent anxiety or rumination features."
    }
  },
  "regions": ["pfc", "striatum", "thalamus", "amygdala", "hippocampus", "cortex-broad"],
  "mechanisms": ["loop-termination", "sustained-inhibition", "presynaptic-glutamate-suppression", "autoreceptor-regulation"],
  "pharmacology": {
    "agonists": ["baclofen", "arbaclofen (R-baclofen)", "phenibut"],
    "antagonists": ["CGP-35348", "SCH-50911"],
    "modulators": ["GABA-B positive allosteric modulators (GS39783, ADX71943) — in research"],
    "notes": "GABA-B is an obligate heterodimer (GABA-B1 + GABA-B2 subunits). Presynaptic GABA-B on glutamate terminals is a key target for reducing excitatory tone without directly sedating GABA-A circuits. Arbaclofen's mixed ASD trial results may reflect subgroup heterogeneity — those with higher E/I imbalance showing more benefit."
  }
}
```

```json
{
  "id": "glu-nmda",
  "system": "gaba-glutamate",
  "receptor": "NMDA",
  "pattern": "excitatory-coincidence-detector",
  "role": "N-methyl-D-aspartate receptor: a voltage-gated, ligand-gated ion channel requiring both glutamate binding and membrane depolarization to open (the 'coincidence detector'). Critical for synaptic plasticity, long-term potentiation (LTP), working memory, and the consolidation of emotional memories. Mg2+ block at rest prevents noise-driven opening.",
  "conditions": {
    "adhd": {
      "weight": 0.55,
      "description": "NMDA-dependent LTP supports working memory maintenance and learning-from-consequence. Altered NMDA function in PFC contributes to working memory volatility and temporal processing deficits. Memantine (NMDA antagonist) shows modest benefit in some ADHD presentations, particularly inattentive type."
    },
    "asd": {
      "weight": 0.70,
      "description": "NMDA hypofunction is one theoretical account of ASD social deficits — social prediction models require NMDA-dependent plasticity to update. Conversely, NMDA hyperfunction in other circuits may drive repetitive behaviors. The direction of dysfunction likely varies by circuit and individual. GluN2B subunit variants are among documented ASD-associated genetic factors."
    },
    "ocd": {
      "weight": 0.75,
      "description": "Glutamate excess in CSTC loops, mediated partly through NMDA receptors, drives the runaway checking circuit. Memantine augmentation of SSRIs has evidence in treatment-resistant OCD. D-cycloserine (partial NMDA agonist) has been studied for augmenting exposure therapy — enhancing extinction learning via NMDA-dependent plasticity."
    },
    "cptsd": {
      "weight": 0.80,
      "description": "NMDA receptors are central to both trauma memory consolidation and extinction. Traumatic memories form through enhanced NMDA-dependent LTP (stress hormones lower the threshold for potentiation). But chronic cortisol then downregulates NMDA function in the hippocampus — impairing new learning, including extinction. This is why PTSD produces both hyperconsolidated fear memories and difficulty learning safety."
    },
    "gad": {
      "weight": 0.50,
      "description": "NMDA-mediated glutamatergic activity drives anticipatory anxiety circuits in the prefrontal-amygdala network. The worry loop in GAD may involve persistent NMDA-dependent potentiation of the threat-evaluation circuit — the circuit stays 'learned-in' to threat detection."
    },
    "mdd": {
      "weight": 0.85,
      "description": "The NMDA receptor is now central to depression neurobiology. Ketamine and esketamine produce rapid antidepressant effects through NMDA antagonism — bypassing the 2-6 week SSRI mechanism and producing changes within hours. NMDA-dependent BDNF release in PFC is a key antidepressant mechanism. Hypoactive NMDA in PFC circuits may contribute to cognitive flattening and anhedonia."
    }
  },
  "regions": ["pfc", "hippocampus", "amygdala", "striatum", "acc"],
  "mechanisms": ["working-memory-maintenance", "fear-consolidation", "fear-extinction", "synaptic-plasticity", "long-term-potentiation"],
  "pharmacology": {
    "agonists": ["D-serine (co-agonist at glycine site)", "glycine (co-agonist)", "D-cycloserine (partial agonist at glycine site)"],
    "antagonists": ["ketamine", "esketamine", "memantine", "phencyclidine (PCP)", "MK-801 (dizocilpine)"],
    "modulators": ["Mg2+ (endogenous voltage-dependent block)", "Zn2+ (inhibitory at GluN2B)", "polyamines (enhance at GluN2B)", "riluzole (reduces glutamate release presynaptically)"],
    "notes": "NMDA receptors require glutamate + glycine/D-serine co-agonism + membrane depolarization (to relieve Mg2+ block). GluN2 subunit composition shapes receptor kinetics and clinical relevance: GluN2A dominates adult cortical expression; GluN2B is more prominent in limbic circuits and is a target for OCD and depression. D-cycloserine's use in exposure therapy augmentation exploits NMDA-dependent extinction LTP."
  }
}
```

```json
{
  "id": "glu-ampa",
  "system": "gaba-glutamate",
  "receptor": "AMPA",
  "pattern": "fast-excitatory",
  "role": "Alpha-amino-3-hydroxy-5-methyl-4-isoxazolepropionic acid receptor: fast ionotropic glutamate receptor mediating the majority of rapid excitatory neurotransmission. AMPA receptor trafficking (insertion/removal from synapses) is the cellular mechanism of synaptic strength changes. AMPA:NMDA ratio at synapses determines the 'gain' of excitatory circuits.",
  "conditions": {
    "adhd": {
      "weight": 0.45,
      "description": "AMPA receptor expression in PFC affects the speed and gain of excitatory signaling that supports working memory maintenance. Ampakines (AMPA positive allosteric modulators) have been studied for cognitive enhancement in ADHD-like deficits. DA D1 receptor stimulation regulates AMPA trafficking in PFC spines — linking DA deficiency directly to excitatory signaling changes."
    },
    "asd": {
      "weight": 0.65,
      "description": "Altered AMPA:NMDA ratio in ASD cortical circuits is proposed as a mechanism for sensory hypersensitivity and hyperactivation: too much fast excitatory gain relative to NMDA-dependent timing. GluA1 subunit (GRIA1) variants have been found in ASD genetic studies. mTOR pathway dysregulation (in tuberous sclerosis ASD) alters AMPA receptor synthesis."
    },
    "ocd": {
      "weight": 0.55,
      "description": "AMPA-mediated fast excitation in the orbitofrontal-striatal pathway drives the initiation of compulsive behaviors. The loop begins with OFC glutamatergic excitation of the caudate via AMPA receptors. Reducing AMPA-driven corticostriatal excitation is a theoretical OCD target."
    },
    "cptsd": {
      "weight": 0.50,
      "description": "AMPA receptor upregulation following stress (a compensatory mechanism to glutamate desensitization) can increase basal excitatory tone in fear circuits, contributing to persistent hyperarousal. Stress-induced AMPA GluA1 phosphorylation in the amygdala enhances fear expression."
    },
    "gad": {
      "weight": 0.45,
      "description": "Fast AMPA-mediated excitation drives the speed of the threat-detection response and the rapidity of anxious ideation. Chronic activation may upregulate AMPA in prefrontal-amygdala circuits, maintaining a hair-trigger for anxiety initiation."
    },
    "mdd": {
      "weight": 0.60,
      "description": "Ketamine's antidepressant effect requires AMPA receptor activation downstream of NMDA blockade — blocking NMDA at rest allows a 'burst' of AMPA activity on recovery that triggers BDNF release. AMPA potentiation is now a direct antidepressant target. LY451646 (AMPA PAM) has been studied for depression."
    }
  },
  "regions": ["pfc", "hippocampus", "amygdala", "striatum", "acc"],
  "mechanisms": ["fast-excitatory-transmission", "synaptic-scaling", "fear-expression", "working-memory-maintenance"],
  "pharmacology": {
    "agonists": ["AMPA", "quisqualate"],
    "antagonists": ["NBQX", "CNQX", "perampanel (clinical, approved for seizures — reduces AMPA-driven excitation)"],
    "modulators": ["ampakines (CX717, farampator) — positive allosteric modulators", "cyclothiazide (prevents desensitization)", "LY451646"],
    "notes": "AMPA receptors desensitize rapidly — their contribution is transient fast signaling rather than sustained activation. GluA2 subunit expression determines Ca2+ permeability: GluA2-containing receptors are Ca2+-impermeable (most adult synapses); GluA2-lacking receptors are Ca2+-permeable and more involved in plasticity. Ketamine's antidepressant mechanism requires intact AMPA signaling: blocking AMPA blocks ketamine's effect."
  }
}
```

```json
{
  "id": "glu-mglur5",
  "system": "gaba-glutamate",
  "receptor": "mGluR5",
  "pattern": "modulatory-excitatory",
  "role": "Metabotropic glutamate receptor, Group I. Coupled to Gq/G11 proteins, activating PLC and releasing intracellular Ca2+. Unlike ionotropic receptors, mGluR5 modulates — amplifying or sensitizing glutamatergic signaling over seconds to minutes rather than milliseconds. Located perisynaptically, it acts as a gain knob on excitatory transmission. Interacts directly with FMRP (the Fragile X protein), making it central to one of the best-understood genetic models of ASD/ADHD-like symptoms.",
  "conditions": {
    "adhd": {
      "weight": 0.45,
      "description": "mGluR5 modulates striatal and PFC circuit excitability. mGluR5 antagonism reduces impulsivity in animal models. The FMRP-mGluR5 link is relevant because subclinical FMRP variations may occur in the ADHD population without full Fragile X syndrome."
    },
    "asd": {
      "weight": 0.90,
      "description": "The mGluR5 theory of Fragile X syndrome — and by extension, a subset of ASD — is one of the most developed mechanistic accounts in neurodevelopmental research. In Fragile X, absence of FMRP leads to exaggerated mGluR5 signaling, excessive synaptic protein synthesis, and excess long-term depression (mGluR-LTD). This manifests as sensory hypersensitivity, repetitive behaviors, anxiety, and intellectual disability. mGluR5 antagonists (mavoglurant, basimglurant) were trialed in Fragile X ASD — results mixed at group level but positive for specific subgroups. Even absent Fragile X, mGluR5 amplification of E/I imbalance is a core ASD mechanism."
    },
    "ocd": {
      "weight": 0.70,
      "description": "mGluR5 amplifies the glutamatergic drive in CSTC loops. mGluR5 antagonism reduces compulsive behavior in animal OCD models. Riluzole (which reduces glutamate release) has evidence in OCD, and mGluR5's modulatory amplification is part of why glutamate excess becomes self-sustaining in OCD circuits."
    },
    "cptsd": {
      "weight": 0.55,
      "description": "mGluR5 modulates fear memory consolidation and extinction in the amygdala. mGluR5 activation during trauma may amplify the encoding of fear memories. Conversely, mGluR5 antagonism facilitates extinction in animal fear models — a potential target for trauma exposure therapy augmentation."
    },
    "gad": {
      "weight": 0.55,
      "description": "mGluR5 amplifies amygdala excitability. mGluR5 antagonists have anxiolytic effects in preclinical models. The sustained amplification of glutamatergic threat-detection circuits in GAD may be partly mGluR5-dependent."
    },
    "mdd": {
      "weight": 0.50,
      "description": "mGluR5 interacts with NMDA receptors physically and functionally — mGluR5 activation potentiates NMDA responses. Antidepressant-like effects of mGluR5 antagonists have been shown in animal models. The mGluR5-NMDA interaction is one mechanism by which glutamate dysregulation in MDD could be targeted."
    }
  },
  "regions": ["pfc", "amygdala", "hippocampus", "striatum", "acc"],
  "mechanisms": ["excitatory-amplification", "synaptic-plasticity", "fear-consolidation", "sensory-gain-modulation", "loop-amplification"],
  "pharmacology": {
    "agonists": ["DHPG (research only)"],
    "antagonists": ["mavoglurant (AFQ056)", "basimglurant (RG7090)", "MTEP", "MPEP"],
    "modulators": ["fenobam (negative allosteric modulator — anxiolytic, analgesic)", "CTEP (negative allosteric modulator)"],
    "notes": "mGluR5 physically scaffolds with NMDA receptors via Homer and Shank proteins — the synaptic density complex. Shank3 mutations (a major ASD genetic finding) directly alter this scaffold, disrupting mGluR5-NMDA coupling. This is the molecular link between SHANK ASD genetics and the E/I balance theory. mGluR5's perisynaptic location makes it a modulator rather than a primary signal — targeting it adjusts gain without eliminating excitation."
  }
}
```

---

### `pathways.json` entries — GABA/Glutamate

```json
{
  "id": "cstc-loop",
  "name": "Cortico-Striatal-Thalamo-Cortical Loop",
  "from": "Orbitofrontal Cortex / ACC",
  "to": "Striatum → Globus Pallidus → Thalamus → OFC/ACC (re-entrant)",
  "neurotransmitter": "glutamate (cortical output), GABA (striatal/pallidal gates), dopamine (modulatory)",
  "receptors": ["glu-ampa", "glu-nmda", "glu-mglur5", "gaba-a", "gaba-b"],
  "role": "Re-entrant checking circuit. OFC detects salience/error → excites caudate (via glutamate) → caudate inhibits globus pallidus (via GABA) → reduced pallidal inhibition allows thalamic firing → thalamus re-excites OFC → loop terminates when OFC signals resolution. In health, this loop runs once and closes. In OCD, thalamic gating fails and the loop continues.",
  "conditions": {
    "adhd": "CSTC loops are involved in response inhibition. Reduced DA tone in the striatum alters loop dynamics — compulsive initiation may be insufficient (can't start loops) rather than excessive (can't stop them).",
    "asd": "Altered loop dynamics may contribute to restricted/repetitive behaviors — the circuit that normally terminates upon pattern completion fails to do so, creating behavioral perseveration.",
    "ocd": "The defining pathophysiology of OCD. Glutamate excess in OFC output → inadequate GABA gating in caudate → thalamic disinhibition → persistent loop cycling experienced as intrusive thoughts and compulsive urges. SRI medications reduce OFC hyperactivity via 5-HT2A; glutamate modulators (riluzole, memantine) quiet excess excitation; deep brain stimulation targets thalamic gating directly.",
    "cptsd": "Trauma-related hypervigilance may involve pathologically sensitized CSTC loops for threat detection — the 'checking' circuit runs continuously on threat-related content.",
    "gad": "Chronic worry may represent a GAD-specific CSTC loop pattern — worry initiation loops that don't reach resolution. The insufficiency of GABA-B-mediated loop termination in prefrontal-thalamic circuits.",
    "mdd": "Rumination in MDD may share a circuit basis with OCD compulsive loops — negative self-referential thought loops that don't terminate, mediated by glutamate-driven CSTC cycling."
  },
  "mechanisms": ["loop-termination", "error-detection", "behavioral-perseveration", "rumination", "compulsive-initiation"]
}
```

```json
{
  "id": "cortical-ei-interneurons",
  "name": "Cortical GABAergic Interneuron Network",
  "from": "GABAergic interneurons (PV+, SST+, VIP+)",
  "to": "Pyramidal neurons (cortex-broad)",
  "neurotransmitter": "GABA",
  "receptors": ["gaba-a", "gaba-b"],
  "role": "Fast-spiking parvalbumin-positive (PV+) interneurons provide feedforward and feedback inhibition to pyramidal cells, creating the gamma oscillations (30-80 Hz) that support working memory, sensory binding, and attention. Somatostatin-positive (SST+) interneurons provide dendritic inhibition, gating inputs to pyramidal cells. VIP interneurons disinhibit SST cells. This nested inhibitory network is how the cortex controls its own noise floor.",
  "conditions": {
    "adhd": "PV+ interneuron hypofunction in PFC is proposed as a mechanism for the broadened attention filter in ADHD — less inhibitory sharpening of the attentional spotlight, allowing more signals through. Gamma oscillation disruption in ADHD PFC has been recorded during working memory tasks.",
    "asd": "PV+ interneuron density is reduced in multiple cortical areas in postmortem ASD tissue. This is one of the best-replicated cellular findings in ASD neurobiology. Fewer PV+ interneurons means less inhibitory sculpting — the excitatory noise floor rises, sensory signals overwhelm, and pattern-detection becomes less discriminating (everything is signal).",
    "ocd": "PV+ interneuron function in OFC may regulate the gain of error-detection signals feeding into the CSTC loop.",
    "cptsd": "Stress and glucocorticoids damage PV+ interneurons — parvalbumin expression is particularly glucocorticoid-sensitive. Chronic trauma literally reduces the number and function of the cells that quiet the cortex.",
    "gad": "GABAergic interneuron network insufficiency is the cellular basis for the chronically low anxiety threshold — the noise floor is too high for the inhibitory system to maintain calm baseline.",
    "mdd": "Reduced PV+ interneuron function in PFC contributes to the disrupted gamma oscillations seen in depression, which correlates with cognitive symptoms (slowed thinking, difficulty concentrating)."
  },
  "mechanisms": ["sensory-gating", "attentional-filtering", "working-memory-maintenance", "noise-floor-regulation"]
}
```

---

### GABA/Glutamate: Unnamed Experience Examples

**"The Brain That Won't Stop Checking"** *(OCD + ASD)*
The door is locked. You checked it. You know you checked it. The knowledge sits in your head clearly, but your body won't accept it as settled — something keeps asking the question again. It isn't about doubt, exactly. It's as if the circuit that should receive the answer and say *done* has a loose wire, and the signal keeps recycling before it can close.

**"Sensory Static"** *(ASD + GAD)*
It starts as background — the hum of fluorescent lights, the texture of the chair, the smell in the room. Each one is manageable. But they don't add up, they multiply. By the time someone speaks to you, their voice arrives inside a body that's already three-quarters full of noise. The feeling isn't pain, exactly. It's more like the whole world got louder than your brain's quieting system can handle.

**"The Worry That Runs on Its Own"** *(GAD + OCD)*
You know the thought isn't useful. You've reasoned with it thoroughly. And yet it comes back — not because you invited it, but because something in the checking circuit didn't get the memo that you'd already resolved it. The thought is less like a feeling and more like an alarm that can't find its own off switch.

---

## 2. Endocannabinoid System

### Overview

The endocannabinoid (eCB) system is a retrograde signaling system — it runs backward across synapses. Postsynaptic neurons release endocannabinoids (anandamide and 2-AG) that travel backward to bind CB1 receptors on presynaptic terminals, suppressing neurotransmitter release. This makes the eCB system the brain's primary real-time feedback mechanism: "too much input, dial it back."

The system's roles are broad: stress buffering (terminating the stress response), sensory modulation (gating the intensity of incoming signals), emotional regulation (dampening acute fear and aversive memory), appetite, pain modulation, and social bonding (via interaction with the opioid and oxytocin systems).

Its relevance to neurodivergent experience is significant but underappreciated clinically. The eCB system is why many autistic people and ADHD adults report cannabis reducing sensory overwhelm, social anxiety, and emotional intensity — and also why dependence risk is higher when the eCB system is chronically understimulated (the drug fills a genuine gap). Responsible clinical framing acknowledges this without either pathologizing use or ignoring risk.

**Cross-system interactions:**
- CB1 receptors are among the most abundant in the brain and are located on both GABAergic and glutamatergic terminals — the eCB system is a primary E/I balance regulator
- Anandamide shares a binding profile with TRPV1 channels (involved in pain/heat sensation) — sensory modulation extends to thermal and mechanical sensitivity
- CB1 on DA terminals in the mesolimbic pathway modulates phasic DA release; eCB system dysfunction contributes to reward sensitivity alterations in ADHD and MDD
- 5-HT1A and CB1 receptors interact — shared downstream signaling explains the anxiolytic overlap between eCB activation and 5-HT1A agonism
- Stress acutely increases anandamide synthesis (protective), but chronic stress depletes anandamide via upregulation of FAAH (the enzyme that breaks it down)

---

### `systems.json` entry

```json
{
  "id": "endocannabinoid",
  "name": "Endocannabinoid System",
  "abbreviation": "eCB",
  "role": "Retrograde synaptic modulation; real-time feedback suppression of excessive neurotransmitter release. Primary roles: stress termination, sensory gain control, emotional regulation, fear extinction, social reward modulation, pain buffering.",
  "adhd": "eCB system modulates DA release in mesolimbic circuits. Altered anandamide tone may contribute to reward sensitivity and emotional dysregulation in ADHD. High rates of cannabis use in ADHD populations may reflect self-medication of sensory/emotional intensity and stress hypersensitivity.",
  "asd": "CB1 receptor density differences and altered anandamide levels have been found in ASD. The eCB system is central to sensory modulation — reducing the gain on incoming sensory signals — which maps directly onto the sensory hypersensitivity profile of ASD. Social reward circuits (amygdala, NAc) are regulated partly by eCB tone.",
  "ocd": "eCB system modulates anxiety and the ability to extinguish learned fear/threat associations. CB1-mediated suppression of OFC glutamate release could reduce CSTC loop gain. Cannabis is reported anecdotally by some with OCD to reduce compulsive urges; the mechanism is likely eCB-mediated OFC dampening.",
  "cptsd": "The eCB system is integral to stress termination — ending the cortisol stress response and facilitating fear extinction. CPTSD is characterized by impaired extinction and chronic HPA activation; eCB deficiency is a proposed mechanistic contributor. FAAH inhibitors and low-dose cannabinoids are being studied in PTSD.",
  "gad": "Anandamide deficiency has been specifically proposed as a 'clinical endocannabinoid deficiency' contributing to anxiety disorders including GAD. CB1 activation in the amygdala and PFC reduces anxiety-related glutamate release and modulates the HPA stress response.",
  "mdd": "eCB tone affects mood baseline, motivation, and anhedonia. Reduced anandamide signaling in the reward system (NAc, PFC) contributes to the motivational deficits of depression. The eCB system interfaces with DA and opioid systems in ways that collectively regulate the capacity for pleasure."
}
```

---

### `receptors.json` entries

```json
{
  "id": "ecb-cb1",
  "system": "endocannabinoid",
  "receptor": "CB1",
  "pattern": "retrograde-inhibitory",
  "role": "The primary brain cannabinoid receptor. Gi/o-coupled; suppresses adenylyl cyclase and reduces presynaptic neurotransmitter release (both GABA and glutamate, depending on location). Found on excitatory and inhibitory terminals throughout cortex, hippocampus, amygdala, cerebellum, and basal ganglia. Acts as a volume knob on synaptic activity — reducing both excitatory and inhibitory gain, net effect determined by local circuit context.",
  "conditions": {
    "adhd": {
      "weight": 0.60,
      "description": "CB1 receptors on DA terminals in the striatum modulate phasic DA release. Altered CB1 tone contributes to reward hypersensitivity and motivational volatility. CB1 in PFC modulates the gain of working memory circuits. The high prevalence of cannabis use in ADHD likely reflects CB1-mediated reduction of sensory/emotional intensity and improved task focus in some individuals (via reduced distracting signal noise), though THCV and CBD profiles matter greatly."
    },
    "asd": {
      "weight": 0.80,
      "description": "CB1 is the primary receptor mediating eCB-based sensory gain control. In ASD, where sensory signals arrive at full intensity without sufficient attenuation, CB1 hypofunction on glutamatergic sensory terminals would produce exactly the hypersensitivity profile described clinically. Postmortem ASD brain shows altered CB1 expression in cortical regions. Parent-reported and clinical studies of cannabidiol (which modulates eCB tone indirectly via FAAH) show benefit for ASD-associated anxiety and sensory reactivity."
    },
    "ocd": {
      "weight": 0.60,
      "description": "CB1 activation in OFC and corticostriatal projections reduces glutamatergic drive in the CSTC loop. CB1 in the amygdala suppresses fear-related glutamate release. Cannabis reports from OCD individuals frequently describe reduction in compulsive urge intensity — consistent with CB1-mediated OFC quieting. The extinction-facilitating role of eCB signaling (via amygdala CB1) is relevant to OCD exposure therapy."
    },
    "cptsd": {
      "weight": 0.85,
      "description": "CB1 is the primary receptor for eCB-mediated fear extinction. The process of extinction (learning that a cue is no longer dangerous) requires CB1 activation in the amygdala — suppressing conditioned fear responses so new safety learning can be encoded. In CPTSD, CB1 hypofunction or anandamide deficiency directly impairs this. FAAH inhibitors (increasing endogenous anandamide) and low-dose THC are being studied for PTSD/CPTSD specifically for this reason."
    },
    "gad": {
      "weight": 0.75,
      "description": "CB1 activation in the amygdala and bed nucleus of the stria terminalis (BNST — the sustained anxiety center) reduces glutamate release and dampens the HPA stress response. Anandamide at CB1 is an endogenous anxiolytic. Chronic stress depletes anandamide via FAAH upregulation, creating a self-reinforcing cycle: anxiety depletes the system that reduces anxiety."
    },
    "mdd": {
      "weight": 0.65,
      "description": "CB1 in the NAc and PFC modulates the hedonic tone of dopaminergic reward signals. CB1 hypofunction reduces the eCB system's contribution to mood baseline and motivation. Chronic SSRI use increases eCB tone as a downstream effect — part of the SSRI antidepressant mechanism may be indirect eCB enhancement. Antidepressant-like effects of CB1 agonism are well-documented in animal models."
    }
  },
  "regions": ["pfc", "amygdala", "hippocampus", "nac", "striatum", "cerebellum", "bnst"],
  "mechanisms": ["sensory-gating", "fear-extinction", "stress-termination", "reward-modulation", "retrograde-inhibition"],
  "pharmacology": {
    "agonists": ["THC (partial agonist)", "synthetic cannabinoids (JWH-018, etc — high potency, high risk)", "WIN 55,212-2 (research)", "anandamide (endogenous partial agonist)", "2-AG (endogenous full agonist)"],
    "antagonists": ["rimonabant (SR141716 — withdrawn due to psychiatric side effects: depression, suicidality)", "AM251 (research)"],
    "modulators": ["CBD (indirect — inhibits FAAH, increasing anandamide; also allosteric negative modulator of CB1 at high THC doses)", "FAAH inhibitors (URB597, PF-3845 — increase endogenous anandamide)", "MAGL inhibitors (increase endogenous 2-AG)"],
    "notes": "THC is a partial CB1 agonist with low intrinsic efficacy — it displaces anandamide and 2-AG but activates the receptor less fully. This is why low doses can be anxiolytic (fills deficient eCB tone) while high doses are anxiogenic (overactivation, especially in regions with normally healthy eCB tone). CBD does not bind CB1 directly at physiological doses; its eCB effects are via FAAH inhibition (anandamide accumulation) and as a negative allosteric modulator preventing CB1 overactivation by THC. Rimonabant's withdrawal demonstrates CB1 is load-bearing for mood — blocking it causes depression and suicidality."
  }
}
```

```json
{
  "id": "ecb-cb2",
  "system": "endocannabinoid",
  "receptor": "CB2",
  "pattern": "neuroimmune-modulatory",
  "role": "Initially classified as peripheral (immune tissue), CB2 is now confirmed to be expressed in the brain — particularly in microglia (the brain's immune cells) and to a lesser extent in neurons. CB2 activation suppresses neuroinflammatory signaling and modulates microglial activation states. Its role is less in acute synaptic modulation and more in the chronic inflammatory tone of the nervous system. Increasingly recognized as relevant to the neuroinflammatory component of multiple psychiatric conditions.",
  "conditions": {
    "adhd": {
      "weight": 0.30,
      "description": "Limited direct evidence, but neuroinflammatory hypotheses of ADHD are growing. CB2 modulation of microglial activity may affect the neuroinflammatory environment that shapes dopaminergic neuron function. CBD's anti-inflammatory effects are partly CB2-mediated."
    },
    "asd": {
      "weight": 0.55,
      "description": "Neuroinflammation is increasingly documented in ASD — elevated microglial activation, increased neuroinflammatory markers. CB2 activation suppresses microglial activation and pro-inflammatory cytokines. CBD's reported benefits in ASD may be partly CB2-mediated anti-inflammatory effects rather than purely eCB/serotonin mechanisms."
    },
    "ocd": {
      "weight": 0.30,
      "description": "Emerging evidence for inflammatory markers in OCD, particularly in treatment-resistant cases. CB2-mediated anti-inflammatory effects are a theoretical adjunct mechanism."
    },
    "cptsd": {
      "weight": 0.50,
      "description": "Trauma activates microglial neuroinflammatory responses. Chronic CPTSD is associated with elevated inflammatory markers. CB2 activation could reduce the neuroinflammatory burden that perpetuates sensitized threat circuits."
    },
    "gad": {
      "weight": 0.35,
      "description": "Inflammatory markers are elevated in anxiety disorders. CB2-mediated anti-inflammatory effects in the amygdala and limbic system may reduce the inflammatory substrate that lowers anxiety threshold."
    },
    "mdd": {
      "weight": 0.55,
      "description": "Neuroinflammation is well-documented in MDD — elevated cytokines (IL-6, TNF-alpha, CRP) correlate with depression severity and predict treatment response. CB2-mediated microglial suppression is an anti-inflammatory antidepressant mechanism. The anti-inflammatory effects of CBD in MDD are partly CB2-mediated."
    }
  },
  "regions": ["microglia-broad", "amygdala", "hippocampus", "pfc"],
  "mechanisms": ["neuroinflammation-modulation", "microglial-regulation", "cytokine-suppression"],
  "pharmacology": {
    "agonists": ["2-AG (endogenous)", "JWH-133 (selective CB2, research)", "HU-308", "GW405833"],
    "antagonists": ["AM630 (selective CB2 antagonist, research)"],
    "modulators": ["CBD (partial CB2 agonist/modulator)", "beta-caryophyllene (found in cannabis terpenes — selective CB2 agonist, dietary)"],
    "notes": "CB2 in neurons (not just microglia) is increasingly confirmed — particularly in dopaminergic and serotonergic circuits. CB2 neuronal expression may contribute to mood regulation independently of inflammatory mechanisms. Beta-caryophyllene as a dietary CB2 agonist is of interest because it crosses the blood-brain barrier and may provide mild CB2-mediated anti-inflammatory effects without CB1-mediated psychoactivity."
  }
}
```

---

### `pathways.json` entry — Endocannabinoid

```json
{
  "id": "ecb-retrograde-modulation",
  "name": "Endocannabinoid Retrograde Modulation",
  "from": "Postsynaptic neuron (activity-dependent)",
  "to": "Presynaptic terminal (CB1 receptor)",
  "neurotransmitter": "anandamide (AEA), 2-arachidonoylglycerol (2-AG)",
  "receptors": ["ecb-cb1"],
  "role": "When postsynaptic activity exceeds threshold, the postsynaptic cell synthesizes and releases endocannabinoids (on-demand, not stored). These travel backward across the synapse and bind CB1 on the presynaptic terminal, suppressing further neurotransmitter release. DSI (depolarization-induced suppression of inhibition) and DSE (depolarization-induced suppression of excitation) are the short-term forms. Long-term eCB-dependent LTD is the plasticity form. This is the brain's primary real-time volume control.",
  "conditions": {
    "adhd": "eCB retrograde modulation sets the dynamic range of mesolimbic DA signaling. Altered 2-AG or anandamide synthesis/degradation rates affect how quickly the system can adapt DA output to context. Impaired eCB modulation may contribute to reward volatility (signals don't adapt as expected).",
    "asd": "In ASD sensory circuits, impaired eCB retrograde suppression means incoming sensory signals aren't adequately dampened. The postsynaptic cell fires, but the feedback 'that was enough' signal doesn't suppress the presynaptic terminal adequately. Sensory overwhelm is the experiential result.",
    "ocd": "eCB retrograde suppression of OFC glutamate release should reduce CSTC loop drive. If this suppression is insufficient, OFC continues driving the loop past the point of resolution.",
    "cptsd": "Stress-induced eCB synthesis in the amygdala is an acute protective mechanism — reducing fear circuit excitation in real-time during trauma. Chronically, FAAH upregulation (driven by chronic stress) depletes anandamide, removing this protection and leaving the amygdala circuit without its real-time feedback brake.",
    "gad": "The eCB retrograde system should suppress anxious circuit activity once it reaches threshold — a biological anxiety-off switch. Chronic anandamide deficiency in GAD means the switch is broken.",
    "mdd": "eCB retrograde modulation in mesolimbic circuits affects the dynamic range of pleasurable experience. Depleted eCB tone may narrow this range, contributing to anhedonia — not the absence of pleasure capacity, but the absence of the modulation that allows peaks."
  },
  "mechanisms": ["retrograde-inhibition", "sensory-gating", "fear-extinction", "stress-termination", "reward-modulation"]
}
```

---

### Endocannabinoid: Unnamed Experience Examples

**"The Volume That Won't Turn Down"** *(ASD + CPTSD)*
Everything that afternoon was fine — manageable, even. But somewhere between the third conversation and the brightness of the room and the sensation of your socks, the system just ran out of headroom. Not a feeling of being overwhelmed, exactly. More like the noise keeps arriving and nothing is processing it out. The world keeps pushing in and whatever usually absorbs it has simply stopped working.

**"The Grief That Doesn't Know It's Old"** *(CPTSD + MDD)*
The sadness lands with the same weight it always did, but it doesn't seem to know the original thing that caused it is in the past. It's not attached to anything you can point to today. It just persists, like a system that was supposed to terminate the stress response and couldn't find the off signal. Less like pain, more like a residue that the brain's cleaning process never got to.

---

## 3. Oxytocin

### Overview

Oxytocin (OT) is a neuropeptide synthesized in the hypothalamus (paraventricular and supraoptic nuclei) and released both peripherally (as a hormone via the pituitary, mediating uterine contractions and lactation) and centrally (as a neuromodulator, released directly into the brain from hypothalamic axons). The central OT system is distinct from the hormonal OT system and has its own receptor distribution.

Its roles in the brain: social bonding, trust calibration, approach motivation toward social stimuli, stress buffering (particularly via dampening HPA response to social stressors), fear suppression in familiar social contexts, and modulation of social memory. It is not, despite popular framing, simply the "love hormone." Its effects are context-dependent and bidirectional — OT increases in-group trust while in some contexts increasing out-group wariness. OT effects also depend heavily on prior social experience: in people with secure attachment histories, OT promotes approach; in those with histories of attachment disruption, OT can amplify vigilance.

This context-dependence is critical for CPTSD: intranasal OT trials in PTSD populations showed mixed results — for some, OT enhanced the safety of social connection; for others with severe attachment disruption, OT amplified threat-related social attention.

**Cross-system interactions:**
- OT and DA interact in the mesolimbic system: OT receptors are on VTA DA neurons, and OT release triggers DA release in the NAc — social reward is partly dopaminergic, mediated by OT-DA crosstalk
- OT suppresses HPA axis activity acutely — a key stress-buffering mechanism that is disrupted in CPTSD (where attachment figures were threat sources, not safety sources)
- OT interacts with the opioid system in social bonding: the warmth of social connection involves both OT (approach, trust) and μ-opioid (social reward signal)
- OT modulates amygdala reactivity — OT generally suppresses amygdala threat responses in safe social contexts, but this suppression is reduced in individuals with trauma histories

---

### `systems.json` entry

```json
{
  "id": "oxytocin",
  "name": "Oxytocin",
  "abbreviation": "OT",
  "role": "Social bonding, trust calibration, social approach motivation, stress buffering in social contexts, social memory, and modulation of fear responses in familiar social environments.",
  "adhd": "Oxytocin modulates social attention and reward. Some evidence for altered OT levels in ADHD. OT may relate to the intense social motivation in some ADHD presentations (high reward value of social novelty) and to the pain of social rejection — RSD may involve dysregulated OT-mediated social pain processing.",
  "asd": "The most researched OT-condition link. Reduced OT levels and altered OT receptor expression in ASD. OT is proposed to underlie differences in social attention (faces as less salient), social reward (social contact less inherently rewarding), and social prediction (OT primes the brain to expect social interaction to be rewarding). Intranasal OT trials in ASD: consistent improvement in some social processing measures, less consistent in behavioral outcomes.",
  "ocd": "OT may regulate the social anxiety component of OCD and contamination-related fears. OT's ability to increase trust and reduce social vigilance is potentially relevant to OCD involving social evaluation fears.",
  "cptsd": "Critically relevant. Secure attachment and co-regulation rely on OT. Early trauma, particularly relational trauma (abuse, neglect by caregivers), disrupts the OT system's calibration — OT receptor sensitivity may be altered such that social contact no longer reliably triggers the safety/bonding response. The person may crave connection while simultaneously being triggered by it.",
  "gad": "OT's HPA-buffering effects are relevant: reduced OT signaling means social interactions are less stress-buffering and may be more activating. Social anxiety in GAD may involve OT system insufficiency in social safety-signaling.",
  "mdd": "OT contributes to the positive valence of social connection. In MDD, social withdrawal is both a symptom and a driver — OT hypoactivity may make social contact feel less rewarding, accelerating withdrawal. OT's anti-inflammatory effects are also relevant (see HPA/inflammatory overlap with MDD)."
}
```

---

### `receptors.json` entry

```json
{
  "id": "ot-oxtr",
  "system": "oxytocin",
  "receptor": "Oxytocin Receptor (OXTR)",
  "pattern": "social-modulatory",
  "role": "G-protein-coupled receptor (primarily Gq/G11 and Gi/o). OXTR is expressed in hypothalamus, amygdala, NAc, VTA, hippocampus, and several cortical regions. OXTR activation in the amygdala suppresses fear responses in familiar social contexts. OXTR in the NAc and VTA contributes to social reward (OT-DA crosstalk). OXTR in hippocampus supports social memory formation. The receptor's effects are strongly context-dependent: the same OT release can increase approach or vigilance depending on prior social experience encoded in the circuit.",
  "conditions": {
    "adhd": {
      "weight": 0.45,
      "description": "OXTR variants have been associated with social function in ADHD. OT-DA interaction in the NAc may contribute to the high social reward-seeking in some ADHD presentations — social novelty is intrinsically high-reward when the DA system needs strong signals. RSD (Rejection Sensitive Dysphoria) may involve abnormal OXTR-mediated pain responses to social exclusion signals."
    },
    "asd": {
      "weight": 0.85,
      "description": "OXTR is among the most studied receptors in ASD. Multiple OXTR gene variants are associated with ASD, and postmortem studies show altered OXTR distribution in ASD brains. Reduced OXTR density in amygdala may explain why faces and social stimuli are less automatically salient (the 'social attention' pull that OT normally potentiates is weaker). Intranasal OT increases eye contact, social memory, and emotion recognition in ASD in controlled settings. The social reward hypothesis of ASD (social stimuli are less inherently rewarding, not that social connection is not desired) is partly an OXTR account."
    },
    "ocd": {
      "weight": 0.40,
      "description": "OT's amygdala-suppressing effects are relevant to OCD involving social evaluation anxiety. Contamination OCD may involve OT-related social safety signaling — the boundary between self and contaminated other is partly regulated by OT's in-group/out-group signaling. Elevated OT in some OCD presentations has been found, possibly representing a compensatory up-regulation."
    },
    "cptsd": {
      "weight": 0.85,
      "description": "OXTR in CPTSD is central to attachment disruption. Early relational trauma alters OXTR expression and sensitivity — particularly the context-dependence of OT effects. When attachment figures were also threat sources, the OT system learns that social closeness predicts threat rather than safety. This inverts OT's normal function: instead of OT suppressing amygdala reactivity in social contexts, OT signaling may amplify vigilance. The person doesn't stop wanting connection; the system that should make connection feel safe has been calibrated against it."
    },
    "gad": {
      "weight": 0.55,
      "description": "OXTR-mediated social safety signaling is a key modulator of anxious baseline. When social contexts reliably trigger OT-based calming, social interaction is buffering. In GAD, if OXTR-mediated safety signaling is insufficient, social interactions add to rather than relieve the anxiety load. Co-regulation (using another person's regulated nervous system to calm your own) relies on this mechanism."
    },
    "mdd": {
      "weight": 0.60,
      "description": "OXTR density reductions in depression may reduce the positive valence of social contact, accelerating the social withdrawal that deepens MDD. OT's anti-inflammatory effects (suppressing IL-6 and other cytokines) are relevant to the neuroinflammatory component of MDD. Loneliness and social isolation worsen MDD via OT deficiency — the neural mechanism of what is otherwise described as a social phenomenon."
    }
  },
  "regions": ["amygdala", "nac", "vta", "hippocampus", "hypothalamus", "pfc", "tpj"],
  "mechanisms": ["social-reward", "trust-calibration", "fear-suppression-social-context", "co-regulation", "social-memory", "hpa-buffering"],
  "pharmacology": {
    "agonists": ["intranasal oxytocin (clinical research)", "carbetocin (long-acting OT analogue)", "endogenous OT (from hypothalamus)"],
    "antagonists": ["atosiban (clinical — uterine relaxant; limited CNS penetration)", "L-368,899 (research, CNS-penetrant)"],
    "modulators": ["MDMA (massively increases OT release — basis for its prosocial effects; being studied in PTSD-assisted therapy)", "social touch (oxytocin release via C-tactile afferents)", "warm social interaction (endogenous release)"],
    "notes": "Intranasal OT has inconsistent results across populations partly because OXTR effects depend on prior attachment history (which varies enormously). OXTR genetic variants (rs53576 is the most studied — GG genotype associated with greater empathy and social bonding) may moderate intranasal OT response. MDMA's therapeutic mechanism in PTSD is substantially OT-mediated — the intense prosocial feelings, combined with OXTR-mediated amygdala suppression, allow trauma processing in a state of felt safety. Social touch (particularly slow stroking at C-tactile fiber optimal speeds) is one of the most reliable non-pharmacological OT-release mechanisms."
  }
}
```

---

### `pathways.json` entry — Oxytocin

```json
{
  "id": "ot-social-reward-circuit",
  "name": "Oxytocin-Dopamine Social Reward Circuit",
  "from": "Hypothalamus (PVN) → VTA / NAc",
  "to": "Amygdala, hippocampus, PFC, NAc",
  "neurotransmitter": "oxytocin (neuromodulatory), dopamine (reward signal)",
  "receptors": ["ot-oxtr", "da-d1-tonic"],
  "role": "OT released from hypothalamic neurons acts directly on VTA DA neurons (via OXTR), triggering DA release in the NAc and PFC. This OT-DA coupling is the mechanism by which social bonding produces reward — the positive feeling of connection is partly dopaminergic, initiated by OT. Simultaneously, OT in the amygdala suppresses fear responses, enabling the social contact to be experienced as safe. This pathway is how healthy attachment feels: approach toward safety, reward from connection, reduced threat.",
  "conditions": {
    "adhd": "The high social reward value in ADHD (social novelty, connection) likely involves intact or elevated OT-DA coupling. The cost is that social loss/rejection hits harder — OT-mediated social pain may be amplified when the reward expectation is high.",
    "asd": "Reduced OXTR density in VTA and NAc reduces OT-mediated DA release from social stimuli. Social contact produces less DA — not because connection is unwanted, but because the chemistry that converts connection into reward signal is blunted. This is the 'social motivation' account of ASD social differences.",
    "ocd": "OT-DA coupling may modulate the reward value of ritualistic/compulsive behaviors vs. social connection. Some with OCD report rituals as more rewarding than social contact — a relative weighting that may involve OT-DA pathway imbalance.",
    "cptsd": "When attachment figures are threat sources, the OT-DA circuit becomes conditioned in the opposite direction — OT release (from social proximity) is paired with threat (not safety), and the amygdala-suppressing effect of OT is replaced or overridden by threat-conditioned responses. The person approaches connection and is simultaneously activated by it.",
    "gad": "OT-mediated amygdala suppression normally makes social contexts less anxiety-provoking. Insufficient OT-DA social reward coupling means social interactions neither provide reward nor adequately suppress anxiety — they become net anxiety-positive events rather than buffers.",
    "mdd": "Depleted OT-DA coupling reduces the hedonic value of social connection, accelerating social withdrawal. Social isolation then further depletes OT (which is release-dependent on social stimuli), creating a self-reinforcing cycle where the system that needs social contact to repair is least available during the withdrawal that depression drives."
  },
  "mechanisms": ["social-reward", "co-regulation", "trust-calibration", "fear-suppression-social-context"]
}
```

---

### Oxytocin: Unnamed Experience Examples

**"Wanting It and Dreading It Simultaneously"** *(CPTSD + ASD)*
You want to be close to them. That isn't the question. The question is why your body responds to getting close with something that feels exactly like threat — a tightening, a scanning, an inexplicable urge to create distance right at the moment connection is actually available. You're not avoiding them. You're navigating a nervous system that learned closeness and danger arrived together.

**"The Face That Doesn't Land"** *(ASD + MDD)*
You know they love you. You can see it, even. But in this moment their face isn't landing as information — it's just visual input, processed without the warmth it should carry. This isn't coldness and it isn't distance. It's more like the channel that converts their presence into felt connection has gone quiet. You're looking at love without being able to receive it.

---

## 4. HPA Axis (Cortisol / Stress)

### Overview

The HPA (hypothalamic-pituitary-adrenal) axis is the body's primary stress response system. Under threat (real or perceived):

1. The hypothalamus releases **CRH** (corticotropin-releasing hormone)
2. CRH signals the pituitary to release **ACTH** (adrenocorticotropic hormone)
3. ACTH signals the adrenal cortex to release **cortisol** (glucocorticoid)
4. Cortisol mobilizes energy, suppresses inflammation, and — critically — feeds back to shut down the axis via glucocorticoid receptors (GR) in the hypothalamus and hippocampus

This self-terminating feedback loop is how acute stress should work. In CPTSD, chronic activation has altered the feedback loop itself. In GAD, the threat detection that initiates the cascade is calibrated too sensitively. In MDD, the feedback loop is dysregulated — cortisol stays elevated even after stress resolves. In ADHD, the axis is often hypersensitive, with stress producing outsized cortisol responses that further impair the prefrontal function that's already challenged.

**Downstream effects on other neurotransmitter systems:**
- Chronic cortisol suppresses mesocortical DA function — directly worsening executive function and motivation in ADHD under stress
- Chronic cortisol impairs 5-HT synthesis and receptor sensitivity — one mechanism linking chronic stress to depression
- Cortisol damages PV+ GABAergic interneurons (discussed in GABA section) — reducing the inhibitory tone that manages anxiety and sensory sensitivity
- Chronic cortisol reduces anandamide (via FAAH upregulation) — removing the eCB stress-termination mechanism
- Cortisol reduces BDNF (brain-derived neurotrophic factor) in the hippocampus — impairing learning, memory, and neuroplasticity; one mechanism of trauma's effect on memory

**The ADHD-stress interaction:** Under HPA activation, DA is shunted from the PFC (mesocortical pathway) to the amygdala-centered stress circuit. The brain deprioritizes executive function in favor of survival. For someone with ADHD whose PFC DA is already marginal, even modest stress can push them below the threshold for functional executive control. Stress doesn't just add to the difficulty — it removes the capacity that was barely there to begin with.

---

### `systems.json` entry

```json
{
  "id": "hpa-axis",
  "name": "HPA Axis / Cortisol",
  "abbreviation": "HPA/CORT",
  "role": "Primary stress response system. CRH (hypothalamus) → ACTH (pituitary) → cortisol (adrenal cortex). Mobilizes energy under threat, suppresses non-essential functions, and — in healthy function — self-terminates via glucocorticoid receptor feedback in hippocampus and hypothalamus.",
  "adhd": "HPA hypersensitivity is common in ADHD — stress produces outsized cortisol responses. Cortisol acutely impairs mesocortical DA function, causing PFC capacity to plummet under stress. The already-narrow margin of executive function disappears. People with ADHD frequently describe losing all executive capacity in stressful situations — this is the neurochemical mechanism.",
  "asd": "Altered HPA axis reactivity in ASD — often higher basal cortisol and steeper reactivity to social/sensory stressors. Social and sensory demands can be chronically activating, meaning many autistic people live in a state of mild-to-moderate chronic HPA activation. This contributes to fatigue, cognitive overload, and the restorative need for solitude.",
  "ocd": "Stress reliably worsens OCD symptoms — HPA activation increases compulsive urge intensity, likely via cortisol-induced glutamate dysregulation in CSTC loops and reduced GABAergic inhibitory control.",
  "cptsd": "The defining pathology. Chronic trauma produces lasting HPA dysregulation — the self-terminating feedback fails. GR expression in the hippocampus is reduced by chronic cortisol exposure, destroying the brake on the axis. Results can include elevated basal cortisol, or — in some chronic CPTSD cases — a paradoxically blunted cortisol response (adrenal 'exhaustion' with hypersensitive GR upregulation). Both represent a broken self-regulation system.",
  "gad": "HPA is chronically over-active in GAD — the threat-detection system that triggers the axis is calibrated to fire too easily. Worry itself triggers low-grade cortisol release, creating a cycle: anxiety → cortisol → impaired PFC top-down inhibition → more anxiety. Cortisol also sensitizes the amygdala to threat, further lowering the threshold.",
  "mdd": "HPA dysregulation in MDD is among the most replicated biological findings. Cortisol hypersecretion in melancholic depression damages hippocampal neurons (reducing volume — visible on MRI), suppresses DA and 5-HT synthesis, reduces BDNF, and maintains a biological state incompatible with recovery. The 'dexamethasone suppression test' (whether cortisol is suppressed by synthetic GR agonist) was a candidate biological marker for MDD."
}
```

---

### `receptors.json` entries

```json
{
  "id": "hpa-gr",
  "system": "hpa-axis",
  "receptor": "Glucocorticoid Receptor (GR / NR3C1)",
  "pattern": "nuclear-feedback-inhibitory",
  "role": "Intracellular nuclear receptor with high affinity for cortisol at elevated concentrations. When cortisol is high, GR-cortisol complexes translocate to the nucleus and modulate gene expression — including downregulating CRH and ACTH production, thereby terminating the HPA response. Also regulates BDNF, inflammatory cytokines, and metabolic genes. GR in the hippocampus is the primary negative feedback sensor for HPA termination. GR in the PFC modulates DA and 5-HT systems under stress.",
  "conditions": {
    "adhd": {
      "weight": 0.55,
      "description": "GR function in PFC mediates cortisol's acute impairment of DA signaling under stress. GR activation by stress cortisol shifts PFC state from 'executive function mode' to 'survival mode' — D1 signaling decreases, NE alpha-1 increases. For ADHD, this means stress rapidly removes marginal PFC function. GR hypersensitivity may underlie the outsized stress responses observed in ADHD."
    },
    "asd": {
      "weight": 0.60,
      "description": "Altered GR sensitivity in ASD may contribute to HPA dysregulation. Social and sensory demands trigger HPA activation, and if GR feedback is less efficient, cortisol remains elevated longer, accumulating biological cost. Autistic burnout may partly represent the endpoint of chronic HPA dysregulation — the accumulated damage of a stress system that couldn't self-regulate adequately to the level of demand."
    },
    "ocd": {
      "weight": 0.50,
      "description": "GR-mediated cortisol effects on GABA and glutamate systems in OFC and striatum influence CSTC loop tone. Acute stress via GR activation reduces GABAergic inhibitory control in OFC, increasing the gain on compulsive loop initiation."
    },
    "cptsd": {
      "weight": 0.95,
      "description": "This is the defining receptor in CPTSD neurobiology. Chronic cortisol downregulates GR expression in the hippocampus via epigenetic mechanisms — methylation of the GR gene (NR3C1) promoter, reducing GR density. Fewer GRs means weaker negative feedback, meaning cortisol rises higher and stays elevated longer. This is how trauma is written into the biology: the brake system that should terminate stress responses is systematically dismantled by the stress itself."
    },
    "gad": {
      "weight": 0.70,
      "description": "GR hypersensitivity at the amygdala amplifies cortisol's anxiogenic effects — each cortisol pulse from worry-triggered HPA activation sensitizes the amygdala to be more reactive to the next trigger. Reduced hippocampal GR feedback efficiency means worrying produces lasting HPA changes that make further worrying more likely."
    },
    "mdd": {
      "weight": 0.85,
      "description": "GR resistance (insufficient GR signaling despite high cortisol) is a hallmark of melancholic depression — the negative feedback fails, cortisol stays chronically elevated, and downstream suppression of DA, 5-HT, and BDNF perpetuates depression. Mifepristone (GR antagonist) has been studied in psychotic depression — paradoxically, blocking the pathologically dysregulated GR can break the feedback loop. Antidepressants' normalization of HPA axis is one mechanism of sustained recovery."
    }
  },
  "regions": ["hippocampus", "hypothalamus", "pfc", "amygdala", "pituitary"],
  "mechanisms": ["hpa-negative-feedback", "stress-termination", "epigenetic-stress-encoding", "da-suppression-under-stress", "bdnf-regulation"],
  "pharmacology": {
    "agonists": ["cortisol (endogenous)", "dexamethasone (synthetic, high-potency — used in DST)", "prednisolone", "hydrocortisone"],
    "antagonists": ["mifepristone (RU-486 — GR and progesterone receptor antagonist; studied in psychotic depression)", "relacorilant (selective GR antagonist, in trials for Cushing's and MDD)"],
    "modulators": ["CBT/psychotherapy (increases hippocampal GR expression via BDNF)", "antidepressants (normalize GR sensitivity long-term)", "exercise (increases GR sensitivity and BDNF)"],
    "notes": "GR has low affinity for cortisol at basal levels — it activates primarily under stress-level cortisol concentrations. At basal cortisol, the mineralocorticoid receptor (MR) is the primary receptor (see below). The GR/MR ratio in hippocampal neurons determines how quickly the HPA axis self-terminates. Epigenetic GR methylation by early-life stress is one of the most important mechanisms linking adverse childhood experiences to lifelong stress dysregulation — and is, in principle, a target for reversal."
  }
}
```

```json
{
  "id": "hpa-mr",
  "system": "hpa-axis",
  "receptor": "Mineralocorticoid Receptor (MR / NR3C2)",
  "pattern": "nuclear-tonic-sensitive",
  "role": "High-affinity intracellular receptor activated by basal cortisol levels (also aldosterone peripherally). The primary receptor determining HPA tone at rest — not the stress response itself (that's GR's job) but the baseline sensitivity and set-point of the entire system. MR in hippocampal neurons is a key determinant of anxiety threshold and stress reactivity. High MR:GR ratio → stable, low anxiety baseline; disrupted MR:GR balance → anxious, hair-trigger stress reactivity.",
  "conditions": {
    "adhd": {
      "weight": 0.40,
      "description": "MR function sets the baseline HPA sensitivity. Altered MR:GR balance may explain why some ADHD presentations have what appears to be chronically elevated stress reactivity even in objectively safe environments — the baseline 'threat readiness' is set higher."
    },
    "asd": {
      "weight": 0.55,
      "description": "MR in the hippocampus is highly sensitive to early developmental stress — and social isolation, sensory distress, and chronic misattunement in childhood (common in undiagnosed autism) constitute chronic stress. Altered MR expression may shift the baseline HPA setpoint toward higher reactivity in autistic individuals who experienced chronic social stress pre- or post-identification."
    },
    "ocd": {
      "weight": 0.40,
      "description": "MR-mediated baseline anxiety sensitivity determines how easily the HPA axis fires in response to OCD-related triggers. Higher tonic HPA sensitivity amplifies OCD symptom severity."
    },
    "cptsd": {
      "weight": 0.80,
      "description": "MR downregulation co-occurs with GR downregulation in CPTSD — the baseline HPA set-point shifts toward hyperreactivity. MR loss specifically impairs the 'low arousal' suppression of HPA activity, meaning the axis never fully rests. This is experienced as a chronic state of 'something is wrong' that can't quite resolve, regardless of external safety."
    },
    "gad": {
      "weight": 0.75,
      "description": "MR function determines the anxiety floor. Reduced MR:GR ratio in GAD means the system that should maintain a calm baseline between stressors isn't functioning adequately. The baseline isn't neutral — it's already anxious, and stressors add to an already-elevated foundation."
    },
    "mdd": {
      "weight": 0.65,
      "description": "MR mediates the appraisal of mildly rewarding events — its activation in hippocampal circuits promotes approach and reduces passive avoidance. MR hypoactivity in MDD may contribute to the dampened response to positive events — the biological mechanism of 'nothing feels good' even when circumstances are objectively acceptable."
    }
  },
  "regions": ["hippocampus", "amygdala", "hypothalamus", "pfc"],
  "mechanisms": ["hpa-setpoint", "baseline-anxiety-regulation", "tonic-stress-sensitivity", "approach-appraisal"],
  "pharmacology": {
    "agonists": ["cortisol (endogenous, high affinity)", "aldosterone (peripheral)", "fludrocortisone (selective MR agonist, clinical for POTS/dysautonomia)"],
    "antagonists": ["spironolactone (MR antagonist — used as antiandrogen and for hypertension; preliminary evidence for antidepressant effect)", "eplerenone (selective MR antagonist)", "finerenone"],
    "modulators": ["antidepressants normalize MR expression over time", "aerobic exercise increases MR sensitivity in hippocampus"],
    "notes": "The MR/GR hippocampal ratio is considered a biomarker of stress resilience. High MR expression = calm baseline, good stress response, good recovery. Low MR + functional GR = anxiety-prone, reactive. Low both = blunted stress response with high reactivity (CPTSD pattern). Spironolactone's antidepressant effects in clinical observation deserve more research — MR blockade paradoxically improving MDD suggests complex MR-mediated feedback mechanisms."
  }
}
```

```json
{
  "id": "hpa-crh-r1",
  "system": "hpa-axis",
  "receptor": "CRH Receptor 1 (CRHR1)",
  "pattern": "stress-initiating",
  "role": "Gs-coupled receptor for CRH (corticotropin-releasing hormone). CRHR1 in the pituitary mediates ACTH release (the hormonal cascade). CRHR1 in the amygdala, BNST, and PFC mediates the behavioral and emotional responses to CRH — anxiety, fear-potentiation, and avoidance — independent of the hormonal pathway. CRH acts as both a hormone initiating the HPA cascade and as a neurotransmitter directly producing anxious/fearful behavior.",
  "conditions": {
    "adhd": {
      "weight": 0.40,
      "description": "CRHR1 in the amygdala and PFC contributes to the acute stress-worsening of ADHD symptoms. CRH release during stress directly impairs PFC-mediated inhibitory control via CRHR1 — before cortisol even reaches its targets, CRH is already narrowing executive function."
    },
    "asd": {
      "weight": 0.55,
      "description": "Elevated CRH in ASD has been reported — both systemically and in CSF. CRH's direct anxiogenic effects via amygdala CRHR1 may contribute to the anxiety profile of many autistic individuals, independent of cortisol effects. The social stress of chronic masking may chronically elevate CRH release."
    },
    "ocd": {
      "weight": 0.50,
      "description": "CRH and CRHR1 in the BNST mediate sustained, non-cue-specific anxiety — the free-floating dread rather than fear of a specific thing. This is relevant to OCD's anticipatory anxiety between compulsions and the pervasive sense of threat that drives checking behaviors."
    },
    "cptsd": {
      "weight": 0.90,
      "description": "CRH hypersecretion is one of the best-documented neurobiological findings in PTSD/CPTSD. Elevated CSF CRH in combat veterans with PTSD was found decades ago. Chronic CRH hypersecretion via CRHR1 produces sustained anxiety, hypervigilance, and sensitization of the amygdala-fear circuit. CRHR1 antagonists are among the most promising investigational drugs for PTSD."
    },
    "gad": {
      "weight": 0.80,
      "description": "CRHR1 activation in the BNST is the primary mechanism for sustained, non-specific anxiety — the 'anxious about nothing in particular' quality of GAD. Unlike amygdala-based fear (specific, cue-triggered), BNST-CRH anxiety is diffuse and persistent. GAD's pathognomonic 'free-floating anxiety' is a BNST-CRHR1 phenomenon."
    },
    "mdd": {
      "weight": 0.70,
      "description": "CRH hypersecretion in MDD is documented. CRH's direct effects on monoamine systems (suppressing DA and 5-HT release) mean CRH is both a stress mediator and a mood suppressor. CRHR1 antagonists were investigated as antidepressants — results were promising but inconsistent, possibly due to subgroup heterogeneity (MDD with HPA dysregulation would benefit; MDD without might not)."
    }
  },
  "regions": ["pituitary", "amygdala", "bnst", "pfc", "hippocampus", "lc"],
  "mechanisms": ["hpa-initiation", "fear-potentiation", "sustained-anxiety", "executive-function-impairment-acute"],
  "pharmacology": {
    "agonists": ["CRH (endogenous)", "urocortin (also activates CRHR2)"],
    "antagonists": ["antalarmin (CRHR1-selective, research)", "pexacerfont (studied in clinical trials for GAD and MDD)", "verucerfont", "NBI-30775"],
    "modulators": ["SSRIs reduce CRH expression with chronic treatment (one mechanism of anxiolytic effect)", "CBT reduces CRH levels in panic disorder"],
    "notes": "CRHR1 and CRHR2 have opposing functions in stress: CRHR1 initiates and amplifies the stress response; CRHR2 (activated by urocortin 2/3) promotes stress recovery and termination. The balance between these two receptors determines stress response duration and recovery speed. CRHR1 antagonists have been disappointingly inconsistent in clinical trials — likely because CRH dysregulation is one of several HPA dysfunctions, and monotherapy may not be sufficient to restore system balance."
  }
}
```

---

### `pathways.json` entry — HPA Axis

```json
{
  "id": "hpa-cascade",
  "name": "HPA Stress Cascade",
  "from": "Hypothalamus (PVN) → Pituitary → Adrenal Cortex",
  "to": "Systemic cortisol → Brain (GR, MR) / Hippocampal feedback",
  "neurotransmitter": "CRH (neuropeptide), ACTH (peptide hormone), cortisol (glucocorticoid steroid)",
  "receptors": ["hpa-crh-r1", "hpa-gr", "hpa-mr"],
  "role": "Threat signal → CRH release → ACTH → cortisol → mobilizes body for response. Cortisol feeds back via hippocampal GR to terminate the cascade. In parallel, CRH acts as a direct neurotransmitter in amygdala and BNST to produce fear and anxiety behaviors independent of the hormonal cascade. Healthy function: threat → response → termination → recovery. Disrupted function (CPTSD, GAD, MDD): threat → response → failure to terminate → chronic elevation → downstream damage to DA, 5-HT, GABA, eCB systems.",
  "conditions": {
    "adhd": "HPA hypersensitivity degrades the already-thin margin of mesocortical DA function under stress. The pathway from threat perception to executive function collapse is very short for ADHD.",
    "asd": "Chronic social and sensory demands constitute persistent low-grade HPA activation. The cascade runs frequently without adequate termination, accumulating as fatigue, cognitive overload, and what is clinically recognizable as autistic burnout.",
    "ocd": "Stress via the HPA cascade acutely worsens OCD by reducing GABAergic control of CSTC loops (cortisol suppresses PV+ interneurons) and increasing glutamate drive.",
    "cptsd": "The defining pathway of the condition. Repeated trauma activation of the HPA cascade, combined with GR downregulation preventing feedback termination, produces lasting neurobiological change. The pathway that should terminate stress becomes unable to do so — and the body lives in the consequence.",
    "gad": "HPA over-initiation: the threat-detection system triggers CRH release too readily. Each episode of worry is a micro-HPA activation, and the cascade never fully terminates between them.",
    "mdd": "HPA dysregulation in MDD produces sustained cortisol elevation that suppresses DA, 5-HT, BDNF, and GABAergic interneuron function — a multi-system depression of the systems that support mood, motivation, and resilience."
  },
  "mechanisms": ["stress-initiation", "hpa-negative-feedback", "stress-termination", "executive-function-impairment-acute", "da-suppression-under-stress", "serotonin-suppression", "bdnf-suppression", "neuroinflammation-modulation"]
}
```

---

### HPA Axis: Unnamed Experience Examples

**"The Floor That Drops Out"** *(ADHD + CPTSD)*
You were fine — genuinely fine, managing everything — and then something small happened. Not a big thing. A tone of voice, an unexpected request, a plan that changed. And suddenly there's nothing underneath. Not panic. Not anger. Just the executive function that was there a moment ago is simply gone, and you're left holding responsibilities you can no longer process. The capacity vanished before you could use it to cope with the thing that removed it.

**"The Calm That Doesn't Arrive"** *(CPTSD + GAD)*
The situation resolved. Objectively, it's over. People around you have moved on. But your body is still running the response — still searching for a threat signal that would justify the cortisol levels that are apparently still high. You're waiting for a biological calm that your nervous system doesn't seem to know how to produce. It's not that you're upset. It's that the system that should register safety isn't responding to it.

**"Autistic Burnout's Last Day"** *(ASD + CPTSD)*
There's no specific moment when it broke. The last thing on the list was ordinary — a message to answer, a room to be in. But you've been running on cortisol for months, maybe longer, and the system has simply used up what it had. It's not exhaustion you can sleep off. It's the cost of a nervous system that was never given a chance to terminate its own stress response, and finally presented the bill all at once.

---

## 5. Opioid System

### Overview

The endogenous opioid system consists of three receptor families (μ, κ, δ) and their peptide ligands (endorphins, enkephalins, dynorphins). The opioid system's role extends far beyond pain modulation: it is central to social reward, the felt sense of warmth and belonging, the registration of social loss as physically painful, and the hedonic tone of experience more broadly.

The social pain overlap with physical pain is neuroimaging-confirmed: social exclusion activates the same anterior cingulate and dorsal insula regions as physical pain. μ-opioid receptor (MOR) activation is the primary mechanism for both the relief of physical pain and the warmth of social connection. This is not metaphor — the chemistry of belonging and the chemistry of analgesia share receptors.

Relevance to the AuDHD framework:
- ASD social reward differences may involve reduced μ-opioid social reward signaling (social contact produces less endorphin — not because connection isn't wanted, but because the reward chemistry is blunted)
- CPTSD numbing and dissociation involve κ-opioid receptor (KOR) activation — κ-opioids produce dysphoria and dissociation, and chronic stress activates the dynorphin/κ-opioid system as a pain-suppression mechanism that becomes pathological
- MDD anhedonia has a μ-opioid component: reduced μ-opioid signaling in ventral striatum is directly correlated with anhedonia severity in depression
- Social pain (rejection, exclusion, bereavement) is real opioid-relevant pain — this gives neurochemical specificity to RSD

**Cross-system interactions:**
- μ-opioid activation releases DA in the NAc (indirect, via VTA disinhibition) — the opioid-DA interaction underlies addictive potential and the motivational salience of social reward
- OT and opioids are co-released in some social bonding contexts and interact synergistically — the warmth of social touch involves both OT (approach/trust) and μ-opioid (pleasurable reward)
- κ-opioid activation opposes μ-opioid function: dynorphin/κ-opioid is the stress-dysphoria system, antagonizing the social reward signal of μ-opioid
- CRH co-activates the dynorphin/κ-opioid system: stress → CRH → dynorphin → KOR activation → dysphoria + dissociation — the neurochemical account of stress-induced emotional numbing

---

### `systems.json` entry

```json
{
  "id": "opioid",
  "name": "Opioid System",
  "abbreviation": "OPS",
  "role": "Pain modulation (physical and social), social reward and bonding, hedonic tone regulation, stress-induced analgesia/dysphoria, and motivation via DA-opioid interaction in the reward system.",
  "adhd": "Opioid system contributes to social reward valuation. High reward-sensitivity in ADHD (novelty-seeking, social engagement) may involve μ-opioid amplification of social reward signals. The acute pain of social rejection (RSD) is partly a μ-opioid phenomenon — intense social reward expectation means social loss is experienced as acute withdrawal.",
  "asd": "Social reward via μ-opioid signaling is central to social motivation. The social motivation hypothesis of ASD is partly an opioid hypothesis: reduced μ-opioid-mediated reward from social contact reduces the drive to seek social interaction. Early evidence suggests that low-dose naltrexone (μ-opioid antagonist) has paradoxical benefits in ASD — possibly via upregulation of endogenous opioid systems.",
  "ocd": "The compulsive reward system in OCD involves opioid components. The brief relief following a compulsion may be μ-opioid-mediated (completion-relief); the mounting distress before compulsion may involve κ-opioid activation.",
  "cptsd": "κ-opioid (dynorphin) system activation is a key mechanism of trauma-induced emotional numbing and dissociation. Chronic stress chronically activates the KOR system, producing persistent dysphoria, emotional blunting, and dissociative states. κ-opioid antagonists (aticaprant, CERC-501) are among the most promising investigational treatments for PTSD and treatment-resistant depression.",
  "mdd": "Opioid system dysregulation in MDD involves both dimensions: reduced μ-opioid signaling reduces hedonic capacity (anhedonia), and elevated κ-opioid/dynorphin signaling produces dysphoria. Buprenorphine (μ partial agonist / κ antagonist) has antidepressant evidence precisely because it targets both dimensions simultaneously.",
  "gad": "Social anxiety and social pain register as opioid-mediated experiences. GAD's sensitivity to social judgment may involve μ-opioid-mediated social pain sensitivity. The anticipation of social rejection (which drives avoidance) is partly anticipatory opioid withdrawal."
}
```

---

### `receptors.json` entries

```json
{
  "id": "opioid-mu",
  "system": "opioid",
  "receptor": "μ-Opioid Receptor (MOR / OPRM1)",
  "pattern": "hedonic-reward-analgesic",
  "role": "Primary receptor for endorphins and enkephalins. Gi/o-coupled; reduces cAMP, opens K+ channels (hyperpolarizing), and closes Ca2+ channels. In the reward system (NAc, VTA), MOR activation disinhibits DA neurons, producing DA release and the positive subjective experience of reward. In pain pathways, MOR activation reduces nociceptive transmission. In social circuits, MOR activation is the mechanism of 'social warmth' — the felt sense of connection, belonging, and comfort in the presence of trusted others.",
  "conditions": {
    "adhd": {
      "weight": 0.55,
      "description": "MOR-mediated social reward is likely higher in ADHD — the intense pleasure of social engagement (and the intense pain of its absence, RSD) are consistent with heightened μ-opioid social sensitivity. Novelty-seeking in ADHD may involve seeking μ-opioid reward peaks. The ADHD pattern of emotional intensity tracks with opioid system sensitivity."
    },
    "asd": {
      "weight": 0.75,
      "description": "The social motivation hypothesis of ASD frames social approach as driven by the reward of MOR activation from social contact. If MOR activation in response to social stimuli is reduced in ASD, the drive to initiate social contact is reduced — not because connection isn't valued, but because the pleasurable opioid signal that normally reinforces social approach is blunted. OPRM1 variants have been associated with ASD. Low-dose naltrexone's paradoxical ASD benefits may involve compensatory MOR upregulation following receptor blockade."
    },
    "ocd": {
      "weight": 0.50,
      "description": "MOR activation may mediate the brief relief following compulsion completion — the 'done' signal that temporarily quiets OCD distress. This opioid-mediated completion relief may reinforce compulsive behavior: the ritual ends with a small opioid reward, strengthening the compulsion-reward association. Opioid signaling in OFC is relevant to the obsessive error-detection that drives compulsions."
    },
    "cptsd": {
      "weight": 0.65,
      "description": "In CPTSD, MOR-mediated social reward is disrupted — not necessarily at the receptor level, but because trusted social contact (which would normally trigger MOR activation) is associated with threat via prior trauma. The person can't receive the social opioid reward because the social context that should trigger it also triggers HPA activation. The reward system and the threat system are simultaneously engaged by the same input."
    },
    "gad": {
      "weight": 0.45,
      "description": "MOR-mediated social warmth is a key stress buffer — positive social contact normally activates MOR, producing comfort and reducing anxious arousal. In GAD, social anxiety may reduce access to this buffer: the social interactions that would provide MOR-mediated comfort are themselves anxiety-provoking, preventing the reward circuit from doing its stress-buffering work."
    },
    "mdd": {
      "weight": 0.80,
      "description": "Reduced μ-opioid function in ventral striatum is one of the most directly demonstrated mechanisms of anhedonia in MDD. PET imaging with OPRM1 tracers shows reduced MOR binding potential in NAc in depression — the system is downregulated or occupied, and the capacity to experience social and other pleasures is biochemically diminished. Augmentation of antidepressants with buprenorphine (MOR partial agonist) has evidence in treatment-resistant depression."
    }
  },
  "regions": ["nac", "vta", "pfc", "amygdala", "acc", "dorsal-raphe", "periaqueductal-gray"],
  "mechanisms": ["social-reward", "hedonic-tone", "pain-modulation-physical", "social-pain-buffering", "da-disinhibition"],
  "pharmacology": {
    "agonists": ["endorphins (endogenous)", "enkephalins (endogenous)", "morphine", "oxycodone", "buprenorphine (partial agonist — partial activity with ceiling)", "methadone", "fentanyl"],
    "antagonists": ["naltrexone (full antagonist — used in AUD, OUD, and investigated in ASD, MDD)", "naloxone (emergency reversal)", "nalmefene"],
    "modulators": ["social touch, exercise, laughter, positive social connection (all increase endorphin release)"],
    "notes": "MOR OPRM1 gene variant A118G (rs1799971): G allele carriers have reduced MOR expression and show reduced social sensitivity — relevant to ASD and social pain research. Low-dose naltrexone (1-4.5mg vs clinical 50mg) may work via different mechanisms — brief MOR blockade followed by compensatory upregulation of endogenous opioid systems, rather than sustained antagonism. LDN is being studied in ASD, fibromyalgia, CPTSD, and MDD. The opioid system's role in social bonding has profound clinical implications: loneliness is not just a social experience, it is an opioid deficiency state."
  }
}
```

```json
{
  "id": "opioid-kappa",
  "system": "opioid",
  "receptor": "κ-Opioid Receptor (KOR / OPRK1)",
  "pattern": "stress-dysphoric-dissociative",
  "role": "The anti-reward receptor. Gi/o-coupled, KOR activation produces dysphoria, anxiety, anhedonia, and dissociation — the opposite of MOR activation. Its endogenous ligand is dynorphin, released in response to stress and pain. KOR activation is the brain's acute pain-suppression system: under severe stress, dynorphin/KOR activation numbs both physical and emotional pain. Chronically, this mechanism produces the emotional blunting, flat affect, and dissociation of persistent trauma response. KOR activation also inhibits DA release — directly opposing the hedonic signal.",
  "conditions": {
    "adhd": {
      "weight": 0.35,
      "description": "KOR activation in response to stress may contribute to the ADHD stress-collapse pattern — emotional blunting and shutdown under excessive demand. Chronic rejection experiences (RSD history) may produce sensitized dynorphin/KOR responses to social threat cues."
    },
    "asd": {
      "weight": 0.50,
      "description": "KOR activation may underlie autistic shutdown states — the emotional withdrawal and flattening that occurs when sensory or social demands exceed the system's capacity. Dynorphin/KOR as a stress-numbing response to chronic overstimulation is consistent with the phenomenology of shutdown."
    },
    "ocd": {
      "weight": 0.45,
      "description": "Dynorphin/KOR activation in the NAc and PFC contributes to the dysphoric, driven quality of OCD — the compulsive behavior emerges from a state of KOR-driven distress that the compulsion briefly relieves (via MOR activation). The oscillation between KOR-driven distress and MOR-mediated relief is a mechanism of compulsive reinforcement."
    },
    "cptsd": {
      "weight": 0.90,
      "description": "KOR is the neurochemical basis of trauma-induced emotional numbing and dissociation. CRH co-activates dynorphin release — meaning the same stress signal that initiates the HPA cascade also activates KOR-mediated numbing. Chronically high dynorphin/KOR tone in CPTSD produces persistent dysphoria, emotional blunting, anhedonia, and dissociative states. KOR antagonists (aticaprant/CERC-501, JNJ-67953964) are in clinical trials for PTSD/CPTSD and represent one of the most mechanism-grounded investigational treatments for the condition."
    },
    "gad": {
      "weight": 0.40,
      "description": "KOR-mediated anxiety and dysphoria add a distress quality to GAD's anxious state — beyond the cognitive worry, there is an opioid-mediated somatic dread. Chronic KOR activation from chronic stress exposure may contribute to the anhedonic/flat quality that sometimes co-occurs with GAD."
    },
    "mdd": {
      "weight": 0.85,
      "description": "Dynorphin/KOR overactivation is one of the most empirically supported mechanisms of depression anhedonia. KOR activation suppresses DA release in NAc and 5-HT release in dorsal raphe — directly producing the neurochemical state of depression. KOR also reduces motivation via lateral hypothalamus inputs. Buprenorphine's antidepressant effect involves KOR antagonism (it is a partial MOR agonist and KOR antagonist). Pure KOR antagonists in trials show antidepressant effects specifically for anhedonia dimensions."
    }
  },
  "regions": ["nac", "vta", "pfc", "amygdala", "hypothalamus", "periaqueductal-gray", "dorsal-raphe"],
  "mechanisms": ["stress-induced-analgesia", "emotional-numbing", "dissociation", "da-suppression", "dysphoria-production", "anti-reward"],
  "pharmacology": {
    "agonists": ["dynorphin A/B (endogenous)", "U50488 (research)", "salvinorin A (kappa-selective hallucinogen from Salvia divinorum)"],
    "antagonists": ["aticaprant (CERC-501 / LY2456302 — in clinical trials for MDD, PTSD)", "JNJ-67953964 (navacaprant)", "GNTI (research)", "norbinaltorphimine (nor-BNI, research)"],
    "modulators": ["buprenorphine (KOR antagonist component, alongside MOR partial agonism)", "stress reduction practices that lower dynorphin release"],
    "notes": "KOR antagonists have a unique pharmacological property: they require chronic dosing to show efficacy (unlike most receptor antagonists). This is because KOR antagonism works via epigenetic mechanisms — the receptor's downstream signaling is altered with sustained blockade, not just acute blocking. This has dosing implications for clinical trials (short trials underestimate efficacy). Salvinorin A's KOR-selective hallucinogenic effect is consistent with the dissociative, reality-distorting effects of high dynorphin states — suggesting a KOR mechanistic basis for some trauma-related perceptual distortions."
  }
}
```

```json
{
  "id": "opioid-delta",
  "system": "opioid",
  "receptor": "δ-Opioid Receptor (DOR / OPRD1)",
  "pattern": "mood-modulatory-anxiolytic",
  "role": "Gi/o-coupled receptor primarily for enkephalins. DOR has a distinct profile from MOR and KOR: it mediates mood stabilization and anxiety reduction with a more sustained, tonic quality than the phasic reward of MOR. DOR activation produces anxiolytic and antidepressant-like effects with less dependence liability than MOR agonism. DOR is also involved in olfactory circuits (highly enkephalin-dense) and interacts with DA signaling in the striatum.",
  "conditions": {
    "adhd": {
      "weight": 0.35,
      "description": "DOR-mediated striatal DA modulation may affect the tonic reward tone that underlies motivation. DOR in limbic circuits may modulate emotional volatility — enkephalin/DOR insufficiency could contribute to the emotional intensity and rapid mood shifts of ADHD."
    },
    "asd": {
      "weight": 0.45,
      "description": "DOR modulates anxiety and social behavior in animal models. Enkephalin/DOR circuits in olfactory and limbic regions may contribute to olfactory sensitivity in ASD — the opioid-olfactory interaction is underexplored but potentially relevant to sensory processing differences."
    },
    "ocd": {
      "weight": 0.40,
      "description": "DOR's anxiolytic profile is relevant to OCD's anxiety dimension. DOR activation reduces anxious avoidance behaviors in animal models. Enkephalin/DOR insufficiency in OFC-limbic circuits may reduce the anxiolytic braking on compulsive loop initiation."
    },
    "cptsd": {
      "weight": 0.55,
      "description": "DOR activation has antidepressant and anxiolytic effects relevant to CPTSD's chronic dysphoria and anxiety. DOR agonists are being investigated for depression and anxiety with a potentially better safety profile than MOR agonists. Enkephalin/DOR tone may buffer against the worst of KOR-mediated dysphoria in CPTSD."
    },
    "gad": {
      "weight": 0.50,
      "description": "DOR's sustained anxiolytic quality makes it particularly relevant to GAD's chronic, non-episodic anxiety. Enkephalin/DOR circuits in amygdala and hippocampus provide tonic anxiety buffering that may be insufficient in GAD."
    },
    "mdd": {
      "weight": 0.65,
      "description": "DOR-selective agonists show antidepressant and anxiolytic effects in animal models and early human data. DOR modulates DA transmission in ways that may support hedonic tone with less reward-volatility than direct MOR agonism. AZD2327 (DOR-selective agonist) showed antidepressant effects in clinical trials, particularly for anxious depression."
    }
  },
  "regions": ["striatum", "amygdala", "hippocampus", "olfactory-bulb", "pfc", "acc"],
  "mechanisms": ["mood-stabilization", "tonic-anxiolysis", "social-reward-modulation", "da-modulation"],
  "pharmacology": {
    "agonists": ["enkephalins (endogenous)", "SNC80 (research)", "BW373U86 (research)", "AZD2327 (clinical research)"],
    "antagonists": ["naltrindole (selective, research)", "TIPP[psi] (research)"],
    "modulators": ["DOR can be upregulated by chronic pain / chronic stress (compensatory)", "exercise increases enkephalin synthesis"],
    "notes": "DOR has historically been underresearched relative to MOR and KOR. It is now gaining attention as an antidepressant target with potentially better tolerability. DOR agonists at high doses can produce convulsions (a dose-limiting side effect in early research), but newer compounds have improved therapeutic windows. The olfactory-DOR connection is interesting for sensory research: olfactory hypersensitivity in ASD and CPTSD might be partly an opioid-olfactory circuit phenomenon."
  }
}
```

---

### `pathways.json` entry — Opioid System

```json
{
  "id": "opioid-social-pain-circuit",
  "name": "Social Pain / Social Reward Circuit (Opioid)",
  "from": "ACC, dACC / Social input",
  "to": "NAc (μ-opioid reward) / dACC, insula (κ-opioid pain)",
  "neurotransmitter": "endorphins, enkephalins (MOR), dynorphin (KOR)",
  "receptors": ["opioid-mu", "opioid-kappa"],
  "role": "Social connection and social loss are processed through the same opioid circuits as physical reward and pain. Social inclusion / positive connection → endorphin / enkephalin release → MOR activation in NAc → DA disinhibition → felt warmth and belonging. Social exclusion / rejection → dynorphin release → KOR activation in dACC and NAc → DA suppression → felt pain, dysphoria, social withdrawal. The social and physical pain overlap in the dACC is the neuroimaging-confirmed basis for the social pain metaphor becoming a neurochemical fact.",
  "conditions": {
    "adhd": "RSD (Rejection Sensitive Dysphoria) is a plausible opioid-circuit phenomenon: high MOR sensitivity means both the reward of acceptance and the pain of rejection are amplified. The emotional intensity of social loss in ADHD is not catastrophizing — it is high-gain opioid circuitry processing the loss at its full neurochemical weight.",
    "asd": "Reduced MOR activation from social stimuli reduces the approach-motivation to seek connection. Social contact is neither as rewarding (MOR) nor as painful when lost (KOR may be similarly reduced) — producing a different, not lesser, relationship to social engagement. The lack of visible social distress in some autistic people doesn't mean absence of social need; it may reflect lower-gain opioid social circuitry that registers the same social losses at a different intensity.",
    "ocd": "The compulsion-completion relief is MOR-mediated. The distress preceding it is partly KOR-mediated. This oscillation between opioid pain and opioid relief is a reinforcement mechanism that helps explain why OCD behaviors are so persistent despite the person's clear knowledge that they don't resolve the underlying obsession.",
    "cptsd": "Chronic KOR activation produces the emotional numbing and dissociative quality of CPTSD. The person can watch their own experience from a distance, feel things in a muffled way, or feel very little — this is dynorphin at work. It was protective during trauma. It becomes the thing that prevents felt connection, healing, and the ability to be inside one's own life.",
    "gad": "The opioid social pain circuit processes anticipated social rejection as partially equivalent to actual rejection — anticipatory anxiety in GAD may involve low-level dynorphin/KOR activation driven by imagined social loss, producing somatic anxiety that is chemically real, not merely cognitive.",
    "mdd": "The anhedonia of MDD is substantially a MOR-downregulation and KOR-upregulation state. The person cannot feel the rewards they know are present, and experiences a low-level dysphoric quality that KOR activation produces independent of external circumstances. This is why depression feels like a physical thing — because it partly is."
  },
  "mechanisms": ["social-pain", "social-reward", "hedonic-tone", "rejection-processing", "emotional-numbing", "dissociation"]
}
```

---

### Opioid System: Unnamed Experience Examples

**"The Cost of Connection"** *(ADHD + CPTSD)*
When they left the room, something that had been warm simply went cold. Not sadness, not exactly — more like a withdrawal, a physical absence where the warmth was. You're not sure if what you're feeling is missing them or missing what their presence did to your nervous system. The gap between presence and absence is a specific kind of hollow that doesn't seem proportional to the length of time they were there.

**"Watching From Behind Glass"** *(CPTSD + MDD)*
Something significant is happening. You know it is. You can observe yourself knowing it, can report on what you should feel about it. But the feeling isn't arriving — or it's arriving with a lag, or through several layers of material. You're not detached. You're present, technically. But the connection between what's occurring and the inside of your body has gone distant, like the signal is getting through but the receiver has been turned down.

**"The Relief That Isn't"** *(OCD)*
You did the thing. It's done. And for one breath, there's almost something — a loosening, a silence. But then the thought comes back, or its cousin comes back, and the relief dissolves so completely you begin to wonder if it was ever there. The brief quiet wasn't resolution. It was just the pause between one version of the loop and the next.

---

## Cross-System Interactions Summary

This section documents the most hypothesis-generative cross-system interactions — combinations most likely to produce unnamed experiences at their intersection.

### Interaction Map

| System A | System B | Key Interaction | Conditions Most Affected |
|---|---|---|---|
| HPA (CRH) | Dynorphin/KOR | Stress → CRH → dynorphin → numbing | CPTSD, MDD |
| eCB (CB1) | GABA-A | eCB retrograde suppresses GABA release (DSI) | ASD, GAD |
| Oxytocin | μ-Opioid | Social touch co-releases OT + endorphins | ASD, CPTSD, MDD |
| HPA (Cortisol) | Mesocortical DA | Stress cortisol → D1 downregulation → executive collapse | ADHD, CPTSD |
| GABA-A (PV+) | E/I Balance | Cortisol damages PV+ interneurons → E/I tips to excitation | ASD, CPTSD, GAD |
| eCB (anandamide) | HPA | Stress → FAAH upregulation → anandamide depletion → impaired stress termination | CPTSD, GAD |
| mGluR5 | NMDA | mGluR5 potentiates NMDA → amplifies excitatory gain | ASD, OCD, CPTSD |
| KOR (dynorphin) | Mesocortical DA | Stress → dynorphin → KOR → VTA DA suppression | MDD, CPTSD |
| Oxytocin (OXTR) | HPA | OT suppresses CRH/HPA → social contact = stress relief; disrupted in CPTSD | CPTSD, GAD |
| μ-Opioid | Mesolimbic DA | MOR in VTA disinhibits DA neurons → social reward is dopaminergic | ADHD, ASD, MDD |
| GABA-B | CSTC Glutamate | GABA-B failure → CSTC loop won't terminate | OCD, GAD |
| HPA | 5-HT Synthesis | Chronic cortisol suppresses tryptophan hydroxylase → less serotonin | MDD, CPTSD |

### High-Priority Hypothesis Targets

The following node intersections are underrepresented in the current named experience set and have strong multi-system neurochemical grounding:

1. **Shutdown vs. Dissociation** — ASD shutdown (sensory overwhelm → eCB/GABA protective inhibition) vs. CPTSD dissociation (KOR/dynorphin numbing). The phenomenology overlaps but the mechanisms differ. A hypothesis: people with ASD + CPTSD may experience both simultaneously, with different triggering conditions.

2. **Autistic Burnout as HPA Exhaustion** — The progressive failure of executive and emotional function after sustained social performance (masking) is consistent with chronic HPA activation → GR downregulation → cortisol dysregulation → PV+ interneuron damage → E/I balance tips → everything gets louder as the quieting system degrades.

3. **The Warmth That Doesn't Arrive** — MDD + ASD: reduced MOR social reward + reduced OXTR social reward + reduced DA social novelty = reaching for connection and finding the chemistry that should make it land has gone quiet on multiple channels simultaneously.

4. **Compulsive Comfort-Seeking** — ADHD + CPTSD + OCD: a pattern where emotional dysregulation (HPA/NE) drives urgent self-soothing behavior that temporarily activates MOR (completion/comfort relief) but sets up a KOR rebound — the comfort doesn't last, which drives more seeking.

5. **Sensory Grief** — ASD: the exhaustion and mourning that follows a period of forced sensory tolerance (a noisy event, a day of masking sensory response). Mechanistically: prolonged glutamatergic excitatory load without adequate eCB retrograde dampening → depletion of eCB resources → heightened sensitivity following the event, not before it. The world doesn't go back to manageable immediately. It gets harder first.

---

## Notes on Data Integration

When integrating these entries into `receptors.json` and `systems.json`:

- **IDs** use the format `system-receptor` (e.g., `gaba-a`, `ecb-cb1`, `ot-oxtr`, `hpa-gr`, `opioid-mu`)
- **Weight scale:** 0.0–1.0 where 0.3 = modest evidence, 0.5 = moderate relevance, 0.7 = well-documented role, 0.9+ = defining/central mechanism
- **Conditions coverage:** All six conditions (adhd, asd, ocd, cptsd, gad, mdd) are populated for every receptor — even where weight is low, the description notes why the receptor has limited involvement for that condition
- **Regions:** Use the atlas.json ID convention (short, lowercase, hyphenated for multi-word)
- **Mechanisms:** Use the mechanisms.json ID convention (verb-noun, hyphenated)

Receptors introduced here that require new mechanisms.json entries:
- `hpa-initiation`
- `stress-termination`
- `hpa-negative-feedback`
- `hpa-setpoint`
- `social-pain`
- `emotional-numbing`
- `dissociation`
- `retrograde-inhibition`
- `loop-termination`
- `loop-amplification`
- `sensory-gain-modulation`
- `neuroinflammation-modulation`
- `epigenetic-stress-encoding`
- `da-suppression-under-stress`
- `bdnf-suppression`
- `social-memory`
- `co-regulation`
- `trust-calibration`
