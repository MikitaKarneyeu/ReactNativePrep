# Implementation Plan: Candidate Question Randomizer

**Branch**: `001-candidate-question-randomizer` | **Date**: 2026-09-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-candidate-question-randomizer/spec.md`

## Summary

Add a "Randomize Questions" feature to the Apps Script menu that lets a mentor (for their own
candidates) or an admin (for any candidate) pick a candidate and an assessment sheet, then opens a
persistent sidebar showing a randomly selected set of that candidate's unanswered questions (3 or 4
per topic, fewer if a topic has fewer left). From the sidebar the mentor/admin can mark any listed
question as answered, which updates that candidate's checkbox on the sheet in place. Built as new
functions in a `questionRandomizer.js` script plus one new sidebar HTML file, reusing existing
role-guard, sheet-access, and logging helpers — no new storage, dependencies, or external services.

## Technical Context

**Language/Version**: Google Apps Script (V8 runtime), ES5-leaning JavaScript style matching the
existing codebase (`var`, function declarations, no ES6 modules)

**Primary Dependencies**: Built-in Apps Script services only — `SpreadsheetApp`, `HtmlService`,
`Session`; no external libraries or npm packages at runtime (`@types/google-apps-script` remains a
dev-only type dependency)

**Storage**: Google Sheets only (assessment sheet checkbox columns are the sole persisted state;
the randomized list itself is never persisted — see spec Assumptions)

**Testing**: No automated test harness exists in this project (`npm test` is a stub). Validation is
manual against a real or copy spreadsheet, per Constitution's Additional Constraints section and
this feature's `quickstart.md`

**Target Platform**: Google Sheets bound Apps Script project, deployed via `clasp`

**Project Type**: Single Apps Script project (menu-driven tool bound to a spreadsheet) — no
frontend/backend split, no mobile component

**Performance Goals**: Sidebar list must appear within a couple of seconds for sheets with the
project's current realistic data volume (tens of topics, low hundreds of question rows, tens of
candidate columns); no hard SLA requested

**Constraints**: Must work within Apps Script execution time limits for a single UI-triggered call;
must not require new Google Cloud services, OAuth scopes beyond what the bound script already has,
or persistent state outside the spreadsheet

**Scale/Scope**: Single spreadsheet, existing user/candidate/question volumes as described in
`AGENTS.md`; no multi-spreadsheet or multi-tenant scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Role-Based Access Control | Every entry point (opening the picker, generating the list, marking a question answered) MUST call `requireAdminOrMentor()` and, for mentors, MUST verify the chosen candidate via `canManageCandidate()` before returning any data or applying any write | PASS (planned) |
| II. Sheets as Source of Truth | No new persistent store is introduced; the randomized list is computed on demand from existing sheet data and answered-status writes go to the existing checkbox cell | PASS |
| III. Consistent Structure & Formatting | Feature only reads the existing Topic/Question/Link/candidate-column layout and writes a single boolean checkbox cell; it does not alter `sortAndFormatAllSheets()`'s assumptions or reserved columns | PASS |
| IV. Auditability | Both "generated a randomized list" and "marked a question answered from the panel" MUST call `logAction(...)` | PASS (planned, FR-014/FR-018) |
| V. Simplicity & Convention Adherence | New code follows existing conventions: global functions, camelCase, `throw new Error(...)`, HTML served via `HtmlService`, reuses `requireAdminOrMentor`, `canManageCandidate`, `getAssessmentSheets`, `getCachedExistingUsers`, `getSheetMetadata`, `logAction` rather than reinventing them | PASS (planned) |

No violations requiring the Complexity Tracking table.

**Post-Phase 1 re-check**: `research.md` and `data-model.md` confirm no new persistent structures,
no bypassed guards, and no deviation from the existing checkbox/logging conventions — all five
rows above still PASS after design.

## Project Structure

### Documentation (this feature)

```text
specs/001-candidate-question-randomizer/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No `contracts/` directory: this feature exposes no external API, CLI, or service boundary — its
only interface is Apps Script server functions called from one new HTML sidebar via
`google.script.run`, which is documented in `data-model.md` and `quickstart.md` instead of a
separate contracts folder.

### Source Code (repository root)

```text
scripts/
├── Code.js                  # onOpen menu builder — add one menu item to open the randomizer
├── helpers.js                # Reused as-is: requireAdminOrMentor, canManageCandidate,
│                              # getAssessmentSheets, getCachedExistingUsers, getSheetMetadata,
│                              # logAction, getSheet
├── questionManager.js        # Reused for reference (existing question-reading patterns);
│                              # not modified
└── questionRandomizer.js     # NEW: candidate list for current user, sheet list, randomized
                               # selection logic, mark-as-answered write-back, all called from
                               # the sidebar via google.script.run

forms/
└── randomizeQuestionsPanel.html   # NEW: sidebar UI — candidate picker, sheet picker, generated
                                    # list grouped by topic, per-question "mark answered" control
```

**Structure Decision**: This is a single-project Apps Script tool with no existing directory
separation beyond `scripts/` (server-side `.js`) and `forms/` (client-side `.html`), so the new
feature adds one file to each of those two existing directories and a small addition to
`Code.js`'s menu — matching how every prior feature (users, questions, topics, sheets) was added.

## Complexity Tracking

*No Constitution Check violations — table intentionally omitted.*
