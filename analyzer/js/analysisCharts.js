// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////
var analysisChart = null;

  // returns the Y-axis number for possible reuse
  // or null if no graph created
  // yAxisInfo = {primary:true, reuse:false, yName:"", yMin:1, yMax:null, reuseAxisNum:2}
  // flags = {warning:true, error:false}
  // paramInfo = {name:"", transitions:[], color:""}
function addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo) {
    var paramTransitions = paramInfo.transitions;
    var paramName = paramInfo.name;
    var paramColor = paramInfo.color;
  
    var xyPoints = chart.createXYPoints(breathTimes, paramTransitions, null, null, 
      flags.error, flags.warning);
    if (!xyPoints.dataPoints || (xyPoints.dataPoints.length==0)) return null;
  
    var yAxis = null;
    if (!yAxisInfo.reuse) {
      yAxis = chart.createYaxis(yAxisInfo.yName, paramColor, yAxisInfo.yMin, yAxisInfo.yMax);
      if (yAxisInfo.primary) {
        return chart.addXYPointsPrimaryYNew(yAxis, paramName, paramColor,  xyPoints);
      } else {
        chart.addXYPointsSecondaryYNew(yAxis, paramName, paramColor,  xyPoints);
        return null;
      }
    } else {
      if (yAxisInfo.primary) {
        return chart.addXYPointsPrimaryYReuse(
  	  yAxisInfo.reuseAxisNum, paramName, paramColor,  xyPoints);
      } else {
        chart.addXYPointsSecondaryYReuse(paramName, paramColor,  xyPoints);
        return null;
      }
    }
    return null;
  }


function createPeakGraph(chart, reuseAxisNum) {
  elm = document.getElementById('peakTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Pressure (cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Peak Pressure (cm H20)" ,
    color: newGraphColor(),
    transitions: peakValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createPlatGraph(chart, reuseAxisNum) {
  elm = document.getElementById('platTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Pressure (cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Plateau Pressure (cm H20)" ,
    color: newGraphColor(),
    transitions: platValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createPeepGraph(chart, reuseAxisNum) {
  elm = document.getElementById('peepTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Pressure (cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Peep Pressure (cm H20)" ,
    color: newGraphColor(),
    transitions: mpeepValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createVtdelGraph(chart, reuseAxisNum) {
  elm = document.getElementById('vtdelTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:700, reuseAxisNum:reuseAxisNum,
               yName:"Volume (ml)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Tidal Volume (ml)" ,
    color: newGraphColor(),
    transitions: vtdelValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createMvdelGraph(chart, reuseAxisNum) {
  elm = document.getElementById('mvdelTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:20, reuseAxisNum:reuseAxisNum,
               yName:"Minute Volume (litres/min)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Minute Volume (litres/min)" ,
    color: newGraphColor(),
    transitions: mvdelValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createSbpmGraph(chart, reuseAxisNum) {
  elm = document.getElementById('sbpmTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Breaths per Min (bpm)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Static BPM (bpm)" ,
    color: newGraphColor(),
    transitions: sbpmValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createMbpmGraph(chart, reuseAxisNum) {
  elm = document.getElementById('mbpmTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Breaths per Min (bpm)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Static BPM (bpm)" ,
    color: newGraphColor(),
    transitions: mbpmValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createScompGraph(chart, reuseAxisNum) {
  elm = document.getElementById('scompTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Compliance (ml/cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Static Compliance (ml/cm H20)" ,
    color: newGraphColor(),
    transitions: scompValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createDcompGraph(chart, reuseAxisNum) {
  elm = document.getElementById('dcompTick');
  if (!elm.checked) return reuseAxisNum;

  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Compliance (ml/cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Dynamic Compliance (ml/cm H20)" ,
    color: newGraphColor(),
    transitions: dcompValues
  };

  return addGraph(chart, yAxisInfo, breathTimes, flags, paramInfo);
}

function createAnalysisChart() {
  cleanupCharts();
  height = 650;
  elm = document.getElementById("chartTitle");
  title = elm.value;
  elm = document.getElementById("timeTick");
  timeBased = elm.checked;

  analysisChart = new LineChart(title, height, timeBased);

  var init = null;
  var min = null;
  var max = null;
  var missing = [];
  if (timeBased) {
    init = logStartTime;
    min = analysisStartTime;
    max = analysisEndTime;
  } else {
    init = 0;
    min = 1;
    max = breathTimes.length;
  }
  analysisChart.addXaxis(init, min, max, missing);

  pressureAxisNum = null;
  pressureAxisNum = createPeakGraph(analysisChart, pressureAxisNum);
  pressureAxisNum = createPlatGraph(analysisChart, pressureAxisNum);
  pressureAxisNum = createPeepGraph(analysisChart, pressureAxisNum);

  vtAxisNum = null;
  vtAxisNum = createVtdelGraph(analysisChart, vtAxisNum);

  mvAxisNum = null;
  mvAxisNum = createMvdelGraph(analysisChart, mvAxisNum);

  bpmAxisNum = null;
  bpmAxisNum = createSbpmGraph(analysisChart, bpmAxisNum);
  bpmAxisNum = createMbpmGraph(analysisChart, bpmAxisNum);

  compAxisNum = null;
  compAxisNum = createScompGraph(analysisChart, compAxisNum);
  compAxisNum = createDcompGraph(analysisChart, compAxisNum);

  containerDiv = document.getElementById("chartContainerDiv");
  analysisChart.render(containerDiv);
}

////////////////////////////////////////////////////////

function displayCharts() {
  //console.log("displayCharts");
  if (!globalDataValid) {
    alert("Data Gathering in process\nGive us a second and try again");
    return;
  }
}

function cleanupCharts() {
  if (analysisChart) {
    analysisChart.destroy();
    delete analysisChart;
    analysisChart = null;
  }
  elm = document.getElementById("chartContainerDiv");
  elm.innerHTML = "";
}

function initSelection() {
  document.getElementById('peakTick').checked = false;
  document.getElementById('platTick').checked = false;
  document.getElementById('peepTick').checked = false;
  document.getElementById('vtdelTick').checked = false;
  document.getElementById('mvdelTick').checked = false;
  document.getElementById('mbpmTick').checked = false;
  document.getElementById('sbpmTick').checked = false;
  document.getElementById('errorTick').checked = false;
  document.getElementById('warningTick').checked = false;
  document.getElementById('scompTick').checked = false;
  document.getElementById('dcompTick').checked = false;
  document.getElementById('tempTick').checked = false;
  document.getElementById('fiO2Tick').checked = false;
  document.getElementById('o2PurityTick').checked = false;
  document.getElementById('o2FlowTick').checked = false;
  document.getElementById('timeTick').checked = false;
  document.getElementById('breathTick').checked = true;
}

function initCharts() {
  //console.log("initCharts");
  cleanupCharts();
  initSelection();
}

