// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////

var firstTimeShapesEntry = true;

function createAnalysisShapes() {
  if (firstTimeShapesEntry) {
    showEditIconReminder();
    firstTimeShapesEntry = false;
  }

  for (id in app.allShapesContainerInfo) {
    app.allShapesContainerInfo[id].render();
  }
}

function displayShapes() {
  //console.log("displayShapes");
  if (!app.sessionDataValid) {
    modalAlert("Data Gathering in process", "Give us a second and try again");
    return;
  }
  if (numberOfExistingShapes() == 0) {
    shapeInsertOnTop(); // always have shape box for user to start with
  }
  createAnalysisShapes();
}
