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
  sheet.setFrozenRows(1);
  sortAndFormatAllSheets(sheetName.trim());
  logAction('create_sheet', 'Created sheet: ' + sheetName);
  return 'Sheet "' + sheetName + '" created successfully!';
}

function renameAssessmentSheet(oldName, newName) {
  requireContentAdmin();
  var sheet = getSheet(oldName);
  if (!sheet) throw new Error('Sheet "' + oldName + '" not found.');
  sheet.setName(newName.trim());
  logAction('rename_sheet', oldName + ' -> ' + newName);
  return 'Sheet renamed to "' + newName + '".';
}

function deleteAssessmentSheet(sheetName) {
  requireContentAdmin();
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');
  if (ss.getSheets().length <= 1) throw new Error('Cannot delete the last sheet.');
  ss.deleteSheet(sheet);
  logAction('delete_sheet', 'Deleted: ' + sheetName);
  return 'Sheet "' + sheetName + '" deleted.';
}

function searchDashboardUser(keyword) {
  requireAdminOrMentor();
  keyword = keyword ? keyword.trim().toLowerCase() : '';
  var users = getExistingUsers();
  if (keyword) {
    users = users.filter(function(u) {
      return u.name.toLowerCase().indexOf(keyword) !== -1 ||
             u.email.toLowerCase().indexOf(keyword) !== -1;
    });
  }
  return users;
}
