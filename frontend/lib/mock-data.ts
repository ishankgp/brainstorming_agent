import type {
  ChallengeFormat,
  DiagnosticRule,
  EvaluationDimension,
  GenerationResult,
  EvaluationResult,
  DimensionScore,
  ResearchDocument,
  ResearchReference,
} from "./types"

// Pre-Launch Marketing Brief using structured format
export const SAMPLE_BRIEF = `CLIENT MARKETING BRIEF
(Pre-Creative / Pre-Agency Brief — Pre-Launch)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BRAND STATUS

Brand / Product Name: Velozia (enzalutinib)

Lifecycle Stage: Pre-Launch (Approval expected: September 2026)

Pre-Launch Details:
• Indication under review: First-line treatment for adults with EGFR-mutated metastatic NSCLC
• Expected label scope: Oral, once-daily targeted therapy with CNS penetration claims
• Key regulatory milestones:
  - FDA Advisory Committee: July 2026
  - PDUFA date: September 2026
  - EU filing: Q4 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. BACKGROUND & BUSINESS CONTEXT

Category Context:
• Tagrisso (osimertinib) dominates with 62% market share and $5.2B annual revenue
• EGFR TKI category perceived as mature with established treatment paradigms
• Brain metastases present in 25-40% of EGFR+ patients—a critical unmet need
• Increasing payer scrutiny on high-cost oncology therapies
• NCCN guidelines heavily favor Tagrisso as first-line standard

Brand Context (Pre-Launch):
• Intended role in therapy: Confident first-line alternative with superior CNS protection
• Strategic reason for entering now:
  - Phase 3 data shows 18.9 months PFS vs 10.2 months SOC
  - CNS efficacy data is category-leading (24.3 months CNS-PFS)
  - Better tolerability profile (28% Grade 3+ AEs vs 41% for competitors)
  - Competitive pricing strategy (15% below Tagrisso)

Why This Matters Now:
• Launch window requires clear differentiation before being dismissed as "another TKI"
• Tagrisso's 8-year head start means HCP habits are deeply entrenched
• Must establish CNS protection story before competitors address this gap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. THE CORE BUSINESS PROBLEM

Pre-Launch Framing:
• How do we enter a market where Tagrisso is the reflexive first choice?
• How do we make CNS protection a decision-driver, not a nice-to-have?
• How do we establish credibility with oncologists who have no relationship with Meridian Biopharmaceuticals?
• How do we avoid being positioned as "Tagrisso-lite" or a second-line fallback?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. OBJECTIVES

Primary Objective:
• Establish a distinct, credible launch positioning centered on CNS protection
• Drive early HCP consideration and formulary readiness

Secondary Objectives:
• Shape perception of Velozia as "the thinking oncologist's choice"
• Equip 180 oncology specialists with a confident, focused launch story
• Build advocacy network of 50+ KOLs before commercial availability
• Achieve 8% market share by end of Year 1 ($420M revenue)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. TARGET AUDIENCE

Primary Audience:
• Medical oncologists specializing in thoracic malignancies
• High-volume community oncologists (12+ EGFR+ patients/month)
• Academic oncologists at NCI-designated cancer centers

Audience Nuance (Pre-Launch):
• Education and mindset shaping required—many oncologists underestimate brain metastasis risk
• Need to reach both early adopters AND thoughtful conservatives
• Must prepare the market for a new option without creating confusion

Secondary Audiences:
• Pulmonologists involved in early-stage diagnosis
• Oncology nurse navigators influencing treatment discussions
• Hospital pharmacists managing formulary decisions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. ANTICIPATED BRAND PERCEPTION (Pre-Launch)

What we believe HCPs will assume about us at launch:
• "Another EGFR TKI—what's the difference?"
• "Probably works, but why switch from what I know?"
• "Smaller company, less support infrastructure"
• "CNS data sounds good, but Tagrisso works fine for my patients"

Category stereotypes we risk inheriting:
• New entrants are often seen as "me-too" until proven otherwise
• Smaller companies perceived as less reliable for long-term support
• Oral TKIs all blend together in crowded category

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. KEY INSIGHTS (Directional)

Clinical Tensions:
• Brain metastases remain the silent fear in EGFR+ NSCLC—progression often means cognitive decline
• Many oncologists don't proactively discuss CNS risk until symptoms appear
• Tolerability matters more than HCPs admit—dose modifications disrupt patient confidence

Decision-Making Pressures:
• Time-starved oncologists default to familiar agents
• Guideline adherence is a safety net; deviation requires justification
• Payer restrictions increasingly dictate first-line choices

Unmet Needs Not Fully Addressed:
• Proactive CNS protection is discussed but rarely acted upon
• Patients want to "stay on therapy longer" without debilitating side effects
• HCPs want confidence, not just data—reassurance that they're making the right call

(Insights are hypotheses, not truths—agency validation expected.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. POSITIONING (Status)

Status: No formal positioning exists; agency to develop

Positioning Considerations:
• Intended role: Confident first-line alternative for oncologists who prioritize CNS protection
• Degree of differentiation: Moderate-to-high, but must be credibility-first
• Must balance clinical ambition with launch-appropriate restraint
• Elements that must remain consistent: CNS efficacy story, tolerability advantage

Working direction (not final):
"For oncologists who refuse to wait for brain metastases to become a problem."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. MANDATORIES & GUARDRAILS

Regulatory:
• Approved indication language pending—first-line EGFR+ mNSCLC expected
• CNS claims permitted based on secondary endpoint data
• No direct comparative superiority claims vs. Tagrisso at launch

Brand:
• Meridian Biopharmaceuticals brand standards apply
• Scientific, confident tone—avoid fear-based messaging
• Visual identity in development; agency input welcome

What to Avoid:
• Over-promising efficacy before long-term data available
• Fear-based brain metastasis messaging that alarms patients
• Aggressive competitive positioning that invites backlash
• Lifestyle or patient journey storytelling (HCP-focused campaign)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. DELIVERABLES (Pre-Launch)

• Launch campaign territory and creative platform
• Core visual and narrative system
• Disease education framework (CNS risk in EGFR+ NSCLC)
• Brand introduction materials for HCPs
• Sales force training and message pull-through
• Congress presence strategy (ASCO, ESMO)
• Digital HCP engagement platform foundation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. TIMING & MILESTONES

• Agency briefing: January 2026
• Concept development: February-March 2026
• Advisory board meetings with top 30 KOLs: May 2026
• ASCO presentation of Phase 3 data: July 2026
• Internal/legal review cycles: Ongoing
• FDA approval (anticipated): September 2026
• Launch week activities: September 2026
• Payer contracting completion: Q4 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. SUCCESS METRICS

Pre-Launch:
• Message clarity and recall in launch research (target: 70%+ unaided recall of CNS story)
• Sales force readiness scores (target: 90% confident in core message delivery)
• Early awareness among target oncologists (target: 65% aided awareness by launch)
• KOL advocacy network (target: 50+ engaged advocates)

Year 1 Post-Launch:
• Market share: 8% by end of Year 1
• New patient starts: Track monthly velocity
• Formulary access: Tier 2 or better with 80% of commercial lives
• NCCN Guideline inclusion: Category 1 recommendation`

