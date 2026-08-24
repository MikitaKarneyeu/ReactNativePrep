function showAddUserForm() {
  requireAdminOrMentor();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/addUserForm")
      .setWidth(420)
      .setHeight(320),
    "Add New User",
  );
}

function showEditUserForm() {
  requireAdminOrMentor();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/editUserForm")
      .setWidth(420)
      .setHeight(380),
    "Edit User",
  );
}

function showRemoveUserForm() {
  requireAdminOrMentor();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/removeUserForm")
      .setWidth(420)
      .setHeight(280),
    "Remove User",
  );
}

function showUserList() {
  requireAdminOrMentor();
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutputFromFile("forms/userListDialog")
      .setWidth(620)
      .setHeight(420),
    "All Users",
  );
}

function getUserListData() {
  requireAdminOrMentor();
  // Use cached data for better performance
  var users = getCachedExistingUsers();
  var sheets = getCachedAssessmentSheets();

  var sheetDataList = [];
  var overallTotalQuestions = 0;

  sheets.forEach(function (shName) {
    var sh = getSheet(shName);
    var lr = getLastRowInColumns(sh, [1, 2]);
    var lc = _getLastUserColumn(sh);

    // Read candidates starting from the 4th column
    var headers = lc >= 4 ? sh.getRange(1, 4, 1, lc - 3).getValues()[0] : [];

    var tq = 0;
    if (lr > 2) {
      var qData = sh
        .getRange(3, 2, lr - 2, 1)
        .getValues()
        .flat();
      tq = qData.filter(function (q) {
        return q.toString().trim() !== "";
      }).length;
      overallTotalQuestions += tq;
    }
    sheetDataList.push({ sh: sh, headers: headers, lr: lr, tq: tq });
  });

  return users.map(function (u) {
    var overallDone = 0;
    sheetDataList.forEach(function (sd) {
      var colIdx = sd.headers.indexOf(u.name);
      if (colIdx !== -1 && sd.tq > 0) {
        // Candidates are offset by +4 (+3 for JS zero-based indexing)
        var vals = sd.sh
          .getRange(3, colIdx + 4, sd.lr - 2, 1)
          .getValues()
          .flat();
        overallDone += vals.filter(function (v) {
          return v === true;
        }).length;
      }
    });

    var pct =
      overallTotalQuestions > 0
        ? Math.round((overallDone / overallTotalQuestions) * 100) + "%"
        : "N/A";
    return { email: u.email, name: u.name, role: u.role, completion: pct };
  });
}

function addUser(name, email, role, mentorEmail) {
  requireAdminOrMentor();

  name = name.trim();
  email = email.trim().toLowerCase();
  role = role.trim().toLowerCase();
  mentorEmail = mentorEmail ? mentorEmail.trim().toLowerCase() : "";

  var config = getSheet("Config_Users");
  if (!config) throw new Error("Sheet Config_Users not found.");

  // Use cached users for faster duplicate check
  var users = getCachedExistingUsers();
  var exists = users.some(function (u) {
    return u.email === email;
  });
  if (exists) throw new Error("User with this email already exists!");

  var activeUser = Session.getActiveUser().getEmail().toLowerCase();
  var finalMentorChain = "";

  var targetMentorEmail = mentorEmail || activeUser;
  var targetMentor = users.filter(function (u) {
    return u.email === targetMentorEmail;
  })[0];

  if (targetMentor) {
    var chain = [targetMentor.email];
    if (targetMentor.mentorEmail) {
      chain = chain.concat(
        targetMentor.mentorEmail.split(",").map(function (e) {
          return e.trim();
        }),
      );
    }
    finalMentorChain = chain
      .filter(function (item, pos) {
        return item && chain.indexOf(item) === pos;
      })
      .join(", ");
  } else {
    finalMentorChain = targetMentorEmail;
  }

  // Batch write: single row append (already optimized with appendRow)
  config.appendRow([email, name, role, finalMentorChain]);

  // Optimized: Single spreadsheet permission update
  var ss = SpreadsheetApp.getActive();
  try {
    if (role === "admin" || role === "content_admin" || role === "mentor") {
      ss.addEditor(email);
    } else {
      ss.addViewer(email);
    }
  } catch (e) {}

  // Only add candidate column for 'user' role
  if (role === "user") {
    addCandidateColumn(name, finalMentorChain);
  }

  // Clear cache after modification
  _clearCache();

  logAction(
    "add_user",
    "Added: " + name + " (" + role + ") | Chain: " + finalMentorChain,
  );
  return "User " + name + " added successfully!";
}

