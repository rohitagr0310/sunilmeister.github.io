// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////

// ////////////////////////////////////////////////////
// Params are either a number or an enumeration
// For ENUMS, each enumerator has a number associated as below
// ////////////////////////////////////////////////////
const paramsType = {
	NUMBER : 					{type:"NUMBER", range:{}},
	STATE : 					{type:"ENUM", 
											range:{"INITIAL":0, "STANDBY":1, "ACTIVE":2, "ERROR":3}
										},
	BREATH_TYPE : 		{type:"ENUM", 
											range:{"MANDATORY":1, "SPONTANEOUS":2, "MAINTENANCE":3}
										},
	BREATH_CONTROL : 	{type:"ENUM", 
											range:{"VOLUME":0, "PRESSURE":1}
										},
	MODE : 						{type:"ENUM", 
											range:{"CMV":0, "ACV":1, "SIMV":2, "PSV":3}
										},
	VT : 						{type:"ENUM", 
											range:{
												"200":200, 
												"250":250, 
												"300":300, 
												"350":350, 
												"400":400, 
												"450":450, 
												"500":500, 
												"550":550, 
												"600":600, 
											}
										},
	IE : 							{type:"ENUM", 
											range:{"1:1":1, "1:2":2, "1:3":3}
										},
	TPS : 						{type:"ENUM", 
											range:{
											 "10% of Peak Flow":0,
											 "20% of Peak Flow":1,
											 "30% of Peak Flow":2,
											 "40% of Peak Flow":3,
											 "50% of Peak Flow":4,
											 "60% of Peak Flow":5,
											 "1.0 secs":6,
											 "1.5 secs":7,
											 "2.0 secs":8,
											 "2.5 secs":9,
											}
										},
};

// ////////////////////////////////////////////////////
// Allowed ops depending on number type. Result is always a boolean
// ////////////////////////////////////////////////////
const paramOps = {NUMBER:[ "EQ", "NEQ", "LT", "LEQ", "GT", "GEQ" ], ENUM:["EQ", "NEQ"]};

// ////////////////////////////////////////////////////
// Install all params at load time
// ////////////////////////////////////////////////////

function initAllParamsTable() {
	session.allParamsTable.push({key:"state", 			name:"STATE"});
	session.allParamsTable.push({key:"vtdel", 			name:"TIDAL_VOLUME"});
	session.allParamsTable.push({key:"mvdel", 			name:"MINUTE_VOLUME"});
	session.allParamsTable.push({key:"mmvdel", 			name:"MANDATORY_MV"});
	session.allParamsTable.push({key:"smvdel", 			name:"SPONTANEOUS_MV"});
	session.allParamsTable.push({key:"sbpm", 				name:"SPONTANEOUS_BPM"});
	session.allParamsTable.push({key:"mbpm", 				name:"MANDATORY_BPM"});
	session.allParamsTable.push({key:"btype", 			name:"BREATH_TYPE"});
	session.allParamsTable.push({key:"bcontrol", 		name:"BREATH_CONTROL"});
	session.allParamsTable.push({key:"scomp", 			name:"STATIC_COMPLIANCE"});
	session.allParamsTable.push({key:"dcomp", 			name:"DYNAMIC_COMPLIANCE"});
	session.allParamsTable.push({key:"peak", 				name:"PEAK_PRESSURE"});
	session.allParamsTable.push({key:"mpeep", 			name:"PEEP_PRESSURE"});
	session.allParamsTable.push({key:"plat", 				name:"PLATEAU_PRESSURE"});
	session.allParamsTable.push({key:"tempC", 			name:"SYSTEM_TEMPERATURE"});
	session.allParamsTable.push({key:"cmvSpont", 		name:"CMV_SPONT_BREATHS"});
	session.allParamsTable.push({key:"o2FlowX10", 	name:"O2_SOURCE_FLOW"});
	session.allParamsTable.push({key:"errors", 			name:"ERRORS"});
	session.allParamsTable.push({key:"warnings", 		name:"WARNINGS"});
	session.allParamsTable.push({key:"infos", 			name:"NOTIFICATIONS"});
	session.allParamsTable.push({key:"wifiDrops",		name:"WIFI_DROPS"});
	session.allParamsTable.push({key:"wifiReconns",	name:"WIFI_RECONNECTS"});
	session.allParamsTable.push({key:"mode", 				name:"MODE_SETTING"});
	session.allParamsTable.push({key:"vt", 					name:"VT_SETTING"});
	session.allParamsTable.push({key:"mv", 					name:"MV_SETTING"});
	session.allParamsTable.push({key:"rr", 					name:"RR_SETTING"});
	session.allParamsTable.push({key:"ie", 					name:"IE_SETTING"});
	session.allParamsTable.push({key:"ipeep", 			name:"PEEP_SETTING"});
	session.allParamsTable.push({key:"pmax", 				name:"PMAX_SETTING"});
	session.allParamsTable.push({key:"ps", 					name:"PS_SETTING"});
	session.allParamsTable.push({key:"tps", 				name:"TPS_SETTING"});
	session.allParamsTable.push({key:"fiO2", 				name:"FIO2_SETTING"});
	session.allParamsTable.push({key:"o2Purity", 		name:"O2_PURITY_SETTING"});
}

