function sortAndFormatAllSheets(targetSheetName) {
  // Use cached sheets for better performance
  var sheets = targetSheetName ? [targetSheetName] : getCachedAssessmentSheets();
  if (sheets.length === 0) return;

  var configTopics = getSheet('Config_Topics');
  var topicOrder = {};
  if (configTopics) {
    var topicValues = configTopics.getDataRange().getValues();
    for (var i = 1; i < topicValues.length; i++) {
      if (topicValues[i][0]) topicOrder[topicValues[i][0]] = topicValues[i][1] || 999;
    }
  }

  // Use cached users for better performance
  var usersData = getCachedExistingUsers();
  var validUsers = {};
  var mentorMap = {};
  
  usersData.forEach(function(u) {
    if (u.role === 'user' && u.name) {
      validUsers[u.name.toLowerCase()] = true;
      mentorMap[u.name.toLowerCase()] = u.mentorEmail;
    }
  });

  sheets.forEach(function(sheetName) {
    var main = getSheet(sheetName);
    if (!main) return;
    
    // WARNING: Removing all protections before rewriting format
    var pRanges = main.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    pRanges.forEach(function(p) { p.remove(); });
    var sRanges = main.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    sRanges.forEach(function(p) { p.remove(); });
    
    var maxCol = main.getMaxColumns();
    
    // Cleanup removed/inactive user columns
    if (maxCol >= 4) {
      var headers = main.getRange(1, 1, 1, maxCol).getValues()[0];
      for (var c = maxCol - 1; c >= 3; c--) { 
        var colName = headers[c] ? headers[c].toString().trim().toLowerCase() : '';
        if (colName && !validUsers[colName]) {
          if (main.getMaxColumns() <= 4) {
            main.getRange(1, 4, main.getMaxRows(), 1).clearContent().clearDataValidations().setBackground(null);
          } else {
            try { main.deleteColumn(c + 1); } catch(e) {}
          }
        }
      }
    }

    if (main.getMaxColumns() < 15) {
      main.insertColumnsAfter(main.getMaxColumns(), 15 - main.getMaxColumns());
    }

    var currentMaxCol = main.getMaxColumns();
    var updatedHeaders = main.getRange(1, 1, 1, currentMaxCol).getValues()[0];
    var activeCols = 3; 
    
    for (var i = 3; i < updatedHeaders.length; i++) {
      if (updatedHeaders[i] && updatedHeaders[i].toString().trim() !== '') activeCols++;
      else break; 
    }

    var dataLastRow = main.getLastRow(); 
    var pureQuestions = [];
    var lastTopic = '';

    // Extract existing data
    if (dataLastRow >= 3) {
      var rawData = main.getRange(3, 1, dataLastRow - 2, activeCols).getValues();
      for (var i = 0; i < rawData.length; i++) {
        var topic = rawData[i][0] ? rawData[i][0].toString().trim() : '';
        if (topic) lastTopic = topic;
        var actualTopic = topic || lastTopic;
        var question = rawData[i][1] ? rawData[i][1].toString().trim() : '';
        var link = rawData[i][2] ? rawData[i][2].toString().trim() : ''; 

        if (question !== '') {
          var rowObj = { topic: actualTopic, question: question, link: link, userVals: [] };
          for (var k = 3; k < activeCols; k++) rowObj.userVals.push(rawData[i][k] === true);
          pureQuestions.push(rowObj);
        }
      }
    }

    if (pureQuestions.length === 0) {
      restoreNativeProtections(main, activeCols, mentorMap);
      return;
    }

    // Sort questions based on config order
    pureQuestions.sort(function(a, b) {
      var orderA = topicOrder[a.topic] || 999;
      var orderB = topicOrder[b.topic] || 999;
      if (orderA !== orderB) return orderA - orderB;
      if (a.topic !== b.topic) return a.topic.localeCompare(b.topic);
      return a.question.localeCompare(b.question);
    });

    // Group by topic
    var grouped = [];
    var currentGroup = null;
    for (var j = 0; j < pureQuestions.length; j++) {
      if (!currentGroup || currentGroup.topic !== pureQuestions[j].topic) {
        currentGroup = { topic: pureQuestions[j].topic, questions: [] };
        grouped.push(currentGroup);
      }
      currentGroup.questions.push(pureQuestions[j]);
    }

    // Prepare output array
    var outputData = [];
    var currentRow = 3; 

    for (var g = 0; g < grouped.length; g++) {
      var group = grouped[g];
      var qCount = group.questions.length;
      var headerRow = [group.topic, "", ""]; 
      
      var questionStartRow = currentRow + 1;
      var questionEndRow = currentRow + qCount;

      for (var colIdx = 3; colIdx < activeCols; colIdx++) {
        var colLetter = _colToLetter(colIdx + 1);
        var formula = '=IFERROR(COUNTIF(' + colLetter + questionStartRow + ':' + colLetter + questionEndRow + ', TRUE) / ' + qCount + ', 0)';
        headerRow.push(formula);
      }
      outputData.push(headerRow);
      currentRow++;

      for (var qIdx = 0; qIdx < qCount; qIdx++) {
        var q = group.questions[qIdx];
        var qRow = [q.topic, q.question, q.link]; 
        for (var v = 0; v < (activeCols - 3); v++) {
          qRow.push(q.userVals[v] || false);
        }
        outputData.push(qRow);
        currentRow++;
      }
    }

    // === SAFE OVERWRITE (NO DELETION) ===
    if (outputData.length > 0) {
      var fullRange = main.getRange(3, 1, outputData.length, activeCols);
      
      var palette = ['#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f7fa'];
      var topicColors = {};
      var colorIdx = 0;

      var backgrounds = [], fontColors = [], fontWeights = [], numberFormats = [], validations = [];
      var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();

      for (var r = 0; r < outputData.length; r++) {
        var t = outputData[r][0];
        if (!topicColors[t]) { topicColors[t] = palette[colorIdx % palette.length]; colorIdx++; }
        var isHeader = (outputData[r][1] === ""); 
        var bgRow = [], fcRow = [], fwRow = [], nfRow = [], valRow = [];

        for (var col = 0; col < activeCols; col++) {
          if (isHeader) {
            bgRow.push(topicColors[t]); fcRow.push('#000000'); fwRow.push('bold');
            nfRow.push(col >= 3 ? '0%' : ''); valRow.push(null);
          } else {
            bgRow.push(col === 0 ? topicColors[t] : '#ffffff'); fcRow.push(col === 0 ? topicColors[t] : '#000000'); fwRow.push('normal');
            nfRow.push(''); valRow.push(col >= 3 ? checkboxRule : null); 
          }
        }
        backgrounds.push(bgRow); fontColors.push(fcRow); fontWeights.push(fwRow); 
        numberFormats.push(nfRow); validations.push(valRow);
      }

      fullRange.setValues(outputData); 
      fullRange.setBackgrounds(backgrounds);
      fullRange.setFontColors(fontColors);
      fullRange.setFontWeights(fontWeights);
      fullRange.setNumberFormats(numberFormats);
      fullRange.setDataValidations(validations);

      if (dataLastRow >= 3 && (dataLastRow - 2) > outputData.length) {
        var leftoverRows = (dataLastRow - 2) - outputData.length;
        main.getRange(3 + outputData.length, 1, leftoverRows, main.getMaxColumns()).clear();
      }
    }

    if (main.getMaxColumns() > activeCols) {
      main.getRange(1, activeCols + 1, main.getMaxRows(), main.getMaxColumns() - activeCols)
          .clearContent().clearDataValidations().setBackground(null).setFontColor(null);
    }

    // Restore column protections natively based on Config_Users data
    restoreNativeProtections(main, activeCols, mentorMap);
  });
}

/**
 * Helper to dynamically restore native mentor protections after a full sheet format
 * Optimized to use batch operations
 */
function restoreNativeProtections(sheet, activeCols, mentorMap) {
  // Get headers in single API call
  var headers = sheet.getRange(1, 1, 1, activeCols).getValues()[0];
  var maxRows = sheet.getMaxRows();
  
  for (var c = 3; c < activeCols; c++) {
    var candName = headers[c] ? headers[c].toString().trim() : '';
    if (candName) {
      var mentorEmail = mentorMap[candName.toLowerCase()] || '';
      var colRange = sheet.getRange(1, c + 1, maxRows, 1);
      
      // Setup protection with batch addEditors
      var prot = colRange.protect().setDescription('Candidate: ' + candName);
      prot.removeEditors(prot.getEditors());
      
      // Use batch addEditors for better performance
      if (mentorEmail) {
        batchAddEditors(prot, [mentorEmail]);
      }
    }
  }
}