// ============================================
// THE 12 "HOW CAN WE…" CHALLENGE FORMATS
// ============================================

export const DEFAULT_FORMATS: ChallengeFormat[] = [
  // CORE FORMATS (1-8)
  {
    id: "F01",
    name: "Core Mindset-Shift",
    format_template:
      "How can we help [TARGET AUDIENCE] move from [CURRENT MINDSET / BEHAVIOR] to [DESIRED MINDSET / BEHAVIOR], without [KEY FEAR, RISK, OR BARRIER]?",
    when_to_use: [
      "Behavior is entrenched",
      "Change feels risky",
      "Tradeoffs dominate decision-making",
    ],
    example:
      "How can we help physicians move from habitual prescribing to deliberate stroke prevention, without increasing fear of bleeding risk?",
    category: "core",
  },
  {
    id: "F02",
    name: "Reframing",
    format_template:
      "How can we reframe [CURRENT BELIEF] as [NEW, MORE EMPOWERING BELIEF]?",
    when_to_use: [
      "Mental models are outdated",
      "Education alone won't shift behavior",
      "The category is stuck in a narrative",
    ],
    example:
      "How can we reframe early intervention as responsible care rather than escalation?",
    category: "core",
  },
  {
    id: "F03",
    name: "Permission-Giving",
    format_template:
      "How can we give [TARGET AUDIENCE] permission to [DESIRED ACTION] without violating their sense of caution or responsibility?",
    when_to_use: [
      'Audience already "knows" but hesitates',
      "Emotional or professional risk dominates",
      "Fear of judgment or blame is present",
    ],
    example:
      "How can we give dermatologists permission to treat earlier without compromising long-term safety confidence?",
    category: "core",
  },
  {
    id: "F04",
    name: "Role-Clarification",
    format_template:
      "How can we clearly define our role in [JOURNEY / DECISION MOMENT] without overreaching beyond our evidence?",
    when_to_use: [
      "Category is crowded",
      "Differentiation comes from timing",
      '"Why this now?" is unclear',
    ],
    example:
      "How can we define this therapy's role at a critical treatment moment without overstating its breadth?",
    category: "core",
  },
  {
    id: "F05",
    name: "Differentiation-Through-Restraint",
    format_template:
      "How can we stand apart by focusing on [SPECIFIC STRENGTH] instead of [CATEGORY NORM]?",
    when_to_use: [
      "Competitors are over-claiming",
      "Trust and credibility matter most",
      "The brand wins by not being everything",
    ],
    example:
      "How can we stand apart by focusing on dependable prevention rather than maximal claims?",
    category: "core",
  },
  {
    id: "F06",
    name: "Simplification",
    format_template:
      "How can we simplify [COMPLEX DECISION / INFORMATION] so that [TARGET AUDIENCE] can act with confidence?",
    when_to_use: [
      "Decision fatigue is high",
      "Data overload is paralyzing action",
      "The brand's value is clarity",
    ],
    example:
      "How can we simplify treatment sequencing so oncologists can act decisively?",
    category: "core",
  },
  {
    id: "F07",
    name: "Confidence-Building",
    format_template:
      "How can we reinforce confidence in [DESIRED DECISION / BEHAVIOR] when [EXTERNAL PRESSURE OR DOUBT] is working against it?",
    when_to_use: [
      "Belief exists but is eroding",
      "Competitive or policy pressure creates doubt",
      "Creative must reassure, not persuade",
    ],
    example:
      "How can we reinforce confidence in oral therapies when injectables dominate the conversation?",
    category: "core",
  },
  {
    id: "F08",
    name: "Redefining Success",
    format_template:
      'How can we redefine what "success" looks like in [CATEGORY / CONDITION] beyond [TRADITIONAL METRIC]?',
    when_to_use: [
      "Outcomes are narrowly defined",
      "The brand offers broader or longer-term value",
      "The category optimizes the wrong metric",
    ],
    example:
      "How can we redefine success in psoriasis beyond short-term clearance?",
    category: "core",
  },
  // EDGE-CASE FORMATS (9-12) - The 10% that most frameworks miss
  {
    id: "F09",
    name: "Risk-of-Inaction",
    format_template:
      "How can we make the cost of not acting visible without resorting to fear or alarmism?",
    when_to_use: [
      "Inertia is the biggest threat",
      'Status quo feels "safe"',
      "Under-treatment is normalized",
    ],
    example:
      "How can we make the long-term cost of untreated inflammation visible without exaggeration?",
    category: "edge-case",
  },
  {
    id: "F10",
    name: "Trust-Repair",
    format_template:
      "How can we rebuild trust in [CATEGORY / BRAND / APPROACH] without defending past assumptions?",
    when_to_use: [
      "Category or mechanism has lost credibility",
      "Skepticism is emotional, not rational",
      "Over-explaining makes things worse",
    ],
    example:
      "How can we rebuild trust in oral therapies without dismissing past limitations?",
    category: "edge-case",
  },
  {
    id: "F11",
    name: "Paradigm-Shift",
    format_template:
      "How can we help the audience let go of [OLD PARADIGM] and adopt [NEW PARADIGM] without feeling reckless or irresponsible?",
    when_to_use: [
      "Standards of care are changing",
      'The audience risks being "left behind"',
      "Identity and expertise are threatened",
    ],
    example:
      "How can we help oncologists move beyond line-of-therapy thinking without undermining clinical rigor?",
    category: "edge-case",
  },
  {
    id: "F12",
    name: "Behavior-Maintenance",
    format_template:
      "How can we help [TARGET AUDIENCE] stay committed to [DESIRED BEHAVIOR] over time, even when urgency fades?",
    when_to_use: [
      "Initial adoption is strong, but persistence lags",
      "The work is about durability, not conversion",
      "Success requires long-term reinforcement",
    ],
    example:
      "How can we help physicians remain committed to preventive care even when patients appear stable?",
    category: "edge-case",
  },
]