function initSessionParams() {
	initAllParamsTable();

	let type = paramsType;
	session.params.state = 			new Param("STATE", type.STATE, "");
	session.params.vtdel = 			new Param("TIDAL_VOLUME", type.NUMBER, "ml");
	session.params.mvdel = 			new Param("MINUTE_VOLUME", type.NUMBER, "l/min");
	session.params.mmvdel = 		new Param("MANDATORY_MV", type.NUMBER, "l/min");
	session.params.smvdel = 		new Param("SPONTANEOUS_MV", type.NUMBER, "l/min");
	session.params.sbpm = 			new Param("SPONTANEOUS_BPM", type.NUMBER, "bpm");
	session.params.mbpm = 			new Param("MANDATORY_BPM", type.NUMBER, "bpm");
	session.params.btype = 			new Param("BREATH_TYPE", type.BREATH_TYPE, "");
	session.params.bcontrol = 	new Param("BREATH_CONTROL", type.BREATH_CONTROL, "");
	session.params.scomp = 			new Param("STATIC_COMPLIANCE", type.NUMBER, "ml/cmH2O");
	session.params.dcomp = 			new Param("DYNAMIC_COMPLIANCE", type.NUMBER, "ml/cmH2O");
	session.params.peak = 			new Param("PEAK_PRESSURE", type.NUMBER, "cmH2O");
	session.params.mpeep = 			new Param("PEEP_PRESSURE", type.NUMBER, "cmH2O");
	session.params.plat = 			new Param("PLATEAU_PRESSURE", type.NUMBER, "cmH2O");
	session.params.tempC = 			new Param("SYSTEM_TEMPERATURE", type.NUMBER, "degC");
	session.params.cmvSpont = 	new Param("CMV_SPONT_BREATHS", type.NUMBER, "");
	session.params.o2FlowX10 = 	new Param("O2_SOURCE_FLOW", type.NUMBER, "l/min");
	session.params.errors = 		new Param("ERRORS", type.NUMBER, "");
	session.params.warnings = 	new Param("WARNINGS", type.NUMBER, "");
	session.params.infos = 			new Param("NOTIFICATIONS", type.NUMBER, "");
	session.params.wifiDrops =	new Param("WIFI_DROPS", type.NUMBER, "");
	session.params.wifiReconns=	new Param("WIFI_RECONNECTS", type.NUMBER, "");

	session.params.mode = 			new Param("MODE_SETTING", type.MODE, "");
	session.params.vt = 				new Param("VT_SETTING", type.VT, "ml");
	session.params.mv = 				new Param("MV_SETTING", type.NUMBER, "l/min");
	session.params.rr = 				new Param("RR_SETTING", type.NUMBER, "bpm");
	session.params.ie = 				new Param("IE_SETTING", type.IE, "");
	session.params.ipeep = 			new Param("PEEP_SETTING", type.NUMBER, "cmH2O");
	session.params.pmax = 			new Param("PMAX_SETTING", type.NUMBER, "cmH2O");
	session.params.ps = 				new Param("PS_SETTING", type.NUMBER, "cmH2O");
	session.params.tps = 				new Param("TPS_SETTING", type.TPS, "");
	session.params.fiO2 = 			new Param("FIO2_SETTING", type.NUMBER, "%");
	session.params.o2Purity = 	new Param("O2_SOURCE_PURITY_SETTING", type.NUMBER, "%");
}

var paramChangeTemplate = {
	time: 	null,
	value: 	null,
};

