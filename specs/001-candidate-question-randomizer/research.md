# Phase 0 Research: Candidate Question Randomizer

No items in Technical Context were left as `NEEDS CLARIFICATION` — the three open questions from
`/speckit-clarify` (sheet scope, sidebar + mark-as-answered, 3-vs-4 count) already resolved the
decisions that would otherwise have needed research. This document records the remaining
implementation-level decisions needed before design.

## 1. Sidebar vs. modal dialog

- **Decision**: Use `SpreadsheetApp.getUi().showSidebar(htmlOutput)` with a single sidebar HTML
  file (`forms/randomizeQuestionsPanel.html`), not `showModalDialog`.
- **Rationale**: The spec (Clarifications, FR-015) requires the panel to stay open alongside the
  sheet and reflect updates without being reopened — `showSidebar` keeps the panel mounted while
  the user continues interacting with the spreadsheet, which `showModalDialog` does not allow (a
  modal blocks interaction with the sheet underneath it).
- **Alternatives considered**: A modal dialog (rejected — blocks the sheet and does not match
  "persistent... alongside the sheet"); a separate web app deployment (rejected — adds a second
  deployment target and auth surface for no benefit over a bound sidebar).

## 2. Reading "answered" status per candidate

- **Decision**: Reuse the existing checkbox-per-candidate-column layout already used by
  `sortAndFormatAllSheets` and `addQuestions` (columns D+ hold `true`/`false` checkboxes, one
  column per candidate, one row per question). "Unanswered" means the cell for that candidate's
  column, on that question's row, is not `true`.
- **Rationale**: This is the only representation of answered/unanswered status that exists in the
  system (per Constitution Principle II, Sheets as Source of Truth); introducing a parallel status
  representation would violate that principle.
- **Alternatives considered**: A separate "answered" tracking sheet (rejected — duplicates existing
  state, no reconciliation story, violates Principle II).

## 3. Randomization algorithm

- **Decision**: For the selected candidate/sheet, read topic + question + link + candidate's
  checkbox value for all data rows in one range read (matching the existing `getSheetMetadata` /
  bulk-read pattern used elsewhere, e.g. `getQuestionsList`). Filter to rows where that candidate's
  checkbox is not `true`, group by topic (skipping empty-question header rows the same way
  `sortAndFormatAllSheets` detects them), then for each topic with ≥1 unanswered question pick a
  target count via `Math.random() < 0.5 ? 3 : 4`, and randomly sample that many (or all, if fewer
  are available) using a Fisher–Yates shuffle of that topic's unanswered question list.
- **Rationale**: A single bulk read then in-memory filter/group/shuffle keeps this to one
  `getValues()` call per generation, consistent with the project's existing performance-optimization
  conventions (`getSheetMetadata`, batch helpers in `helpers.js`) instead of per-cell reads.
- **Alternatives considered**: Per-row `getValue()` calls (rejected — many small API calls, slower,
  against the project's own optimization conventions); weighting selection by how long a question
  has been unanswered (rejected — not requested, adds unrequested complexity).

## 4. Mark-as-answered write-back

- **Decision**: Expose a single server function, e.g. `markQuestionAnswered(sheetName, row,
  candidateColumn)`, that re-validates the caller's permission for that candidate (via
  `canManageCandidate` for mentors, always-allow for admins) and then sets that single cell to
  `true` with `setValue(true)`, then calls `logAction('mark_question_answered', ...)`.
- **Rationale**: Matches FR-016/FR-018 and the idempotency edge case (setting `true` when it is
  already `true` is a no-op with no error) and reuses the existing per-action permission and logging
  pattern used by `userManager.js`/`questionManager.js` functions rather than introducing a new
  pattern.
- **Alternatives considered**: Batch "mark all shown as answered" in one call (rejected — not
  requested by the spec, which describes marking questions individually from the panel; can be
  added later without breaking this design if requested).

## 5. Candidate and sheet pickers

- **Decision**: Reuse `getCachedExistingUsers()` filtered to role `user` (candidates) and
  `canManageCandidate` (or admin bypass) to build the mentor's/admin's candidate list; reuse
  `getAssessmentSheets()` for the sheet list (already excludes `Config_Users`, `Config_Topics`,
  `Log`, and the other system sheets per its existing `systemSheets` exclusion list).
- **Rationale**: `getAssessmentSheets()` already implements exactly the sheet-scope decision from
  Clarifications (assessment sheets only) — no new filtering logic is needed. Candidate-vs-mentor
  association already lives in each user record's `mentorEmail` field, consumed via
  `canManageCandidate`.
- **Alternatives considered**: A new `getRandomizableSheets()` filter (rejected — `getAssessmentSheets()`
  already provides exactly the required scope; adding a parallel function would duplicate logic the
  Constitution's Simplicity principle asks to avoid).

## 6. Panel refresh after marking a question answered

- **Decision**: After a successful `markQuestionAnswered` call, the client-side script in
  `randomizeQuestionsPanel.html` removes that question from the currently displayed list (optimistic
  local update) rather than re-fetching and re-randomizing the whole list.
- **Rationale**: FR-017 requires the panel to reflect the change without closing/reopening; a full
  re-randomization on every single mark-as-answered click would needlessly change the rest of the
  list the user is still working through, which is not what "reflect the change" implies.
- **Alternatives considered**: Full re-generation after every mark (rejected — churns the rest of
  the list unnecessarily and costs an extra full read per click).
