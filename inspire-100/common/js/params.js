// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////

// ////////////////////////////////////////////////////
// Class to manage all parameters
// to find their values at different times, ranges etc.
// to find when they change etc.
// ////////////////////////////////////////////////////
class Param {
	constructor(name, type, units) {
		this.debug = false;
		this.name = name;
		this.type = type;
		this.units = units;

		// changes is a sorted array - monotonically increasing in time
		// first entry is a null entry
		let initChange = {};
		initChange.time = new Date(0);
		initChange.value = null;
		this.changes = [cloneObject(initChange)];

		//if (this.name == "D_ERROR_BREATH") this.debug = true;
	}

	setNumberRange(min, max, step) {
		this.type = cloneObject(this.type);
		this.type.range.min = min;
		this.type.range.max = max;
		this.type.range.step = step;
	}

	// some queries
	Name() { return this.name; }
	Type() { return this.type; }
	Units() { return this.units; }
	Changes() { return this.changes; }

	// each call must be monotonically increasing in time values
	// time is a Date object
	AddTimeValue(time, value) {
		if (this.debug) console.error("AddTimeValue", value, time);
		if (this.type.type == "STRING") {
			value = String(value);
		} else {
			value = Number(value);
		}
		if (isUndefined(time) || (time === null)) { // missing breaths
			return;
		}

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
		let change = {};
		change.time = time;
		change.value = value;
		this.changes.push(cloneObject(change));
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
		if (isUndefined(time) || (time === null)) return null;

		// first entry in changes is a null entry
		if (this.changes.length == 1) return null;

		// most of the time it is the last value
		// shortcut to do that
		if (time.getTime() >= this.changes[this.changes.length-1].time.getTime()) {
			return this.LastValue();
		}

		// else do a binary search
		let ix = this.FindLastValueChangeIndex(time);
		if (ix === null) {
			console.error("Error during search in Param::ValueAtTime", Name());
			return null;
		}

		return this.changes[ix].value;
	}

	// bnum must have been logged
	ValueAtBnum(bnum) {
		if (!bnum) return null;
		// first entry in loggedBreaths is a null entry
		return this.ValueAtTime(session.loggedBreaths[bnum].time);
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
		let count = 0;

		let startTime = session.loggedBreaths[startBnum].time;
		let endTime = session.loggedBreaths[endBnum].time;
		if (isUndefined(startTime) || (startTime === null)) {
			startTime = new Date(0); // beginning of the universe
		}
		if (isUndefined(endTime) || (endTime === null)) return count;

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
		let values = [];

		let startTime = session.loggedBreaths[startBnum].time;
		let endTime = session.loggedBreaths[endBnum].time;
		if (isUndefined(startTime) || (startTime === null)) {
			startTime = new Date(0); // beginning of the universe
		}
		if (isUndefined(endTime) || (endTime === null)) return values;

		if (isUndefined(stepBnum)) stepBnum = 1;
		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::Values", Name());
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
			let btime = session.loggedBreaths[bnum].time;
			if (isUndefined(btime) || (btime === null)) continue;
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
		let values = [];
		if (startBnum > endBnum) return values;

		let endTime = session.loggedBreaths[endBnum].time;
		let startTime = session.loggedBreaths[startBnum].time;
		if (isUndefined(startTime) || (startTime === null)) {
			startTime = new Date(0); // beginning of the universe
		}
		if (isUndefined(endTime) || (endTime === null)) return values;

		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::DistinctValues", Name());
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
			let btime = session.loggedBreaths[bnum].time;
			if (isUndefined(btime) || (btime === null)) continue;
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
		let count = 0;
		if (startBnum > endBnum) return count;

		let endTime = session.loggedBreaths[endBnum].time;
		let startTime = session.loggedBreaths[startBnum].time;
		if (isUndefined(startTime) || (startTime === null)) {
			startTime = new Date(0); // beginning of the universe
		}
		if (isUndefined(endTime) || (endTime === null)) return count;

		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::CountValueEqual", Name());
			return count;
		}

		let value = this.changes[changeIx].value;
		if (value == targetValue) count++;
		if (startBnum == endBnum) {
			return count;
		}

