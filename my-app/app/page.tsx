"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { BriefInput } from "@/components/brief-input"
import { ResultsSection } from "@/components/results-section"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import { FormatLibrary } from "@/components/format-library"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_FORMATS,
  DEFAULT_DIAGNOSTIC_RULES,
  SAMPLE_RESEARCH_DOCUMENTS,
} from "@/lib/mock-data"
import type {
  GenerationResult,
  ChallengeFormat,
  DiagnosticRule,
  ResearchDocument,
} from "@/lib/types"

type AppState = "idle" | "loading" | "success" | "error"

// Pre-Launch Marketing Brief using structured format
const SAMPLE_BRIEF = `CLIENT MARKETING BRIEF
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

export default function BrainstormAgent() {
  // Start with empty brief - users select from brand selector or paste their own
  const [briefText, setBriefText] = useState("")
  const [appState, setAppState] = useState<AppState>("idle")
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [formats, setFormats] = useState<ChallengeFormat[]>(DEFAULT_FORMATS)
  const [diagnosticRules, setDiagnosticRules] =
    useState<DiagnosticRule[]>(DEFAULT_DIAGNOSTIC_RULES)

  // Research Library state
  const [researchDocuments, setResearchDocuments] = useState<ResearchDocument[]>(
    SAMPLE_RESEARCH_DOCUMENTS
  )
  const [selectedResearch, setSelectedResearch] = useState<string[]>([])

  // Load formats from localStorage on mount
  useEffect(() => {
    const savedFormats = localStorage.getItem("brainstorm-formats")
    const savedRules = localStorage.getItem("brainstorm-rules")

    if (savedFormats) {
      try {
        setFormats(JSON.parse(savedFormats))
      } catch {
        // Use defaults if parse fails
      }
    }

    if (savedRules) {
      try {
        setDiagnosticRules(JSON.parse(savedRules))
      } catch {
        // Use defaults if parse fails
      }
    }
  }, [])

  // Save formats to localStorage when updated
  const handleUpdateFormats = (newFormats: ChallengeFormat[]) => {
    setFormats(newFormats)
    localStorage.setItem("brainstorm-formats", JSON.stringify(newFormats))
  }

  const handleUpdateRules = (newRules: DiagnosticRule[]) => {
    setDiagnosticRules(newRules)
    localStorage.setItem("brainstorm-rules", JSON.stringify(newRules))
  }

  // Research library handlers
  const handleToggleResearch = (docId: string) => {
    setSelectedResearch((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSelectAllResearch = () => {
    setSelectedResearch(researchDocuments.map((d) => d.id))
  }

  const handleClearAllResearch = () => {
    setSelectedResearch([])
  }

  const handleAddResearchDocument = (doc: ResearchDocument) => {
    setResearchDocuments((prev) => [...prev, doc])
  }

  const handleRemoveResearchDocument = (docId: string) => {
    setResearchDocuments((prev) => prev.filter((d) => d.id !== docId))
    setSelectedResearch((prev) => prev.filter((id) => id !== docId))
  }

  const handleGenerate = async (includeResearch: boolean) => {
    setAppState("loading")
    setError(null)

    try {
      console.log("🚀 Starting generation request...")
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      console.log("📡 Sending POST to /api/generate-challenge-statements")
      const response = await fetch('http://localhost:8000/api/generate-challenge-statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brief_text: briefText,
          include_research: includeResearch,
          selected_research_ids: includeResearch ? selectedResearch : null
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log(`📥 Response status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.detail || `API request failed with status ${response.status}`
        )
      }

      const data = await response.json()

      // Transform API response to match frontend format
      const result = {
        challenge_statements: data.challenge_statements,
        diagnostic_summary: data.diagnostic_summary,
        diagnostic_path: data.diagnostic_path
      }

      setResult(result)
      setAppState("success")
    } catch (err) {
      console.error("🚨 Generation failed:", err)

      let errorMessage = "An unexpected error occurred"
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = "Request timed out after 60 seconds. The model might be busy."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setAppState("error")
    }
  }

  const handleReset = () => {
    setBriefText("")
    setResult(null)
    setAppState("idle")
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenLibrary={() => setIsLibraryOpen(true)} />

      <main className="mx-auto max-w-3xl px-6 py-8 md:py-12">
        {/* Input Section - Always visible when not in success state */}
        {appState !== "success" && (
          <BriefInput
            value={briefText}
            onChange={setBriefText}
            onGenerate={handleGenerate}
            isLoading={appState === "loading"}
            researchDocuments={researchDocuments}
            selectedResearch={selectedResearch}
            onToggleResearch={handleToggleResearch}
            onSelectAllResearch={handleSelectAllResearch}
            onClearAllResearch={handleClearAllResearch}
            onAddResearchDocument={handleAddResearchDocument}
            onRemoveResearchDocument={handleRemoveResearchDocument}
          />
        )}

        {/* Empty State */}
        {appState === "idle" && !briefText && <EmptyState />}

        {/* Loading State */}
        {appState === "loading" && <LoadingSkeleton />}

        {/* Error State */}
        {appState === "error" && error && (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription className="mt-2">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-3">
              <Button onClick={handleRetry}>Try Again</Button>
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            </div>
          </div>
        )}

        {/* Success State - Results */}
        {appState === "success" && result && (
          <ResultsSection
            result={result}
            formats={formats}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Format Library Modal */}
      <FormatLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        formats={formats}
        onUpdateFormats={handleUpdateFormats}
        diagnosticRules={diagnosticRules}
        onUpdateRules={handleUpdateRules}
      />
    </div>
  )
}
