# Interview Prep Sheet - Agent Guide

## Project Overview

Google Apps Script application for managing interview preparation questions in Google Sheets. Tracks candidate progress across multiple assessment sheets with role-based access control.

## Architecture

### Tech Stack
- **Runtime**: Google Apps Script (V8)
- **Deployment**: [clasp](https://github.com/nicereply/clasp) CLI
- **Types**: `@types/google-apps-script` for IDE support
- **Storage**: Google Sheets (no database)

### Sheet Structure
- **Assessment sheets**: JS, React Native, Web, AI, Soft Skills
- **Config_Users**: User registry (email, name, role, mentorChain)
- **Config_Topic**: Topic ordering and sheet mapping
- **Log**: Action audit trail

### Column Layout (Assessment Sheets)
| Col A | Col B | Col C | Col D+ |
|-------|-------|-------|--------|
| Topic | Question | Link | Candidate checkboxes |

Row 1 = candidate names, Row 2 = topic headers with COUNTIF formulas, Row 3+ = questions.

## Roles & Permissions

| Role | Users | Questions | Topics | Sheets | Controls |
|------|-------|-----------|--------|--------|----------|
| admin | Full | Full | Full | Full | Full |
| content_admin | View | Full | Full | Full | None |
| mentor | Team only | None | None | None | None |
| user | None | None | None | None | None |

## File Map

```
scripts/
├── Code.js              # onOpen menu builder
├── helpers.js           # Core utils: getUserRole, getSheet, getAssessmentSheets, logAction
├── userManager.js       # CRUD for users, candidate columns, Drive sync
├── questionManager.js   # CRUD for questions, search
├── topicManager.js      # CRUD for topics (add, rename, merge, reorder, remove)
├── formatting.js        # sortAndFormatAllSheets - master formatter
└── protection.js        # Sheet/range protection management

forms/
├── addUserForm.html
├── editUserForm.html
├── removeUserForm.html
├── userListDialog.html
├── addQuestionForm.html
├── editQuestionForm.html
├── removeQuestionForm.html
├── searchForm.html
├── addTopicForm.html
├── renameTopicForm.html
├── mergeTopicsForm.html
├── reorderTopicsForm.html
├── removeTopicForm.html
├── createSheetForm.html
├── renameSheetForm.html
├── deleteSheetForm.html
└── dashboardSearchForm.html

content/                 # Source question banks (markdown) - SKIP, not in active use
```

## Key Functions

### Authentication
- `getUserRole()` - Returns role of current user
- `requireAdmin()` - Throws if not admin
- `requireContentAdmin()` - Throws if not admin/content_admin
- `requireAdminOrMentor()` - Throws if not admin/content_admin/mentor
- `canManageCandidate(mentorChain)` - Checks if current user can manage a candidate

### Data Access
- `getSheet(name)` - Get sheet by name
- `getAssessmentSheets()` - All non-config sheets
- `getExistingUsers()` - Returns user array from Config_Users
- `getLastRowInColumns(sheet, columns)` - Find last row across columns
- `_getLastUserColumn(sheet)` - Last column with candidate name
- `_colToLetter(col)` - Column number to letter (4 → D)

### Formatting
- `sortAndFormatAllSheets(targetSheetName?)` - Master formatter: sorts by topic order, groups questions, applies colors, sets COUNTIF formulas, restores protections

### Protection
- `applyGranularProtection(sheetName, admins, contentAdmins, usersData)` - Per-column protection
- `restoreNativeProtections(sheet, activeCols, mentorMap)` - Restores after format

## Conventions

- **Language**: CommonJS modules (`require` not used, functions are global)
- **Naming**: camelCase for functions, PascalCase for sheet names
- **Error handling**: `throw new Error('message')` caught by HTML forms
- **Logging**: `logAction(action, details)` to Log sheet
- **Forms**: HTML served via `HtmlService.createHtmlOutputFromFile()`

## Common Tasks

### Adding a new assessment sheet
1. Create sheet manually or via `createSheetForm.html`
2. Ensure first 3 columns: Topic, Question, Link
3. Run `sortAndFormatAllSheets()` to apply formatting

### Adding questions
1. Use `addQuestions(sheetName, topic, questionsText)` where questionsText is newline-delimited, pipe-separated (`question|link`)
2. Auto-formats via `sortAndFormatAllSheets()`

### User onboarding
1. `addUser(name, email, role, mentorEmail)` creates user + candidate column
2. Mentor chain auto-propagates from parent mentor
3. Column protection applied automatically

## Deployment

```bash
npx clasp push    # Push local changes to Apps Script
npx clasp deploy  # Create new deployment version
```

## Gotchas

- `sortAndFormatAllSheets()` removes ALL protections before reapplying - any manual protections will be lost
- Topic headers in assessment sheets have empty question cell (col B = "") - this is how grouping is detected
- `editUser` in `helpers.js` and `userManager.js` both exist - `userManager.js` is the active version with mentor chain logic
- Column index 4 = first candidate column (1-indexed in Sheets API)
