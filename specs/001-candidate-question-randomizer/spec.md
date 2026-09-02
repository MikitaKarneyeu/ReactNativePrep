# Feature Specification: Candidate Question Randomizer

**Feature Branch**: `001-candidate-question-randomizer`

**Created**: 2026-09-02

**Status**: Draft

**Input**: User description: "I need to implement a function to randomise the question from the table. mentor should pick a person from the list of its candidates and questions that are not marked as answered should be rundomised and outputed as list of questions (3-4 for each topic). mentor or admin should pick a sheets from what he want randomised questions."

## Clarifications

### Session 2026-09-02

- Q: Which sheets should be selectable as a source for the randomized question list? → A: Only assessment sheets (JS, React Native, Web, AI, Soft Skills, and any future ones with the standard Topic/Question/Link/candidate-column layout)
- Q: Where should the randomized question list be presented, and should it support marking questions answered? → A: Presented in a persistent sidebar panel (not a one-shot dialog) that stays open alongside the sheet; the mentor/admin can mark any listed question as answered directly from the panel, and that marks the candidate's checkbox for that question on the sheet itself.
- Q: Should the number of questions picked per topic always try to hit exactly 4, or randomly vary between 3 and 4? → A: Randomly pick either 3 or 4 per topic on each generation, even when more are available; if fewer than 3 unanswered questions exist in a topic, show all of them.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mentor generates a practice list for their candidate (Priority: P1)

A mentor wants to prepare a short, varied practice session for one of their candidates. They pick
the candidate from their own list of candidates, pick the assessment sheet (e.g. JS, React Native,
Web, AI, Soft Skills) to draw questions from, and receive a randomized list of a few questions per
topic — pulled only from questions that candidate has not yet answered.

**Why this priority**: This is the core value of the feature and the primary use case described by
the requester; without it there is nothing to deliver.

**Independent Test**: Can be fully tested by having a mentor with at least one candidate select that
candidate and a sheet, and verifying the resulting list only contains unanswered questions grouped
by topic, with a new run producing a different random subset when more unanswered questions exist
than the per-topic limit.

**Acceptance Scenarios**:

1. **Given** a mentor manages a candidate who has unanswered questions across multiple topics on a
   sheet, **When** the mentor selects that candidate and that sheet and requests a randomized list,
   **Then** the system returns a list grouped by topic, with 3-4 questions per topic (or fewer if a
   topic has fewer unanswered questions), containing only questions not marked as answered for that
   candidate.
2. **Given** the same candidate and sheet with more than 4 unanswered questions in a topic,
   **When** the mentor requests the randomized list twice in a row, **Then** the two results are not
   guaranteed to be identical (the selection is randomized on each generation).
3. **Given** a topic on the selected sheet where the candidate has answered every question,
   **When** the randomized list is generated, **Then** that topic is omitted from the output rather
   than shown empty.
4. **Given** a randomized list open in the sidebar, **When** the mentor marks one of the listed
   questions as answered from the panel, **Then** that candidate's checkbox for that question is
   marked answered on the sheet, and the change is reflected in the sidebar without the mentor
   needing to switch back to the sheet.

---

### User Story 2 - Admin generates a practice list for any candidate (Priority: P2)

An admin wants the same randomized practice list capability as a mentor, but for any candidate in
the system (not limited to their own mentor chain), for oversight, spot-checks, or helping a mentor
who is unavailable.

**Why this priority**: Extends the same value to the admin role per the stated requirement, but the
mentor flow (User Story 1) already delivers the core capability, so this is a close second rather
than a blocker for MVP.

**Independent Test**: Can be fully tested by having an admin select a candidate that is not in
their own mentor chain (or has no mentor at all) and a sheet, and confirming the randomized list is
produced the same way as for a mentor's own candidate.

**Acceptance Scenarios**:

1. **Given** an admin and a candidate who is mentored by someone else, **When** the admin selects
   that candidate and a sheet and requests a randomized list, **Then** the system produces the list
   exactly as it would for that candidate's own mentor.
2. **Given** a mentor who is not managing a particular candidate, **When** that mentor attempts to
   generate a list for that candidate, **Then** the system MUST refuse the request.

---

### Edge Cases

- What happens when the selected candidate has zero unanswered questions on the selected sheet
  across all topics? The system MUST report that there is nothing to practice rather than return an
  empty or misleading list.
- What happens when the selected sheet has no column for the selected candidate at all (candidate
  was never added to that assessment sheet)? The system MUST report that the candidate has no data
  on that sheet rather than fail silently or crash.
- What happens when a mentor has no candidates at all? The system MUST inform the mentor there is
  no one to select instead of presenting an empty, confusing picker.
- How does the system handle a topic that exists only as a header row with no questions under it?
  Such a topic MUST be skipped since there is nothing to randomize.
- What happens when a non-mentor, non-admin user (role `user`) attempts to use this feature?
  The system MUST refuse the request, consistent with that role having no access to candidate data.
- What happens when a question is marked answered from the sidebar but that same question was
  already changed directly on the sheet in the meantime (e.g., someone else marked it answered)?
  The system MUST apply the mentor's mark-as-answered action idempotently (the checkbox ends up
  answered either way) without erroring.
- What happens when the mentor or admin closes the sidebar and reopens it for the same candidate
  and sheet? The system MUST generate a fresh randomized selection rather than reuse the previous
  one, so questions already marked answered in the meantime are naturally excluded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a mentor to choose one candidate from the set of candidates that
  mentor is authorized to manage (their direct and downstream mentor chain).
