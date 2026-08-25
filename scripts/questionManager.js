/**
 * Question Management: Adding, Editing, Removing, and Searching.
 */

function showAddQuestionForm() {
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/addQuestionForm")
      .setWidth(500)
      .setHeight(480),
    "Add Question(s)",
  );
}

function showEditQuestionForm() {
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/editQuestionForm")
      .setWidth(500)
      .setHeight(500),
    "Edit Question",
  );
}

function showRemoveQuestionForm() {
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/removeQuestionForm")
      .setWidth(550)
      .setHeight(550),
    "Remove Question(s)",
  );
}

function showSearchForm() {
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/searchForm")
      .setWidth(600)
      .setHeight(550),
    "Search Questions",
  );
}

/**
 * Helper to get the list of existing topics (for dropdowns in HTML forms)
 */
function getTopicsForSelect() {
  requireContentAdmin();
  var config = getSheet("Config_Topics");
  if (!config) return [];
  var lastRow = config.getLastRow();
  if (lastRow <= 1) return [];

  var data = config.getRange(2, 1, lastRow - 1, 3).getValues();
  return data
    .map(function (r) {
      return { name: r[0], sheetName: r[2] || "" };
    })
    .filter(function (item) {
      return item.name !== "";
    });
}

/**
 * Scans all assessment sheets and returns a full list of questions with their sheet and row
 */
function getQuestionsList() {
  requireContentAdmin();

  // Use cached assessment sheets for better performance
  var sheets = getCachedAssessmentSheets();
  var list = [];

  sheets.forEach(function (sheetName) {
    var sh = getSheet(sheetName);
    if (!sh) return;

    var lr = sh.getLastRow();
    if (lr >= 3) {
      var data = sh.getRange(3, 1, lr - 2, 3).getValues();
      for (var i = 0; i < data.length; i++) {
        var t = data[i][0] ? data[i][0].toString().trim() : "";
        var q = data[i][1] ? data[i][1].toString().trim() : "";
        var l = data[i][2] ? data[i][2].toString().trim() : "";

        if (q) {
          list.push({
            sheetName: sheetName,
            row: i + 3,
            topic: t,
            question: q,
            link: l,
          });
        }
      }
    }
  });

  return list;
}

/**
 * Optimized Question Addition.
 * Appends raw data and relies on sortAndFormatAllSheets to apply native formulas and styles.
 */
function addQuestions(sheetName, topic, questionsText) {
  requireContentAdmin();

  var sheet = getSheet(sheetName);
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');

  topic = topic.trim();
  var lines = questionsText.split("\n");
  var lastUserCol = _getLastUserColumn(sheet);
  if (lastUserCol < 4) lastUserCol = 3;

  // Build set of existing questions for this topic to prevent duplicates
  var existingQuestions = {};
  var lastRow = sheet.getLastRow();
  if (lastRow >= 3) {
    var data = sheet.getRange(3, 1, lastRow - 2, 2).getValues();
    data.forEach(function (r) {
      if (r[0] === topic && r[1]) {
        existingQuestions[r[1].toString().trim().toLowerCase()] = true;
      }
    });
  }
  var newRows = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var parts = line.split("|");

    var rowData = [
      topic,
      parts[0].trim(),
      parts.length > 1 ? parts[1].trim() : "",
    ];

    // Set checkboxes to false for all candidates
    for (var c = 4; c <= lastUserCol; c++) {
      rowData.push(false);
    }
    newRows.push(rowData);
  }

  if (newRows.length > 0) {
    // Append raw data to the bottom of the sheet, ensuring we start at least on row 3
    var startRow = Math.max(sheet.getLastRow() + 1, 3);
    sheet
      .getRange(startRow, 1, newRows.length, newRows[0].length)
      .setValues(newRows);

    try {
      _ensureTopicInConfig(topic, sheetName);
    } catch (e) {}

    // Let the master formatter sort, color, and apply native COUNTIF formulas instantly
    sortAndFormatAllSheets(sheetName);
  }

  logAction(
    "add_questions",
    "Added " + newRows.length + " questions to " + sheetName,
  );
  return newRows.length;
}

/**
 * Edits a specific question and resorts the sheet
 */
function editQuestion(sheetName, rowIdx, newTopic, newQuestion, newLink) {
  requireContentAdmin();

  var sheet = getSheet(sheetName);
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');

  sheet.getRange(rowIdx, 1).setValue(newTopic.trim());
  sheet.getRange(rowIdx, 2).setValue(newQuestion.trim());
  sheet.getRange(rowIdx, 3).setValue(newLink ? newLink.trim() : "");

  _ensureTopicInConfig(newTopic.trim(), sheetName);

  sortAndFormatAllSheets(sheetName);
  logAction(
    "edit_question",
    "Edited question on " + sheetName + " row " + rowIdx,
  );
}

/**
 * Safely removes selected questions and recalculates formatting
 */
function removeQuestions(items) {
  requireContentAdmin();
  if (!items || items.length === 0) throw new Error("No questions selected.");

  // Handle fallback format where items is just an array of row numbers
  if (typeof items[0] === "number") {
    // Use cached assessment sheets for better performance
    var firstSheet = getCachedAssessmentSheets()[0];
    items = items.map(function (r) {
      return { sheetName: firstSheet, row: r };
    });
  }

  var grouped = {};
  items.forEach(function (item) {
    if (!grouped[item.sheetName]) grouped[item.sheetName] = [];
    grouped[item.sheetName].push(item.row);
  });

  Object.keys(grouped).forEach(function (shName) {
    var sh = getSheet(shName);
    if (!sh) return;

    grouped[shName].forEach(function (rowNum) {
      // Clearing the topic and question cells tells sortAndFormatAllSheets to drop this row
      sh.getRange(rowNum, 1, 1, 2).setValues([["", ""]]);
    });

    // Rebuild the sheet without the deleted questions
    sortAndFormatAllSheets(shName);
  });

  logAction("remove_questions", "Deleted " + items.length + " question(s)");
  return "ok";
}

/**
 * Searches for questions based on keywords
 */
function searchQuestions(sheetName, topicName, keyword) {
  requireContentAdmin();
  keyword = keyword ? keyword.trim().toLowerCase() : "";

  var list = getQuestionsList();

  if (sheetName) {
    list = list.filter(function (q) {
      return q.sheetName === sheetName;
    });
  }
  if (topicName) {
    list = list.filter(function (q) {
      return q.topic === topicName;
    });
  }
  if (keyword) {
    list = list.filter(function (q) {
      return (
        q.topic.toLowerCase().indexOf(keyword) !== -1 ||
        q.question.toLowerCase().indexOf(keyword) !== -1
      );
    });
  }

  return list;
}

/**
 * Ensures a topic exists in the configuration sheet
 */
function _ensureTopicInConfig(topic, sheetName) {
  var existing = getExistingTopics();
  if (existing.indexOf(topic) === -1) {
    getSheet("Config_Topics").appendRow([
      topic,
      existing.length + 1,
      sheetName || "Main",
    ]);
  }
}
