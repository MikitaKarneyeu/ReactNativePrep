# Phase 1 Data Model: Candidate Question Randomizer

No new persistent storage is introduced (Constitution Principle II). This document describes the
existing sheet-backed entities this feature reads and writes, and the transient in-memory shapes
passed between server and sidebar.

## Existing persisted entities (read/written, not newly created)

### Candidate
- **Represented by**: A user record (`Config_Users`) with role `user`, plus a corresponding header
  cell in row 1 of one or more assessment sheets naming that candidate's column.
- **Fields used by this feature**: `name`, `email`, `mentorEmail` (comma-separated mentor chain).
- **Used for**: Building the mentor's candidate picker (via `canManageCandidate`) and the admin's
  unrestricted candidate picker; resolving which column on the selected sheet is that candidate's.

### Question (assessment sheet row)
- **Represented by**: A data row (row ≥ 3) on an assessment sheet: column A = topic, column B =
  question text, column C = link, columns D+ = one boolean checkbox per candidate.
- **Fields used by this feature**: topic (col A), question text (col B), link (col C), and the
  selected candidate's checkbox value (col D+).
- **Used for**: Determining answered/unanswered status per candidate and building the randomized
  selection.
- **Validation/derivation rule carried over from existing formatter**: a row with an empty question
  cell (col B) is a topic header row, not a question, and is skipped — same rule
  `sortAndFormatAllSheets` already uses.

### Topic
- **Represented by**: The distinct values in column A across an assessment sheet's data rows (and
  optionally registered in `Config_Topics` for ordering).
- **Fields used by this feature**: topic name only (grouping key); topic order from
  `Config_Topics` is not required for this feature since output order within the panel is not
  specified as needing to match sheet order.
- **Used for**: Grouping unanswered questions before per-topic random selection.

### Candidate's answered-status cell
- **Represented by**: A single boolean cell at (question row, candidate column) on an assessment
  sheet.
- **Write performed by this feature**: `setValue(true)` when the mentor/admin marks that question
  answered from the panel (FR-016). This feature never sets a cell back to unanswered — that
  remains a manual sheet edit, consistent with existing behavior elsewhere in the app.

### Log entry
- **Represented by**: An appended row on the `Log` sheet via `logAction(action, details)`.
- **New actions this feature introduces**:
  - `randomize_questions` — recorded when a randomized list is generated; details include acting
    user (implicit via `logAction`), candidate name/email, and sheet name (FR-014).
  - `mark_question_answered` — recorded when a question is marked answered from the panel; details
    include candidate name/email, sheet name, topic, and question text (FR-018).

## Transient shapes (server ↔ sidebar only, never persisted)

### CandidateOption
```
{ name: string, email: string }
```
One entry per candidate selectable by the current user (mentor: their managed candidates; admin:
all candidates).

### SheetOption
```
{ name: string }
```
One entry per sheet returned by `getAssessmentSheets()`.

### RandomizedTopicGroup
```
{
  topic: string,
  questions: [
    { row: number, question: string, link: string }
  ]
}
```
An array of these, one per topic that has at least one unanswered question, is what the "generate"
call returns to the sidebar. `row` is carried along solely so a later "mark answered" click can
identify which sheet row/candidate-column cell to update — it is not displayed to the user.

### MarkAnsweredRequest / Result
```
// request (implicit: function args)
{ sheetName: string, row: number, candidateEmail: string }

// result
{ success: boolean }
```
On success the sidebar removes that question from its local `RandomizedTopicGroup` list (see
research.md §6); on failure (permission denied, row no longer valid) the sidebar surfaces the error
message thrown by the server function.

## State transitions

The only state transition this feature performs is: a question's per-candidate checkbox goes from
`false`/empty → `true` (unanswered → answered), triggered by the "mark answered" action. There is no
reverse transition, no intermediate states, and no transition for the randomized list itself (it is
recomputed fresh on every "generate" call, never stored — see spec Assumptions and Edge Cases).
