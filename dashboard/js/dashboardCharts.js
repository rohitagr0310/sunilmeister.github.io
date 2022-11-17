// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////
var dashboardChart = null;
var prevMinBreathNum = 0;
var prevMaxBreathNum = 0;

function createPeakGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Pressure (cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Peak Pressure (cm H20)" ,
    color: newGraphColor(),
    transitions: peakValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createPlatGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Pressure (cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Plateau Pressure (cm H20)" ,
    color: newGraphColor(),
    transitions: platValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createPeepGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Pressure (cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Peep Pressure (cm H20)" ,
    color: newGraphColor(),
    transitions: mpeepValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createVtdelGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:700, reuseAxisNum:reuseAxisNum,
               yName:"Volume (ml)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Tidal Volume (ml)" ,
    color: newGraphColor(),
    transitions: vtdelValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createMvdelGraph(chart, reuseAxisNum, rangeX) {
  yAxisInfo = {primary:false, reuse:false, yMin:0, yMax:20, reuseAxisNum:reuseAxisNum,
               yName:"Minute Volume (litres/min)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Minute Volume (litres/min)" ,
    color: newGraphColor(),
    transitions: mvdelValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createO2FlowGraph(chart, reuseAxisNum, rangeX) {
  yAxisInfo = {primary:false, reuse:false, yMin:0, yMax:20, reuseAxisNum:reuseAxisNum,
               yName:"Minute Volume (litres/min)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "O2 Flow Rate (litres/min)" ,
    color: newGraphColor(),
    transitions: o2FlowValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createSbpmGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Breaths per Min (bpm)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Static BPM (bpm)" ,
    color: newGraphColor(),
    transitions: sbpmValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createMbpmGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Breaths per Min (bpm)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Static BPM (bpm)" ,
    color: newGraphColor(),
    transitions: mbpmValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createScompGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Compliance (ml/cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Static Compliance (ml/cm H20)" ,
    color: newGraphColor(),
    transitions: scompValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createDcompGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Compliance (ml/cm H20)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "Dynamic Compliance (ml/cm H20)" ,
    color: newGraphColor(),
    transitions: dcompValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createTempGraph(chart, reuseAxisNum, rangeX) {
  yAxisInfo = {primary:false, reuse:false, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"System Temp (deg C)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "System Temp (deg C)" ,
    color: newGraphColor(),
    transitions: tempValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createWarningGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Errors & Warnings"};
  flags = {warning:true, error:false}
  paramInfo = {
    name: "Warnings" ,
    color: newGraphColor(),
    transitions: warningValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createErrorGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Errors & Warnings"};
  flags = {warning:false, error:true}
  paramInfo = {
    name: "Errors" ,
    color: newGraphColor(),
    transitions: errorValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createFiO2Graph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Percentage (%)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "FiO2 (%)" ,
    color: newGraphColor(),
    transitions: fiO2Values
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

function createPurityGraph(chart, reuseAxisNum, rangeX) {
  reuse = (reuseAxisNum != null);
  yAxisInfo = {primary:true, reuse:reuse, yMin:0, yMax:null, reuseAxisNum:reuseAxisNum,
               yName:"Percentage (%)"};
  flags = {warning:false, error:false}
  paramInfo = {
    name: "O2 Purity (%)" ,
    color: newGraphColor(),
    transitions: o2PurityValues
  };

  return chart.addGraph(yAxisInfo, breathTimes, flags, paramInfo);
}

var pressureChart = null;
function createPressureCharts(height, timeBased, rangeX, missing) {
  if (!document.getElementById("PressuresTick").checked) return;
  initGraphColor();
  if (pressureChart) {
    pressureChart.destroy();
    delete pressureChart;
    pressureChart = null;
  }
  needDummyY2 = true;
  pressureChart = new LineChart("Pressures (Peak, Plateau, Peep)", 
    height, timeBased, rangeX, needDummyY2);

  pressureChart.addXaxis(missing);

  pressureAxisNum = null;
  pressureAxisNum = createPeakGraph(pressureChart, pressureAxisNum, rangeX);
  pressureAxisNum = createPlatGraph(pressureChart, pressureAxisNum, rangeX);
  pressureAxisNum = createPeepGraph(pressureChart, pressureAxisNum, rangeX);

  containerDiv = document.getElementById("chartPressureDiv");
  pressureChart.render(containerDiv);
}

var volumeChart = null;
function createVolumeCharts(height, timeBased, rangeX, missing) {
  if (!document.getElementById("VolumesTick").checked) return;
  initGraphColor();
  if (volumeChart) {
    volumeChart.destroy();
    delete volumeChart;
    volumeChart = null;
  }
  needDummyY2 = false;
  volumeChart = new LineChart("Volumes (Tidal, Minute)", 
    height, timeBased, rangeX, needDummyY2);

  volumeChart.addXaxis(missing);

  volumeAxisNum = null;
  volumeAxisNum = createVtdelGraph(volumeChart, volumeAxisNum, rangeX);
  mvAxisNum = null;
  mvAxisNum = createMvdelGraph(volumeChart, mvAxisNum, rangeX);

  containerDiv = document.getElementById("chartVolumeDiv");
  volumeChart.render(containerDiv);
}

var bpmChart = null;
function createBpmCharts(height, timeBased, rangeX, missing) {
  if (!document.getElementById("BpmTick").checked) return;
  initGraphColor();
  if (bpmChart) {
    bpmChart.destroy();
    delete bpmChart;
    bpmChart = null;
  }
  needDummyY2 = true;
  bpmChart = new LineChart("BPM (Mandatory, Spontaneous)", 
    height, timeBased, rangeX, needDummyY2);

  bpmChart.addXaxis(missing);

  bpmAxisNum = null;
  bpmAxisNum = createSbpmGraph(bpmChart, bpmAxisNum, rangeX);
  bpmAxisNum = createMbpmGraph(bpmChart, bpmAxisNum, rangeX);

  containerDiv = document.getElementById("chartBpmDiv");
  bpmChart.render(containerDiv);
}

var compChart = null;
function createCompCharts(height, timeBased, rangeX, missing) {
  if (!document.getElementById("CompTick").checked) return;
  initGraphColor();
  if (compChart) {
    compChart.destroy();
    delete compChart;
    compChart = null;
  }
  needDummyY2 = true;
  compChart = new LineChart("Instant Lung Compliances (Static, Dynamic)", 
    height, timeBased, rangeX, needDummyY2);

  compChart.addXaxis(missing);

  compAxisNum = null;
  compAxisNum = createScompGraph(compChart, compAxisNum, rangeX);
  compAxisNum = createDcompGraph(compChart, compAxisNum, rangeX);

  containerDiv = document.getElementById("chartCompDiv");
  compChart.render(containerDiv);
}

var miscChart = null;
function createMiscCharts(height, timeBased, rangeX, missing) {
  if (!document.getElementById("MiscTick").checked) return;
  initGraphColor();
  if (miscChart) {
    miscChart.destroy();
    delete miscChart;
    miscChart = null;
  }
  needDummyY2 = false;
  miscChart = new LineChart("Miscellaneous (Errors, Warnings, Temperature)", 
    height, timeBased, rangeX, needDummyY2);

  miscChart.addXaxis(missing);

  flagAxisNum = null;
  flagAxisNum = createWarningGraph(miscChart, flagAxisNum, rangeX);
  flagAxisNum = createErrorGraph(miscChart, flagAxisNum, rangeX);

  tempAxisNum = null;
  tempAxisNum = createTempGraph(miscChart, tempAxisNum, rangeX);

  containerDiv = document.getElementById("chartMiscDiv");
  miscChart.render(containerDiv);
}

var fiO2Chart = null;
function createFiO2Charts(height, timeBased, rangeX, missing) {
  if (!document.getElementById("FiO2Tick").checked) return;
  initGraphColor();
  if (fiO2Chart) {
    fiO2Chart.destroy();
    delete fiO2Chart;
    fiO2Chart = null;
  }
  needDummyY2 = false;
  fiO2Chart = new LineChart("Oxygen (FiO2, Purity, Flow Rate)", 
    height, timeBased, rangeX, needDummyY2);

  fiO2Chart.addXaxis(missing);

  pctAxisNum = null;
  pctAxisNum = createFiO2Graph(fiO2Chart, pctAxisNum, rangeX);
  pctAxisNum = createPurityGraph(fiO2Chart, pctAxisNum, rangeX);
  mvAxisNum = null;
  mvAxisNum = createO2FlowGraph(fiO2Chart, mvAxisNum, rangeX);

  containerDiv = document.getElementById("chartFiO2Div");
  fiO2Chart.render(containerDiv);
}

var chartCreationInProgress = false;
function createDashboardCharts() {
  if (chartCreationInProgress) return;
  chartCreationInProgress = true;

  elm = document.getElementById("timeTick");
  var timeBased = elm.checked;
  var height=475
  var rangeX = {
    doFull: false,
    initBnum:0, 
    minBnum:minChartBreathNum , 
    maxBnum:maxChartBreathNum ,
    initTime:startDate, 
    minTime:breathTimes[minChartBreathNum].time, 
    maxTime:breathTimes[maxChartBreathNum].time
  };

  var missing = [];
  if (timeBased) {
    missing = missingTimeWindows ;
  } else {
    missing = missingBreathWindows ;
  }

  createPressureCharts(height, timeBased, rangeX, missing);
  createVolumeCharts(height, timeBased, rangeX, missing);
  createBpmCharts(height, timeBased, rangeX, missing);
  createFiO2Charts(height, timeBased, rangeX, missing);
  createCompCharts(height, timeBased, rangeX, missing);
  createMiscCharts(height, timeBased, rangeX, missing);

  prevMinBreathNum = rangeX.minBnum;
  prevMaxBreathNum = rangeX.maxBnum;
  chartCreationInProgress = false;
}

////////////////////////////////////////////////////////

function PressuresClick() {
  if (document.getElementById("PressuresTick").checked) {
    document.getElementById("PressuresChartWrapper").style.display = "block";
  }
  else {
    document.getElementById("PressuresChartWrapper").style.display = "none";
  }
  createDashboardCharts();
}

function VolumesClick() {
  if (document.getElementById("VolumesTick").checked) {
    document.getElementById("VolumesChartWrapper").style.display = "block";
  }
  else {
    document.getElementById("VolumesChartWrapper").style.display = "none";
  }
  createDashboardCharts();
}

function BpmClick() {
  if (document.getElementById("BpmTick").checked) {
    document.getElementById("BpmChartWrapper").style.display = "block";
  }
  else {
    document.getElementById("BpmChartWrapper").style.display = "none";
  }
  createDashboardCharts();
}

function CompClick() {
  if (document.getElementById("CompTick").checked) {
    document.getElementById("CompChartWrapper").style.display = "block";
  }
  else {
    document.getElementById("CompChartWrapper").style.display = "none";
  }
  createDashboardCharts();
}

function FiO2Click() {
  if (document.getElementById("FiO2Tick").checked) {
    document.getElementById("FiO2ChartWrapper").style.display = "block";
  }
  else {
    document.getElementById("FiO2ChartWrapper").style.display = "none";
  }
  createDashboardCharts();
}

function MiscClick() {
  if (document.getElementById("MiscTick").checked) {
    document.getElementById("MiscChartWrapper").style.display = "block";
  }
  else {
    document.getElementById("MiscChartWrapper").style.display = "none";
  }
  createDashboardCharts();
}

function InitChartCheckBoxes() {
  document.getElementById("PressuresTick").checked = false;
  document.getElementById("VolumesTick").checked = false;
  document.getElementById("BpmTick").checked = false;
  document.getElementById("FiO2Tick").checked = false;
  document.getElementById("CompTick").checked = false;
  document.getElementById("MiscTick").checked = false;
}

function createChartRangeSlider(div) {
  chartSliderPresent = true;
  chartRangeSlider = new IntRangeSlider(
    div,
    0,
    MAX_CHART_DATAPOINTS,
    0,
    0,
    1
  );
  chartRangeSlider.setChangeCallback(chartRangeSliderCallback);
}

function chartRangeSliderCallback() {
  //console.log("chartRangeSliderCallback");
  values = chartRangeSlider.getSlider();
  selectChartRange(chartRangeSlider, values[0], values[1]);
  createDashboardCharts();
}

function selectChartRange(slider, minB, maxB) {
  l = Number(minB);
  r = Number(maxB);
  if (dashboardBreathNum) {
    if (r>dashboardBreathNum) r = dashboardBreathNum;
    if (l<1) l = 1;
  } else {
    r = l = 0;
  }

  minChartBreathNum = l;
  maxChartBreathNum = r;
  //console.log("Select min=" + minChartBreathNum + " max=" + maxChartBreathNum);
  slider.setSlider([l, r]);
}

function updateChartRangeOnNewBreath(num) {
  chartRangeLimit = dashboardBreathNum;
  if (chartRangeLimit==1) chartRangeLimit=2; // max must be > min
  chartRangeSlider.setRange([1, chartRangeLimit]);

  // If update is paused
  if (updatePaused) return;

  //console.log("Before min=" + minChartBreathNum + " max=" + maxChartBreathNum);

  maxChartBreathNum = dashboardBreathNum;
  minChartBreathNum = maxChartBreathNum - MAX_CHART_DATAPOINTS + 1;
  if (minChartBreathNum <= 0) {
    minChartBreathNum = 1;
  }
  //console.log("After min=" + minChartBreathNum + " max=" + maxChartBreathNum);
  chartRangeSlider.setSlider([minChartBreathNum, maxChartBreathNum]);
}

