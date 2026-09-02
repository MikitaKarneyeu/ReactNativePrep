/**
 * Candidate Question Randomizer: candidate/sheet pickers, randomized selection,
 * and mark-as-answered write-back for the sidebar panel.
 */

function showRandomizeQuestionsPanel() {
  requireAdminOrMentor();

  var html = HtmlService.createHtmlOutputFromFile('forms/randomizeQuestionsPanel')
    .setTitle('Randomize Questions');
  SpreadsheetApp.getUi().showSidebar(html);
}

function getRandomizerCandidates() {
  requireAdminOrMentor();

  var role = getUserRole();
  var users = getCachedExistingUsers();
  var candidates = users.filter(function (u) {
    return u.role === 'user';
  });

  if (role !== 'admin') {
    candidates = candidates.filter(function (u) {
      return canManageCandidate(u.mentorEmail);
    });
  }

  if (candidates.length === 0) {
    throw new Error('You have no candidates to select.');
  }

  return candidates.map(function (u) {
    return { name: u.name, email: u.email };
  });
}

function getRandomizerSheets() {
  requireAdminOrMentor();

  return getAssessmentSheets().map(function (name) {
    return { name: name };
  });
}

// Resolves the 1-based column of the candidate on this sheet, or null if not found.
function resolveCandidateColumn_(sheet, candidateEmail, candidateName) {
  var metadata = getSheetMetadata(sheet);
  if (metadata.lastUserCol < 4) return null;

  var target = (candidateName || '').toString().trim().toLowerCase();
  var targetEmail = (candidateEmail || '').toString().trim().toLowerCase();

  for (var col = 4; col <= metadata.lastUserCol; col++) {
    var header = metadata.headers[col - 1];
    if (header == null || header === '') continue;
    var headerClean = header.toString().trim().toLowerCase();
    if (headerClean === target || (targetEmail && headerClean === targetEmail)) {
      return col;
    }
  }

  return null;
}

function findCandidateByEmail_(candidateEmail) {
  var email = (candidateEmail || '').toString().trim().toLowerCase();
  var users = getCachedExistingUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) return users[i];
  }
  return null;
}

// Reads the sheet once and groups unanswered questions by topic.
function readUnansweredQuestionsByTopic_(sheet, candidateColumn) {
  var lastRow = sheet.getLastRow();
  var byTopic = {};
  var order = [];

  if (lastRow < 3) return { byTopic: byTopic, order: order };

  var numCols = Math.max(candidateColumn, 3);
  var data = sheet.getRange(3, 1, lastRow - 2, numCols).getValues();

  for (var i = 0; i < data.length; i++) {
    var topic = data[i][0] ? data[i][0].toString().trim() : '';
    var question = data[i][1] ? data[i][1].toString().trim() : '';
    var link = data[i][2] ? data[i][2].toString().trim() : '';
    if (!question) continue; // header/empty row, skip

    var answered = data[i][candidateColumn - 1] === true;
    if (answered) continue;

    if (!byTopic[topic]) {
      byTopic[topic] = [];
      order.push(topic);
    }
    byTopic[topic].push({ row: i + 3, question: question, link: link });
  }

  return { byTopic: byTopic, order: order };
}

// Fisher-Yates shuffle then take a target count of 3 or 4 (or all if fewer).
function pickRandomSubset_(entries) {
  var pool = entries.slice();
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  if (pool.length < 3) return pool;

  var targetCount = Math.random() < 0.5 ? 3 : 4;
  return pool.slice(0, Math.min(targetCount, pool.length));
}

function generateRandomizedQuestions(sheetName, candidateEmail) {
  requireAdminOrMentor();

  var candidate = findCandidateByEmail_(candidateEmail);
  if (!candidate) throw new Error('Candidate not found.');

  var role = getUserRole();
  if (role !== 'admin' && !canManageCandidate(candidate.mentorEmail)) {
    throw new Error('Access Denied! You do not manage this candidate.');
  }

  var sheet = getSheet(sheetName);
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');

  var column = resolveCandidateColumn_(sheet, candidate.email, candidate.name);
  if (!column) {
    throw new Error('This candidate has no data on sheet "' + sheetName + '".');
  }

  var grouped = readUnansweredQuestionsByTopic_(sheet, column);
  var result = [];

  grouped.order.forEach(function (topic) {
    var entries = grouped.byTopic[topic];
    if (!entries || entries.length === 0) return;
    result.push({
      topic: topic,
      questions: pickRandomSubset_(entries)
    });
  });

  if (result.length === 0) {
    throw new Error('Nothing to practice — this candidate has no unanswered questions on "' + sheetName + '".');
  }

  logAction('randomize_questions', 'Candidate: ' + candidate.name + ' (' + candidate.email + '), Sheet: ' + sheetName);

  return result;
}

function markQuestionAnswered(sheetName, row, candidateEmail) {
  requireAdminOrMentor();

  var candidate = findCandidateByEmail_(candidateEmail);
  if (!candidate) throw new Error('Candidate not found.');

  var role = getUserRole();
  if (role !== 'admin' && !canManageCandidate(candidate.mentorEmail)) {
    throw new Error('Access Denied! You do not manage this candidate.');
  }

  var sheet = getSheet(sheetName);
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');

  var column = resolveCandidateColumn_(sheet, candidate.email, candidate.name);
  if (!column) {
    throw new Error('This candidate has no data on sheet "' + sheetName + '".');
  }

  var topic = sheet.getRange(row, 1).getValue();
  var question = sheet.getRange(row, 2).getValue();

  sheet.getRange(row, column).setValue(true);

  logAction(
    'mark_question_answered',
    'Candidate: ' + candidate.name + ' (' + candidate.email + '), Sheet: ' + sheetName +
      ', Topic: ' + topic + ', Question: ' + question
  );

  return { success: true };
}
