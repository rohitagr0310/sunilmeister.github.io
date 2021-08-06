var logStartTime;
var logEndTime;
var analysisStartTime;
var analysisEndTime;

// check for browser capability
document.title = respimaticUid + " (ANALYZER)" ;
if (!window.indexedDB) {
    alert("IndexedDB not available in your browser.\nSwitch browsers");
}

// ///////////////////////////////////////////////////////
// Database Functions 
// ///////////////////////////////////////////////////////
function listDbTableRow(item, index) {
  nameTm = parseDbName(item);

  // only list databases for the currently selected system
  if (nameTm[0] != respimaticUid) return;

  var table = document.getElementById("dbTable");

  var row = table.insertRow();

  var cell = row.insertCell();
  cell.innerHTML = '<button class="tableButton" onclick="selectDbRow(this)">SELECT</button>' ;
  cell = row.insertCell();
  cell.innerHTML = nameTm[1];
  cell = row.insertCell();
  cell.innerHTML = nameTm[2];
  cell = row.insertCell();
  cell.innerHTML = '<button class="tableButton" onclick="deleteDbRow(this)">DELETE</button>' ;

}

function getSessionDuration(dbName) {
  var req = indexedDB.open(dbName, dbVersion);
  req.onsuccess = function(event) {
    // Set the db variable to our database so we can use it!  
    db = event.target.result;
    dbReady = true;

    var tx = db.transaction(dbObjStoreName, 'readonly');
    var store = tx.objectStore(dbObjStoreName);
    var keyReq = store.getAllKeys();

    keyReq.onsuccess = function(event) {
      keys = event.target.result;
      if (keys.length==0) {
        alert("Selected Session has no data");
      }

      logStartTime = new Date(keys[0]);
      logEndTime = new Date(keys[keys.length-1]);
      analysisStartTime = logStartTime;
      analysisEndTime = logEndTime;
      var diff = logEndTime - logStartTime;

      var elm = document.getElementById("startTime");
      elm.value = logStartTime.toISOString();
      elm.min = logStartTime.toISOString();
      elm.max = logEndTime.toISOString();

      elm = document.getElementById("endTime");
      elm.value = logEndTime.toISOString();
      elm.min = logStartTime.toISOString();
      elm.max = logEndTime.toISOString();

      elm = document.getElementById("logTimeDuration");
      elm.innerHTML = "Session Duration " + msToTime(diff);
      elm = document.getElementById("selectedTimeDuration");
      elm.innerHTML = "Selected Duration " + msToTime(diff);
    }
  }
}

async function selectDbRow(row) {
  var p=row.parentNode.parentNode;

  // reconstruct the dbName
  // grab the tag field from the first cell in the same row
  dbName = respimaticUid + '|' + p.cells[1].innerHTML + '|' + p.cells[2].innerHTML;
  
  var heading = document.getElementById("SysUid");
  heading.innerHTML = respimaticUid + 
    ' [' + p.cells[1].innerHTML + ' ' + p.cells[2].innerHTML + ' ]';

  createOrOpenDb(dbName);

  getSessionDuration(dbName);
  return dbName;
}

function deleteDbRow(row) {
  var p=row.parentNode.parentNode;

  // reconstruct the dbName
  // grab the tag field from the first cell in the same row
  name = respimaticUid + '|' + p.cells[1].innerHTML + '|' + p.cells[2].innerHTML;

  // Delete the actual database
  deleteDb(name);

  // remove from HTML table
  p.parentNode.removeChild(p);

  // return the name just in case
  return dbName;
}

// ///////////////////////////////////////////////////////
// MAIN function executed on window load
// ///////////////////////////////////////////////////////

function listAllDbs() {
  //clear any existing table being shown
  var table = document.getElementById("dbTable");
  table.innerHTML = "";

  var retrieved_dbs = getAllDbs();
  if (retrieved_dbs) {
    retrieved_dbs.forEach(listDbTableRow);
  }
}

function deleteAllDbs() {
  if (!confirm("Deleting All Saved Sessions")) return;

  //clear any existing table being shown
  var table = document.getElementById("dbTable");

  numRows = table.rows.length;
  for (i=0; i<numRows; i++) {
    row = table.rows[0];
    name = respimaticUid + '|' + row.cells[1].innerHTML + '|' + row.cells[2].innerHTML;
    deleteDb(name);
    table.deleteRow(0);
  }
}

function checkDbReady() {
  //alert("dbReady=" + dbReady + "dbName=" + dbName + "  db=" + db);
  if (dbReady && db && dbName) return true;

  if (!dbName) {
    alert('No Session Selected\nPlease Select Session for Analysis');
    return false;
  }

  nameTm = parseDbName(dbName);
  sessionName = nameTm[1] + ' [ ' + nameTm[2] + ' ]' ;
  alert('Session ' + sessionName + '\nNot yet ready\nPlease try again');
  return false;
}

function selectSession() {
  document.getElementById("selectorDiv").style.display = "block";
  document.getElementById("statsDiv").style.display = "none";
  document.getElementById("chartsDiv").style.display = "none";
  document.getElementById("rawDataDiv").style.display = "none";
  listAllDbs();
}

function selectStats() {
  if (!checkDbReady()) return;

  document.getElementById("selectorDiv").style.display = "none";
  document.getElementById("statsDiv").style.display = "block";
  document.getElementById("chartsDiv").style.display = "none";
  document.getElementById("rawDataDiv").style.display = "none";

  constructStatMinMaxTable();
}

function selectCharts() {
  if (!checkDbReady()) return;

  document.getElementById("selectorDiv").style.display = "none";
  document.getElementById("statsDiv").style.display = "none";
  document.getElementById("chartsDiv").style.display = "block";
  document.getElementById("rawDataDiv").style.display = "none";
}

function selectRawData() {
  if (!checkDbReady()) return;

  document.getElementById("selectorDiv").style.display = "none";
  document.getElementById("statsDiv").style.display = "none";
  document.getElementById("chartsDiv").style.display = "none";
  document.getElementById("rawDataDiv").style.display = "block";
}

function ResetAnalysisData() {
}

function selectStartTime() {
  var elm = document.getElementById("startTime");
  alert("Start=" + elm.value);

  ResetAnalysisData();
}

function selectEndTime() {
  var elm = document.getElementById("endTime");
  alert("End=" + elm.value);

  ResetAnalysisData();
}

function selectLogTimes() {
  ResetAnalysisData();
}

window.onload = function() {
  var heading = document.getElementById("SysUid");
  heading.innerHTML = respimaticUid + " No Session Selected";

  document.getElementById("selectorDiv").style.display = "none";
  document.getElementById("statsDiv").style.display = "none";
  document.getElementById("chartsDiv").style.display = "none";
  document.getElementById("rawDataDiv").style.display = "none";

  //Date time pickers
  instance = new dtsel.DTS('input[name="startTime"]',  {
    direction: 'BOTTOM',
    dateFormat: "dd-mm-yyyy",
    showTime: true,
    timeFormat: "HH:MM:SS"
  });

  instance = new dtsel.DTS('input[name="endTime"]',  {
    direction: 'BOTTOM',
    dateFormat: "dd-mm-yyyy",
    showTime: true,
    timeFormat: "HH:MM:SS"
  });
}


