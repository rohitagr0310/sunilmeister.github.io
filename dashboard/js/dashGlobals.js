// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////

const TIMEOUT_INTERVAL_IN_MS = 200;
const BLINK_INTERVAL_IN_MS = 1000;
const MAX_DWEET_INTERVAL_IN_MS = 30000;
const INIT_RECORDING_INTERVAL_IN_MS = 5000;
const MAX_DIFF_DWEET_SIMULAION_TIMES = 10000;

var datasource_name = "RESPIMATIC100";
var simulatedTimeInMs = 0;
var startimulatedTimeInMs = 0;
var startMillis = 0;
var simulatedMillis = 0;
var lastDweetInMs = 0;
var startSystemDate = new Date();
var prevAlarmErrorNum = -1;

var currentView = "snapshots";
var currentViewIsSnapshot = true;

var updatePaused = false;
var updateInProgress = false;
var prevUpdateRange = {rolling:false};
var prevUpdateNumWaves = -1;
var prevUpdateNumShapes = -1;
var prevUpdateNumAlerts = -1;

var wifiDropped = false;
var wifiDroppedBlink = 0;

var savedL1 = "";
var savedL2 = "";
var savedL3 = "";
var savedL4 = "";

var breathPausedAt = 0;

var updatedDweetContent = {
  "content": {}
};
var awaitingFirstDweet = true;
var dweetQ = null;
var periodicTickCount = 0;
var lastDweetTick = 0;
var dweetIntervalCounter = 0;
var finishedLoading = false;

var messagesBackground = "MEDIUMBLUE";
var alertBackground = "GREEN";
var pendingBackground = "MEDIUMBLUE";
var flowDivBackground = "DARKBLUE";
var pauseButtonForeground = "MEDIUMBLUE";
var recordButtonForeground = "MEDIUMBLUE";
var recorderBackground = "MEDIUMBLUE";
var alertImage = "OK";

var blinkInterval = 0;
var prevBlinkTimeInMs = (new Date()).getTime();

var blueColor;
var darkblueColor;
var darkredColor;
var greenColor;
var orangeColor;

var desiredFiO2 = 21;
var o2Purity = 21;
var reqO2Flow = 0;

var fiO2Gauge = null;
var purityGauge = null;
var peakGauge = null;
var platGauge = null;
var peepGauge = null;
var tempGauge = null;

// sliders
var sliderCommitPending = false;
var stopSliderCallback = false;
var sliderDiv = null;
var rangeWindowDiv = null;
var rangeSlider = null;

// Various HTML divs for updating
var stateDIV = null;
var pline1DIV = null;
var pline2DIV = null;
var pline3DIV = null;
var sbpmDIV = null;
var mbpmDIV = null;
var vtdelDIV = null;
var mvdelDIV = null;
var scompDIV = null;
var dcompDIV = null;
var altfDIV = null;
var altmDIV = null;
var breathTypeDIV = null;
var tpsDIV = null;
var tpsUnitsDIV = null;
var imgStateDIV = null;
var imgBreathDIV = null;

var sbpmValELM = null;
var mbpmValELM = null;
var vtdelValELM = null;
var mvdelValELM = null;
var scompValELM = null;
var dcompValELM = null;
var breathTypeValELM = null;
var tpsValELM = null;
var vtValELM = null;
var pmaxValELM = null;
var ipeepValELM = null;
var psValELM = null;
var modeValELM = null;
var tpsValELM = null;
var ieValELM = null;
var rrValELM = null;
var vtMvTitleELM = null;
var vtMvUnitsELM = null;

function initDivElements() {
  stateDIV = document.getElementById("StateDiv");
  pline1DIV = document.getElementById("Pline1");
  pline2DIV = document.getElementById("Pline2");
  pline3DIV = document.getElementById("Pline3");
  stateDIV = document.getElementById("State");
  sbpmDIV = document.getElementById("SBPM");
  mbpmDIV = document.getElementById("MBPM");
  vtdelDIV = document.getElementById("VTDEL");
  mvdelDIV = document.getElementById("MVDEL");
  scompDIV = document.getElementById("SCOMP");
  dcompDIV = document.getElementById("DCOMP");
  altfDIV = document.getElementById("AltF");
  altmDIV = document.getElementById("AltM");
  breathTypeDIV = document.getElementById("BreathType");
  tpsDIV = document.getElementById("TPS");
  tpsUnitsDIV = document.getElementById("TPS_UNITS");
  imgStateDIV = document.getElementById("StateImg")
  imgBreathDIV = document.getElementById("ImgBreath");

  vtDIV = document.getElementById("VTDiv");
  pmaxDIV = document.getElementById("PMAXDiv");
  ipeepDIV = document.getElementById("IPEEPDiv");
  psDIV = document.getElementById("PSDiv");
  modeDIV = document.getElementById("MODEDiv");
  tpsDIV = document.getElementById("TPSDiv");
  ieDIV = document.getElementById("IEDiv");
  rrDIV = document.getElementById("RRDiv");

  sbpmValELM = document.getElementById("SBPM");
  mbpmValELM = document.getElementById("MBPM");
  vtdelValELM = document.getElementById("VTDEL");
  mvdelValELM = document.getElementById("MVDEL");
  scompValELM = document.getElementById("SCOMP");
  dcompValELM = document.getElementById("DCOMP");
  breathTypeValELM = document.getElementById("BreathType");
  tpsValELM = document.getElementById("TPS");
  tpsUnitsValELM = document.getElementById("TPS_UNITS");
  vtValELM = document.getElementById("VT");
  pmaxValELM = document.getElementById("PMAX");
  ipeepValELM = document.getElementById("IPEEP");
  psValELM = document.getElementById("PS");
  modeValELM = document.getElementById("MODE");
  ieValELM = document.getElementById("IE");
  rrValELM = document.getElementById("RR");
  vtMvTitleELM = document.getElementById('VtMvTitle');
  vtMvUnitsELM = document.getElementById('VtMvUnits');

}
  
  