// ////////////////////////////////////////////////////
// Class to manage param values at different points in time
// and to find their values at different times, ranges etc.
// ////////////////////////////////////////////////////
class Param {
	constructor(name, type, units) {
		this.debug = false;
		this.name = name;
		this.type = type;
		this.units = units;
		let initChange = cloneObject(paramChangeTemplate);
		initChange.time = new Date(0);
		initChange.value = null;
		// changes is a sorted array - monotonically increasing in time
		// first entry is a null entry
		this.changes = [initChange];

		//if (this.name == "PEAK_PRESSURE") this.debug = true;
	}

	// some queries
	Name() { return this.name; }
	Type() { return this.type; }
	Units() { return this.units; }
	Changes() { return this.changes; }

	// each call must be monotonically increasing in time values
	// time is a Date object
	AddTimeValue(time, value) {
		// All params are a number including enums
		value = Number(value);

		let len = this.changes.length;
		if (this.changes[len-1].time.getTime() > time.getTime()) {
			console.error("Bad addValueChange for " + this.name);
			return;
		} else if (this.changes[len-1].time.getTime() == time.getTime()) {
			this.changes[len-1].value = value; // override
			return;
		}

		let v = this.LastValue();
		if (v == value) return; // record only changes
		let change = cloneObject(paramChangeTemplate);
		change.time = time;
		change.value = value;
		this.changes.push(change);
	}

	FirstValue() {
		let len = this.changes.length;
		if (len <= 1) return null;
		// first entry is a null entry
		return this.changes[1].value;
	}

	FirstValueTime() {
		let len = this.changes.length;
		if (len <= 1) return null;
		// first entry is a null entry
		return this.changes[1].time;
	}

	LastValue() {
		let len = this.changes.length;
		if (len <= 1) return null;
		// first entry is a null entry
		return this.changes[len-1].value;
	}

	// time is a Date Object
	ValueAtTime(time) {
		// first entry in changes is a null entry
		if (this.changes.length == 1) return null;
		let ix = this.FindLastValueChangeIndex(time);
		if (ix === null) {
			console.error("Error during search in Param::ValueAtTime");
			return null;
		}

		return this.changes[ix].value;
	}

	// bnum must have been logged
	ValueAtBnum(bnum) {
		if (!bnum) return null;
		// first entry in breathTimes is a null entry
		return valueAtTime(session.breathTimes[bnum]);
	}

	// helper function to compute min/max/avg
	UpdateStats(stats, value) {
		if (isUndefined(value)) return;

		if (value !== null) {
			stats.sum += value;
			stats.num++;

			if (stats.min === null) stats.min = value;
			else if (stats.min > value) stats.min = value;

			if (stats.max === null) stats.max = value;
			else if (stats.max < value) stats.max = value;
		}

		return stats;
	}

	// number of times the param changed
	NumChanges(startBnum, endBnum) {
		let startTime = session.breathTimes[startBnum];
		let endTime = session.breathTimes[endBnum];
		let count = 0;

		for (let i=1; i<this.changes.length; i++) {
			let cTime = this.changes[i].time;
			if (cTime.getTime() < startTime.getTime()) continue;
			if (cTime.getTime() > endTime.getTime()) break;
			count++;
		}
		return count;
	}

	// return all values logged starting from startBnum till endBnum in intervals of stepBnum
	Values(startBnum, endBnum, stepBnum) {
		let startTime = session.breathTimes[startBnum];
		let endTime = session.breathTimes[endBnum];

		if (isUndefined(stepBnum)) stepBnum = 1;
		let values = [];
		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::Values");
			return values;
		} else if (changeIx == 0) {
			return values;
		}

	  let value = this.changes[changeIx].value;
	  values.push(value);

		if (startBnum == endBnum) {
			return values;
		}

		let nextBnumToStore = startBnum + stepBnum;
		for (let bnum=startBnum+1; bnum <= endBnum; bnum++) {
			let btime = session.breathTimes[bnum];
			if ((changeIx >= endChangeIndex) || (btime.getTime() >= endTime.getTime())) {
				if (bnum == nextBnumToStore) {
					values.push(value); // previously computed value
					nextBnumToStore += stepBnum;
				}
				continue;
			}

			if (btime.getTime() >= this.changes[changeIx + 1].time.getTime()) {
				changeIx++;
				value = this.changes[changeIx].value; // new value
			}

			if (bnum == nextBnumToStore) {
				values.push(value);
				nextBnumToStore += stepBnum;
			}
		}

