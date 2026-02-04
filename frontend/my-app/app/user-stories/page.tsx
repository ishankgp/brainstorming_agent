"use client"

import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

const userStories = {
  briefInput: [
    {
      id: "US-001",
      role: "Marketing Strategist",
      goal: "Submit marketing brief",
      description: "Enter or paste a comprehensive marketing brief to generate challenge statements",
      criteria: [
        "Text area accepts 50+ characters",
        "Character count displayed in real-time",
        "Clear placeholder text with example format"
      ]
    },
    {
      id: "US-002",
      role: "Marketing Strategist",
      goal: "Upload brief document",
      description: "Upload brief as .txt, .pdf, or .docx file instead of manual entry",
      criteria: [
        "Drag-and-drop or click-to-upload supported",
        "File name displayed after upload",
        "File content extracted and populated in text area",
        "Clear button removes uploaded file"
      ]
    },
    {
      id: "US-003",
      role: "Marketing Strategist",
      goal: "Use pre-formatted brief template",
      description: "Access structured brief templates (Pre-Launch, Mature Brand, etc.)",
      criteria: [
        "Sample brief pre-populated for reference",
        "Template follows 12-section format",
        "All required fields clearly indicated"
      ]
    },
    {
      id: "US-004",
      role: "Marketing Strategist",
      goal: "Clear and restart",
      description: "Reset the entire workflow to start fresh with a new brief",
      criteria: [
        '"New Brief" button available from results view',
        "Confirmation not required for reset",
        "All previous results cleared"
      ]
    }
  ],
  researchLibrary: [
    {
      id: "US-005",
      role: "Marketing Strategist",
      goal: "View research documents",
      description: "Browse available research documents with key insights",
      criteria: [
        "Collapsible Research Library panel",
        "Each document shows: name, type, description, file type, size",
        "All 5 key insights visible per document"
      ]
    },
    {
      id: "US-006",
      role: "Marketing Strategist",
      goal: "Toggle research inclusion",
      description: "Choose whether to include research context in analysis",
      criteria: [
        '"Include in analysis" toggle switch',
        "Toggle state clearly visible",
        "Indicator shows when research will be used"
      ]
    },
    {
      id: "US-007",
      role: "Marketing Strategist",
      goal: "Select specific documents",
      description: "Choose which research documents to include",
      criteria: [
        "Checkbox per document",
        '"Select All" and "Clear All" buttons',
        "Selected count displayed in panel header"
      ]
    },
    {
      id: "US-008",
      role: "Marketing Strategist",
      goal: "Search research library",
      description: "Find specific documents by name, type, or content",
      criteria: [
        "Search input with real-time filtering",
        "Search matches name, type, and description",
        "Empty state shown when no matches"
      ]
    },
    {
      id: "US-009",
      role: "Marketing Strategist",
      goal: "Add new research document",
      description: "Upload additional research files to the library",
      criteria: [
        '"Add Document" button opens form',
        "Required fields: name, type, description",
        "Key insights can be added manually",
        "Document appears in library after save"
      ]
    },
    {
      id: "US-010",
      role: "Marketing Strategist",
      goal: "Remove research document",
      description: "Delete documents no longer relevant",
      criteria: [
        "Delete button per document",
        "Document removed from library and selection"
      ]
    },
    {
      id: "US-011",
      role: "Marketing Strategist",
      goal: "Categorize research by type",
      description: "Filter research by document type",
      criteria: [
        "Type badges: Clinical Trial, Market Research, Competitor Analysis, Regulatory, Patient Insights, Other",
        "Color-coded type indicators"
      ]
    }
  ],
  generation: [
    {
      id: "US-012",
      role: "Marketing Strategist",
      goal: "Generate challenge statements",
      description: "Trigger AI analysis of brief to produce challenge statements",
      criteria: [
        '"Generate Challenge Statements" button',
        "Button disabled if brief < 50 characters",
        "Loading state with progress message"
      ]
    },
    {
      id: "US-013",
      role: "Marketing Strategist",
      goal: "View loading progress",
      description: "See status while generation is in progress",
      criteria: [
        "Skeleton loaders for expected content",
        'Status message: "Analyzing brief with 12 challenge formats..."',
        "No user interaction required during loading"
      ]
    },
    {
      id: "US-014",
      role: "Marketing Strategist",
      goal: "Receive 5 challenge statements",
      description: "View generated challenge statements after analysis",
      criteria: [
        "Exactly 5 statements displayed",
        "Each statement numbered 1-5",
        "Format tag shown per statement"
      ]
    },
    {
      id: "US-015",
      role: "Marketing Strategist",
      goal: "Handle generation errors",
      description: "Receive clear feedback when generation fails",
      criteria: [
        "Error message displayed prominently",
        '"Try Again" button available',
        '"Reset" option to start over'
      ]
    }
  ],
  statementDisplay: [
    {
      id: "US-016",
      role: "Marketing Strategist",
      goal: "View statement with format",
      description: "See challenge statement text with its assigned format",
      criteria: [
        "Statement text prominently displayed",
        'Format ID badge (e.g., "CS-01")',
        'Format name shown (e.g., "Mindset-Shift")'
      ]
    },
    {
      id: "US-017",
      role: "Marketing Strategist",
      goal: "View reasoning trace",
      description: "Understand why a specific format was selected",
      criteria: [
        '"Show reasoning" toggle button',
        "Collapsible panel with reasoning text",
        "Format template shown in expanded view",
        '"When to use" criteria listed'
      ]
    },
    {
      id: "US-018",
      role: "Marketing Strategist",
      goal: "Identify edge-case formats",
      description: "Distinguish standard formats from edge-case formats",
      criteria: [
        '"Edge Case Format" badge for CS-09 through CS-12',
        "Visual differentiation (amber color)"
      ]
    },
    {
      id: "US-019",
      role: "Creative Director",
      goal: "Review statement quality",
      description: "Quickly assess if statements are ready for creative development",
      criteria: [
        "Evaluation summary visible on each card",
        "Proceed/Revise/Reject status clear",
        "Weighted score percentage shown"
      ]
    }
  ],
  evaluation: [
    {
      id: "US-020",
      role: "Marketing Strategist",
      goal: "View compact evaluation",
      description: "See quick evaluation summary without expanding",
      criteria: [
        'Score badge (e.g., "85%")',
        "Recommendation status (Proceed/Revise/Reject)",
        "Non-negotiable failure warning if applicable"
      ]
    },
    {
      id: "US-021",
      role: "Marketing Strategist",
      goal: "View full evaluation details",
      description: "Access complete 8-dimension evaluation breakdown",
      criteria: [
        '"Full evaluation" toggle button',
        "All 8 dimensions listed with scores (1-5)",
        "Visual score bars per dimension"
      ]
    },
    {
      id: "US-022",
      role: "Marketing Strategist",
      goal: "Understand dimension scoring",
      description: "See details for each evaluation dimension",
      criteria: [
        "Dimension name and weight indicator",
        "Score with visual progress bar",
        "Key question, what to check, red flags on expand"
      ]
    },
    {
      id: "US-023",
      role: "Medical Reviewer",
      goal: "Verify non-negotiables",
      description: "Confirm critical dimensions pass minimum thresholds",
      criteria: [
        "Non-negotiables marked: Audience Truth, Data Alignment, Creative Solvability",
        "Failed non-negotiables listed explicitly",
        "Reject recommendation if any non-negotiable fails"
      ]
    },
    {
      id: "US-024",
      role: "Marketing Strategist",
      goal: "Compare raw vs weighted scores",
      description: "Understand both scoring methods",
      criteria: [
        "Raw score: X/40 displayed",
        "Weighted score: percentage displayed",
        "Tooltip explaining weight methodology"
      ]
    },
    {
      id: "US-025",
      role: "Marketing Strategist",
      goal: "View research references",
      description: "See which research documents support the statement",
      criteria: [
        "Research references section in evaluation panel",
        "Document name and relevant insight shown",
        "Relevance score (1-5) per reference",
        "Only visible when research was included"
      ]
    }
  ],
  diagnosticPath: [
    {
      id: "US-026",
      role: "Marketing Strategist",
      goal: "View diagnostic summary",
      description: "Understand the agent's overall format selection logic",
      criteria: [
        '"Diagnostic Decision Path" collapsible panel',
        "Summary text explaining analysis approach"
      ]
    },
    {
      id: "US-027",
      role: "Marketing Strategist",
      goal: "Trace decision tree path",
      description: "See step-by-step questions and answers in diagnostic",
      criteria: [
        "Numbered steps (1, 2, 3...)",
        "Question text per step",
        "YES/NO answer badge",
        "Reasoning for each decision"
      ]
    },
    {
      id: "US-028",
      role: "Marketing Strategist",
      goal: "View format distribution",
      description: "See which formats were selected across all statements",
      criteria: [
        "Format badges for all 5 statements",
        "Format ID and name per selection",
        "Edge-case formats marked"
      ]
    }
  ],
  formatLibrary: [
    {
      id: "US-029",
      role: "Marketing Strategist",
      goal: "Access format library",
      description: "Open the format library from header",
      criteria: [
        '"Format Library" button in header',
        "Modal dialog opens",
        "Close button available"
      ]
    },
    {
      id: "US-030",
      role: "Marketing Strategist",
      goal: "Browse all 12 formats",
      description: "View complete list of challenge statement formats",
      criteria: [
        "8 core formats + 4 edge-case formats",
        "Category tabs or filters",
        "Search functionality"
      ]
    },
    {
      id: "US-031",
      role: "Marketing Strategist",
      goal: "View format details",
      description: "See complete information for each format",
      criteria: [
        "Format ID and name",
        "Format template (fill-in-the-blank structure)",
        '"When to use" criteria list',
        "Example statement"
      ]
    },
    {
      id: "US-032",
      role: "Marketing Strategist",
      goal: "Search formats",
      description: "Find formats by name, description, or keywords",
      criteria: [
        "Search input field",
        "Real-time filtering",
        "Clear search option"
      ]
    },
    {
      id: "US-033",
      role: "Marketing Strategist",
      goal: "Edit format templates",
      description: "Customize format templates for specific needs",
      criteria: [
        "Edit button per format",
        "Editable fields: name, template, when-to-use, example",
        "Save and cancel buttons",
        "Changes persist in session"
      ]
    },
    {
      id: "US-034",
      role: "Marketing Strategist",
      goal: "View diagnostic tree",
      description: "Understand the decision logic for format selection",
      criteria: [
        '"Diagnostic Tree" tab in library',
        "Starting question displayed",
        "Path A and Path B branches shown",
        "Quick reference cheat sheet"
      ]
    },
    {
      id: "US-035",
      role: "Marketing Strategist",
      goal: "View evaluation dimensions",
      description: "See all 8 evaluation dimensions and criteria",
      criteria: [
        '"Evaluation Framework" tab in library',
        "Dimension name, weight, key question",
        "What to check and red flags listed",
        "Non-negotiables clearly marked"
      ]
    }
  ],
  resultsManagement: [
    {
      id: "US-036",
      role: "Marketing Strategist",
      goal: "View evaluation summary",
      description: "See aggregate evaluation status for all statements",
      criteria: [
        "Proceed/Revise/Reject counts displayed",
        "Color-coded summary badges",
        "Visible at top of results section"
      ]
    },
    {
      id: "US-037",
      role: "Marketing Strategist",
      goal: "Export results",
      description: "Save generated statements for use in other tools",
      criteria: [
        "Export functionality (future feature)",
        "Format options: PDF, JSON, CSV"
      ]
    },
    {
      id: "US-038",
      role: "Agency Account Manager",
      goal: "Share results",
      description: "Send results to team members or clients",
      criteria: [
        "Share functionality (future feature)",
        "Link generation or email option"
      ]
    }
  ],
  edgeCases: [
    {
      id: "US-039",
      role: "Marketing Strategist",
      goal: "Handle empty brief",
      description: "See guidance when brief is too short",
      criteria: [
        "Validation message below button",
        '"Please provide at least 50 characters"',
        "Button remains disabled"
      ]
    },
    {
      id: "US-040",
      role: "Marketing Strategist",
      goal: "Handle API failure",
      description: "Receive clear error and recovery options",
      criteria: [
        "Error message displayed",
        '"Try Again" button',
        '"Reset" option available'
      ]
    },
    {
      id: "US-041",
      role: "Marketing Strategist",
      goal: "Handle no research selected",
      description: "Generate without research when none selected",
      criteria: [
        "Generation proceeds without research context",
        "Evaluation omits research references section",
        "No error or warning needed"
      ]
    },
    {
      id: "US-042",
      role: "Marketing Strategist",
      goal: "View empty state",
      description: "See helpful guidance before first generation",
      criteria: [
        "Illustration or icon",
        "Explanation of workflow",
        "Clear call-to-action"
      ]
    }
  ],
  accessibility: [
    {
      id: "US-043",
      role: "All Users",
      goal: "Keyboard navigation",
      description: "Navigate entire interface without mouse",
      criteria: [
        "All interactive elements focusable",
        "Tab order logical",
        "Enter/Space activates buttons"
      ]
    },
    {
      id: "US-044",
      role: "All Users",
      goal: "Screen reader support",
      description: "Use application with assistive technology",
      criteria: [
        "Semantic HTML elements",
        "ARIA labels on interactive elements",
        "Status announcements for loading/errors"
      ]
    },
    {
      id: "US-045",
      role: "All Users",
      goal: "Responsive design",
      description: "Use application on various screen sizes",
      criteria: [
        "Mobile-friendly layout",
        "Touch-friendly tap targets",
        "No horizontal scrolling on mobile"
      ]
    }
  ]
}

