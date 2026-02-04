export interface Brand {
  id: string
  name: string
  logo?: string
  description: string
}

export interface BriefFormat {
  id: string
  name: string
  description: string
}

export interface BriefTemplate {
  brandId: string
  formatId: string
  content: string
}

// Available Brands
export const BRANDS: Brand[] = [
  {
    id: "boehringer-ingelheim",
    name: "Boehringer Ingelheim",
    description: "Global pharmaceutical company focused on human and animal health",
  },
]

// Available Brief Formats
export const BRIEF_FORMATS: BriefFormat[] = [
  {
    id: "prelaunch",
    name: "Pre-Launch",
    description: "For products awaiting regulatory approval or in launch preparation phase",
  },
  {
    id: "postlaunch",
    name: "Post-Launch",
    description: "For products already in market seeking growth or repositioning",
  },
  {
    id: "asundexian",
    name: "Asundexian Version",
    description: "Specific brief format for Asundexian (Factor XIa inhibitor) campaign",
  },
]

// Brief Templates by Brand + Format combination
export const BRIEF_TEMPLATES: BriefTemplate[] = [
  // Boehringer Ingelheim - Pre-Launch
  {
    brandId: "boehringer-ingelheim",
    formatId: "prelaunch",
    content: `CLIENT MARKETING BRIEF
(Pre-Creative / Pre-Agency Brief — Pre-Launch)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BRAND STATUS

Brand / Product Name: Asundexian
Client: Boehringer Ingelheim

Lifecycle Stage: Pre-Launch (Phase 3 trials ongoing)

Pre-Launch Details:
• Indication under review: Stroke prevention in patients with atrial fibrillation
• Expected label scope: Oral Factor XIa inhibitor with improved bleeding profile
• Key regulatory milestones:
  - Phase 3 OCEANIC-AF trial completion: Q3 2026
  - NDA submission: Q4 2026
  - Anticipated FDA approval: Q3 2027

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. BACKGROUND & BUSINESS CONTEXT

Category Context:
• DOACs (Direct Oral Anticoagulants) market valued at $25B+ globally
• Eliquis and Xarelto dominate with combined 80%+ market share
• Bleeding risk remains the primary barrier to anticoagulation adherence
• 30-40% of eligible AF patients remain untreated due to bleeding concerns
• Physicians increasingly cautious about anticoagulation in elderly patients

Brand Context (Pre-Launch):
• Intended role in therapy: First Factor XIa inhibitor offering stroke prevention WITHOUT increased bleeding
• Strategic reason for entering now:
  - Novel mechanism (Factor XIa) separates thrombosis from hemostasis
  - Phase 2 PACIFIC trials showed 67% reduction in bleeding vs. apixaban
  - Potential to unlock undertreated "bleeding-averse" patient population
  - First-mover advantage in new anticoagulant class

Why This Matters Now:
• DOACs have plateaued—physicians waiting for "next generation" solution
• Aging population means more AF patients with higher bleeding risk profiles
• Competitor Factor XIa programs 2-3 years behind Boehringer Ingelheim
• Window to establish category leadership before fast-followers arrive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. THE CORE BUSINESS PROBLEM

Pre-Launch Framing:
• How do we reframe anticoagulation from "necessary risk" to "confident protection"?
• How do we make physicians believe that effective stroke prevention WITHOUT bleeding risk is finally possible?
• How do we position Asundexian as a category creator, not just another anticoagulant?
• How do we reach the 30-40% of undertreated AF patients who fear bleeding more than stroke?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. OBJECTIVES

Primary Objective:
• Establish Asundexian as the first anticoagulant that separates stroke prevention from bleeding risk
• Build pre-launch awareness and anticipation among cardiologists and neurologists

Secondary Objectives:
• Position Boehringer Ingelheim as the innovator in next-generation anticoagulation
• Develop disease education around the "anticoagulation paradox" (fear of bleeding leads to undertreated stroke risk)
• Secure early KOL advocacy from thought leaders in AF management
• Achieve 15% market share within 24 months of launch

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. TARGET AUDIENCE

Primary Audience:
• Cardiologists managing AF patients (high-volume prescribers)
• Electrophysiologists specializing in arrhythmia management
• Neurologists treating stroke patients and secondary prevention

Audience Nuance (Pre-Launch):
• Many physicians frustrated with current DOAC limitations but skeptical of "too good to be true" claims
• Need scientific credibility first, then emotional permission to believe
• Early adopters want to be seen as forward-thinking; conservatives need peer validation

Secondary Audiences:
• Primary care physicians managing stable AF patients
• Hospitalists initiating anticoagulation post-AF diagnosis
• Clinical pharmacists influencing formulary decisions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. ANTICIPATED BRAND PERCEPTION (Pre-Launch)

What we believe HCPs will assume about us at launch:
• "Sounds too good to be true—what's the catch?"
• "Boehringer Ingelheim has credibility, but this is a bold claim"
• "I'll wait for real-world data before switching my patients"
• "Factor XIa is interesting science, but does it translate to clinical benefit?"

Category stereotypes we risk inheriting:
• "All anticoagulants cause bleeding—it's a trade-off"
• "New drugs always have hidden risks that emerge post-launch"
• "Marketing claims rarely match clinical reality"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. KEY INSIGHTS (Directional)

Clinical Tensions:
• The "anticoagulation paradox": Physicians often undertreat patients they perceive as high-bleeding-risk, paradoxically increasing stroke risk
• Bleeding events are visceral and memorable; strokes prevented are invisible
• Physicians feel personally responsible for bleeding complications in ways they don't for untreated strokes

Decision-Making Pressures:
• Defensive medicine drives conservative prescribing in elderly/frail patients
• Guidelines recommend anticoagulation, but clinical judgment often overrides
• Patients' fear of bleeding often mirrors (and reinforces) physician hesitancy

Unmet Needs Not Fully Addressed:
• A true "first, do no harm" anticoagulation option
• Confidence to treat the patients currently left untreated
• Freedom from the constant bleeding anxiety that shadows every anticoagulation decision

(Insights are hypotheses, not truths—agency validation expected.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. POSITIONING (Status)

Status: No formal positioning exists; agency to develop

Positioning Considerations:
• Intended role: Category-creating anticoagulant that finally separates efficacy from bleeding
• Degree of differentiation: High—new mechanism, new promise
• Must build credibility before aspiration; science must lead
• Elements that must remain consistent: Factor XIa mechanism story, bleeding separation data

Working direction (not final):
"The anticoagulant that changes the conversation from 'despite the bleeding risk' to 'without the bleeding risk.'"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. MANDATORIES & GUARDRAILS

Regulatory:
• Phase 3 data not yet available—cannot make efficacy claims
• Pre-launch communication limited to disease education and mechanism discussion
• No comparative claims vs. existing DOACs permitted until approval

Brand:
• Boehringer Ingelheim corporate brand standards apply
• Scientific rigor and credibility non-negotiable
• Hopeful but not hyperbolic tone

What to Avoid:
• Overpromising before Phase 3 data confirms hypothesis
• Fear-based messaging about bleeding with current therapies
• Dismissing existing DOACs (physicians have patients doing well on them)
• Creating unrealistic expectations that Phase 3 might not support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. DELIVERABLES (Pre-Launch)

• Pre-launch disease awareness campaign (Anticoagulation Paradox)
• Medical education on Factor XIa mechanism
• KOL engagement program and advisory boards
• Congress presence strategy (AHA, ACC, ESC)
• HCP anticipation-building campaign framework
• Internal alignment and sales force preparation materials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. TIMING & MILESTONES

• Agency briefing: Q1 2026
• Disease awareness campaign development: Q2 2026
• Phase 3 data readout: Q3 2026
• Pre-submission KOL engagement: Q4 2026
• NDA submission: Q4 2026
• Anticipated approval: Q3 2027
• Launch preparation: Q2-Q3 2027

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. SUCCESS METRICS

Pre-Launch:
• Awareness of "anticoagulation paradox" concept among target HCPs (target: 50%)
• Understanding of Factor XIa mechanism differentiation (target: 60% among cardiologists)
• KOL advocacy network established (target: 75+ engaged advocates)
• Media coverage positioning Asundexian as "next generation" anticoagulant

Year 1 Post-Launch:
• Market share: 15% within 24 months
• New patient starts in previously undertreated population
• Physician confidence scores in prescribing to "high-bleeding-risk" patients
• Formulary access: Tier 2 or better with 75% of commercial lives`,
  },

  // Boehringer Ingelheim - Post-Launch
  {
    brandId: "boehringer-ingelheim",
    formatId: "postlaunch",
    content: `CLIENT MARKETING BRIEF
(Pre-Creative / Pre-Agency Brief — Post-Launch / Growth Phase)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BRAND STATUS

Brand / Product Name: Jardiance (empagliflozin)
Client: Boehringer Ingelheim (co-marketed with Eli Lilly)

Lifecycle Stage: Post-Launch / Growth Phase (Launched 2014, expanded indications ongoing)

Current Market Position:
• Leading SGLT2 inhibitor with 35% market share in diabetes
• First-in-class for heart failure with reduced ejection fraction (HFrEF)
• Recently approved for chronic kidney disease (CKD)
• Global revenue: $7.2B (2025)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. BACKGROUND & BUSINESS CONTEXT

Category Context:
• SGLT2 inhibitor class has expanded from diabetes to cardio-renal protection
• Heart failure and CKD indications represent significant growth opportunity
• Farxiga (dapagliflozin) aggressively competing for cardiologist mindshare
• Cardiologists and nephrologists increasingly driving SGLT2 prescribing
• Primary care remains undertapped for cardio-renal protection messaging

Brand Context (Post-Launch):
• Current role in therapy: Established diabetes leader, growing cardio-renal presence
• Challenge: Extending brand relevance beyond "diabetes drug" perception
• Opportunity: New CKD indication opens access to nephrologists
• Threat: Farxiga gaining ground with "first-in-CKD" messaging

Why This Matters Now:
• CKD indication launch requires repositioning for new specialist audience
• Must defend diabetes leadership while expanding cardio-renal narrative
• Cardiologists increasingly see SGLT2s as "their drugs"—must maintain share of voice
• Patent considerations require accelerated market penetration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. THE CORE BUSINESS PROBLEM

Post-Launch Framing:
• How do we evolve Jardiance from "diabetes drug with heart benefits" to "cardio-metabolic-renal protection"?
• How do we win in cardiology and nephrology without losing diabetes core?
• How do we differentiate from Farxiga's aggressive "first-in-class" CKD positioning?
• How do we make the cardio-renal story simple enough for primary care adoption?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. OBJECTIVES

Primary Objective:
• Establish Jardiance as the SGLT2 of choice across diabetes, heart failure, AND CKD
• Drive adoption among nephrologists for the new CKD indication

Secondary Objectives:
• Protect and grow diabetes market share against biosimilar/generic pressure
• Increase cardiologist prescribing for HFrEF indication
• Build primary care confidence in initiating Jardiance for cardio-renal protection
• Achieve 40% SGLT2 market share across all indications by end of 2027

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. TARGET AUDIENCE

Primary Audiences:
• Nephrologists managing CKD patients (new indication focus)
• Cardiologists treating heart failure patients (growth opportunity)
• Endocrinologists managing type 2 diabetes (defense/retention)

Audience Nuance (Post-Launch):
• Nephrologists skeptical of "diabetes drugs"—need evidence-led, kidney-first messaging
• Cardiologists increasingly comfortable with SGLT2s but see category as interchangeable
• Endocrinologists loyal but distracted by GLP-1 agonist excitement

Secondary Audiences:
• Primary care physicians (volume opportunity, simpler messaging needed)
• Hospital formulary committees (multi-indication value story)
• Health system pharmacy directors (cost-effectiveness positioning)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. CURRENT BRAND PERCEPTION (Post-Launch)

What HCPs currently think about Jardiance:
• Endocrinologists: "My go-to SGLT2—solid efficacy, good experience"
• Cardiologists: "Good option for diabetic HF patients, interchangeable with Farxiga"
• Nephrologists: "Diabetes drug that happens to help kidneys—not designed for CKD"
• Primary Care: "Complicated mechanism, worried about initiating in complex patients"

Perception shifts needed:
• From "diabetes drug with benefits" → "cardio-renal protector that also treats diabetes"
• From "interchangeable with Farxiga" → "differentiated evidence and experience leader"
• From "specialist-initiated" → "appropriate for primary care initiation"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. KEY INSIGHTS (Directional)

Clinical Tensions:
• Organ-specific specialists resist drugs "from another specialty"
• The broader the indication, the less compelling it feels to any single audience
• Real-world outcomes data increasingly valued over trial extrapolation

Competitive Pressures:
• Farxiga's "first-in-CKD" narrative has penetrated nephrology
• GLP-1 excitement (Ozempic, etc.) is pulling mindshare from SGLT2s
• Payer pressure for step therapy and generic SGLT2 switches emerging

Unmet Needs Not Fully Addressed:
• A unified story that resonates across diabetes, cardiology, and nephrology
• Practical guidance for primary care initiation without specialist referral
• Clear differentiation beyond "me-too" SGLT2 messaging

(Insights are hypotheses, not truths—agency validation expected.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. POSITIONING (Status)

Status: Evolving positioning required for multi-indication reality

Current Positioning:
"Beyond glycemic control—cardiovascular and renal protection in one tablet"

Positioning Challenge:
• Current positioning diabetes-centric; needs evolution for cardio-renal audiences
• Must work across three different specialist mindsets
• Cannot abandon diabetes heritage while expanding relevance

Working direction (not final):
"One molecule, comprehensive protection—from metabolism to heart to kidneys."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. MANDATORIES & GUARDRAILS

Regulatory:
• Must align with approved indication language for each condition
• CV and renal claims must reference appropriate trial data (EMPA-REG, EMPEROR, EMPA-KIDNEY)
• Combination messaging requires careful regulatory review

Brand:
• Boehringer Ingelheim/Lilly co-brand requirements
• Established Jardiance visual identity to be maintained
• Scientific credibility paramount

What to Avoid:
• Undermining diabetes core while chasing new indications
• Generic "cardio-renal" messaging that doesn't differentiate from Farxiga
• Oversimplification that loses specialist credibility
• Fear-based disease messaging

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. DELIVERABLES (Post-Launch)

• Updated brand positioning platform for multi-indication reality
• Nephrology-specific launch campaign for CKD indication
• Cardiology campaign refresh emphasizing differentiation
• Primary care simplified messaging and initiation support
• Sales force training on multi-specialist selling
• Digital engagement programs by specialty
• Real-world evidence communication strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. TIMING & MILESTONES

• Agency briefing: Q1 2026
• Positioning evolution finalized: Q2 2026
• CKD launch campaign in market: Q2 2026
• Cardiology campaign refresh: Q3 2026
• Primary care initiative launch: Q4 2026
• Integrated multi-specialty campaign: 2027

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. SUCCESS METRICS

CKD Launch:
• Nephrologist awareness of Jardiance CKD indication: 80% within 6 months
• New CKD prescriptions: 25% of new Jardiance starts by Q4 2026
• Share of voice vs. Farxiga in nephrology: parity or better

Overall Brand:
• Total SGLT2 market share: 40% by end of 2027
• Cardiologist prescribing growth: 15% YoY
• Primary care initiation rate: 20% increase
• Brand perception shift tracking across all three specialist audiences`,
  },

  // Boehringer Ingelheim - Asundexian Version (specific campaign)
  {
    brandId: "boehringer-ingelheim",
    formatId: "asundexian",
    content: `CLIENT MARKETING BRIEF
(Pre-Creative / Pre-Agency Brief — Asundexian Campaign)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASUNDEXIAN: THE FACTOR XIa INHIBITOR BRIEF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. THE MOLECULE & THE PROMISE

Product: Asundexian (BAY 2433334)
Class: Oral Factor XIa Inhibitor
Developer: Boehringer Ingelheim

The Scientific Breakthrough:
Asundexian represents a paradigm shift in anticoagulation. By selectively inhibiting Factor XIa, it targets the amplification loop of the coagulation cascade while sparing the initiation pathway critical for hemostasis. In plain terms: it prevents pathological clots (thrombosis) without significantly impairing the body's ability to stop bleeding (hemostasis).

Why Factor XIa:
• Factor XI deficiency (Hemophilia C) patients have natural protection against thrombosis
• These same patients rarely experience severe bleeding, even during surgery
• Nature has demonstrated that Factor XI is "druggable" with an acceptable safety margin
• Asundexian brings this natural protection to patients pharmacologically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. THE CLINICAL EVIDENCE STORY

PACIFIC Program (Phase 2):
• PACIFIC-AF: Asundexian vs. apixaban in atrial fibrillation
  - 67% relative reduction in bleeding (major + clinically relevant non-major)
  - Comparable prevention of covert brain lesions on MRI
  
• PACIFIC-STROKE: Asundexian in recent non-cardioembolic stroke
  - 50% reduction in bleeding vs. standard antiplatelet therapy
  - Exploratory efficacy signals encouraging

Phase 3 Program (Ongoing):
• OCEANIC-AF: 18,000-patient trial vs. apixaban in AF
  - Primary endpoint: stroke/systemic embolism with bleeding safety
  - Readout expected: Q3 2026
  
• OCEANIC-STROKE: Secondary stroke prevention study
  - Dual pathway inhibition (Asundexian + antiplatelet)
  - Potential to expand treatable population

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. THE MARKET OPPORTUNITY

The Anticoagulation Paradox:
• 37.5 million people worldwide have atrial fibrillation
• AF increases stroke risk 5x—anticoagulation reduces risk by 60-70%
• YET: 30-40% of AF patients who should be anticoagulated are NOT treated
• Primary reason for undertreatment: Physician and patient fear of bleeding

The Undertreated Population:
• Elderly patients (perceived as "too fragile")
• Patients with prior bleeding history
• Patients on concurrent antiplatelet therapy
• Patients where physicians "don't want to take the risk"

These patients have the HIGHEST stroke risk but the LOWEST treatment rates.
Asundexian could unlock this paradox by offering protection without the bleeding trade-off.

Market Size:
• Global anticoagulant market: $45B+ by 2027
• Addressable undertreated AF population: ~15 million patients globally
• First-mover Factor XIa inhibitor advantage: 2-3 year lead vs. competitors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. THE COMPETITIVE LANDSCAPE

Current Standard of Care:
• Eliquis (apixaban) - Bristol-Myers Squibb/Pfizer - Market leader, $20B+ revenue
• Xarelto (rivaroxaban) - Bayer/Janssen - Strong hospital presence
• Pradaxa (dabigatran) - Boehringer Ingelheim - First DOAC, reversible
• Warfarin - Generic, still used in 20%+ of AF patients

All current anticoagulants share the same limitation: They prevent clots by impairing hemostasis. More effective stroke prevention = more bleeding risk. This is the trade-off that has defined anticoagulation for decades.

Factor XIa Competitive Set:
• Milvexian (Bristol-Myers Squibb/Janssen) - Phase 3, 2-3 years behind
• Abelacimab (Anthos Therapeutics) - Antibody approach, monthly injection
• Asundexian has first-mover oral Factor XIa advantage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. THE COMMUNICATION CHALLENGE

The Central Tension:
Physicians have been trained for decades that anticoagulation is a trade-off. "No bleeding, no clot prevention" is deeply ingrained. Asundexian challenges this fundamental belief.

The Skepticism We Must Overcome:
• "If it sounds too good to be true, it probably is"
• "Every new anticoagulant promised to be safer"
• "I'll wait for the Phase 3 data / real-world evidence"
• "My patients are doing fine on apixaban—why switch?"

The Opportunity:
When Phase 3 data confirms the Phase 2 promise, physicians will have permission to believe. Our task is to:
1. Pre-establish the Factor XIa mechanism story (so data lands in prepared minds)
2. Frame the "anticoagulation paradox" (so the unmet need is visible)
3. Position Asundexian as the answer physicians have been waiting for

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. TARGET AUDIENCES & MINDSETS

Primary Targets:

CARDIOLOGISTS (Electrophysiologists, General Cardiologists)
• Manage the majority of AF patients
• Comfortable with anticoagulation but frustrated by bleeding events
• Early adopters if data is compelling
• Key question: "Will this let me treat my patients more confidently?"

NEUROLOGISTS (Vascular Neurologists, Stroke Specialists)
• See the devastating consequences of untreated AF (stroke)
• Also see the consequences of bleeding (intracranial hemorrhage)
• Highly evidence-driven, skeptical of marketing
• Key question: "Will this actually reduce strokes without ICH?"

Secondary Targets:

HEMATOLOGISTS
• Understand Factor XIa biology deeply
• Influential in academic centers and formulary decisions
• Appreciate the elegance of the mechanism

PRIMARY CARE / INTERNISTS
• Manage stable AF patients long-term
• Often inherit anticoagulation decisions from specialists
• Want simplicity and safety reassurance
• Key question: "Is this safe enough for me to prescribe confidently?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. STRATEGIC MESSAGING PILLARS

Pillar 1: THE SCIENCE
Factor XIa inhibition separates thrombosis from hemostasis—targeting pathological clots while preserving the body's natural ability to stop bleeding.

Pillar 2: THE EVIDENCE
Phase 2 data demonstrated 67% reduction in bleeding vs. apixaban with comparable efficacy signals. Phase 3 will confirm whether this translates to clinical practice.

Pillar 3: THE UNMET NEED
Millions of patients remain untreated because the current trade-off is unacceptable. Asundexian could finally give physicians the confidence to protect these patients.

Pillar 4: THE PROMISE
Anticoagulation without the constant anxiety about bleeding. Protection without the trade-off.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. CAMPAIGN TERRITORIES TO EXPLORE

Territory A: "The Trade-Off Ends Here"
Acknowledge the historical compromise, position Asundexian as the breakthrough that finally breaks it.

Territory B: "Confidence to Protect"
Focus on the physician experience—the relief of being able to offer protection without bleeding anxiety.

Territory C: "The Patients You've Been Waiting to Treat"
Spotlight the undertreated population and the opportunity to finally reach them.

Territory D: "Nature's Blueprint"
Lead with the elegant science—Factor XI deficiency patients as proof of concept.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. MANDATORIES & CONSTRAINTS

Regulatory (Pre-Phase 3 Data):
• Cannot make efficacy claims until Phase 3 readout
• Mechanism education and disease awareness only
• No direct comparative claims vs. existing anticoagulants

Scientific Integrity:
• All claims must be supportable by published data
• Acknowledge Phase 3 data is pending
• No hyperbole—let the data speak

Brand Requirements:
• Boehringer Ingelheim corporate standards
• Consistent visual and verbal identity with broader BI portfolio
• Global consistency with local adaptation flexibility

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. KEY MILESTONES

2026:
• Q1: Agency briefing, campaign development begins
• Q2: Disease awareness campaign launch (pre-data)
• Q3: OCEANIC-AF Phase 3 data readout
• Q4: NDA submission (if data positive)

2027:
• Q2-Q3: Anticipated FDA approval
• Q3: Launch campaign activation
• Q4: First full quarter of commercial availability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. SUCCESS METRICS

Pre-Launch (2026):
• Factor XIa mechanism awareness among cardiologists: 60%
• "Anticoagulation paradox" concept recognition: 50%
• KOL advocacy network: 75+ engaged thought leaders
• Congress presence/share of voice: Top 3 at AHA, ACC, ESC

Launch Year (2027-2028):
• Market share among new AF anticoagulation starts: 15% by end of Year 1
• Prescribing in previously undertreated patients: Track as key differentiator
• Physician confidence scores: Measurable improvement vs. baseline
• Safety perception vs. DOACs: Clear differentiation in tracking studies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE BRIEF QUESTION:

How do we prepare the market to believe that effective anticoagulation without increased bleeding is finally possible—and position Asundexian as the answer when Phase 3 data confirms the promise?`,
  },
]

// Helper function to get brief content by brand and format
export function getBriefTemplate(brandId: string, formatId: string): string | null {
  const template = BRIEF_TEMPLATES.find(
    (t) => t.brandId === brandId && t.formatId === formatId
  )
  return template?.content || null
}
