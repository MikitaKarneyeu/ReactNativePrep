function protectAllSheets() {
  requireAdminOrMentor();

  // Use cached data for better performance
  var admins = getCachedAdmins();
  var contentAdmins = getCachedContentAdmins();
  var usersData = getCachedExistingUsers();
  var sheets = getCachedAssessmentSheets();

  sheets.forEach(function(shName) {
    applyGranularProtection(shName, admins, contentAdmins, usersData);
  });

  return 'All sheet protections updated successfully!';
}


function applyGranularProtection(sheetName, admins, contentAdmins, usersData) {
  var sheet = getSheet(sheetName);
  if (!sheet) return;

  // Batch remove all existing range protections
  var rangeProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  rangeProtections.forEach(function(p) { 
    try { p.remove(); } catch(e) {} 
  });

  var maxRows = sheet.getMaxRows();
  if (maxRows <= 2) return;

  // Protect questions area with batch editors
  var questionsRange = sheet.getRange(1, 1, maxRows, 3);
  var questionsProt = questionsRange.protect().setDescription('Questions: ' + sheetName);
  questionsProt.removeEditors(questionsProt.getEditors());
  
  // Use batch addEditors for base editors
  var baseEditors = admins.concat(contentAdmins);
  batchAddEditors(questionsProt, baseEditors);

  var maxCol = sheet.getMaxColumns();
  if (maxCol < 4) return;
  
  // Get headers in single API call
  var headers = sheet.getRange(1, 1, 1, maxCol).getValues()[0];
  
  // Build mentor map for quick lookup
  var mentorMap = {};
  usersData.forEach(function(u) {
    if (u.role === 'user' && u.name) {
      mentorMap[u.name.toLowerCase().trim()] = u.mentorEmail;
    }
  });

  // Process all candidate columns
  for (var c = 3; c < headers.length; c++) {
    var userName = headers[c] ? headers[c].toString().trim() : '';
    if (!userName) continue;

    var mentorEmails = mentorMap[userName.toLowerCase()] || '';
    var colNum = c + 1;
    
    // Get all editors for this candidate
    var allEditors = getEditorEmailsForCandidate(mentorEmails);
    
    // Setup protection with batch addEditors
    var colRange = sheet.getRange(1, colNum, maxRows, 1);
    var colProt = colRange.protect().setDescription('Candidate: ' + userName);
    colProt.removeEditors(colProt.getEditors());
    batchAddEditors(colProt, allEditors);
  }
}