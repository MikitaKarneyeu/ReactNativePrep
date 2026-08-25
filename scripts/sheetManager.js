function showCreateSheetForm() {
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile('forms/createSheetForm').setWidth(400).setHeight(250),
    'Create New Sheet'
  );
}

function showRenameSheetForm() {
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile('forms/renameSheetForm').setWidth(400).setHeight(300),
    'Rename Sheet'
  );
}

function showDeleteSheetForm() {
  requireContentAdmin();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile('forms/deleteSheetForm').setWidth(400).setHeight(250),
    'Delete Sheet'
  );
}

function showDashboardSearchForm() {
  requireAdminOrMentor();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile('forms/dashboardSearchForm').setWidth(700).setHeight(500),
    'Dashboard Search'
  );
}

function createNewAssessmentSheet(sheetName) {
  requireContentAdmin();
  if (!sheetName || !sheetName.trim()) throw new Error('Sheet name is required.');
  var ss = SpreadsheetApp.getActive();
  var existing = ss.getSheetByName(sheetName.trim());
  if (existing) throw new Error('Sheet "' + sheetName + '" already exists.');
  var sheet = ss.insertSheet(sheetName.trim());
  sheet.getRange(1, 1).setValue('Topic');
  sheet.getRange(1, 2).setValue('Question');
  sheet.getRange(1, 3).setValue('Link');
  
  // Add existing candidates to the new sheet
  var users = getCachedExistingUsers();
  var col = 4;
  users.forEach(function(u) {
    if (u.role === 'user' && u.name) {
      if (col > sheet.getMaxColumns()) {
        sheet.insertColumnAfter(sheet.getMaxColumns());
      }
      sheet.getRange(1, col)
           .setValue(u.name)
           .setFontWeight("bold")
           .setHorizontalAlignment("center")
           .setBackground("#f3f3f3");
      sheet.setColumnWidth(col, 110);
      col++;
    }
  });

  sheet.setFrozenRows(1);
  _clearCache(); // clear cache so sortAndFormatAllSheets sees the new sheet
  sortAndFormatAllSheets(sheetName.trim());
  logAction('create_sheet', 'Created sheet: ' + sheetName);
  return 'Sheet "' + sheetName + '" created successfully!';
}

function renameAssessmentSheet(oldName, newName) {
  requireContentAdmin();
  var sheet = getSheet(oldName);
  if (!sheet) throw new Error('Sheet "' + oldName + '" not found.');
  var newNameTrimmed = newName.trim();
  sheet.setName(newNameTrimmed);
  
  // Update Config_Topics to reflect the new sheet name
  var ss = SpreadsheetApp.getActive();
  var configSheet = ss.getSheetByName('Config_Topics');
  if (configSheet) {
    var lastRow = configSheet.getLastRow();
    if (lastRow > 1) {
      var data = configSheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = 0; i < data.length; i++) {
        var cSheet = data[i][2] ? data[i][2].toString().trim() : '';
        if (cSheet === oldName) {
          configSheet.getRange(i + 2, 3).setValue(newNameTrimmed);
        }
      }
    }
  }

  logAction('rename_sheet', oldName + ' -> ' + newNameTrimmed);
  return 'Sheet renamed to "' + newNameTrimmed + '".';
}

function deleteAssessmentSheet(sheetName) {
  requireContentAdmin();
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');
  if (ss.getSheets().length <= 1) throw new Error('Cannot delete the last sheet.');
  
  // Clear topics from Config_Topics
  var configSheet = ss.getSheetByName('Config_Topics');
  if (configSheet) {
    var lastRow = configSheet.getLastRow();
    if (lastRow > 1) {
      var data = configSheet.getRange(2, 1, lastRow - 1, 3).getValues();
      var rowsToDelete = [];
      for (var i = 0; i < data.length; i++) {
        var cSheet = data[i][2] ? data[i][2].toString().trim() : '';
        if (cSheet === sheetName) {
          rowsToDelete.push(i + 2);
        }
      }
      for (var j = rowsToDelete.length - 1; j >= 0; j--) {
        configSheet.deleteRow(rowsToDelete[j]);
      }
    }
  }

  ss.deleteSheet(sheet);
  logAction('delete_sheet', 'Deleted: ' + sheetName);
  return 'Sheet "' + sheetName + '" deleted.';
}

function searchDashboardUser(keyword) {
  requireAdminOrMentor();
  keyword = keyword ? keyword.trim().toLowerCase() : '';
  // Use cached users for better performance
  var users = getCachedExistingUsers();
  if (keyword) {
    users = users.filter(function(u) {
      return u.name.toLowerCase().indexOf(keyword) !== -1 ||
             u.email.toLowerCase().indexOf(keyword) !== -1;
    });
  }
  return users;
}