const priorityMatrix = [
  {
    priority: "P0 - Critical",
    stories: "US-001, US-012, US-014, US-016, US-020",
    rationale: "Core generation and display functionality"
  },
  {
    priority: "P1 - High",
    stories: "US-005, US-006, US-017, US-021, US-026, US-029",
    rationale: "Key differentiation features (research, evaluation, diagnostics)"
  },
  {
    priority: "P2 - Medium",
    stories: "US-002, US-007, US-022, US-031, US-034, US-039, US-040",
    rationale: "Enhanced usability and error handling"
  },
  {
    priority: "P3 - Low",
    stories: "US-009, US-033, US-037, US-038, US-043, US-044",
    rationale: "Future enhancements and polish"
  }
]

const sections = [
  { title: "1. Brief Input & Management", key: "briefInput" },
  { title: "2. Research Library", key: "researchLibrary" },
  { title: "3. Challenge Statement Generation", key: "generation" },
  { title: "4. Challenge Statement Display", key: "statementDisplay" },
  { title: "5. Evaluation Framework", key: "evaluation" },
  { title: "6. Diagnostic Decision Path", key: "diagnosticPath" },
  { title: "7. Format Library", key: "formatLibrary" },
  { title: "8. Results Management", key: "resultsManagement" },
  { title: "9. Edge Cases & Error Handling", key: "edgeCases" },
  { title: "10. Accessibility & Usability", key: "accessibility" }
]

