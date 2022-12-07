// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////
function keyMoreThanAnalysisRangeMax(key) {
  d = new Date(key);
  if (d > app.analysisEndTime) return true;
  return false;
}

function keyLessThanAnalysisRangeMin(key) {
  d = new Date(key);
  if (d < app.analysisStartTime) return true;
  return false;
}

function keyWithinAnalysisRange(key) {
  d = new Date(key);
  if (d < app.analysisStartTime) return false;
  if (d > app.analysisEndTime) return false;
  return true;
}

function equalParamCombos(curr, prev) {
  //console.log("curr"); console.log(curr);
  //console.log("prev"); console.log(prev);
  if (
    (curr.value.mode == prev.value.mode) &&
    (curr.value.vt == prev.value.vt) &&
    (curr.value.rr == prev.value.rr) &&
    (curr.value.ie == prev.value.ie) &&
    (curr.value.ipeep == prev.value.ipeep) &&
    (curr.value.pmax == prev.value.pmax) &&
    (curr.value.ps == prev.value.ps) &&
    (curr.value.fiO2 == prev.value.fiO2) &&
    (curr.value.tps == prev.value.tps)
  ) {
    return true;
  }
  else return false;
}

function globalTrackJsonRecord(jsonData) {
  for (var key in jsonData) {
    app.initialJsonRecord.created = jsonData.created;
    if (key == 'content') {
      for (var ckey in jsonData.content) {
        value = jsonData.content[ckey];
        app.initialJsonRecord.content[ckey] = value;
        if (ckey == "BNUM") {
	  var bnumValue = parseChecksumString(value);
	  if (bnumValue==null) continue; // ignore badly formed BNUM
	  value = Number(bnumValue);
          if (app.prevSystemBreathNum == -1) { // initialize
            app.prevSystemBreathNum = value - 1;
          }
          app.systemBreathNum = value;
	  if (app.startSystemBreathNum==-1) app.startSystemBreathNum = value;
          bMissing = app.systemBreathNum - app.prevSystemBreathNum - 1;
          session.numMissingBreaths += bMissing;
          app.prevSystemBreathNum = value;
          session.breathTimes = [{
            "time": app.initialJsonRecord.created,
            "valid": false
          }]
        }
      }
    }
  }
  // delete signalling messages
  delete app.initialJsonRecord.content["BNUM"];
  delete app.initialJsonRecord.content["WMSG"];
  delete app.initialJsonRecord.content["EMSG"];
}

function processFirstRecordData() {
  // delete signalling messages
  delete app.initialJsonRecord.content["BNUM"];
  delete app.initialJsonRecord.content["WMSG"];
  delete app.initialJsonRecord.content["EMSG"];
  app.prevParamCombo = cloneObject(app.currParamCombo);
  app.prevParamCombo.time = app.initialJsonRecord.created;
  globalProcessJsonRecord(app.initialJsonRecord);
}

function readSessionVersion(jsonData) {
  if (app.sessionVersion != 'UNKNOWN') return;
  for (var key in jsonData) {
    if (key == 'content') {
      for (var ckey in jsonData.content) {
        if (ckey == "SESSION_VERSION") {
          app.sessionVersion = jsonData.content[ckey];
	  console.log("Found sessionVersion=" + app.sessionVersion);
	}
      }
    }
  }
}

function globalProcessJsonRecord(jsonData) {
  curTime = new Date(jsonData.created);
  if (app.firstRecord) {
    app.firstRecord = false;
    processFirstRecordData();
  }
  // Below is common to all pages
  processJsonRecord(jsonData);
}

function globalProcessAllJsonRecords(key, lastRecord, lastRecordCallback) {
  var req = indexedDB.open(dbName, dbVersion);
  req.onsuccess = function(event) {
    // Set the db variable to our database so we can use it!  
    var db = event.target.result;
    sessionDbReady = true;
    var tx = db.transaction(dbObjStoreName, 'readonly');
    var store = tx.objectStore(dbObjStoreName);
    var keyReq = store.get(key);
    keyReq.onsuccess = function(event) {
      var jsonData = keyReq.result;
      readSessionVersion(jsonData);
      // It will never get here if keyMoreThanAnalysisRangeMax
      if (keyLessThanAnalysisRangeMin(jsonData.created)) {
        globalTrackJsonRecord(jsonData);
      }
      else {
        globalProcessJsonRecord(jsonData);
      }
      if (lastRecord) {
        if (typeof lastRecordCallback != 'undefined') lastRecordCallback();
      }
    }
  }
}

