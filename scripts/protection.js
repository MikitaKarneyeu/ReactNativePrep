function protectAllSheets() {
  requireAdminOrMentor();

  var admins = getAdmins();
  var contentAdmins = typeof getContentAdmins === 'function' ? getContentAdmins() : [];
  var usersData = getExistingUsers();
  var sheets = getAssessmentSheets();

  sheets.forEach(function(shName) {
    applyGranularProtection(shName, admins, contentAdmins, usersData);
  });

  return 'All sheet protections updated successfully!';
}


function applyGranularProtection(sheetName, admins, contentAdmins, usersData) {
  var sheet = getSheet(sheetName);
  if (!sheet) return;

  var rangeProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  rangeProtections.forEach(function(p) { p.remove(); });

  var maxRows = sheet.getMaxRows();
  if (maxRows <= 2) return;

  var questionsRange = sheet.getRange(1, 1, maxRows, 3);
  var questionsProt = questionsRange.protect().setDescription('Questions: ' + sheetName);
  questionsProt.removeEditors(questionsProt.getEditors());
  
  var baseEditors = admins.concat(contentAdmins);
  baseEditors.forEach(function(email) {
    try { questionsProt.addEditor(email); } catch(e) {}
  });

  var maxCol = sheet.getMaxColumns();
  if (maxCol < 4) return;
  
  var headers = sheet.getRange(1, 1, 1, maxCol).getValues()[0];
  var mentorMap = {};
  
  usersData.forEach(function(u) {
    if (u.role === 'user' && u.name) {
      mentorMap[u.name.toLowerCase().trim()] = u.mentorEmail;
    }
  });

  for (var c = 3; c < headers.length; c++) {
    var userName = headers[c] ? headers[c].toString().trim() : '';
    if (!userName) continue;

    var mentorEmails = mentorMap[userName.toLowerCase()] || '';
    var colNum = c + 1;
    
    var colRange = sheet.getRange(1, colNum, maxRows, 1);
    var colProt = colRange.protect().setDescription('Candidate: ' + userName);
    colProt.removeEditors(colProt.getEditors());

    admins.forEach(function(admin) {
      try { colProt.addEditor(admin); } catch(e) {}
    });

    contentAdmins.forEach(function(ca) {
      try { colProt.addEditor(ca); } catch(e) {}
    });

    if (mentorEmails) {
      var mentorsArray = mentorEmails.split(',');
      mentorsArray.forEach(function(m) {
        var cleanM = m.trim().toLowerCase();
        if (cleanM) {
          try { colProt.addEditor(cleanM); } catch(e) {}
        }
      });
    }
  }
}