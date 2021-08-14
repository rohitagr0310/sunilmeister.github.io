var importJsonArray = [];

function initImportExport() {
  console.log("initImportExport");
  importJsonArray = [];
}

function doImport(file, fileName, dbName) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    importJsonArray = JSON.parse(evt.target.result);

    var dbReq = window.indexedDB.open(dbName, dbVersion);

    dbReq.onupgradeneeded = function(event) {
      // Save the IDBDatabase interface
      var db = event.target.result;
      var dbObjStore;
      if (!db.objectStoreNames.contains(dbObjStoreName)) {
        dbObjStore = db.createObjectStore(dbObjStoreName, {keyPath: dbPrimaryKey});
      } else {
        dbObjStore = dbReq.transaction.objectStore(dbObjStoreName);
      }
    };

    dbReq.onsuccess = function(event) {
      var db = event.target.result;
      for (i=0; i<importJsonArray.length; i++) {
        jsonData = importJsonArray[i];
        var tx = db.transaction([dbObjStoreName], 'readwrite');
        var store = tx.objectStore(dbObjStoreName);  
        store.add(jsonData);  
      }
      // free up memory ASAP
      importJsonArray = [];
      registerDbName(dbName);
      listAllDbs();
    }
  }
}

function importFile() {
  elm = document.getElementById("fileSelector");
  var fileName = elm.value;
  var file = elm.files[0];
  elm = document.getElementById("importSessionName");
  sessionName = elm.value;

  var name = "";
  today = new Date();
  creationTimeStamp = today;

  var dd = String(today. getDate()). padStart(2, '0');
  var mm = String(today. getMonth() + 1). padStart(2, '0'); //January is 0!
  var yyyy = today. getFullYear();

  var hrs = String(today. getHours()). padStart(2, '0');
  var min = String(today. getMinutes()). padStart(2, '0');
  var sec = String(today. getSeconds()). padStart(2, '0');

  dmy = dd + "-" + mm + "-" + yyyy;
  nameTagTime = dmy + " " + hrs + ":" + min + ":" + sec;

  do {
    dbName= respimaticUid + '|' + sessionName + "|" + nameTagTime;
    if (checkDbExists(dbName)) {
      alert("Session name already exists\n" + sessionName + "\nTry again");
    } else break;
  } while (true) ;

  doImport(file, fileName, dbName);
}

function exportWindow() {
}