function addCandidateColumn(name, mentorChain) {
  requireAdminOrMentor();
  if (!name) throw new Error("Candidate name is required.");

  // Use cached data for better performance
  var sheets = getCachedAssessmentSheets();
  var checkboxRule = SpreadsheetApp.newDataValidation()
    .requireCheckbox()
    .build();

  // Get all editor emails once using optimized helper
  var allEditors = getEditorEmailsForCandidate(mentorChain);

  sheets.forEach(function (shName) {
    var sheet = getSheet(shName);
    if (!sheet) return;

    // Get sheet metadata in single call
    var metadata = getSheetMetadata(sheet);
    var targetCol = metadata.lastUserCol + 1;
    if (targetCol < 4) targetCol = 4;

    // Ensure we have enough columns
    if (targetCol > metadata.maxCols) {
      sheet.insertColumnAfter(metadata.maxCols);
    }

    // Copy format from previous column (single API call)
    var sourceRange = sheet.getRange(1, targetCol - 1, metadata.maxRows, 1);
    var targetRange = sheet.getRange(1, targetCol, metadata.maxRows, 1);
    sourceRange.copyTo(
      targetRange,
      SpreadsheetApp.CopyPasteType.PASTE_FORMAT,
      false,
    );

    // Set header with all formatting in one chained call
    sheet
      .getRange(1, targetCol)
      .setValue(name)
      .clearNote()
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f3f3f3");

    sheet.setColumnWidth(targetCol, 110);

    var maxRows = sheet.getLastRow();
    if (maxRows >= 3) {
      var numRows = maxRows - 2;
      var colLetter = _colToLetter(targetCol);

      // Read all needed data in single API call
      var firstColVals = sheet.getRange(3, 1, numRows, 2).getValues();

      // Prepare batch data for checkboxes
      var checkboxData = [];
      var validationData = [];

      // Pre-fill arrays with default values (checkboxes for regular rows)
      for (var i = 0; i < numRows; i++) {
        checkboxData.push([false]);
        validationData.push([checkboxRule]);
      }

      // Track header rows for formula and formatting application
      var headerRows = [];

      // Calculate formulas for topic headers and mark them
      for (var r = 0; r < firstColVals.length; r++) {
        if (firstColVals[r][1] === "") {
          var actualRow = r + 3;
          var endRow = maxRows;
          for (var nextR = r + 1; nextR < firstColVals.length; nextR++) {
            if (firstColVals[nextR][1] === "") {
              endRow = nextR + 2;
              break;
            }
          }

          var nativeFormula =
            "=IFERROR(COUNTIF(" +
            colLetter +
            (actualRow + 1) +
            ":" +
            colLetter +
            endRow +
            ", TRUE) / COUNTIF(" +
            colLetter +
            (actualRow + 1) +
            ":" +
            colLetter +
            endRow +
            ', "<>"), 0)';

          // Clear checkbox for header row
          var headerIdx = actualRow - 3;
          checkboxData[headerIdx] = [""];
          validationData[headerIdx] = [null]; // Clear validation for header
          headerRows.push({ row: actualRow, formula: nativeFormula });
        }
      }

      var dataRange = sheet.getRange(3, targetCol, numRows, 1);

      // --- НАЧАЛО: СБРОС РУЧНОГО ФОРМАТИРОВАНИЯ ---
      // Получаем скопированные стили
      var backgrounds = dataRange.getBackgrounds();
      var fontColors = dataRange.getFontColors();
      var fontLines = dataRange.getFontLines();

      for (var i = 0; i < numRows; i++) {
        // Если это НЕ строка-заголовок (в колонке B есть текст задания)
        if (firstColVals[i][1] !== "") {
          backgrounds[i][0] = null; // Сбрасываем цвет фона (null = белый/стандартный)
          fontColors[i][0] = null; // Сбрасываем цвет текста
          fontLines[i][0] = "none"; // Убираем зачеркивания, если ментор так отмечал ячейку
        }
      }

      // Применяем очищенные стили обратно батч-запросом
      dataRange.setBackgrounds(backgrounds);
      dataRange.setFontColors(fontColors);
      dataRange.setFontLines(fontLines);
      // --- КОНЕЦ: СБРОС РУЧНОГО ФОРМАТИРОВАНИЯ ---

      // Set values (false for checkboxes, empty for headers)
      dataRange.setValues(checkboxData);

      // Apply validations (checkbox for regular rows, none for headers)
      dataRange.setDataValidations(validationData);

      // Apply formulas and formatting to header rows individually
      headerRows.forEach(function (h) {
        sheet
          .getRange(h.row, targetCol)
          .setFormula(h.formula)
          .setNumberFormat("0%")
          .setFontWeight("bold")
          .setHorizontalAlignment("center");
      });

      // Setup protection with batch addEditors (single API call instead of multiple)
      var protection = targetRange
        .protect()
        .setDescription("Candidate: " + name);
      protection.removeEditors(protection.getEditors());
      batchAddEditors(protection, allEditors);
    }
  });
}