// ============================================
// DIAGNOSTIC DECISION TREE (CHEAT SHEET)
// ============================================

export const DEFAULT_DIAGNOSTIC_RULES: DiagnosticRule[] = [
  {
    id: "R01",
    problem: "Habit or inertia",
    format_id: "F01",
    format_name: "Core Mindset-Shift",
  },
  {
    id: "R02",
    problem: "Wrong belief",
    format_id: "F02",
    format_name: "Reframing",
  },
  {
    id: "R03",
    problem: "Fear of acting",
    format_id: "F03",
    format_name: "Permission-Giving",
  },
  {
    id: "R04",
    problem: '"Why this now?"',
    format_id: "F04",
    format_name: "Role-Clarification",
  },
  {
    id: "R05",
    problem: "Over-claiming category",
    format_id: "F05",
    format_name: "Differentiation-Through-Restraint",
  },
  {
    id: "R06",
    problem: "Data overload",
    format_id: "F06",
    format_name: "Simplification",
  },
  {
    id: "R07",
    problem: "Eroding confidence",
    format_id: "F07",
    format_name: "Confidence-Building",
  },
  {
    id: "R08",
    problem: "Narrow outcomes",
    format_id: "F08",
    format_name: "Redefining Success",
  },
  {
    id: "R09",
    problem: "Inaction feels safe",
    format_id: "F09",
    format_name: "Risk-of-Inaction",
  },
  {
    id: "R10",
    problem: "Credibility damaged",
    format_id: "F10",
    format_name: "Trust-Repair",
  },
  {
    id: "R11",
    problem: "Standards changing",
    format_id: "F11",
    format_name: "Paradigm-Shift",
  },
  {
    id: "R12",
    problem: "Drop-off over time",
    format_id: "F12",
    format_name: "Behavior-Maintenance",
  },
]