		return values;
	}

	// returns an array of distinct values over the range
	DistinctValues(startBnum, endBnum) {
		let endTime = session.breathTimes[endBnum];
		let startTime = session.breathTimes[startBnum];

		let values = [];
		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::DistinctValues");
			return values;
		} else if (changeIx == 0) {
			return values;
		}

		let value = this.changes[changeIx].value;
		values.push(value);
		if (startBnum == endBnum) {
			return values;
		}

		for (let bnum=startBnum+1; bnum <= endBnum; bnum++) {
			let btime = session.breathTimes[bnum];
			if ((changeIx >= endChangeIndex) || (btime.getTime() >= endTime.getTime())) {
				break;
			}

			if (btime.getTime() >= this.changes[changeIx + 1].time.getTime()) {
				changeIx++;
				value = this.changes[changeIx].value; // new value
			}

			if (values.indexOf(value) == -1) values.push(value);
		}

		return values;
	}

	// returns number of breaths the value was equal to target value
	CountValueEqual(targetValue, startBnum, endBnum) {
		let endTime = session.breathTimes[endBnum];
		let startTime = session.breathTimes[startBnum];

		let count = 0;
		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::CountValueEqual");
			return count;
		}

		let value = this.changes[changeIx].value;
		if (value == targetValue) count++;
		if (startBnum == endBnum) {
			return count;
		}

		for (let bnum=startBnum+1; bnum <= endBnum; bnum++) {
			let btime = session.breathTimes[bnum];
			if ((changeIx >= endChangeIndex) || (btime.getTime() >= endTime.getTime())) {
				if (value == targetValue) count++;
				continue;
			}

			if (btime.getTime() >= this.changes[changeIx + 1].time.getTime()) {
				changeIx++;
				value = this.changes[changeIx].value; // new value
			}

			if (value == targetValue) count++;
		}

		return count;
	}

	// returns {min: , max:, avg: }
	MinMaxAvg(startBnum, endBnum) {
		let startTime = session.breathTimes[startBnum];
		let endTime = session.breathTimes[endBnum];

		let stats = {min: null, max: null, avg:null, sum:0, num:0};
		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::MinMaxAvg");
			return stats;
		}

		let value = this.changes[changeIx].value;
		stats = this.UpdateStats(stats, value);
		if (startBnum == endBnum) {
			return stats;
		}

		for (let bnum=startBnum+1; bnum <= endBnum; bnum++) {
			let btime = session.breathTimes[bnum];
			if ((changeIx >= endChangeIndex) || (btime.getTime() >= endTime.getTime())) {
				stats = this.UpdateStats(stats, value);
				continue;
			}

			if (btime.getTime() >= this.changes[changeIx + 1].time.getTime()) {
				changeIx++;
				value = this.changes[changeIx].value; // new value
			}

			stats = this.UpdateStats(stats, value);
		}

		let rval = {min: stats.min, max: stats.max, avg: stats.sum/stats.num};
		return rval;
	}

  // Recursive Binary search for a value change at or immediately before given time
	// start and end are indices into the changes array
	// return value of null signifies error
	// return value of 0 signifies an index before the first data was logged
  FindLastValueChangeIndex(time, start, end) {
  	if (isUndefined(start)) start = 0;
  	if (isUndefined(end)) end = this.changes.length - 1;

		if (this.debug) {
			console.log("Find start", start, "end", end);
		}

  	if (end < start) return null;
  	if (start < 0) return null;
  	if (end >= this.changes.length) return null;

		// if last transition was before given time
		let endTime = this.changes[end].time;
		if (endTime.getTime() <= time.getTime()) return end;

    // find the middle index
    let mid = Math.floor((start + end) / 2);
		if (mid == 0) return 0; // reached the beginning and there is no value logged

		let midTime = this.changes[mid].time;
    if (midTime.getTime() == time.getTime()) return mid;
		else if (midTime.getTime() < time.getTime()) {
  		// If the element in the middle is smaller than the time
			// check the next one
			if (mid < end) {
				let nextTime = this.changes[mid+1].time;
				if (nextTime.getTime() > time.getTime()) return mid;
				else if (nextTime.getTime() == time.getTime()) return mid+1;
			}
			// look in the right half
  		return this.FindLastValueChangeIndex(time, mid, end);
		} else {
     	// If the element in the middle is greater than the time 
			// look in the left half
  		return this.FindLastValueChangeIndex(time, start, mid - 1);
		}
  }

};

