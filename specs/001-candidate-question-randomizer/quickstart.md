# Quickstart: Candidate Question Randomizer

Manual validation guide (this project has no automated test harness — see `plan.md` Technical
Context and the Constitution's Additional Constraints section).

## Prerequisites

- A copy of the spreadsheet (do not validate against production data) with `clasp` pushed to it:
  `npx clasp push`.
- At least one assessment sheet (e.g. `React Native`) with:
  - 2+ topics, each with 5+ question rows, so both the "3-or-4" and "fewer than 3 left" paths are
    reachable.
  - At least one candidate column with a realistic mix of `true`/`false` checkboxes.
- Three test accounts (or role-switching via `Config_Users`, per `AGENTS.md`'s role matrix):
  1. A **mentor** whose `mentorEmail` chain includes the test candidate.
  2. An **admin**.
  3. A **plain `user`** (should be refused access entirely).

## Scenario 1 — Mentor generates a list for their own candidate (User Story 1, spec FR-001–FR-010)

1. Open the spreadsheet as the mentor account.
2. Open the menu item added by this feature (see `plan.md` Project Structure — added under the
   existing `📋 Interview Tools` menu).
3. Select the test candidate and the prepared assessment sheet.
4. **Expect**: A sidebar opens (not a modal — you can still click cells on the sheet while it's
   open) showing questions grouped by topic, 3 or 4 per topic that had that many unanswered, all of
   a topic's questions if it had fewer than 3.
5. Manually cross-check against the sheet: every listed question's checkbox for this candidate is
   currently unchecked; no answered question appears.
6. Close and reopen the panel for the same candidate/sheet. **Expect**: a different random subset
   for any topic that had more unanswered questions than were shown (per SC-003; not guaranteed on
   every single retry, but should differ across a handful of retries).

## Scenario 2 — Marking a question answered from the panel (spec FR-016–FR-018, User Story 1
acceptance scenario 4)

1. With the panel open from Scenario 1, click the "mark answered" control on one listed question.
2. **Expect**: The question disappears from (or is visually marked done in) the panel without the
   panel closing or needing a manual refresh (FR-017).
3. Switch to the sheet tab. **Expect**: That candidate's checkbox for that exact question row is now
   checked.
4. Check the `Log` sheet. **Expect**: A new row for action `mark_question_answered` with this
   mentor's identity, the candidate, sheet, and question.

## Scenario 3 — Admin generates a list for a candidate outside their own mentor chain (User Story 2,
spec FR-002, FR-008)

1. Open the spreadsheet as the admin account.
2. Open the same menu item; select a candidate mentored by someone else, and the same assessment
   sheet.
3. **Expect**: The panel opens and produces a list the same way as Scenario 1 — no restriction
   based on mentor chain for the admin role.

## Scenario 4 — Access control refusals (spec FR-011, FR-012)

1. As the mentor account, attempt to select a candidate **not** in that mentor's chain (if the UI
   allows constructing such a request, e.g. via directly invoking the server function during
   development). **Expect**: The request is refused with a clear error, no data is returned.
2. As the plain `user` account, attempt to open the feature's menu item at all. **Expect**: Either
   the menu item is not present (consistent with `onOpen`'s existing role-based menu construction)
   or, if reached, the request is refused with a clear error.

## Scenario 5 — Empty/edge states (spec Edge Cases, FR-013)

1. Pick a candidate who has answered every question on the selected sheet. **Expect**: A clear
   "nothing to practice" message instead of an empty or blank panel.
2. Pick a sheet the chosen candidate has no column on at all. **Expect**: A clear "no data on this
   sheet for this candidate" message.
3. As a mentor with zero candidates, open the feature. **Expect**: A clear "you have no candidates"
   message instead of an empty picker.

## Log verification

After running Scenarios 1–3, confirm the `Log` sheet has one `randomize_questions` row per
successful generation (FR-014), in addition to the `mark_question_answered` row from Scenario 2.