// ============================================
// EVALUATION FRAMEWORK (8 DIMENSIONS)
// ============================================

export const EVALUATION_DIMENSIONS: EvaluationDimension[] = [
  {
    id: "E01",
    name: "Business Relevance",
    key_question:
      "Does this Challenge directly address the primary business problem defined in the Client Marketing Brief and Integrated Launch Plan?",
    what_to_check: [
      "Alignment with stated launch or growth objectives",
      "Clear line of sight to success metrics (trial, adoption, readiness, etc.)",
      "Addresses the biggest barrier, not a secondary symptom",
    ],
    red_flags: [
      "Challenge sounds insightful but doesn't move KPIs",
      "Solves for awareness when the plan calls for conversion",
      'Feels "nice to have" rather than mission-critical',
    ],
    weight: "high",
    is_non_negotiable: false,
  },
  {
    id: "E02",
    name: "Audience Truth",
    key_question:
      "Is this Challenge grounded in how the target audience actually thinks and behaves?",
    what_to_check: [
      "Consistency with qualitative research, field insights, advisory boards",
      "Resonance with known motivations, fears, and pressures",
      "Realistic portrayal of decision-making context",
    ],
    red_flags: [
      "Challenge reflects internal brand frustration, not audience reality",
      "Over-intellectualized or abstract",
      'Requires the audience to behave "unlike themselves"',
    ],
    weight: "high",
    is_non_negotiable: true,
  },
  {
    id: "E03",
    name: "Insight Strength",
    key_question:
      "Is the Challenge rooted in a true insight, not an observation or assumption?",
    what_to_check: [
      "Tension or contradiction in beliefs or behaviors",
      "Something the audience feels but rarely articulates",
      '"Why now" pressure evidence',
    ],
    red_flags: [
      'Restates category facts ("It\'s a crowded market")',
      "Describes the brand problem, not the human problem",
      "Could apply equally to every competitor",
    ],
    weight: "high",
    is_non_negotiable: false,
  },
  {
    id: "E04",
    name: "Data & Evidence Alignment",
    key_question:
      "Can this Challenge be credibly supported by the brand's data and evidence base?",
    what_to_check: [
      "Compatibility with clinical data and label",
      "Support from real-world evidence or experience",
      "Alignment with what sales teams can confidently say",
    ],
    red_flags: [
      "Requires claims or implications the data can't support",
      "Forces creative to stretch or imply",
      "Depends on future data not yet available (especially pre-launch)",
    ],
    weight: "medium",
    is_non_negotiable: true,
  },
  {
    id: "E05",
    name: "Lifecycle Appropriateness",
    key_question:
      "Is this Challenge appropriate for the brand's lifecycle stage?",
    what_to_check: [
      "Pre-Launch: Establishes clarity and credibility",
      "Pre-Launch: Avoids over-promising or over-positioning",
      "Post-Launch: Addresses real market feedback",
      "Post-Launch: Allows evolution without identity whiplash",
    ],
    red_flags: [
      "Feels too bold or disruptive for launch",
      "Feels too conservative for a stalled brand",
      "Ignores launch timing or market maturity",
    ],
    weight: "medium",
    is_non_negotiable: false,
  },
  {
    id: "E06",
    name: "Strategic Focus",
    key_question:
      "Is the Challenge singular, or is it trying to solve too much?",
    what_to_check: [
      "One primary tension, not a list",
      "Clear prioritization over secondary issues",
      "Creative can realistically address it",
    ],
    red_flags: [
      'Multiple "ands"',
      "Attempts to fix messaging, perception, and behavior at once",
      "Requires multiple Challenge formats simultaneously",
    ],
    weight: "medium",
    is_non_negotiable: false,
  },
  {
    id: "E07",
    name: "Creative Solvability",
    key_question:
      "Can this Challenge be meaningfully addressed by creative communication?",
    what_to_check: [
      "Creative ideas can plausibly shift perception or belief",
      "The Challenge doesn't depend on access, price, or logistics",
      "Allows for multiple creative territories",
    ],
    red_flags: [
      "Root cause is policy, reimbursement, or supply",
      "Would require sales force behavior change, not messaging",
      "Leads to purely rational or didactic communication",
    ],
    weight: "high",
    is_non_negotiable: true,
  },
  {
    id: "E08",
    name: "Longevity & Scalability",
    key_question:
      "Can this Challenge support sustained creative work over time?",
    what_to_check: [
      "Relevance beyond a single campaign",
      "Ability to flex across channels and audiences",
      "Durability as the brand matures",
    ],
    red_flags: [
      "Too tied to a momentary message or data point",
      "Overly tactical",
      "Burns itself out in one execution",
    ],
    weight: "medium",
    is_non_negotiable: false,
  },
]

