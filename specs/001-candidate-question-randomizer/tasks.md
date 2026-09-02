---

description: "Task list template for feature implementation"
---

# Tasks: Candidate Question Randomizer

**Input**: Design documents from `/specs/001-candidate-question-randomizer/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated test harness exists in this project (`npm test` is a stub). No test tasks
are generated; validation is manual via `quickstart.md` (Polish phase includes running it).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing
of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single Apps Script project: server code in `scripts/`, sidebar UI in `forms/`. New files:
`scripts/questionRandomizer.js`, `forms/randomizeQuestionsPanel.html`. Existing files reused as-is:
`scripts/helpers.js` (`requireAdminOrMentor`, `canManageCandidate`, `getAssessmentSheets`,
`getCachedExistingUsers`, `getSheetMetadata`, `logAction`, `getSheet`); `scripts/Code.js` gets one
new menu item.

---

## Phase 1: Setup

**Purpose**: Create the new file skeletons this feature adds

- [X] T001 Create `scripts/questionRandomizer.js` with a file-level comment-free skeleton (no
      logic yet) so subsequent tasks have a file to add functions to
- [X] T002 Create `forms/randomizeQuestionsPanel.html` with a minimal HTML skeleton (`<div>`
      containers for candidate picker, sheet picker, and results list; a `<script>` block for
      `google.script.run` wiring to be filled in by later tasks)

**Checkpoint**: Empty files exist; no behavior yet

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Server-side entry points and data-fetch helpers every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 In `scripts/questionRandomizer.js`, implement `getRandomizerCandidates()`: calls
      `requireAdminOrMentor()`, then returns a `CandidateOption[]` (`{name, email}`) — for an admin,
      every user with role `user` from `getCachedExistingUsers()`; for a mentor, that same set
      filtered through `canManageCandidate(user.mentorEmail)`; throw a clear error if the resulting
      list is empty ("you have no candidates") per FR-013 and the Edge Cases section
- [X] T004 [P] In `scripts/questionRandomizer.js`, implement `getRandomizerSheets()`: calls
      `requireAdminOrMentor()`, then returns a `SheetOption[]` (`{name}`) from
      `getAssessmentSheets()`
- [X] T005 In `scripts/questionRandomizer.js`, implement the shared internal helper
      `resolveCandidateColumn_(sheet, candidateEmail)` that reads header row 1 via
      `getSheetMetadata(sheet)` (or a direct header range read) and returns the 1-based column index
      matching the candidate's email/name, or `null` if not found — used by both generation and
      mark-as-answered so the "no data on this sheet for this candidate" check (FR-013, Edge Cases)
      is implemented once
- [X] T006 In `scripts/Code.js`, add one menu item ("Randomize Questions" or similar) under the
      existing `📋 Interview Tools` menu, wired to a new `showRandomizeQuestionsPanel()` function,
      visible to admin and mentor roles only (matching the existing role-based menu construction
      pattern already used for other items)
- [X] T007 In `scripts/questionRandomizer.js`, implement `showRandomizeQuestionsPanel()`: calls
      `requireAdminOrMentor()`, builds the sidebar via
      `HtmlService.createHtmlOutputFromFile('forms/randomizeQuestionsPanel')` (per research.md §1),
      sets a title, and calls `SpreadsheetApp.getUi().showSidebar(...)`

**Checkpoint**: Menu item opens an (empty) sidebar; candidate/sheet server functions are callable
and permission-checked — user story implementation can now begin

---

## Phase 3: User Story 1 - Mentor generates a practice list for their candidate (Priority: P1) 🎯 MVP

**Goal**: A mentor picks one of their own candidates and an assessment sheet, and receives a
randomized, topic-grouped list of that candidate's unanswered questions in a persistent sidebar,
with the ability to mark any listed question answered from the panel.

**Independent Test**: A mentor with at least one candidate selects that candidate and a sheet;
verify the resulting list only contains unanswered questions grouped by topic (3-4 per topic, or
fewer if fewer exist), that a repeat generation can differ, and that marking a question answered
from the panel checks that candidate's box on the sheet and logs the action.

### Implementation for User Story 1

- [X] T008 [US1] In `scripts/questionRandomizer.js`, implement the internal helper
      `readUnansweredQuestionsByTopic_(sheet, candidateColumn)`: one bulk `getValues()` read of the
      data rows (row ≥ 3, per data-model.md), skip rows with an empty question cell (col B, same
      rule as `sortAndFormatAllSheets`), skip rows where the candidate's column cell is `true`, and
      group the remaining `{row, question, link}` entries by topic (col A) into a
      `Map<topic, entries[]>` — implements research.md §3's single-read approach
- [X] T009 [US1] In `scripts/questionRandomizer.js`, implement the internal helper
      `pickRandomSubset_(entries)`: picks a target count via `Math.random() < 0.5 ? 3 : 4`, then
      returns that many entries (or all of them if fewer are available) selected via a Fisher–Yates
      shuffle, per FR-007 and research.md §3
- [X] T010 [US1] In `scripts/questionRandomizer.js`, implement `generateRandomizedQuestions(sheetName,
      candidateEmail)`: calls `requireAdminOrMentor()`; for a mentor caller, calls
      `canManageCandidate(candidate.mentorEmail)` and refuses (throws) if the candidate is not
      managed by that mentor (FR-011); resolves the candidate column via `resolveCandidateColumn_`
      and throws a clear "no data on this sheet for this candidate" error if not found (FR-013);
      calls `readUnansweredQuestionsByTopic_` and, for each topic with ≥1 unanswered question, calls
      `pickRandomSubset_` and builds a `RandomizedTopicGroup[]` (per data-model.md), omitting topics
      with zero unanswered questions (FR-008); throws a clear "nothing to practice" error if the
      resulting array is empty (FR-013); calls `logAction('randomize_questions', {candidate, sheet})`
      on success (FR-014) before returning the result
- [X] T011 [US1] In `scripts/questionRandomizer.js`, implement `markQuestionAnswered(sheetName, row,
      candidateEmail)`: calls `requireAdminOrMentor()`; for a mentor caller, re-validates
      `canManageCandidate` for that candidate (FR-011 applies here too, not just at generation time);
      resolves the candidate column via `resolveCandidateColumn_`; calls `setValue(true)` on that
      cell (idempotent no-op if already `true`, per the Edge Cases concurrency note); calls
      `logAction('mark_question_answered', {candidate, sheet, topic, question})` (FR-018); returns
      `{success: true}`
- [X] T012 [US1] In `forms/randomizeQuestionsPanel.html`, build the candidate and sheet picker UI:
      on load, call `google.script.run.getRandomizerCandidates()` and `getRandomizerSheets()` to
      populate two `<select>` elements (or an equivalent picker), surface any thrown error (e.g. "you
      have no candidates") as a visible message in the panel instead of a blank UI, and show a
      "Generate" button that calls `generateRandomizedQuestions(sheetName, candidateEmail)`
- [X] T013 [US1] In `forms/randomizeQuestionsPanel.html`, render the `RandomizedTopicGroup[]` result
      from "Generate" grouped by topic, each question showing its text and link (when present, per
      FR-010), with a per-question "Mark answered" control; surface thrown errors (no data on sheet,
      nothing to practice) as a visible panel message per FR-013 rather than a blank list
- [X] T014 [US1] In `forms/randomizeQuestionsPanel.html`, wire each "Mark answered" control to call
      `google.script.run.markQuestionAnswered(sheetName, row, candidateEmail)` and, on success,
      remove that question from the currently displayed list client-side (optimistic local update,
      per research.md §6 and FR-017) without re-fetching or re-randomizing the rest of the list;
      surface a thrown error inline on that question if the call fails

**Checkpoint**: User Story 1 is fully functional and independently testable per quickstart.md
Scenarios 1 and 2

---

## Phase 4: User Story 2 - Admin generates a practice list for any candidate (Priority: P2)

**Goal**: An admin gets the same randomized list capability for any candidate, not limited to their
own mentor chain.

**Independent Test**: An admin selects a candidate mentored by someone else (or with no mentor) and
a sheet, and confirms the randomized list is produced exactly as it would be for that candidate's
own mentor (quickstart.md Scenario 3).

### Implementation for User Story 2

- [X] T015 [US2] Verify (and adjust if needed) that `getRandomizerCandidates()` (T003) already
      returns the full candidate set for an admin caller with no mentor-chain filtering — this should
      already hold from T003's admin branch; this task is the explicit check/fix pass for FR-002
- [X] T016 [US2] Verify (and adjust if needed) that `generateRandomizedQuestions` (T010) and
      `markQuestionAnswered` (T011) skip the `canManageCandidate` check entirely for admin callers
      (unrestricted access per FR-002), while still requiring `requireAdminOrMentor()` to have
      passed

**Checkpoint**: Both user stories work independently; admin has unrestricted candidate access,
mentor access remains scoped to their chain

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Access-control refusal paths, edge-state messaging, and manual validation

- [X] T017 [P] In `scripts/questionRandomizer.js`, confirm every exported entry point
      (`getRandomizerCandidates`, `getRandomizerSheets`, `generateRandomizedQuestions`,
      `markQuestionAnswered`, `showRandomizeQuestionsPanel`) begins with `requireAdminOrMentor()` so a
      plain `user`-role caller is refused before any data is read (FR-012, Edge Cases)
- [X] T018 [P] In `forms/randomizeQuestionsPanel.html`, ensure every `google.script.run` failure
      handler displays the server's thrown error message to the user rather than failing silently,
      covering all FR-013 messages (no candidates, no data on sheet, nothing to practice) and the
      FR-011/FR-012 refusal messages
- [ ] T019 Run `quickstart.md` Scenarios 1-5 end to end against a copy spreadsheet with mentor,
      admin, and plain `user` test accounts; confirm `Log` sheet rows for `randomize_questions` and
      `mark_question_answered` match the expected details (data-model.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion; in practice reuses/verifies
  T003/T010/T011 from User Story 1, so implement after Phase 3 even though it introduces no new
  functions of its own
- **Polish (Phase 5)**: Depends on Phases 3 and 4 being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories; delivers the MVP
- **User Story 2 (P2)**: Functionally independent (admin path already exists in the shared
  functions built for US1), but its verification tasks (T015, T016) are only meaningful once T003,
  T010, T011 exist, so sequence it after Phase 3 in practice

### Within Each User Story

- Read/grouping helpers (T008) before random-subset selection (T009) before the generation entry
  point (T010)
- Server functions (T010, T011) before the sidebar UI that calls them (T012-T014)

### Parallel Opportunities

- T004 can run in parallel with T003 (different concerns, same file — coordinate if editing
  simultaneously)
- T017 and T018 (Polish phase) can run in parallel — different files
- Phase 4 tasks (T015, T016) are verification/adjustment passes and can be done alongside final
  Phase 3 UI tasks (T012-T014) once T003, T010, T011 land

---

## Parallel Example: Foundational Phase

```bash
# After T001/T002 skeletons exist:
Task: "Implement getRandomizerCandidates() in scripts/questionRandomizer.js"
Task: "Implement getRandomizerSheets() in scripts/questionRandomizer.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run quickstart.md Scenarios 1 and 2 with a mentor account
5. Deploy/demo if ready — mentor-facing randomization and mark-as-answered is a usable MVP on its own

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (menu item + pickers work)
2. Add User Story 1 → Test independently with a mentor account → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently with an admin account → Deploy/Demo
4. Polish → Run all quickstart.md scenarios including access-control refusals (Scenario 4) and edge
   states (Scenario 5)

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks are included — this project has no automated test harness (see plan.md Technical
  Context); validation is the manual `quickstart.md` run in T019
- Every server-side task must call `requireAdminOrMentor()` first and, where a specific candidate is
  involved, `canManageCandidate()` for mentor callers — this is the Constitution's Principle I gate
  and is non-negotiable per plan.md's Constitution Check
- Commit after each task or logical group
- Stop at the Phase 3 checkpoint to validate User Story 1 independently before starting Phase 4
