function getAdmins() {
  var users = getExistingUsers();
  var admins = [];
  
  users.forEach(function(u) {
    if (u.role === 'admin') {
      admins.push(u.email);
    }
  });
  
  return admins;
}

function applyNativeProtectionsToAllCandidates() {
  requireAdmin();
  var sheets = getAssessmentSheets();
  var users = getExistingUsers();
  var mentorMap = {};
  
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === 'user' && users[i].name) {
      mentorMap[users[i].name.toLowerCase()] = users[i].mentorEmail;
    }
  }

  var protectedCount = 0;

  sheets.forEach(function(shName) {
    var sheet = getSheet(shName);
    if (!sheet) return;

    var lastCol = _getLastUserColumn(sheet);
    if (lastCol < 4) return;

    for (var col = 4; col <= lastCol; col++) {
      var cell = sheet.getRange(1, col);
      var candidateName = cell.getValue();
      
      cell.clearNote();

      if (candidateName) {
        var cleanName = candidateName.toString().trim().toLowerCase();
        var mentorEmail = mentorMap[cleanName] || '';
        var colRange = sheet.getRange(1, col, sheet.getMaxRows(), 1);
        
        var existingProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
        existingProtections.forEach(function(p) {
          if (p.getRange().getColumn() === col) p.remove();
        });

        var prot = colRange.protect().setDescription('Candidate: ' + candidateName);
        prot.removeEditors(prot.getEditors());

        if (mentorEmail) {
          try { prot.addEditor(mentorEmail); } catch(e) {}
        }
        protectedCount++;
      }
    }
  });
  SpreadsheetApp.getUi().alert('Native Google protection successfully applied to ' + protectedCount + ' columns!');
}

function getUserRole() {
  var email = Session.getActiveUser().getEmail().toLowerCase();
  
  if (!email) {
    email = Session.getEffectiveUser().getEmail().toLowerCase();
  }

  var ownerEmail = '';
  try {
    var owner = SpreadsheetApp.getActive().getOwner();
    if (owner) {
      ownerEmail = owner.getEmail().toLowerCase();
    }
  } catch(e) {}

  if (email && email === ownerEmail) {
    return 'admin';
  }

  var users = getExistingUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      return users[i].role;
    }
  }
  return 'user';
}

function requireAdminOrMentor() {
  var role = getUserRole();
  if (role !== 'admin' && role !== 'content_admin' && role !== 'mentor') {
    throw new Error('Access Denied! Only Admins, Content Admins, and Mentors can perform this action.');
  }
}


function canManageCandidate(assignedMentorEmail) {
  var role = getUserRole();
  if (role === 'admin') return true;
  
  var activeUser = Session.getActiveUser().getEmail().toLowerCase();
  
  if (role === 'mentor') {
    var mentorsArray = assignedMentorEmail ? assignedMentorEmail.toLowerCase().split(',').map(function(e){ return e.trim(); }) : [];
    return mentorsArray.indexOf(activeUser) !== -1;
  }
  
  return false;
}

function getAssessmentSheets() {
  var ss = SpreadsheetApp.getActive();
  var sheets = ss.getSheets();
  var assessmentSheets = [];
  var systemSheets = ['Config_Users', 'Config_Topics', 'Log'];

  sheets.forEach(function(sh) {
    var name = sh.getName();
    if (systemSheets.indexOf(name) === -1) {
      assessmentSheets.push(name);
    }
  });

  return assessmentSheets;
}


// Gets the last column containing a candidate's name
function _getLastUserColumn(mainSheet) {
  var headers = mainSheet.getRange(1, 1, 1, mainSheet.getMaxColumns()).getValues()[0];
  for (var i = headers.length - 1; i >= 0; i--) {
    if (headers[i] !== '' && headers[i] != null) return i + 1;
  }
  return 0;
}

// Finds the last row with data in specific columns
function getLastRowInColumns(sheet, columns) {
  var lastRow = 1;
  for (var i = 0; i < columns.length; i++) {
    var col = columns[i];
    var values = sheet.getRange(1, col, sheet.getMaxRows(), 1).getValues();
    for (var row = values.length - 1; row >= 0; row--) {
      if (values[row][0] !== '' && values[row][0] != null) {
        if (row + 1 > lastRow) {
          lastRow = row + 1;
        }
        break;
      }
    }
  }
  return lastRow;
}

// Converts a column number to a letter (e.g., 4 -> D)
function _colToLetter(col) {
  var temp, letter = '';
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(65 + temp) + letter;
    col = (col - temp) / 26 | 0;
  }
  return letter;
}

// Logs actions to the Log sheet
function logAction(action, details) {
  var log = getSheet('Log');
  if (log) {
    log.appendRow([new Date(), Session.getActiveUser().getEmail(), action, details]);
  }
}

/**
 * Provides a list of available mentors for the dropdown menus in HTML forms.
 */
function getMentorsList() {
  requireAdminOrMentor();
  
  var role = getUserRole();
  var activeUser = Session.getActiveUser().getEmail().toLowerCase();
  var users = getExistingUsers();
  
  if (role === 'mentor') {
    var me = users.filter(function(u) { return u.email === activeUser; })[0];
    if (me) {
      return [{ name: me.name, email: me.email }];
    } else {
      return [{ name: activeUser, email: activeUser }];
    }
  }
  
  return users.filter(function(u) {
    return (u.role === 'mentor' || u.role === 'admin' || u.role === 'content_admin');
  }).map(function(u) {
    return { name: u.name, email: u.email };
  });
}

function getMentors() {
  return getMentorsList();
}

function requireAdmin() {
  var role = getUserRole();
  if (role !== 'admin') {
    throw new Error('Access denied. This action requires Admin privileges.');
  }
}

function requireContentAdmin() {
  var role = getUserRole();
  if (role !== 'admin' && role !== 'content_admin') {
    throw new Error('Access denied. This action requires Admin or Content Admin privileges.');
  }
}


function getSubordinates() {
  requireAdminOrMentor();
  
  var users = getExistingUsers();
  var activeUser = Session.getActiveUser().getEmail().toLowerCase();
  var role = getUserRole();

  var availableMentors = [];

  if (role === 'admin' || role === 'content_admin') {
    availableMentors = users.filter(function(u) {
      return u.role === 'mentor' || u.role === 'admin' || u.role === 'content_admin';
    });
  } else {
    availableMentors = users.filter(function(u) {
      if (u.role !== 'mentor' && u.role !== 'admin' && u.role !== 'content_admin') return false;
      if (u.email === activeUser) return true; // Include self

      var theirChain = u.mentorEmail ? u.mentorEmail.split(',').map(function(e) { return e.trim().toLowerCase(); }) : [];
      return theirChain.indexOf(activeUser) !== -1;
    });
  }

  return availableMentors.map(function(u) {
    return { name: u.name, email: u.email };
  });
}

function getExistingTopics() {
  var config = getSheet('Config_Topics');
  if (!config) return [];

  var lr = config.getLastRow();
  if (lr < 2) return [];

  var data = config.getRange(2, 1, lr - 1, 3).getValues();
  var topics = [];

  data.forEach(function(r) {
    if (r[0]) {
      topics.push({
        name: r[0].toString().trim(),
        order: r[1] || 999,
        sheetName: r[2] ? r[2].toString().trim() : ''
      });
    }
  });

  return topics;
}

function getContentAdmins() {
  var users = getExistingUsers();
  var contentAdmins = [];
  
  users.forEach(function(u) {
    if (u.role === 'content_admin') {
      contentAdmins.push(u.email);
    }
  });
  
  return contentAdmins;
}