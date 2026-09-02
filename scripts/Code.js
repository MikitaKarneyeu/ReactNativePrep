function onOpen() {
  var role;
  try {
    role = getUserRole();
    if (role === 'user') return; 
  } catch (e) {
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const mainMenu = ui.createMenu('📋 Interview Tools');

  if (role === 'admin' || role === 'mentor' || role === 'content_admin') {
    const usersMenu = ui.createMenu('👥 Users')
      .addItem('Add User', 'showAddUserForm')
      .addItem('Edit User', 'showEditUserForm')
      .addItem('Remove User', 'showRemoveUserForm')
      .addItem('List All Users', 'showUserList')
      .addItem('Dashboard Search', 'showDashboardSearchForm')
      .addItem('Randomize Questions', 'showRandomizeQuestionsPanel');

    if (role === 'admin') {
      usersMenu.addSeparator().addItem('Sync Users from Drive', 'syncUsersFromDrive');
    }
    mainMenu.addSubMenu(usersMenu);
  }

  if (role === 'admin' || role === 'content_admin') {
    const questionsMenu = ui.createMenu('❓ Questions')
      .addItem('Add Question(s)', 'showAddQuestionForm')
      .addItem('Edit Question', 'showEditQuestionForm')
      .addItem('Remove Question(s)', 'showRemoveQuestionForm')
      .addItem('Search Questions', 'showSearchForm'); 
    mainMenu.addSubMenu(questionsMenu);

    const topicsMenu = ui.createMenu('🏷️ Topics')
      .addItem('Add Topic', 'showAddTopicForm')
      .addItem('Rename Topic', 'showRenameTopicForm')
      .addItem('Merge Topics', 'showMergeTopicsForm')
      .addItem('Reorder Topics', 'showReorderTopicsForm')
      .addItem('Remove Topic', 'showRemoveTopicForm');
    mainMenu.addSubMenu(topicsMenu);

    const sheetsMenu = ui.createMenu('📑 Sheets')
      .addItem('Create New Sheet', 'showCreateSheetForm')
      .addItem('Rename Sheet', 'showRenameSheetForm')
      .addItem('Delete Sheet', 'showDeleteSheetForm');
    mainMenu.addSubMenu(sheetsMenu);
  }

  if (role === 'admin') {
    const controlMenu = ui.createMenu('🔄 Controls')
      .addItem('Refresh All Sheets', 'sortAndFormatAllSheets')
      .addItem('Protect All Sheets', 'protectAllSheets')
      .addItem('Apply Native Protections', 'applyNativeProtectionsToAllCandidates');
    mainMenu.addSubMenu(controlMenu);
  }

  mainMenu.addToUi();
}