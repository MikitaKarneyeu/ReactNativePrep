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
  
  // Use cached data for better performance
  var sheets = getCachedAssessmentSheets();
  var users = getCachedExistingUsers();
  
  // Build mentor map for quick lookup
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

    // Get sheet metadata in single call
    var metadata = getSheetMetadata(sheet);
    if (metadata.lastUserCol < 4) return;

    // Batch remove existing protections for all candidate columns
    var columnsToProtect = [];
    for (var col = 4; col <= metadata.lastUserCol; col++) {
      columnsToProtect.push(col);
    }
    batchRemoveProtectionsByColumns(sheet, columnsToProtect);

    // Process each candidate column
    for (var col = 4; col <= metadata.lastUserCol; col++) {
      var cell = sheet.getRange(1, col);
      var candidateName = cell.getValue();
      
      cell.clearNote();

      if (candidateName) {
        var cleanName = candidateName.toString().trim().toLowerCase();
        var mentorEmail = mentorMap[cleanName] || '';
        
        // Get all editors for this candidate
        var allEditors = [];
        if (mentorEmail) {
          allEditors.push(mentorEmail);
        }
        
        // Setup protection with batch addEditors
        var colRange = sheet.getRange(1, col, metadata.maxRows, 1);
        var prot = colRange.protect().setDescription('Candidate: ' + candidateName);
        prot.removeEditors(prot.getEditors());
        batchAddEditors(prot, allEditors);
        
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
  var systemSheets = ['Config_Users', 'Config_Topics', 'Log', 'Bug list'];

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

function getExistingTopics(sheetName) {
  var config = getSheet('Config_Topics');
  if (!config) return [];

  var lr = config.getLastRow();
  if (lr < 2) return [];

  var data = config.getRange(2, 1, lr - 1, 3).getValues();
  var topics = [];

  data.forEach(function(r) {
    if (r[0]) {
      var topicSheet = r[2] ? r[2].toString().trim() : '';
      if (!sheetName || topicSheet === sheetName) {
        topics.push({
          name: r[0].toString().trim(),
          order: r[1] || 999,
          sheetName: topicSheet
        });
      }
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

// ============================================================
// OPTIMIZED HELPER FUNCTIONS FOR BATCH OPERATIONS
// ============================================================

/**
 * Cache for frequently accessed data within a single operation
 * Reduces redundant API calls
 */
var _dataCache = {
  users: null,
  assessmentSheets: null,
  admins: null,
  contentAdmins: null,
  timestamp: 0,
  CACHE_TTL: 30000 // 30 seconds cache lifetime
};

/**
 * Clears the data cache
 */
function _clearCache() {
  _dataCache.users = null;
  _dataCache.assessmentSheets = null;
  _dataCache.admins = null;
  _dataCache.contentAdmins = null;
  _dataCache.timestamp = 0;
}

/**
 * Gets cached existing users or fetches fresh data
 */
function getCachedExistingUsers() {
  var now = new Date().getTime();
  if (_dataCache.users && (now - _dataCache.timestamp) < _dataCache.CACHE_TTL) {
    return _dataCache.users;
  }
  _dataCache.users = getExistingUsers();
  _dataCache.timestamp = now;
  return _dataCache.users;
}

/**
 * Gets cached assessment sheets or fetches fresh data
 */
function getCachedAssessmentSheets() {
  var now = new Date().getTime();
  if (_dataCache.assessmentSheets && (now - _dataCache.timestamp) < _dataCache.CACHE_TTL) {
    return _dataCache.assessmentSheets;
  }
  _dataCache.assessmentSheets = getAssessmentSheets();
  _dataCache.timestamp = now;
  return _dataCache.assessmentSheets;
}

/**
 * Gets cached admin list or fetches fresh data
 */
function getCachedAdmins() {
  var now = new Date().getTime();
  if (_dataCache.admins && (now - _dataCache.timestamp) < _dataCache.CACHE_TTL) {
    return _dataCache.admins;
  }
  _dataCache.admins = getAdmins();
  _dataCache.timestamp = now;
  return _dataCache.admins;
}

/**
 * Gets cached content admin list or fetches fresh data
 */
function getCachedContentAdmins() {
  var now = new Date().getTime();
  if (_dataCache.contentAdmins && (now - _dataCache.timestamp) < _dataCache.CACHE_TTL) {
    return _dataCache.contentAdmins;
  }
  _dataCache.contentAdmins = getContentAdmins();
  _dataCache.timestamp = now;
  return _dataCache.contentAdmins;
}

/**
 * Batch set values in a sheet (single API call instead of multiple setValue calls)
 * @param {Sheet} sheet - The sheet object
 * @param {number} startRow - Starting row (1-indexed)
 * @param {number} startCol - Starting column (1-indexed)
 * @param {Array<Array>} data - 2D array of values to set
 */
function batchSetValues(sheet, startRow, startCol, data) {
  if (!data || data.length === 0) return;
  var numRows = data.length;
  var numCols = data[0].length;
  sheet.getRange(startRow, startCol, numRows, numCols).setValues(data);
}

/**
 * Batch set a single value across multiple cells in a column
 * @param {Sheet} sheet - The sheet object
 * @param {number} startRow - Starting row (1-indexed)
 * @param {number} col - Column number (1-indexed)
 * @param {number} numRows - Number of rows to fill
 * @param {*} value - Value to set
 */
function batchSetColumnValue(sheet, startRow, col, numRows, value) {
  if (numRows <= 0) return;
  var data = [];
  for (var i = 0; i < numRows; i++) {
    data.push([value]);
  }
  sheet.getRange(startRow, col, numRows, 1).setValues(data);
}

/**
 * Optimized protection setup using addEditors (batch) instead of individual addEditor calls
 * @param {Protection} protection - The protection object
 * @param {Array<string>} editorEmails - Array of editor email addresses
 */
function batchAddEditors(protection, editorEmails) {
  if (!editorEmails || editorEmails.length === 0) return;
  
  // Filter out empty emails and deduplicate
  var validEditors = [];
  var seen = {};
  
  editorEmails.forEach(function(email) {
    if (email && typeof email === 'string') {
      var cleanEmail = email.trim().toLowerCase();
      if (cleanEmail && !seen[cleanEmail]) {
        seen[cleanEmail] = true;
        validEditors.push(cleanEmail);
      }
    }
  });
  
  if (validEditors.length > 0) {
    try {
      protection.addEditors(validEditors);
    } catch(e) {
      // Fallback to individual adds if batch fails
      validEditors.forEach(function(email) {
        try { protection.addEditor(email); } catch(e2) {}
      });
    }
  }
}

/**
 * Get all editor emails for a candidate (admins + content admins + mentor chain)
 * @param {string} mentorChain - Comma-separated mentor chain string
 * @returns {Array<string>} Array of editor email addresses
 */
function getEditorEmailsForCandidate(mentorChain) {
  var editors = [];
  
  // Add admins
  var admins = getCachedAdmins();
  editors = editors.concat(admins);
  
  // Add content admins
  var contentAdmins = getCachedContentAdmins();
  editors = editors.concat(contentAdmins);
  
  // Add mentor chain
  if (mentorChain) {
    var mentorsArray = mentorChain.split(',');
    mentorsArray.forEach(function(m) {
      var cleanM = m.trim().toLowerCase();
      if (cleanM) {
        editors.push(cleanM);
      }
    });
  }
  
  return editors;
}

/**
 * Optimized sheet data reading - reads all needed data in single API call
 * @param {Sheet} sheet - The sheet object
 * @returns {Object} Object containing headers, maxRows, maxCols, lastUserCol
 */
function getSheetMetadata(sheet) {
  var maxCols = sheet.getMaxColumns();
  var maxRows = sheet.getMaxRows();
  var headers = sheet.getRange(1, 1, 1, maxCols).getValues()[0];
  
  var lastUserCol = 0;
  for (var i = headers.length - 1; i >= 0; i--) {
    if (headers[i] !== '' && headers[i] != null) {
      lastUserCol = i + 1;
      break;
    }
  }
  
  return {
    headers: headers,
    maxRows: maxRows,
    maxCols: maxCols,
    lastUserCol: lastUserCol
  };
}

/**
 * Batch remove protections by column numbers
 * @param {Sheet} sheet - The sheet object
 * @param {Array<number>} columnNumbers - Array of column numbers to remove protections from
 */
function batchRemoveProtectionsByColumns(sheet, columnNumbers) {
  if (!columnNumbers || columnNumbers.length === 0) return;
  
  var existingProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  var protectionsToRemove = [];
  
  existingProtections.forEach(function(p) {
    var protCol = p.getRange().getColumn();
    if (columnNumbers.indexOf(protCol) !== -1) {
      protectionsToRemove.push(p);
    }
  });
  
  // Remove in batch
  protectionsToRemove.forEach(function(p) {
    try { p.remove(); } catch(e) {}
  });
}