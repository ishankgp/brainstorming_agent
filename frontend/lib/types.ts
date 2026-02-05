export interface ChallengeStatement {
  id: number
  text: string
  selected_format: string
  reasoning: string
  evaluation?: EvaluationResult
}

export interface GenerationResult {
  challenge_statements: ChallengeStatement[]
  diagnostic_summary: string
  diagnostic_path: DiagnosticPathStep[]
}

export interface DiagnosticPathStep {
  question: string
  answer: "yes" | "no"
  reasoning: string
}

export interface ChallengeFormat {
  id: string
  name: string
  format_template: string
  when_to_use: string[]
  example: string
  category: "core" | "edge-case"
}

export interface DiagnosticRule {
  id: string
  problem: string
  format_id: string
  format_name: string
}

// Evaluation Framework Types
export type EvaluationWeight = "high" | "medium"

export interface EvaluationDimension {
  id: string
  name: string
  key_question: string
  what_to_check: string[]
  red_flags: string[]
  weight: EvaluationWeight
  is_non_negotiable: boolean
}

export interface DimensionScore {
  dimension_id: string
  score: number // 1-5
  notes: string
  has_red_flags: boolean
}

export interface EvaluationResult {
  dimension_scores: DimensionScore[]
  total_score: number
  weighted_score: number
  passes_non_negotiables: boolean
  failed_non_negotiables: string[]
  recommendation: "proceed" | "revise" | "reject"
  research_references?: ResearchReference[]
  detected_format_id?: string
}

// Research Library Types
export type ResearchDocumentType = "clinical-trial" | "market-research" | "competitor-analysis" | "regulatory" | "patient-insights" | "other"

export interface ResearchDocument {
  id: string
  name: string
  type: ResearchDocumentType
  file_type: "pdf" | "ppt" | "pptx" | "doc" | "docx"
  description: string
  uploaded_at: string
  size_kb: number
}

export interface ResearchReference {
  document_id: string
  document_name: string
  relevant_insight: string
  relevance_score: number // 1-5
}
