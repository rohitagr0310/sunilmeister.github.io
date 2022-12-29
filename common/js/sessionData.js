// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////

var SessionDataTemplate = {
  // Misc data
  patientName: "",
  patientInfo: "",
  altitude:    "",

  // value transitions arrays
  breathTimes:          [null],
  stateValues:          [{"time":0, "value":null}],
  vtdelValues:          [{"time":0, "value":null}],
  mvdelValues:          [{"time":0, "value":null}],
  sbpmValues:           [{"time":0, "value":null}],
  mbpmValues:           [{"time":0, "value":null}],
  breathTypeValues:     [{"time":0, "value":null}],
  scompValues:          [{"time":0, "value":null}],
  dcompValues:          [{"time":0, "value":null}],
  peakValues:           [{"time":0, "value":null}],
  platValues:           [{"time":0, "value":null}],
  mpeepValues:          [{"time":0, "value":null}],
  tempValues:           [{"time":0, "value":null}],
  fiO2Values:           [{"time":0, "value":null}],
  o2PurityValues:       [{"time":0, "value":null}],
  o2FlowValues:         [{"time":0, "value":null}],
  infoValues:           [{"time":0, "value":null}],
  warningValues:        [{"time":0, "value":null}],
  errorValues:          [{"time":0, "value":null}],

  modes:                [],
  vts:                  [],
  rrs:                  [],
  ies:                  [],
  ipeeps:               [],
  pmaxs:                [],
  pss:                  [],
  tpss:                 [],
  fiO2s:                [],
  missingBreaths:       [],
  missingBreathWindows: [],
  missingTimeWindows:   [],
  infoMsgs:             [],
  warningMsgs :         [],
  errorMsgs:            [],
};

var session = null;