// ============================================
// SAMPLE RESEARCH DOCUMENTS
// ============================================

export const SAMPLE_RESEARCH_DOCUMENTS: ResearchDocument[] = [
  {
    id: "RD001",
    name: "VELOZIA Phase 3 Clinical Trial Results - CLARITY Study",
    type: "clinical-trial",
    file_type: "pdf",
    description:
      "Primary efficacy and safety data from the pivotal Phase 3 CLARITY trial comparing enzalutinib vs. standard of care in EGFR-mutated NSCLC.",
    uploaded_at: "2025-11-15",
    size_kb: 4250,
  },
  {
    id: "RD002",
    name: "EGFR+ NSCLC Market Landscape Analysis 2025",
    type: "market-research",
    file_type: "pptx",
    description:
      "Comprehensive market analysis including competitor positioning, market share dynamics, and prescriber behavior patterns.",
    uploaded_at: "2025-10-20",
    size_kb: 8900,
  },
  {
    id: "RD003",
    name: "HCP Prescribing Behavior Survey - Thoracic Oncologists",
    type: "patient-insights",
    file_type: "pdf",
    description:
      "Quantitative survey of 450 medical oncologists on treatment decision factors for EGFR+ NSCLC.",
    uploaded_at: "2025-09-08",
    size_kb: 2100,
  },
  {
    id: "RD004",
    name: "Tagrisso Competitive Intelligence Dossier",
    type: "competitor-analysis",
    file_type: "pdf",
    description:
      "Detailed analysis of AstraZeneca's Tagrisso positioning, messaging, and market defense strategies.",
    uploaded_at: "2025-08-25",
    size_kb: 3400,
  },
  {
    id: "RD005",
    name: "Patient Journey Mapping - EGFR+ NSCLC Diagnosis to Treatment",
    type: "patient-insights",
    file_type: "pptx",
    description:
      "Qualitative research on the patient experience from diagnosis through treatment initiation and ongoing management.",
    uploaded_at: "2025-07-12",
    size_kb: 5600,
  },
  {
    id: "RD006",
    name: "Regulatory Submission Package Summary - FDA NDA",
    type: "regulatory",
    file_type: "pdf",
    description:
      "Summary of FDA new drug application including approved indications, labeling language, and promotional guidelines.",
    uploaded_at: "2025-12-01",
    size_kb: 1800,
  },
]