		for (let bnum=startBnum+1; bnum <= endBnum; bnum++) {
			let btime = session.loggedBreaths[bnum].time;
			if (isUndefined(btime) || (btime === null)) continue;
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
		let stats = {min: null, max: null, avg:null, sum:0, num:0};
		if (startBnum > endBnum) return stats;

		let startTime = session.loggedBreaths[startBnum].time;
		let endTime = session.loggedBreaths[endBnum].time;
		if (isUndefined(startTime) || (startTime === null)) {
			startTime = new Date(0); // beginning of the universe
		}
		if (isUndefined(endTime) || (endTime === null)) return count;

		let endChangeIndex = this.changes.length - 1;
		let changeIx = this.FindLastValueChangeIndex(startTime);
		if (changeIx === null) {
			console.error("Error during search in Param::MinMaxAvg", Name());
			return stats;
		}

		let value = this.changes[changeIx].value;
		stats = this.UpdateStats(stats, value);
		if (startBnum == endBnum) {
			return stats;
		}

		for (let bnum=startBnum+1; bnum <= endBnum; bnum++) {
			let btime = session.loggedBreaths[bnum].time;
			if (isUndefined(btime) || (btime === null)) continue;
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
		if (isUndefined(time) || (time === null)) return null;

  	if (isUndefined(start)) start = 0;
  	if (isUndefined(end)) end = this.changes.length - 1;

  	if (end < start) return null;
  	if (start < 0) return null;
  	if (end >= this.changes.length) return null;

		// if last transition was before given time
		let endTime = this.changes[end].time;
		if (isUndefined(endTime) || (endTime === null)) return null;
		if (endTime.getTime() <= time.getTime()) return end;

    // find the middle index
    let mid = Math.floor((start + end) / 2);
		if (mid == 0) return 0; // reached the beginning and there is no value logged

		let midTime = this.changes[mid].time;
		if (isUndefined(midTime) || (midTime === null)) return null;
    if (midTime.getTime() == time.getTime()) return mid;
		else if (midTime.getTime() < time.getTime()) {
  		// If the element in the middle is smaller than the time
			// check the next one
			if (mid < end) {
				let nextTime = this.changes[mid+1].time;
				if (isUndefined(nextTime) || (nextTime === null)) return null;
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

// ////////////////////////////////////////////////////
// Params are either a number or an enumeration
// For ENUMS, each enumerator has a number associated as below
// If the param's range is null, it is a string
// If the param's range is {}, it is a number
// ////////////////////////////////////////////////////
const paramsType = {
	NUMBER : 					{type:"NUMBER", range:{}},
	BOOLEAN : 				{type:"ENUM", 
											range:{"FALSE":0, "TRUE":1}
										},
	STRING : 					{type:"STRING", range:null},
	STATE : 					{type:"ENUM", 
											range:{"INITIAL":0, "STANDBY":1, "ACTIVE":2, "ERROR":3}
										},
	BTYPE : 					{type:"ENUM", 
											range:{"MANDATORY":1, "SPONTANEOUS":2, "MAINTENANCE":3}
										},
	BCONTROL : 				{type:"ENUM", 
											range:{"VOLUME":0, "PRESSURE":1}
										},
	MODE : 						{type:"ENUM", 
											range:{"CMV":0, "ACV":1, "SIMV":2, "PSV":3}
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
const paramOps = {
	NUMBER:	[ "=", "!=", "<", "<=", ">", ">=" ], 
	STRING:	[ "&#x220B", "!&#x220B"],
	ENUM:		["=", "!="]
};

// ////////////////////////////////////////////////////
// Install all params at load time
// ////////////////////////////////////////////////////
// range is [min,max,step]
function addParam(key, name, type, units, range) {
	session.params[key] = new Param(name, paramsType[type], units);
	session.allParamsTable.push({"key":key, "name":name});
	if (!isUndefined(range)) {
		session.params[key].setNumberRange(range[0], range[1], range[2]);
	}
}

function createAllParams() {
	// key, name, type, units, numberRange
	// D_ prefix for detected or measured by the system
	// I_ prefix for input setting for the system
	addParam("breathNum",		"D_BREATH_NUMBER", 	"NUMBER", 	"",					[1, null, 1]);
	addParam("btype", 			"D_BREATH_TYPE", 		"BTYPE", 		"");
	addParam("bcontrol", 		"D_BREATH_CONTROL", "BCONTROL",	"");
	addParam("state", 			"D_STATE", 					"STATE", 		"");
	addParam("vtdel", 			"D_VT", 						"NUMBER", 	"ml",				[0, 800, 1]);
	addParam("mvdel", 			"D_MV", 						"NUMBER", 	"l/min",		[0.0 ,25.0 ,0.1]);
	addParam("mmvdel", 			"D_MV_MANDATORY", 	"NUMBER", 	"l/min",		[0.0 ,25.0 ,0.1]);
	addParam("smvdel", 			"D_MV_SPONTANEOUS", "NUMBER", 	"l/min",		[0.0 ,25.0 ,0.1]);
	addParam("sbpm", 				"D_BPM_SPONTANEOUS","NUMBER", 	"bpm",			[0, 40, 1]);
	addParam("mbpm", 				"D_BPM_MANDATORY", 	"NUMBER", 	"bpm",			[0, 30, 1]);
	addParam("scomp", 			"D_COMP_STATIC", 		"NUMBER", 	"ml/cmH2O");
	addParam("dcomp", 			"D_COMP_DYNAMIC", 	"NUMBER", 	"ml/cmH2O");
	addParam("peak", 				"D_PEAK", 					"NUMBER", 	"cmH2O",		[0, 60, 1]);
	addParam("mpeep", 			"D_PEEP", 					"NUMBER", 	"cmH2O",		[0, 60, 1]);
	addParam("plat", 				"D_PLAT", 					"NUMBER", 	"cmH2O",		[0, 60, 1]);
	addParam("tempC", 			"D_TEMP_C", 				"NUMBER", 	"degC",			[-20, 60, 1]);
	addParam("cmvSpont", 		"D_CMV_SPONTANEOUS","NUMBER", 	"",					[0, null, 1]);

	addParam("attention",		"D_ATTENTION", 			"BOOLEAN",	"");
	addParam("errorTag", 		"D_ERROR_BREATH", 	"BOOLEAN",	"");
	addParam("warningTag", 	"D_WARNING_BREATH", "BOOLEAN",	"");
	addParam("errors", 			"D_ERROR_NUMBER", 	"NUMBER", 	"",					[0, null, 1]);
	addParam("warnings", 		"D_WARNING_NUMBER", "NUMBER", 	"",					[0, null, 1]);
	addParam("infos", 			"D_NOTIF_NUMBER", 	"NUMBER", 	"",					[0, null, 1]);
	addParam("wifiDrops",		"D_WIFI_DROPS", 		"NUMBER", 	"",					[0, null, 1]);
	addParam("wifiReconns",	"D_WIFI_CONNECTS", 	"NUMBER", 	"",					[0, null, 1]);

	addParam("lcdLine1",		"LCD_LINE_1", 			"STRING", 	"");
	addParam("lcdLine2",		"LCD_LINE_2", 			"STRING", 	"");
	addParam("lcdLine3",		"LCD_LINE_3", 			"STRING", 	"");
	addParam("lcdLine4",		"LCD_LINE_4", 			"STRING", 	"");

	addParam("somePending",	"D_CHANGE", 				"BOOLEAN",	"");
	addParam("pendingMode",	"D_CHANGE_MODE", 		"BOOLEAN",	"");
	addParam("pendingVt",		"D_CHANGE_VT", 			"BOOLEAN",	"");
	addParam("pendingMv",		"D_CHANGE_MV", 			"BOOLEAN",	"");
	addParam("pendingEi",		"D_CHANGE_EI", 			"BOOLEAN",	"");
	addParam("pendingRr",		"D_CHANGE_RR", 			"BOOLEAN",	"");
	addParam("pendingIpeep","D_CHANGE_PEEP", 		"BOOLEAN",	"");
	addParam("pendingPmax",	"D_CHANGE_PMAX", 		"BOOLEAN",	"");
	addParam("pendingPs",		"D_CHANGE_PS", 			"BOOLEAN",	"");
	addParam("pendingTps",	"D_CHANGE_TPS", 		"BOOLEAN",	"");

	addParam("mode", 				"I_MODE", 					"MODE", 		"");
	addParam("vt", 					"I_VT", 						"NUMBER", 	"ml",				[200, 600, 50]);
	addParam("mv", 					"I_MV", 						"NUMBER", 	"l/min",		[2.0, 18.0, 0.1]);
	addParam("rr", 					"I_RR", 						"NUMBER", 	"bpm",			[10, 30, 1]);
	addParam("ie", 					"I_IE", 						"IE", 			"");
	addParam("ipeep", 			"I_PEEP", 					"NUMBER", 	"cmH2O",		[3, 15, 1]);
	addParam("pmax", 				"I_PMAX", 					"NUMBER", 	"cmH2O",		[10, 60, 1]);
	addParam("ps", 					"I_PS", 						"NUMBER", 	"cmH2O",		[5, 40, 1]);
	addParam("tps", 				"I_TPS", 						"TPS", 			"");
	addParam("fiO2", 				"I_FIO2", 					"NUMBER", 	"%",				[0, 100, 1]);
	addParam("o2Purity", 		"I_O2_PURITY",		 	"NUMBER", 	"%",				[21, 100, 1]);

	addParam("o2FlowX10", 	"O_SOURCE_FLOW",	 "NUMBER", 		"l/min",		[0.0, 20.0, 0.1]);
}