function _registerSyncedUser(email, name, role) {
  var config = getSheet("Config_Users");
  var newUserRow = config.getLastRow() + 1;

  config.getRange(newUserRow, 1).setValue(email.toLowerCase());
  config.getRange(newUserRow, 2).setValue(name);
  config.getRange(newUserRow, 3).setValue(role);
  config.getRange(newUserRow, 4).setValue("");

  if (role === "user") {
    addCandidateColumn(name, "");
  }
}

function getUsersForEdit() {
  requireAdminOrMentor();

  // Use cached users for better performance
  var users = getCachedExistingUsers();
  var role = getUserRole();
  var activeUser = Session.getActiveUser().getEmail().toLowerCase();

  if (role === "admin" || role === "content_admin") {
    return users;
  }

  if (role === "mentor") {
    return users.filter(function (u) {
      if (u.email === activeUser) return false;
      var mentorsArray = u.mentorEmail
        ? u.mentorEmail.split(",").map(function (e) {
            return e.trim().toLowerCase();
          })
        : [];
      return mentorsArray.indexOf(activeUser) !== -1;
    });
  }

  return [];
}

function editUser(
  originalEmail,
  newName,
  newEmail,
  newRole,
  selectedMentorEmail,
) {
  requireAdminOrMentor();
  newName = newName.trim();
  newEmail = newEmail.trim().toLowerCase();
  newRole = newRole.trim().toLowerCase();
  selectedMentorEmail = selectedMentorEmail
    ? selectedMentorEmail.trim().toLowerCase()
    : "";

  var config = getSheet("Config_Users");
  var data = config.getDataRange().getValues();

  var idx = data.findIndex(function (r) {
    return r[0] && r[0].toString().trim().toLowerCase() === originalEmail;
  });
  if (idx === -1) throw new Error("User not found.");

  var oldMentorEmail = data[idx][3]
    ? data[idx][3].toString().trim().toLowerCase()
    : "";
  if (!canManageCandidate(oldMentorEmail)) {
    throw new Error(
      "Access Denied! You can only edit candidates from your own team.",
    );
  }

  var activeUser = Session.getActiveUser().getEmail().toLowerCase();
  var finalMentorChain = oldMentorEmail;

  var users = getCachedExistingUsers();

  if (selectedMentorEmail) {
    var targetMentor = users.filter(function (u) {
      return u.email === selectedMentorEmail;
    })[0];
    if (!targetMentor) throw new Error("Selected mentor not found.");

    if (getUserRole() === "mentor") {
      newRole = "user";
      var targetChainArray = targetMentor.mentorEmail
        ? targetMentor.mentorEmail.split(",").map(function (e) {
            return e.trim();
          })
        : [];
      if (
        selectedMentorEmail !== activeUser &&
        targetChainArray.indexOf(activeUser) === -1
      ) {
        throw new Error(
          "Security violation: You can only assign to yourself or your subordinates.",
        );
      }
    }

    var chain = [targetMentor.email];
    if (targetMentor.mentorEmail) {
      chain = chain.concat(
        targetMentor.mentorEmail.split(",").map(function (e) {
          return e.trim();
        }),
      );
    }
    finalMentorChain = chain
      .filter(function (item, pos) {
        return item && chain.indexOf(item) === pos;
      })
      .join(", ");
  }

  var oldName = data[idx][1] ? data[idx][1].toString().trim() : "";
  var ss = SpreadsheetApp.getActive();

  // Batch permission update
  try {
    if (originalEmail !== newEmail) {
      ss.removeEditor(originalEmail);
      ss.removeViewer(originalEmail);
    }
    if (
      newRole === "admin" ||
      newRole === "content_admin" ||
      newRole === "mentor"
    ) {
      ss.removeViewer(newEmail);
      ss.addEditor(newEmail);
    } else {
      ss.removeEditor(newEmail);
      ss.addViewer(newEmail);
    }
  } catch (e) {}

  // Batch update Config_Users row (single API call)
  batchSetValues(config, idx + 1, 1, [
    [newEmail, newName, newRole, finalMentorChain],
  ]);

  // Get all editor emails once for protection updates
  var allEditors = getEditorEmailsForCandidate(finalMentorChain);

  // Optimized: Process all assessment sheets with cached data
  var sheets = getCachedAssessmentSheets();
  sheets.forEach(function (shName) {
    var main = getSheet(shName);
    if (!main) return;

    // Get sheet metadata in single call
    var metadata = getSheetMetadata(main);
    if (metadata.lastUserCol >= 4) {
      var headerRange = main.getRange(1, 4, 1, metadata.lastUserCol - 3);
      var headers = headerRange.getValues()[0];

      // Find all matching columns (there might be duplicates)
      var columnsToUpdate = [];
      for (var c = 0; c < headers.length; c++) {
        var currentCandidateName = headers[c]
          ? headers[c].toString().trim()
          : "";
        if (currentCandidateName.toLowerCase() === oldName.toLowerCase()) {
          columnsToUpdate.push(c + 4);
        }
      }

      // Batch remove protections for all matching columns
      batchRemoveProtectionsByColumns(main, columnsToUpdate);

      // Update each column
      columnsToUpdate.forEach(function (targetCol) {
        // Update header
        var cell = main.getRange(1, targetCol);
        cell.setValue(newName);
        cell.clearNote();

        // Setup protection with batch addEditors
        var colRange = main.getRange(1, targetCol, metadata.maxRows, 1);
        var prot = colRange.protect().setDescription("Candidate: " + newName);
        prot.removeEditors(prot.getEditors());
        batchAddEditors(prot, allEditors);
      });
    }
  });

  // Clear cache after modification
  _clearCache();

  logAction(
    "edit_user",
    oldName + " -> " + newName + " | Chain: " + finalMentorChain,
  );
  return "User " + newName + " updated successfully!";
}