// Generate mock research references for evaluation
export const generateMockResearchReferences = (): ResearchReference[] => {
  const numRefs = Math.floor(Math.random() * 3) + 1 // 1-3 references
  const shuffled = [...SAMPLE_RESEARCH_DOCUMENTS].sort(
    () => Math.random() - 0.5
  )
  return shuffled.slice(0, numRefs).map((doc) => ({
    document_id: doc.id,
    document_name: doc.name,
    relevant_insight: doc.description,
    relevance_score: Math.floor(Math.random() * 2) + 4, // 4-5
  }))
}

// ============================================
// MOCK EVALUATION GENERATOR
// ============================================

export const generateMockEvaluation = (
  includeResearch = false
): EvaluationResult => {
  const dimensionScores: DimensionScore[] = EVALUATION_DIMENSIONS.map((dim) => {
    const score = Math.floor(Math.random() * 2) + 4 // 4-5 for passing
    return {
      dimension_id: dim.id,
      score,
      notes: score >= 4 ? "Meets criteria" : "Needs improvement",
      has_red_flags: score < 3,
    }
  })

  const totalScore = dimensionScores.reduce((sum, d) => sum + d.score, 0)
  const maxScore = dimensionScores.length * 5

  // Calculate weighted score
  let weightedTotal = 0
  let weightSum = 0
  dimensionScores.forEach((ds) => {
    const dim = EVALUATION_DIMENSIONS.find((d) => d.id === ds.dimension_id)
    const weight = dim?.weight === "high" ? 3 : 2
    weightedTotal += ds.score * weight
    weightSum += 5 * weight
  })

  const failedNonNegotiables = EVALUATION_DIMENSIONS.filter((dim) => {
    if (!dim.is_non_negotiable) return false
    const score = dimensionScores.find((d) => d.dimension_id === dim.id)?.score
    return score !== undefined && score < 3
  }).map((dim) => dim.name)

  return {
    dimension_scores: dimensionScores,
    total_score: totalScore,
    weighted_score: Math.round((weightedTotal / weightSum) * 100),
    passes_non_negotiables: failedNonNegotiables.length === 0,
    failed_non_negotiables: failedNonNegotiables,
    recommendation:
      failedNonNegotiables.length > 0
        ? "reject"
        : totalScore / maxScore >= 0.7
          ? "proceed"
          : "revise",
    research_references: includeResearch
      ? generateMockResearchReferences()
      : undefined,
  }
}

// ============================================
// MOCK GENERATION RESULT
// ============================================