export default function UserStoriesPage() {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Generate HTML content for download
    const htmlContent = generateHTMLDocument()
    const blob = new Blob([htmlContent], { type: "application/msword" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Brainstorm-Agent-User-Stories.doc"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateHTMLDocument = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>User Stories: Pharma Marketing Brainstorming Agent</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 24pt; color: #1a365d; border-bottom: 2px solid #3182ce; padding-bottom: 10px; }
    h2 { font-size: 16pt; color: #2c5282; margin-top: 30px; }
    h3 { font-size: 13pt; color: #2d3748; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10pt; }
    th { background-color: #edf2f7; color: #2d3748; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #cbd5e0; }
    td { padding: 10px; border: 1px solid #cbd5e0; vertical-align: top; }
    .id-cell { width: 70px; font-weight: bold; color: #3182ce; }
    .role-cell { width: 140px; }
    .goal-cell { width: 160px; font-weight: 600; }
    ul { margin: 5px 0; padding-left: 20px; }
    li { margin: 3px 0; }
    .overview { background-color: #f7fafc; padding: 15px; border-left: 4px solid #3182ce; margin: 20px 0; }
    .priority-table th { background-color: #2c5282; color: white; }
    .p0 { background-color: #fed7d7; }
    .p1 { background-color: #feebc8; }
    .p2 { background-color: #fefcbf; }
    .p3 { background-color: #c6f6d5; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 9pt; color: #718096; }
  </style>
</head>
<body>
  <h1>User Stories: Pharma Marketing Brainstorming Agent</h1>
  
  <div class="overview">
    <h3>Overview</h3>
    <p>This document outlines user stories for the Brainstorming Agent tool, which generates AI-powered challenge statements from marketing briefs for pharma marketing strategies.</p>
    <p><strong>Total User Stories:</strong> 45 | <strong>Functional Areas:</strong> 10</p>
  </div>

  ${sections.map(section => `
    <h2>${section.title}</h2>
    <table>
      <thead>
        <tr>
          <th class="id-cell">ID</th>
          <th class="role-cell">User Role</th>
          <th class="goal-cell">Goal/Feature</th>
          <th>Description</th>
          <th>Acceptance Criteria</th>
        </tr>
      </thead>
      <tbody>
        ${(userStories[section.key as keyof typeof userStories] || []).map(story => `
          <tr>
            <td class="id-cell">${story.id}</td>
            <td class="role-cell">${story.role}</td>
            <td class="goal-cell">${story.goal}</td>
            <td>${story.description}</td>
            <td><ul>${story.criteria.map(c => `<li>${c}</li>`).join('')}</ul></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `).join('')}

  <h2>Priority Matrix</h2>
  <table class="priority-table">
    <thead>
      <tr>
        <th style="width: 120px;">Priority</th>
        <th style="width: 280px;">User Stories</th>
        <th>Rationale</th>
      </tr>
    </thead>
    <tbody>
      ${priorityMatrix.map((row, idx) => `
        <tr class="${['p0', 'p1', 'p2', 'p3'][idx]}">
          <td><strong>${row.priority}</strong></td>
          <td>${row.stories}</td>
          <td>${row.rationale}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>Document Generated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <p>This user story set covers 45 distinct scenarios across 10 functional areas. The stories are designed to provide clear acceptance criteria for developers while giving designers context for user workflows and edge cases.</p>
  </div>
</body>
</html>`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with download buttons */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 print:hidden">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">User Stories Document</h1>
            <p className="text-sm text-muted-foreground">Pharma Marketing Brainstorming Agent</p>
          </div>
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

      {/* Document content */}
      <div className="mx-auto max-w-5xl px-6 py-8 print:py-0 print:px-0">
        <div className="space-y-8 print:space-y-6">
          {/* Title */}
          <div className="print:mb-8">
            <h1 className="text-3xl font-bold text-foreground print:text-2xl">
              User Stories: Pharma Marketing Brainstorming Agent
            </h1>
            <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4 print:bg-gray-50 print:border-gray-200">
              <h3 className="font-semibold text-foreground mb-2">Overview</h3>
              <p className="text-muted-foreground text-sm">
                This document outlines user stories for the Brainstorming Agent tool, which generates 
                AI-powered challenge statements from marketing briefs for pharma marketing strategies.
              </p>
              <p className="text-sm text-foreground mt-2">
                <strong>Total User Stories:</strong> 45 | <strong>Functional Areas:</strong> 10
              </p>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <div key={section.key} className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 print:text-lg">
                {section.title}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted/50 print:bg-gray-100">
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground w-20">ID</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground w-36">User Role</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground w-40">Goal/Feature</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">Description</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground w-64">Acceptance Criteria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(userStories[section.key as keyof typeof userStories] || []).map((story) => (
                      <tr key={story.id} className="hover:bg-muted/30 print:hover:bg-transparent">
                        <td className="border border-border px-3 py-2 font-medium text-primary">{story.id}</td>
                        <td className="border border-border px-3 py-2 text-muted-foreground">{story.role}</td>
                        <td className="border border-border px-3 py-2 font-medium text-foreground">{story.goal}</td>
                        <td className="border border-border px-3 py-2 text-muted-foreground">{story.description}</td>
                        <td className="border border-border px-3 py-2">
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {story.criteria.map((criterion, idx) => (
                              <li key={idx} className="text-xs">{criterion}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Priority Matrix */}
          <div className="space-y-4 print:break-before-page">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 print:text-lg">
              Priority Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground print:bg-gray-800 print:text-white">
                    <th className="border border-border px-3 py-2 text-left font-semibold w-32">Priority</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold w-72">User Stories</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityMatrix.map((row, idx) => (
                    <tr 
                      key={row.priority}
                      className={[
                        "bg-red-50 print:bg-red-50",
                        "bg-orange-50 print:bg-orange-50",
                        "bg-yellow-50 print:bg-yellow-50",
                        "bg-green-50 print:bg-green-50"
                      ][idx]}
                    >
                      <td className="border border-border px-3 py-2 font-semibold text-foreground">{row.priority}</td>
                      <td className="border border-border px-3 py-2 text-muted-foreground font-mono text-xs">{row.stories}</td>
                      <td className="border border-border px-3 py-2 text-muted-foreground">{row.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground print:mt-4 print:pt-4">
            <p className="mb-2">
              <strong>Document Generated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>
              This user story set covers 45 distinct scenarios across 10 functional areas. The stories are designed to provide 
              clear acceptance criteria for developers while giving designers context for user workflows and edge cases.
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:break-before-page { break-before: page; }
        }
      `}</style>
    </div>
  )
}