function removeUser(email) {
  requireAdminOrMentor();
  email = email.trim().toLowerCase();

  var config = getSheet("Config_Users");
  var data = config.getDataRange().getValues();
  var idx = data.findIndex(function (r) {
    return r[0] && r[0].toString().trim().toLowerCase() === email;
  });
  if (idx === -1) throw new Error("User not found.");

  var name = data[idx][1];
  var assignedMentor = data[idx][3]
    ? data[idx][3].toString().trim().toLowerCase()
    : "";
  if (!canManageCandidate(assignedMentor)) {
    throw new Error(
      "Access Denied! You can only delete candidates from your own team.",
    );
  }

  // Delete row from Config_Users
  config.deleteRow(idx + 1);

  // Remove spreadsheet permissions
  var ss = SpreadsheetApp.getActive();
  try {
    ss.removeEditor(email);
    ss.removeViewer(email);
  } catch (e) {}

  // Use cached sheets for better performance
  var sheets = getCachedAssessmentSheets();

  // Collect all columns to delete across sheets for batch processing
  var columnsToDelete = [];

  sheets.forEach(function (shName) {
    var main = getSheet(shName);
    if (!main) return;

    // Get sheet metadata in single call
    var metadata = getSheetMetadata(main);

    if (metadata.lastUserCol >= 4) {
      var headers = main
        .getRange(1, 4, 1, metadata.lastUserCol - 3)
        .getValues()[0];
      var colIdx = headers.indexOf(name);
      if (colIdx !== -1) {
        columnsToDelete.push({ sheet: main, col: colIdx + 4 });
      }
    }
  });

  // Delete columns in batch (process in reverse order to maintain column indices)
  columnsToDelete.sort(function (a, b) {
    return b.col - a.col;
  });
  columnsToDelete.forEach(function (item) {
    try {
      item.sheet.deleteColumn(item.col);
    } catch (e) {}
  });

  // Clear cache after modification
  _clearCache();

  logAction("remove_user", name + " (" + email + ")");
  return "ok";
}