export const generateMockResult = (
  briefText: string,
  includeResearch = false
): GenerationResult => {
  const lowerBrief = briefText.toLowerCase()

  // Simulate diagnostic path through decision tree
  const diagnosticPath = []

  // Q1: Is the audience already behaving the way we want?
  const behaviorExists =
    lowerBrief.includes("adoption") ||
    lowerBrief.includes("currently using") ||
    lowerBrief.includes("established")

  diagnosticPath.push({
    question: "Q1: Is the audience already behaving the way we want?",
    answer: behaviorExists ? ("yes" as const) : ("no" as const),
    reasoning: behaviorExists
      ? "Brief indicates existing behavior patterns that need maintenance or reinforcement."
      : "Brief suggests the desired behavior is not yet occurring - new adoption needed.",
  })

  let selectedFormats: string[] = []

  if (!behaviorExists) {
    // PATH B: Behavior is not happening
    const hesitatesEmotionally =
      lowerBrief.includes("hesitat") ||
      lowerBrief.includes("fear") ||
      lowerBrief.includes("risk") ||
      lowerBrief.includes("concern")

    diagnosticPath.push({
      question:
        "Q3: Does the audience know what to do, but hesitate emotionally or professionally?",
      answer: hesitatesEmotionally ? ("yes" as const) : ("no" as const),
      reasoning: hesitatesEmotionally
        ? "Brief mentions emotional or professional barriers to action."
        : "No clear emotional hesitation identified.",
    })

    if (hesitatesEmotionally) {
      selectedFormats.push("F03") // Permission-Giving
    } else {
      const dominantBelief =
        lowerBrief.includes("belief") ||
        lowerBrief.includes("perceive") ||
        lowerBrief.includes("think") ||
        lowerBrief.includes("mindset")

      diagnosticPath.push({
        question: "Q4: Is the primary barrier a dominant belief or mental model?",
        answer: dominantBelief ? ("yes" as const) : ("no" as const),
        reasoning: dominantBelief
          ? "Mental models or beliefs identified as key barrier."
          : "Barrier appears to be structural or informational.",
      })

      if (dominantBelief) {
        selectedFormats.push("F02") // Reframing
      } else {
        const overwhelmed =
          lowerBrief.includes("complex") ||
          lowerBrief.includes("overwhelm") ||
          lowerBrief.includes("confus") ||
          lowerBrief.includes("data")

        diagnosticPath.push({
          question:
            "Q5: Is the audience overwhelmed or paralyzed by complexity?",
          answer: overwhelmed ? ("yes" as const) : ("no" as const),
          reasoning: overwhelmed
            ? "Brief indicates decision complexity or information overload."
            : "Complexity not the primary issue.",
        })

        if (overwhelmed) {
          selectedFormats.push("F06") // Simplification
        } else {
          const roleUnclear =
            lowerBrief.includes("position") ||
            lowerBrief.includes("role") ||
            lowerBrief.includes("when to") ||
            lowerBrief.includes("crowded")

          if (roleUnclear) {
            selectedFormats.push("F04") // Role-Clarification
          }

          const statusQuoSafe =
            lowerBrief.includes("inaction") ||
            lowerBrief.includes("status quo") ||
            lowerBrief.includes("under-treat")

          if (statusQuoSafe) {
            selectedFormats.push("F09") // Risk-of-Inaction
          }

          const wrongMetric =
            lowerBrief.includes("outcome") ||
            lowerBrief.includes("success") ||
            lowerBrief.includes("metric")

          if (wrongMetric) {
            selectedFormats.push("F08") // Redefining Success
          }

          const competitorsLoud =
            lowerBrief.includes("competitor") ||
            lowerBrief.includes("market share") ||
            lowerBrief.includes("crowded")

          if (competitorsLoud) {
            selectedFormats.push("F05") // Differentiation-Through-Restraint
          }

          // Default fallback
          if (selectedFormats.length === 0) {
            selectedFormats.push("F01") // Core Mindset-Shift
          }
        }
      }
    }
  } else {
    // PATH A: Behavior exists but at risk
    const erodingConfidence =
      lowerBrief.includes("eroding") ||
      lowerBrief.includes("declining") ||
      lowerBrief.includes("losing")

    if (erodingConfidence) {
      selectedFormats.push("F12") // Behavior-Maintenance
    }

    const externalPressure =
      lowerBrief.includes("pressure") ||
      lowerBrief.includes("competition") ||
      lowerBrief.includes("doubt")

    if (externalPressure) {
      selectedFormats.push("F07") // Confidence-Building
    }

    if (selectedFormats.length === 0) {
      selectedFormats.push("F10") // Trust-Repair
    }
  }

  // Ensure we have 5 unique formats
  const allFormatIds = ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08", "F09", "F10", "F11", "F12"]
  while (selectedFormats.length < 5) {
    const randomFormat = allFormatIds[Math.floor(Math.random() * allFormatIds.length)]
    if (!selectedFormats.includes(randomFormat)) {
      selectedFormats.push(randomFormat)
    }
  }

  // Generate challenge statements based on selected formats
  const challengeStatements = selectedFormats.slice(0, 5).map((formatId, index) => {
    const format = DEFAULT_FORMATS.find((f) => f.id === formatId)!
    return {
      id: index + 1,
      text: generateChallengeText(formatId, lowerBrief),
      selected_format: formatId,
      reasoning: generateReasoning(formatId, lowerBrief),
      evaluation: generateMockEvaluation(includeResearch),
    }
  })

  return {
    challenge_statements: challengeStatements,
    diagnostic_summary: `Analyzed brief through diagnostic decision tree. Primary path: ${!behaviorExists ? "Behavior Not Happening" : "Behavior Exists"}. Selected formats: ${selectedFormats.slice(0, 5).map((f) => DEFAULT_FORMATS.find((df) => df.id === f)?.name).join(", ")}.`,
    diagnostic_path: diagnosticPath,
  }
}

