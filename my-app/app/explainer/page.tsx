"use client"

import { Download, Printer, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ExplainerPage() {
  const handleDownload = () => {
    const content = document.getElementById("explainer-content")
    if (!content) return

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Brainstorming Agent - Product Explainer</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px; }
          h1 { font-size: 28px; color: #1e3a5f; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; }
          h2 { font-size: 20px; color: #1e3a5f; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 12px; }
          h3 { font-size: 16px; color: #374151; margin-top: 20px; margin-bottom: 10px; }
          p { margin-bottom: 12px; }
          ul, ol { margin-bottom: 15px; padding-left: 25px; }
          li { margin-bottom: 8px; }
          .highlight { background: #eff6ff; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }
          .pain-point { background: #fef2f2; padding: 12px 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #ef4444; }
          .solution { background: #f0fdf4; padding: 12px 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #22c55e; }
          .metric { display: inline-block; background: #f3f4f6; padding: 4px 10px; border-radius: 4px; font-weight: 600; margin: 2px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #d1d5db; padding: 10px 12px; text-align: left; }
          th { background: #f3f4f6; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
      </html>
    `

    const blob = new Blob([html], { type: "application/msword" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Brainstorming-Agent-Explainer.doc"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handlePrint} className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download .doc
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-10 print:py-0 print:px-0">
        <div
          id="explainer-content"
          className="prose prose-slate max-w-none print:prose-sm"
        >
          <h1 className="text-3xl font-bold text-foreground border-b-2 border-primary pb-4 mb-8">
            Brainstorming Agent
            <span className="block text-lg font-normal text-muted-foreground mt-2">
              AI-Powered Challenge Statement Generator for Pharma Marketing
            </span>
          </h1>

          {/* Executive Summary */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              Executive Summary
            </h2>
            <p className="text-foreground mb-0">
              The Brainstorming Agent transforms unstructured marketing briefs into
              strategic challenge statements using a structured AI framework. It
              addresses the critical gap between marketing strategy and creative
              execution by providing strategists with evaluated, format-specific
              challenge statements that bridge business problems to creative
              solutions.
            </p>
          </div>

          {/* The Problem */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive text-sm font-bold">1</span>
            The Problem We Solve
          </h2>

          <p className="text-foreground mb-6">
            In pharmaceutical marketing, the journey from a marketing brief to
            effective creative work is fraught with inefficiencies, inconsistencies,
            and missed opportunities. The challenge statement—the pivotal bridge
            between strategy and creative execution—is often poorly constructed or
            skipped entirely.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Current Pain Points
          </h3>

          <div className="space-y-3 mb-6">
            <div className="rounded-lg bg-destructive/5 border-l-4 border-destructive p-4">
              <p className="font-semibold text-foreground mb-1">
                1. Inconsistent Challenge Framing
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Different strategists frame challenges differently. Some focus on
                business metrics, others on audience behavior, still others on
                competitive positioning. This inconsistency leads to creative work
                that solves the wrong problems.
              </p>
            </div>

            <div className="rounded-lg bg-destructive/5 border-l-4 border-destructive p-4">
              <p className="font-semibold text-foreground mb-1">
                2. Time-Intensive Manual Process
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Senior strategists spend 4-8 hours per brief crafting challenge
                statements through trial and error. This manual process doesn't
                scale with increasing campaign demands.
              </p>
            </div>

            <div className="rounded-lg bg-destructive/5 border-l-4 border-destructive p-4">
              <p className="font-semibold text-foreground mb-1">
                3. Missed Format Opportunities
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Most teams rely on 2-3 familiar challenge formats, missing
                opportunities to reframe problems in ways that unlock more
                innovative creative solutions.
              </p>
            </div>

            <div className="rounded-lg bg-destructive/5 border-l-4 border-destructive p-4">
              <p className="font-semibold text-foreground mb-1">
                4. No Quality Benchmark
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Challenge statements are rarely evaluated against objective
                criteria. "Good" is subjective, leading to weak briefs passing
                through to creative teams.
              </p>
            </div>

            <div className="rounded-lg bg-destructive/5 border-l-4 border-destructive p-4">
              <p className="font-semibold text-foreground mb-1">
                5. Research Underutilization
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Clinical trial data, market research, and patient insights sit in
                silos. Challenge statements often don't leverage the full body of
                available evidence.
              </p>
            </div>
          </div>

          {/* The Solution */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent text-sm font-bold">2</span>
            Our Solution
          </h2>

          <p className="text-foreground mb-6">
            The Brainstorming Agent provides a structured, AI-powered approach to
            challenge statement generation that brings consistency, speed, and
            quality assurance to the strategic process.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Core Capabilities
          </h3>

          <div className="space-y-3 mb-6">
            <div className="rounded-lg bg-emerald-500/5 border-l-4 border-emerald-500 p-4">
              <p className="font-semibold text-foreground mb-1">
                12 Proven Challenge Formats
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                A curated library of 8 core formats and 4 edge-case formats, each
                with specific templates, use cases, and examples. From
                Mindset-Shift to Risk-of-Inaction, every format is designed to
                unlock different creative angles.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-500/5 border-l-4 border-emerald-500 p-4">
              <p className="font-semibold text-foreground mb-1">
                Diagnostic Decision Tree
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                An AI-guided diagnostic process analyzes the brief and
                systematically selects the most appropriate formats based on the
                specific business problem, audience dynamics, and market context.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-500/5 border-l-4 border-emerald-500 p-4">
              <p className="font-semibold text-foreground mb-1">
                8-Dimension Evaluation Framework
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Every generated statement is scored against Business Relevance,
                Audience Truth, Insight Strength, Data Alignment, Lifecycle
                Appropriateness, Strategic Focus, Creative Solvability, and
                Longevity—with weighted scoring and non-negotiable thresholds.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-500/5 border-l-4 border-emerald-500 p-4">
              <p className="font-semibold text-foreground mb-1">
                Research Integration (Optional)
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Connect clinical trials, market research, competitor analysis, and
                patient insights to inform statement generation. Research
                references appear in evaluations, showing evidence-backed
                alignment.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-500/5 border-l-4 border-emerald-500 p-4">
              <p className="font-semibold text-foreground mb-1">
                Transparent Reasoning
              </p>
              <p className="text-muted-foreground text-sm mb-0">
                Every statement includes a collapsible reasoning trace explaining
                why that format was selected and how it addresses the brief's core
                tensions. No black-box outputs.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
            How It Works
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Step</th>
                  <th className="border border-border p-3 text-left font-semibold">Action</th>
                  <th className="border border-border p-3 text-left font-semibold">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">1. Input Brief</td>
                  <td className="border border-border p-3">Paste or upload a structured marketing brief (Pre-Launch, Mature Brand, etc.)</td>
                  <td className="border border-border p-3">Parsed brief with identified key elements</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">2. Add Research (Optional)</td>
                  <td className="border border-border p-3">Select relevant research documents from the library</td>
                  <td className="border border-border p-3">Research context added to analysis</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">3. Diagnostic Analysis</td>
                  <td className="border border-border p-3">AI traverses decision tree to select appropriate formats</td>
                  <td className="border border-border p-3">5 format selections with reasoning</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">4. Statement Generation</td>
                  <td className="border border-border p-3">AI generates challenge statements using selected formats</td>
                  <td className="border border-border p-3">5 unique challenge statements</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">5. Evaluation</td>
                  <td className="border border-border p-3">Each statement scored against 8 dimensions</td>
                  <td className="border border-border p-3">Proceed/Revise/Reject recommendations</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">6. Review & Refine</td>
                  <td className="border border-border p-3">Strategist reviews statements, reasoning, and evaluations</td>
                  <td className="border border-border p-3">Finalized challenge statements for creative brief</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Challenge Formats */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">4</span>
            The 12 Challenge Formats
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Core Formats (CS-01 to CS-08)
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">ID</th>
                  <th className="border border-border p-3 text-left font-semibold">Format Name</th>
                  <th className="border border-border p-3 text-left font-semibold">When to Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-mono text-primary">CS-01</td>
                  <td className="border border-border p-3 font-medium">Mindset-Shift</td>
                  <td className="border border-border p-3">Audience holds a belief that limits adoption</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-mono text-primary">CS-02</td>
                  <td className="border border-border p-3 font-medium">Reframing</td>
                  <td className="border border-border p-3">Problem is real but perceived wrongly</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-mono text-primary">CS-03</td>
                  <td className="border border-border p-3 font-medium">Permission-Giving</td>
                  <td className="border border-border p-3">Audience feels guilty or hesitant</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-mono text-primary">CS-04</td>
                  <td className="border border-border p-3 font-medium">Role-Clarification</td>
                  <td className="border border-border p-3">Brand's role in audience's life is unclear</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-mono text-primary">CS-05</td>
                  <td className="border border-border p-3 font-medium">Differentiation-Through-Restraint</td>
                  <td className="border border-border p-3">Category is crowded with similar claims</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-mono text-primary">CS-06</td>
                  <td className="border border-border p-3 font-medium">Simplification</td>
                  <td className="border border-border p-3">Complex product in noisy environment</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-mono text-primary">CS-07</td>
                  <td className="border border-border p-3 font-medium">Confidence-Building</td>
                  <td className="border border-border p-3">Audience doubts their own ability or judgment</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-mono text-primary">CS-08</td>
                  <td className="border border-border p-3 font-medium">Redefining Success</td>
                  <td className="border border-border p-3">Current success metric doesn't favor the brand</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Edge-Case Formats (CS-09 to CS-12)
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-amber-500/10">
                  <th className="border border-border p-3 text-left font-semibold">ID</th>
                  <th className="border border-border p-3 text-left font-semibold">Format Name</th>
                  <th className="border border-border p-3 text-left font-semibold">When to Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-mono text-amber-600">CS-09</td>
                  <td className="border border-border p-3 font-medium">Risk-of-Inaction</td>
                  <td className="border border-border p-3">Audience doesn't feel urgency to change</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-mono text-amber-600">CS-10</td>
                  <td className="border border-border p-3 font-medium">Trust-Repair</td>
                  <td className="border border-border p-3">Brand/category has credibility issues</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-mono text-amber-600">CS-11</td>
                  <td className="border border-border p-3 font-medium">Paradigm-Shift</td>
                  <td className="border border-border p-3">Entire category thinking needs to change</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-mono text-amber-600">CS-12</td>
                  <td className="border border-border p-3 font-medium">Behavior-Maintenance</td>
                  <td className="border border-border p-3">Audience starts well but doesn't persist</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Evaluation Framework */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">5</span>
            8-Dimension Evaluation Framework
          </h2>

          <p className="text-foreground mb-4">
            Each challenge statement is evaluated against 8 dimensions, with weighted
            scoring based on strategic importance:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Dimension</th>
                  <th className="border border-border p-3 text-left font-semibold">Weight</th>
                  <th className="border border-border p-3 text-left font-semibold">Key Question</th>
                  <th className="border border-border p-3 text-left font-semibold">Non-Neg?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">Business Relevance</td>
                  <td className="border border-border p-3"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary text-xs font-medium">HIGH (3x)</span></td>
                  <td className="border border-border p-3">Does solving this challenge drive business outcome?</td>
                  <td className="border border-border p-3">No</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Audience Truth</td>
                  <td className="border border-border p-3"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary text-xs font-medium">HIGH (3x)</span></td>
                  <td className="border border-border p-3">Is the challenge rooted in real audience behavior?</td>
                  <td className="border border-border p-3 text-destructive font-semibold">Yes</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">Insight Strength</td>
                  <td className="border border-border p-3"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary text-xs font-medium">HIGH (3x)</span></td>
                  <td className="border border-border p-3">Does it reveal something non-obvious?</td>
                  <td className="border border-border p-3">No</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Data Alignment</td>
                  <td className="border border-border p-3"><span className="rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs font-medium">MED (2x)</span></td>
                  <td className="border border-border p-3">Is the challenge supported by data or evidence?</td>
                  <td className="border border-border p-3 text-destructive font-semibold">Yes</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">Lifecycle Appropriateness</td>
                  <td className="border border-border p-3"><span className="rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs font-medium">MED (2x)</span></td>
                  <td className="border border-border p-3">Does this fit the brand's current lifecycle stage?</td>
                  <td className="border border-border p-3">No</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Strategic Focus</td>
                  <td className="border border-border p-3"><span className="rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs font-medium">MED (2x)</span></td>
                  <td className="border border-border p-3">Is the challenge single-minded and focused?</td>
                  <td className="border border-border p-3">No</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">Creative Solvability</td>
                  <td className="border border-border p-3"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary text-xs font-medium">HIGH (3x)</span></td>
                  <td className="border border-border p-3">Can communications actually solve this?</td>
                  <td className="border border-border p-3 text-destructive font-semibold">Yes</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Longevity</td>
                  <td className="border border-border p-3"><span className="rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs font-medium">MED (2x)</span></td>
                  <td className="border border-border p-3">Will this challenge remain relevant over time?</td>
                  <td className="border border-border p-3">No</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4 mb-6">
            <p className="font-semibold text-foreground mb-1">Non-Negotiable Rule</p>
            <p className="text-muted-foreground text-sm mb-0">
              If Audience Truth, Data Alignment, or Creative Solvability scores below
              3, the recommendation is automatically "Reject"—regardless of other
              scores. No amount of clever creative can fix fundamental failures in
              these areas.
            </p>
          </div>

          {/* Value Proposition */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">6</span>
            Value Proposition
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div className="rounded-lg border border-border p-4">
              <p className="text-3xl font-bold text-primary mb-1">75%</p>
              <p className="text-sm text-muted-foreground">Reduction in challenge statement development time</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-3xl font-bold text-primary mb-1">12</p>
              <p className="text-sm text-muted-foreground">Proven formats vs. typical 2-3 used manually</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-3xl font-bold text-primary mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Statements evaluated against objective criteria</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-3xl font-bold text-primary mb-1">5x</p>
              <p className="text-sm text-muted-foreground">More strategic options per brief</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            For Marketing Strategists
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
            <li>Consistent, high-quality challenge statements every time</li>
            <li>Exposure to formats they might not have considered</li>
            <li>Objective evaluation to catch weak statements early</li>
            <li>Research integration for evidence-backed strategy</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            For Creative Teams
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
            <li>Clearer, more actionable briefs to work from</li>
            <li>Reasoning traces explain the "why" behind the challenge</li>
            <li>Multiple strategic angles to explore creatively</li>
            <li>Fewer revision cycles due to misaligned strategy</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            For Agency Leadership
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground mb-6">
            <li>Standardized methodology across teams and clients</li>
            <li>Quality assurance built into the process</li>
            <li>Scalable strategic capability without proportional headcount</li>
            <li>Defensible, documented strategic rationale</li>
          </ul>

          {/* Use Cases */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">7</span>
            Primary Use Cases
          </h2>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-foreground mb-2">Pre-Launch Campaigns</p>
              <p className="text-sm text-muted-foreground mb-0">
                New drug launches require clear differentiation stories. The agent
                identifies whether the challenge is about mindset-shift, competitive
                reframing, or paradigm change—and frames accordingly.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-foreground mb-2">Brand Repositioning</p>
              <p className="text-sm text-muted-foreground mb-0">
                Mature brands needing fresh strategic direction benefit from
                formats like Redefining Success or Role-Clarification to find new
                relevance.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-foreground mb-2">Competitive Response</p>
              <p className="text-sm text-muted-foreground mb-0">
                When competitors gain ground, the agent helps frame challenges that
                leverage Differentiation-Through-Restraint or Risk-of-Inaction
                formats.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-foreground mb-2">Campaign Refresh</p>
              <p className="text-sm text-muted-foreground mb-0">
                Annual campaign refreshes benefit from exploring alternative
                challenge framings to break out of creative ruts.
              </p>
            </div>
          </div>

          {/* User Stories & Documentation */}
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">8</span>
            User Stories & Technical Documentation
          </h2>

          <p className="text-foreground mb-4">
            Comprehensive user stories have been developed to guide development and
            design teams. The documentation covers 45 user stories across 10
            functional areas, with clear acceptance criteria for each feature.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            User Story Coverage
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Category</th>
                  <th className="border border-border p-3 text-left font-semibold">Stories</th>
                  <th className="border border-border p-3 text-left font-semibold">Key Features</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">Brief Input & Management</td>
                  <td className="border border-border p-3">4</td>
                  <td className="border border-border p-3">Text input, file upload, templates, reset</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Research Library</td>
                  <td className="border border-border p-3">7</td>
                  <td className="border border-border p-3">Document management, selection, search, categorization</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">Challenge Generation</td>
                  <td className="border border-border p-3">4</td>
                  <td className="border border-border p-3">Generation trigger, loading states, results, error handling</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Statement Display</td>
                  <td className="border border-border p-3">4</td>
                  <td className="border border-border p-3">Format display, reasoning traces, edge-case identification</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">Evaluation Framework</td>
                  <td className="border border-border p-3">6</td>
                  <td className="border border-border p-3">8-dimension scoring, non-negotiables, research references</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Diagnostic Decision Path</td>
                  <td className="border border-border p-3">3</td>
                  <td className="border border-border p-3">Decision tree visualization, format distribution</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">Format Library</td>
                  <td className="border border-border p-3">7</td>
                  <td className="border border-border p-3">Format browsing, editing, diagnostic tree, evaluation criteria</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Results Management</td>
                  <td className="border border-border p-3">3</td>
                  <td className="border border-border p-3">Summary views, export (future), sharing (future)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">Edge Cases & Errors</td>
                  <td className="border border-border p-3">4</td>
                  <td className="border border-border p-3">Validation, error recovery, empty states</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">Accessibility</td>
                  <td className="border border-border p-3">3</td>
                  <td className="border border-border p-3">Keyboard navigation, screen readers, responsive design</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Accessing Documentation
          </h3>

          <p className="text-foreground mb-4">
            Technical documentation is accessible through a discreet settings menu
            in the application header. This design choice keeps the primary user
            interface clean and focused on the core workflow, while ensuring
            developers and stakeholders can access detailed specifications when
            needed.
          </p>

          <div className="rounded-lg bg-muted/50 border border-border p-4 mb-6">
            <p className="text-sm text-foreground mb-2">
              <strong>How to access:</strong>
            </p>
            <ol className="list-decimal pl-6 space-y-1 text-sm text-muted-foreground">
              <li>Look for the three-dot menu icon (vertical ellipsis) in the top-right corner of the header</li>
              <li>Click to reveal the dropdown menu</li>
              <li>Select "Product Overview" for this document or "User Stories" for detailed specifications</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3 mb-0">
              This unobtrusive placement ensures marketing strategists maintain
              focus on their primary workflow while providing easy access for
              technical teams during development and review cycles.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Priority Matrix
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Priority</th>
                  <th className="border border-border p-3 text-left font-semibold">Focus</th>
                  <th className="border border-border p-3 text-left font-semibold">Rationale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">
                    <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">P0 - Critical</span>
                  </td>
                  <td className="border border-border p-3">Core generation and display</td>
                  <td className="border border-border p-3">Essential functionality for MVP</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3">
                    <span className="inline-block rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">P1 - High</span>
                  </td>
                  <td className="border border-border p-3">Research, evaluation, diagnostics</td>
                  <td className="border border-border p-3">Key differentiating features</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">
                    <span className="inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">P2 - Medium</span>
                  </td>
                  <td className="border border-border p-3">Enhanced usability, error handling</td>
                  <td className="border border-border p-3">Polish and robustness</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3">
                    <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">P3 - Low</span>
                  </td>
                  <td className="border border-border p-3">Future enhancements</td>
                  <td className="border border-border p-3">Post-launch improvements</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Brainstorming Agent v1.0 | Pharma Marketing Strategy Tool
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              For internal use. Generated challenge statements should be reviewed
              and refined by qualified marketing strategists before use in final
              creative briefs.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Documentation accessible via settings menu | User Stories: 45 stories across 10 categories
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
