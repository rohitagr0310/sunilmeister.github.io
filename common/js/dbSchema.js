// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////

// Dweet schema
var jsonRecordSchema = {
  created: 0,
  content: {
    L1: "--",
    L2: "--",
    L3: "--",
    L4: "--",
    INITIAL: "--",
    STANDBY: "--",
    ACTIVE: "--",
    ERROR: "--",
    MANDATORY: "--",
    SPONTANEOUS: "--",
    BNUM: "--",
    ATTENTION: "--",
    PENDING: "--",
    MODE: "--",
    VT: "--",
    RR: "--",
    EI: "--",
    IPEEP: "--",
    PMAX: "--",
    PS: "--",
    TPS: "--",
    FIO2: "--",
    O2PURIY: "--",
    O2FLOWX10: "--",
    MBPM: "--",
    SBPM: "--",
    STATIC: "--",
    DYNAMIC: "--",
    VTDEL: "--",
    MVDEL: "--",
    PIP: "--",
    PLAT: "--",
    MPEEP: "--",
    TEMP: "--",
    ALT: "--",
    PNAME: "--",
    PMISC: "--",
    PID: "--",
    WMSG: "--",
    EMSG: "--"
  }
};

// Preconstructed dweet to clear all fields
var clearAllDweet = {
  created: 0,
  content: {
    INITIAL: 1,
    STANDBY: 0,
    RUNNING: 0,
    ERROR: 0,
    MANDATORY: 0,
    SPONTANEOUS: 0,
    ATTENTION: 0,
    PENDING: 0,
    MODE: "--",
    VT: "--",
    RR: "--",
    EI: "--",
    IPEEP: "--",
    PMAX: "--",
    PS: "--",
    TPS: "--",
    FIO2: "--",
    O2PURIY: "--",
    O2FLOWX10: "--",
    MBPM: "--",
    SBPM: "--",
    STATIC: "--",
    DYNAMIC: "--",
    VTDEL: "--",
    MVDEL: "--",
    PIP: "--",
    PLAT: "--",
    MPEEP: "--",
    TEMP: "--",
    ALT: "--",
    PNAME: "--",
    PMISC: "--",
    PID: "--",
  }
};