function syncUsersFromDrive() {
  requireAdminOrMentor();
  var ss = SpreadsheetApp.getActive();

  var editors = ss.getEditors();
  var viewers = ss.getViewers();
  var owner = ss.getOwner();

  // Use cached users for better performance
  var existingUsers = getCachedExistingUsers();
  var existingEmails = existingUsers.map(function (u) {
    return u.email;
  });

  var addedCount = 0;

  if (owner && existingEmails.indexOf(owner.getEmail().toLowerCase()) === -1) {
    _registerSyncedUser(
      owner.getEmail(),
      owner.getName() || owner.getEmail().split("@")[0],
      "admin",
    );
    addedCount++;
  }

  editors.forEach(function (ed) {
    var email = ed.getEmail().toLowerCase();
    if (email && existingEmails.indexOf(email) === -1) {
      var name = ed.getName() || email.split("@")[0];
      _registerSyncedUser(email, name, "mentor");
      addedCount++;
    }
  });

  viewers.forEach(function (vw) {
    var email = vw.getEmail().toLowerCase();
    if (email && existingEmails.indexOf(email) === -1) {
      var name = vw.getName() || email.split("@")[0];
      _registerSyncedUser(email, name, "user");
      addedCount++;
    }
  });

  if (addedCount > 0) {
    SpreadsheetApp.getUi().alert(
      "Sync complete! Added " + addedCount + " users.",
    );
    logAction("sync_users", "Synced " + addedCount + " users");
  } else {
    SpreadsheetApp.getUi().alert("All users are already synced.");
  }
}

function getExistingUsers() {
  var config = getSheet("Config_Users");
  if (!config) return [];

  var lr = config.getLastRow();
  if (lr < 2) return [];

  var data = config.getRange(2, 1, lr - 1, 4).getValues();
  var users = [];

  data.forEach(function (r) {
    if (r[0]) {
      users.push({
        email: r[0].toString().toLowerCase().trim(),
        name: r[1] ? r[1].toString().trim() : "",
        role: r[2] ? r[2].toString().toLowerCase().trim() : "user",
        mentorEmail: r[3] ? r[3].toString().toLowerCase().trim() : "", // Теперь это r[3], а не r[4]
      });
    }
  });

  return users;
}

function getSheet(name) {
  return SpreadsheetApp.getActive().getSheetByName(name);
}