function generateChallengeText(formatId: string, brief: string): string {
  const challenges: Record<string, string> = {
    F01: "How can we help oncologists move from sequential line-of-therapy thinking to biomarker-driven treatment selection, without undermining their clinical judgment or creating perception of rushing to newer agents?",
    F02: "How can we reframe CNS protection from a 'bonus benefit' to a core requirement for first-line EGFR+ NSCLC treatment selection?",
    F03: "How can we give oncologists permission to prescribe a new entrant over the established leader, without feeling they're taking unnecessary risk with their patients?",
    F04: "How can we clearly define Velozia's role at the moment of first-line treatment selection, without overreaching beyond our comparative efficacy data?",
    F05: "How can we stand apart by focusing on demonstrated CNS efficacy and tolerability instead of trying to match Tagrisso's broad market presence claim-for-claim?",
    F06: "How can we simplify the treatment decision for EGFR+ NSCLC so oncologists can confidently select first-line therapy without being paralyzed by the growing options?",
    F07: "How can we reinforce confidence in choosing a new therapy when Tagrisso's 8-year track record and guideline positioning create doubt about alternatives?",
    F08: "How can we redefine what 'success' looks like in EGFR+ NSCLC treatment beyond PFS, to include meaningful CNS protection and sustained quality of life?",
    F09: "How can we make the cost of undertreating brain metastasis risk visible without resorting to fear tactics about CNS progression?",
    F10: "How can we build trust in a new market entrant without dismissing the genuine value oncologists have experienced with current standard of care?",
    F11: "How can we help oncologists adopt CNS-first treatment thinking for EGFR+ patients without feeling they're abandoning proven approaches?",
    F12: "How can we help oncologists stay committed to optimal first-line selection even when initial patient responses seem adequate on any therapy?",
  }
  return challenges[formatId] || challenges.F01
}

function generateReasoning(formatId: string, brief: string): string {
  const reasonings: Record<string, string> = {
    F01: "The brief reveals entrenched prescribing patterns favoring Tagrisso. Oncologists need help transitioning from habit to evidence-based selection considering new data, but change feels risky given Tagrisso's established position.",
    F02: "Current mental models position CNS efficacy as secondary to systemic response. The brief's emphasis on brain metastases (25-40% of patients) suggests the category narrative needs reframing.",
    F03: "Oncologists know the data but hesitate due to professional risk. The 62% market share of Tagrisso creates emotional and professional barriers to trying alternatives.",
    F04: "The crowded EGFR+ space and Tagrisso's dominance make 'why Velozia now' unclear. The brief shows need to define a specific, credible role at the treatment decision moment.",
    F05: "Competitors have over-claimed with broad positioning. Velozia's specific strengths in CNS and tolerability offer a credibility-based differentiation opportunity.",
    F06: "The proliferation of EGFR therapies creates decision fatigue. The brief indicates oncologists need clarity to act confidently, not more comparative data.",
    F07: "Despite strong Phase 3 data, the brief shows confidence is threatened by Tagrisso's market position and guideline entrenchment. Reassurance, not persuasion, is needed.",
    F08: "The category optimizes for PFS as the primary metric. Velozia's CNS protection offers an opportunity to expand the definition of treatment success.",
    F09: "Under-treatment of brain metastasis risk is normalized because it feels 'safe.' The brief suggests inertia is a major barrier to optimal care.",
    F10: "Entering against an established leader requires building trust, not attacking the incumbent. The brief shows skepticism about new entrants is present.",
    F11: "Standards of care are shifting toward CNS-aware treatment. Oncologists risk being left behind but feel identity threat in abandoning familiar approaches.",
    F12: "Initial adoption may occur but persistence is the real challenge when urgency fades. Long-term commitment requires sustained reinforcement.",
  }
  return reasonings[formatId] || reasonings.F01
}