function gatherGlobalData(lastRecordCallback) {
  app.globalDataValid = false;
  app.sessionVersion = "UNKNOWN";
  app.initialJsonRecord = cloneObject(jsonRecordSchema);
  if (allDbKeys.length == 0) {
    alert("Selected Session has no data");
    return;
  }
  var lastRecord = false;
  for (i = 0; i < allDbKeys.length; i++) {
    key = allDbKeys[i];
    if (keyMoreThanAnalysisRangeMax(allDbKeys[i])) {
      break;
    }
    else if (i == (allDbKeys.length - 1)) {
      lastRecord = true;
    }
    else if (keyMoreThanAnalysisRangeMax(allDbKeys[i + 1])) {
      lastRecord = true;
    }
    globalProcessAllJsonRecords(key, lastRecord, lastRecordCallback);
  }
}

function processJsonRecord(jsonData) {
  curTime = new Date(jsonData.created);
  for (var key in jsonData) {
    if (key == 'content') {
      if (typeof jsonData.content["WMSG"] != 'undefined') {
        if (app.chartExpectWarningMsg) { // back to back with Previous msg not yet fully received
          var msg = {
            'created': app.lastWarningTime,
            'L1': app.chartL1,
            'L2': app.chartL2,
            'L3': app.chartL3,
            'L4': app.chartL4
          };
          session.warningMsgs.push(msg);
        }
        app.lastWarningTime = curTime;
        app.chartExpectWarningMsg = true;
        session.warningValues.push({
          "time": curTime,
          "value": ++app.warningNum
        });
      }
      if (typeof jsonData.content["EMSG"] != 'undefined') {
        if (app.chartExpectErrorMsg) { // back to back with Previous msg not yet fully received
          var msg = {
            'created': app.lastErrorTime,
            'L1': app.chartL1,
            'L2': app.chartL2,
            'L3': app.chartL3,
            'L4': app.chartL4
          };
          session.errorMsgs.push(msg);
        }
        app.lastErrorTime = curTime;
        app.chartExpectErrorMsg = true;
        session.errorValues.push({
          "time": curTime,
          "value": ++app.errorNum
        });
      }
      for (var ckey in jsonData.content) {
        value = jsonData.content[ckey];
        if (app.chartL1 && app.chartL2 && app.chartL3 && app.chartL4) {
          if (app.chartExpectErrorMsg || app.chartExpectWarningMsg) {
            var msgTime;
            if (app.chartExpectWarningMsg) {
              msgTime = app.lastWarningTime;
            }
            else {
              msgTime = app.lastErrorTime;
            }
            var msg = {
              'created': msgTime,
              'L1': app.chartL1,
              'L2': app.chartL2,
              'L3': app.chartL3,
              'L4': app.chartL4
            };
            if (app.chartExpectWarningMsg) {
              session.warningMsgs.push(msg);
            }
            else {
              session.errorMsgs.push(msg);
            }
            app.chartExpectWarningMsg = false;
            app.chartExpectErrorMsg = false;
            app.chartL1 = app.chartL2 = app.chartL3 = app.chartL4 = "";
          }
        }
        if (ckey == "L1") {
          if (app.chartExpectWarningMsg || app.chartExpectErrorMsg) {
            if (!app.chartL1) app.chartL1 = jsonData.content['L1'];
          }
        }
        else if (ckey == "L2") {
          if (app.chartExpectWarningMsg || app.chartExpectErrorMsg) {
            if (!app.chartL2) app.chartL2 = jsonData.content['L2'];
          }
        }
        else if (ckey == "L3") {
          if (app.chartExpectWarningMsg || app.chartExpectErrorMsg) {
            if (!app.chartL3) app.chartL3 = jsonData.content['L3'];
          }
        }
        else if (ckey == "L4") {
          if (app.chartExpectWarningMsg || app.chartExpectErrorMsg) {
            if (!app.chartL4) app.chartL4 = jsonData.content['L4'];
          }
        }
        else if (ckey == "INITIAL") {
          if ((value == 1) && !app.initialState) {
            session.stateValues.push({"time": curTime, "value": INITIAL_STATE});
	  }
          app.initialState = (value == 1);
        }
        else if (ckey == "STANDBY") {
          if ((value == 1) && !app.standbyState) {
            session.stateValues.push({"time": curTime, "value": STANDBY_STATE});
	  }
          app.standbyState = (value == 1);
        }
        else if (ckey == "RUNNING") {
          if ((value == 1) && !app.activeState) {
            session.stateValues.push({"time": curTime, "value": ACTIVE_STATE});
	  }
          app.activeState = (value == 1);
        }
        else if (ckey == "ERROR") {
          if ((value == 1) && !app.errorState) {
            session.stateValues.push({"time": curTime, "value": ERROR_STATE});
	  }
          app.errorState = (value == 1);
        }
        else if (ckey == "BNUM") {
	  var bnumValue = parseChecksumString(value);
	  if (bnumValue==null) {
	    console.log("Bad BNUM value = " + value + " sys = " + app.systemBreathNum);
	    continue; // will count as missing
	  }
          value = Number(bnumValue);
          if ((app.usedParamCombos.length == 0) ||
            !equalParamCombos(app.currParamCombo, app.prevParamCombo)) {
            // first breath in current combo
            app.prevParamCombo = cloneObject(app.currParamCombo);
            app.currParamCombo.time = jsonData.created;
            app.currParamCombo.value.numBreaths = 1;
            app.currParamCombo.value.startingBreath = session.breathTimes.length-1;
            app.usedParamCombos.push(cloneObject(app.currParamCombo));
          }
          else {
            // update number of breaths for the last combo
            app.usedParamCombos[app.usedParamCombos.length - 1].value.numBreaths++;
          }
          session.breathTimes.push({
            "time": curTime,
            "valid": true
          });
	  if (app.prevBreathRecorded != app.prevBreathMandatory) {
            session.breathTypeValues.push({
              "time": curTime,
              "value": app.errorState?ERROR_BREATH:
	      (app.prevBreathMandatory?MANDATORY_BREATH:SPONTANEOUS_BREATH)
            });
	    app.prevBreathRecorded = app.prevBreathMandatory;
	  }

          if (app.chartPrevSystemBreathNum == -1) { // initialize
            app.chartPrevSystemBreathNum = value - 1;
          }
          app.systemBreathNum = value;
          breathsMissing = app.systemBreathNum - app.chartPrevSystemBreathNum - 1;
	  app.numMissingBreaths += breathsMissing;

	  if (breathsMissing) {
	    var msg = {
              'created': curTime,
              'L1': String(breathsMissing) + " Breath(s) missed",
              'L2': "Info not received by",
              'L3': "Dashboard due to",
              'L4': "Internet packet loss"
            };
            session.notificationMsgs.push(msg);
            session.notificationValues.push({
              "time": curTime,
              "value": ++app.notificationNum
            });
	  }

	  updateRangeOnNewBreath(app.systemBreathNum - app.chartPrevSystemBreathNum);
          app.chartPrevSystemBreathNum = value;
          if (breathsMissing) {
            console.log("Breaths Missing =" + breathsMissing);
            console.log("Before systemBreathNum=" + app.systemBreathNum);
            session.missingBreaths.push({
              "time": curTime,
              "value": breathsMissing
            });
            // stuff dummy breaths 1 sec apart because the fastest breath is 2 secs
            lastBreathNum = session.breathTimes.length;
            for (i = 1; i <= breathsMissing; i++) {
              session.breathTimes.push({
                "time": app.lastValidBreathTime + i,
                "valid": false
              });
            }
            // record breaks for graphing
            session.missingBreathWindows.push({
              "startValue": lastBreathNum+0.5,
              "endValue": lastBreathNum + breathsMissing + 0.5,
              "type": "zigzag",
              "lineColor": "black",
              "autoCalculate": true
            });
	    if (!app.lastValidBreathTime) app.lastValidBreathTime=app.startDate;
            session.missingTimeWindows.push({
              "startValue": ((new Date(app.lastValidBreathTime) - app.startDate)/1000)+0.5,
              "endValue": ((new Date(curTime) - app.startDate)/1000)-0.5,
	      "type": "zigzag",
              "lineColor": "black",
              "autoCalculate": true
            });
          }
          app.lastValidBreathTime = curTime;
        }
        else if (ckey == "BREATH") {
	  app.prevBreathMandatory = (value=="MANDATORY");
          app.prevBreathSpontaneous = (value == "SPONTANEOUS");
        }
        else if (ckey == "FIO2") {
          if (validDecimalInteger(value) && (value <= 100)) {
            session.fiO2Values.push({
              "time": curTime,
              "value": Number(value)
            });
            app.currParamCombo.value.fiO2 = value;
            if ((session.fiO2s.length == 0) || (session.fiO2s.indexOf(value) == -1)) {
              session.fiO2s.push({"time": curTime, "value": value});
            }
          }
          else {
            session.fiO2Values.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "O2PURITY") {
          if (validDecimalInteger(value) && (value <= 100)) {
            session.o2PurityValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.o2PurityValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "O2FLOWX10") {
          if (validDecimalInteger(value)) {
            session.o2FlowValues.push({
              "time": curTime,
              "value": (value / 10)
            });
          }
          else {
            session.o2FlowValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "MBPM") {
          if (validDecimalInteger(value)) {
            session.mbpmValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.mbpmValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "SBPM") {
          if (validDecimalInteger(value)) {
            session.sbpmValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.sbpmValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "STATIC") {
          if (validDecimalInteger(value)) {
            session.scompValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.scompValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "DYNAMIC") {
          if (validDecimalInteger(value)) {
            session.dcompValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.dcompValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "VTDEL") {
          if (validDecimalInteger(value)) {
            session.vtdelValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.vtdelValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "MVDEL") {
          if (validFloatNumber(value)) {
            session.mvdelValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.mvdelValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "PIP") {
          if (validDecimalInteger(value)) {
            session.peakValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.peakValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "PLAT") {
          if (validDecimalInteger(value)) {
            session.platValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.platValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "MPEEP") {
          if (validDecimalInteger(value)) {
            session.mpeepValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.mpeepValues.push({
              "time": curTime,
              "value": null
            });
          }
        }
        else if (ckey == "TEMP") {
          if (validDecimalInteger(value)) {
            session.tempValues.push({
              "time": curTime,
              "value": Number(value)
            });
          }
          else {
            session.tempValues.push({
              "time": curTime,
              "value": null
            });
          }
	}
        else if (ckey == "MODE") {
          if (modeValid(value)) {
            app.currParamCombo.value.mode = value;
            if ((session.modes.length == 0) || (session.modes.indexOf(value) == -1)) {
              session.modes.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "VT") {
          if (vtValid(value)) {
            app.currParamCombo.value.vt = value;
            if ((session.vts.length == 0) || (session.vts.indexOf(value) == -1)) {
              session.vts.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "RR") {
          if (rrValid(value)) {
            app.currParamCombo.value.rr = value;
            if ((session.rrs.length == 0) || (session.rrs.indexOf(value) == -1)) {
              session.rrs.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "EI") {
          if (ieValid(value)) {
            app.currParamCombo.value.ie = value;
            if ((session.ies.length == 0) || (session.ies.indexOf(value) == -1)) {
              session.ies.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "IPEEP") {
          if (peepValid(value)) {
            app.currParamCombo.value.ipeep = value;
            if ((session.ipeeps.length == 0) || (session.ipeeps.indexOf(value) == -1)) {
              session.ipeeps.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "PMAX") {
          if (pmaxValid(value)) {
            app.currParamCombo.value.pmax = value;
            if ((session.pmaxs.length == 0) || (session.pmaxs.indexOf(value) == -1)) {
              session.pmaxs.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "PS") {
          if (psValid(value)) {
            app.currParamCombo.value.ps = value;
            if ((session.pss.length == 0) || (session.pss.indexOf(value) == -1)) {
              session.pss.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "TPS") {
          if (tpsValid(value)) {
            app.currParamCombo.value.tps = value;
            if ((session.tpss.length == 0) || (session.tpss.indexOf(value) == -1)) {
              session.tpss.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "FIO2") {
          if (validDecimalInteger(value) && (value <= 100)) {
            app.currParamCombo.value.fiO2 = value;
            if ((session.fiO2s.length == 0) || (session.fiO2s.indexOf(value) == -1)) {
              session.fiO2s.push({"time": curTime, "value": value});
            }
          }
        }
        else if (ckey == "ALT") {
          session.altitude = value + " ft(m)";
        }
        else if (ckey == "PNAME") {
          session.patientName = value;
        }
        else if (ckey == "PMISC") {
          session.patientInfo = value;
        }
      }
    }
  }
}

function formInitialJsonRecord() {
  return initialJsonRecord;
}