- **FR-002**: System MUST allow an admin to choose any candidate in the system, not limited to a
  mentor chain.
- **FR-003**: System MUST allow the mentor or admin to choose which assessment sheet (e.g. JS,
  React Native, Web, AI, Soft Skills, or any future sheet with the standard Topic/Question/Link/
  candidate-column layout) the randomized questions are drawn from. Non-assessment sheets
  (Config_Users, Config_Topic, Log) MUST NOT be selectable.
- **FR-004**: System MUST determine, for the selected candidate and sheet, which questions are
  marked as answered versus not answered, using that candidate's existing progress markers on the
  sheet.
- **FR-005**: System MUST exclude any question already marked as answered for the selected
  candidate from the randomized output.
- **FR-006**: System MUST group the unanswered questions by their topic before selecting a random
  subset.
- **FR-007**: For each topic that has at least 3 unanswered questions, System MUST randomly choose a
  target count of either 3 or 4 (chosen randomly on each generation) and then randomly select that
  many unanswered questions from the topic; when a topic has fewer than 3 unanswered questions,
  System MUST include all of them.
- **FR-008**: System MUST omit a topic from the output entirely when the candidate has zero
  unanswered questions in that topic.
- **FR-009**: System MUST produce a different random subset on repeated generations for the same
  candidate and sheet whenever more unanswered questions exist in a topic than the selected count.
- **FR-010**: System MUST present the resulting list grouped by topic, showing each selected
  question's text (and its reference link when one exists).
- **FR-011**: System MUST prevent a mentor from generating a randomized list for a candidate the
  mentor does not manage.
- **FR-012**: System MUST prevent a user with role `user` (no management permissions) from
  generating a randomized list for any candidate.
- **FR-013**: System MUST inform the requester clearly when there are no unanswered questions to
  randomize, when the candidate has no data on the selected sheet, or when the mentor has no
  candidates to choose from, instead of returning a misleading empty result.
- **FR-014**: System MUST record who generated a randomized list, for which candidate, and on which
  sheet, consistent with the project's existing audit logging of mutating and access-sensitive
  actions.
- **FR-015**: System MUST present the randomized list in a persistent side panel that remains open
  alongside the sheet, rather than a one-shot dialog the user must reopen to see the list again.
- **FR-016**: System MUST allow the mentor or admin to mark any question shown in the panel as
  answered, and doing so MUST mark that candidate's checkbox for that question as answered on the
  underlying sheet.
- **FR-017**: System MUST reflect a question marked answered from the panel in the panel's own
  display (e.g., visually distinguished or removed from the active list) without requiring the
  panel to be closed and reopened.
- **FR-018**: System MUST log marking a question answered from the panel the same way as marking it
  answered directly on the sheet, consistent with existing audit logging.

### Key Entities

- **Candidate**: A person being assessed, represented by a dedicated column on one or more
  assessment sheets; has a mentor chain determining who may manage them.
- **Question**: A single interview question belonging to a topic on an assessment sheet; has text,
  an optional reference link, and an answered/unanswered status per candidate.
- **Topic**: A named grouping of questions within an assessment sheet, used to organize both the
  sheet layout and the randomized output.
- **Randomized Practice List**: The result of this feature — a topic-grouped selection of a
  candidate's unanswered questions, generated on demand and shown in a persistent side panel. The
  list itself is not stored as a new record, but actions taken from it (marking a question
  answered) are written to the candidate's existing checkbox on the sheet and logged like any other
  answered-status change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A mentor or admin can go from selecting a candidate and a sheet to viewing a
  randomized practice list in a single guided flow, without needing to manually scan the sheet for
  unanswered questions.
- **SC-002**: 100% of questions returned in a randomized list are questions the selected candidate
  has not yet answered on the selected sheet.
- **SC-003**: For any topic with 4 or more unanswered questions, at least 90% of repeated
  generations for the same candidate and sheet produce a different set of selected questions for
  that topic, confirming the selection is meaningfully randomized rather than fixed.
- **SC-004**: 100% of attempts by a mentor to generate a list for a candidate outside their mentor
  chain are refused.

## Assumptions

- The randomized list itself (which questions were selected and in what order) is not written back
  into the assessment sheet as new rows or columns; only explicit mark-as-answered actions taken
  from the panel are written back, using the candidate's existing checkbox column rather than any
  new data structure.
- "3-4 questions for each topic" means the system randomly decides, per topic per generation,
  whether to select 3 or 4 questions (rather than always maximizing to 4); when fewer than 3
  unanswered questions exist in a topic, all of them are included regardless of the chosen target.
- A mentor's "list of candidates" means the candidates that mentor is currently authorized to
  manage under the existing mentor-chain rules already used elsewhere in the system (e.g. for
  editing candidate data), not a separate or new definition of ownership.
- Every assessment sheet (current and future) that follows the standard Topic/Question/Link/
  candidate-column layout is eligible to be selected as a source for randomization; config and log
  sheets are excluded automatically because they do not match that layout, not via a manually
  maintained allow-list.
- Generating a randomized list is treated as an access-sensitive action worth logging (who, for
  which candidate, on which sheet), consistent with how other candidate-data operations are
  already logged in this system, even though generating the list itself does not modify sheet data
  (only a subsequent mark-as-answered action from the panel does, per FR-018).
