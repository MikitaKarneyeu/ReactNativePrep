function showAddTopicForm() { 
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('addTopicForm').setWidth(400).setHeight(300), 'Add Topic'); 
}

function showRenameTopicForm() { 
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('renameTopicForm').setWidth(400).setHeight(350), 'Rename Topic'); 
}

function showMergeTopicsForm() { 
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('mergeTopicsForm').setWidth(500).setHeight(500), 'Merge Topics'); 
}

function showReorderTopicsForm() { 
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('reorderTopicsForm').setWidth(450).setHeight(500), 'Reorder Topics'); 
}

function showRemoveTopicForm() { 
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('removeTopicForm').setWidth(450).setHeight(400), 'Remove Topic'); 
}

function addTopic(sheetName, name) {
  requireContentAdmin();
  if (!name || !name.trim()) throw new Error('Topic name is required.');
  name = name.trim();
  
  var config = getSheet('Config_Topics');
  if (!config) throw new Error('Config_Topics sheet not found.');
  
  config.appendRow([name, config.getLastRow(), sheetName]);
  sortAndFormatAllSheets();
  return 'Topic "' + name + '" added successfully to ' + sheetName + '.';
}

function renameTopic(oldName, newName) {
  requireContentAdmin();
  oldName = oldName.trim(); 
  newName = newName.trim();
  
  var assessmentSheets = getAssessmentSheets();
  assessmentSheets.forEach(function(shName) {
    var sh = getSheet(shName);
    if (!sh) return;
    var lastRow = getLastRowInColumns(sh, [1, 2]);
    if (lastRow > 2) {
      var data = sh.getRange(3, 1, lastRow - 2, 1).getValues();
      for (var i = 0; i < data.length; i++) {
        if (data[i][0] === oldName) sh.getRange(i + 3, 1).setValue(newName);
      }
    }
  });

  var configSheet = getSheet('Config_Topics');
  if (configSheet) {
    var configLastRow = configSheet.getLastRow();
    if (configLastRow > 1) {
      var cData = configSheet.getRange(2, 1, configLastRow - 1, 1).getValues();
      for (var j = 0; j < cData.length; j++) {
        if (cData[j][0] === oldName) configSheet.getRange(j + 2, 1).setValue(newName);
      }
    }
  }
  
  sortAndFormatAllSheets();
  return 'Topic renamed successfully.';
}

function mergeTopics(sheetName, sourceTopic, targetTopic) {
  requireContentAdmin();
  sourceTopic = sourceTopic.trim();
  targetTopic = targetTopic.trim();
  
  var sh = getSheet(sheetName);
  if (!sh) throw new Error('Sheet "' + sheetName + '" not found.');
  
  var lastRow = getLastRowInColumns(sh, [1, 2]);
  if (lastRow > 2) {
    var range = sh.getRange(3, 1, lastRow - 2, 2);
    var values = range.getValues();
    var changed = false;
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] === sourceTopic) {
        values[i][0] = targetTopic;
        changed = true;
      }
    }
    if (changed) range.setValues(values);
  }
  
  _ensureTopicInConfig(targetTopic, sheetName);
  
  var configSheet = getSheet('Config_Topics');
  if (configSheet) {
    var cData = configSheet.getDataRange().getValues();
    for (var i = cData.length - 1; i >= 1; i--) {
      if (cData[i][0] === sourceTopic && cData[i][2] === sheetName) {
        configSheet.deleteRow(i + 1);
      }
    }
  }
  
  sortAndFormatAllSheets();
  return 'Topics successfully merged in ' + sheetName;
}

function reorderTopics(orderedTopics) {
  requireContentAdmin();
  var configSheet = getSheet('Config_Topics');
  if (!configSheet) throw new Error('Config_Topics sheet not found.');
  
  var data = configSheet.getDataRange().getValues();
  for (var i = 0; i < orderedTopics.length; i++) {
    var idx = data.findIndex(function(r) { return r[0] === orderedTopics[i]; });
    if (idx !== -1) configSheet.getRange(idx + 1, 2).setValue(i + 1);
  }
  
  sortAndFormatAllSheets();
  return 'Topics reordered successfully.';
}

function removeTopic(sheetName, topicName, action, reassignTo) {
  try {
    requireContentAdmin();
    if (!topicName) throw new Error('Topic name is required.');

    var sheets = sheetName ? [sheetName] : getAssessmentSheets();
    var totalAffected = 0;

    sheets.forEach(function(shName) {
      var sheet = getSheet(shName);
      if (!sheet) return;

      var lastRow = sheet.getLastRow();
      if (lastRow < 3) return;

      var topics = sheet.getRange(3, 1, lastRow - 2, 1).getValues();

      if (action === 'reassign' && reassignTo) {
        var newValues = [];
        for (var r = 0; r < topics.length; r++) {
          var currentTopic = topics[r][0] ? topics[r][0].toString().trim() : '';
          if (currentTopic === topicName) {
            newValues.push([reassignTo]);
            totalAffected++;
          } else {
            newValues.push([topics[r][0]]);
          }
        }
        if (totalAffected > 0) {
          sheet.getRange(3, 1, newValues.length, 1).setValues(newValues);
        }
      } else {
        var startRowToDelete = -1;
        var rowsToDeleteCount = 0;

        for (var r = topics.length - 1; r >= 0; r--) {
          var currentTopic = topics[r][0] ? topics[r][0].toString().trim() : '';
          if (currentTopic === topicName) {
            if (startRowToDelete === -1) {
              startRowToDelete = r + 3;
              rowsToDeleteCount = 1;
            } else {
              rowsToDeleteCount++;
            }
          } else if (startRowToDelete !== -1) {
            sheet.deleteRows(startRowToDelete - rowsToDeleteCount + 1, rowsToDeleteCount);
            totalAffected += rowsToDeleteCount;
            startRowToDelete = -1;
            rowsToDeleteCount = 0;
          }
        }
        if (startRowToDelete !== -1) {
          sheet.deleteRows(startRowToDelete - rowsToDeleteCount + 1, rowsToDeleteCount);
          totalAffected += rowsToDeleteCount;
        }
      }
    });

    logAction('remove_topic', 'Topic "' + topicName + '" (' + action + ') on sheet: ' + (sheetName || 'ALL') + ' - affected ' + totalAffected + ' rows');
    return 'Topic "' + topicName + '" successfully processed (' + totalAffected + ' rows)!';

  } catch (error) {
    Logger.log('CRITICAL ERROR: ' + error.message);
    throw new Error('Server Error: ' + error.message);
  }
}