// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////

var pickedDate = null;

function selectedRangeMinBnum() {
  if (document.getElementById("searchDiv").style.display == "block") {
		if (!session.search.range) {
			session.search.range = cloneObject(session.reportRange);
		}
		return session.search.range.minBnum;
	} else {
		return session.reportRange.minBnum;
	}
}

function selectedRangeMaxBnum() {
  if (document.getElementById("searchDiv").style.display == "block") {
		if (!session.search.range) {
			session.search.range = cloneObject(session.reportRange);
		}
		return session.search.range.maxBnum;
	} else {
		return session.reportRange.maxBnum;
	}
}

function selectedRangeMinTime() {
  if (document.getElementById("searchDiv").style.display == "block") {
		if (!session.search.range) {
			session.search.range = cloneObject(session.reportRange);
		}
		return session.search.range.minTime;
	} else {
		return session.reportRange.minTime;
	}
}

function selectedRangeMaxTime() {
  if (document.getElementById("searchDiv").style.display == "block") {
		if (!session.search.range) {
			session.search.range = cloneObject(session.reportRange);
		}
		return session.search.range.maxTime;
	} else {
		return session.reportRange.maxTime;
	}
}

function updateSelectedSliderMinMax(bmin, bmax) {
  if (document.getElementById("searchDiv").style.display == "block") {
  	session.search.range = createReportRange(false, bmin, bmax);
	} else {
  	session.reportRange = createReportRange(false, bmin, bmax);
	}
 	stopSliderCallback = true;
 	session.rangeSlider.setSlider([bmin, bmax]);;
 	stopSliderCallback = false;
}

function enterBreathInterval () {
  document.getElementById("enterRangeDiv").style.display = "block";
  if (document.getElementById("enterRangeBnum").checked) {
		enterRangeBnum();
	} else {
		enterRangeBtime();
	}
}

function acceptBreathNumRange() {
	let fromBreath = Number(document.getElementById("rangeFromBnum").value);
  let numBreaths = Number(document.getElementById("rangeNumBreaths").value);

	let toBreath = fromBreath + numBreaths - 1;
	let maxBnum = session.breathTimes.length - 1;
	if (toBreath > maxBnum) toBreath = maxBnum;

  if ((fromBreath <= 0) || (toBreath <= 0)) {
    modalAlert("Invalid Breath Range", "Try again!");
    return;
  }

  stopSliderCallback = true;
  session.rangeSlider.setSlider([fromBreath, toBreath]);
  stopSliderCallback = false;

  setTimeInterval();

  document.getElementById("enterRangeDiv").style.display = "none";
}

function acceptBreathTimeRange() {
	if (!pickedDate) pickedDate = session.startDate;
	let fromTime = new Date(pickedDate);
	pickedDate = null;

	let duration = document.getElementById("rangeDuration").value;

	let arr = duration.split(':'); // split it at the colons
	//console.log("arr", arr);
	if (arr.length != 3) {
    modalAlert("Invalid Range Duration", "Try again!");
    return;
  }

	let seconds = Number(arr[0]) * 60 * 60 + Number(arr[1]) * 60 + Number(arr[2]);
	if (!seconds) {
    modalAlert("Invalid Range Duration", "Try again!");
    return;
  }
	console.log("seconds", seconds);

	let toTime = addMsToDate(fromTime, seconds*1000);
	
	//console.log("fromTime", fromTime);
	//console.log("toTime", toTime);
	let fromBreath = lookupBreathNum(fromTime);
	let toBreath = lookupBreathNum(toTime);
	//console.log("fromBreath", fromBreath);
	//console.log("toBreath", toBreath);

	if (!fromBreath || !toBreath) {
    modalAlert("Invalid Breath Range", "Try again!");
    return;
	}

  stopSliderCallback = true;
  session.rangeSlider.setSlider([fromBreath, toBreath]);
  stopSliderCallback = false;

  setTimeInterval();

 document.getElementById("enterRangeDiv").style.display = "none";
}

function acceptBreathRange () {
  if (document.getElementById("enterRangeBnum").checked) acceptBreathNumRange();
	else acceptBreathTimeRange();
}

function cancelBreathRange () {
  document.getElementById("enterRangeDiv").style.display = "none";
}

function enterRangeBnum() {
	let minBnum = selectedRangeMinBnum();
	let maxBnum = selectedRangeMaxBnum();

	document.getElementById("rangeFromBnum").value = minBnum;
  document.getElementById("rangeNumBreaths").value = maxBnum - minBnum + 1;
	document.getElementById('enterRangeBnumDiv').style.display = "block";
	document.getElementById('enterRangeBtimeDiv').style.display = "none";
}

function enterRangeBtime() {
	let selectName = 'input[name="rangeFromBtime"]';
	let startDate = session.startDate;
	if (!startDate) startDate = new Date();

	let minTime = selectedRangeMinTime();
	let maxTime = selectedRangeMaxTime();

	let ms, msStr;
	if (minTime) { // for dashboard before any breath logged
		ms = maxTime.getTime() - minTime.getTime();
		msStr = msToHHMMSS(ms);
	} else {
		msStr = "00:00:00";
		minTime = maxTime = new Date();
	}
	document.getElementById("rangeDuration").value = msStr;

	$(selectName).daterangepicker({
    singleDatePicker: true,
    timePicker: true,
    timePickerSeconds: true,
		startDate: minTime,
		endDate: maxTime,
		minDate: startDate,
		maxDate: addMsToDate(startDate,session.sessionDurationInMs),
    showDropdowns: true,
		locale: {
			format: 'DD/MMM/YYYY HH:MM:SS'
        }
		}, function(start, end, label) {
			pickedDate = new Date(start);
  	});

  //console.log("startDate", minTime);
  //console.log("endDate", maxTime);
  //console.log("minDate", session.startDate);
  //console.log("maxDate", addMsToDate(startDate,session.sessionDurationInMs));

	document.getElementById('enterRangeBnumDiv').style.display = "none";
	document.getElementById('enterRangeBtimeDiv').style.display = "block";
}

function showCurrentRangeTimes() {
	let minBnum = selectedRangeMinBnum();
	let maxBnum = selectedRangeMaxBnum();

	if (maxBnum <= minBnum) {
		document.getElementById('fromRangeDay').innerHTML = "---";
		document.getElementById('fromRangeDate').innerHTML = "---";
		document.getElementById('fromRangeTime').innerHTML = "---";
		document.getElementById('toRangeDay').innerHTML = "---";
		document.getElementById('toRangeDate').innerHTML = "---";
		document.getElementById('toRangeTime').innerHTML = "---";
		document.getElementById('fromRangeBnum').innerHTML = "---";
		document.getElementById('toRangeBnum').innerHTML = "---";
		document.getElementById('spanRangeBnum').innerHTML = "---";
		document.getElementById('spanRangeBtime').innerHTML = "---";
		document.getElementById('breathRangePopup').style.display = "block";
		return;
	}
	document.getElementById('fromRangeBnum').innerHTML = minBnum;
	document.getElementById('toRangeBnum').innerHTML = maxBnum;
	document.getElementById('spanRangeBnum').innerHTML = maxBnum - minBnum + 1;

	let minTime = selectedRangeMinTime();
	let maxTime = selectedRangeMaxTime();

 	let mm = minTime.getMonth();
	let dd = minTime.getDate();
	let yyyy = minTime.getFullYear();
	let ddStr = String(dd).padStart(2, "0");
	let dateStr = ddStr+'-'+months[mm]+'-'+yyyy;
  let hour = minTime.getHours();
  let minute = minTime.getMinutes();
  let second = minTime.getSeconds();
  let hourStr = hour.toString().padStart(2, "0");
  let minuteStr = minute.toString().padStart(2, "0");
  let secondStr = second.toString().padStart(2, "0");
  let timeStr = `${hourStr}:${minuteStr}:${secondStr}`;
	document.getElementById('fromRangeDay').innerHTML = weekDays[minTime.getDay()];
	document.getElementById('fromRangeDate').innerHTML = dateStr;
	document.getElementById('fromRangeTime').innerHTML = timeStr;

 	mm = maxTime.getMonth();
	dd = maxTime.getDate();
	yyyy = maxTime.getFullYear();
	ddStr = String(dd).padStart(2, "0");
	dateStr = ddStr+'-'+months[mm]+'-'+yyyy;
  hour = maxTime.getHours();
  minute = maxTime.getMinutes();
  second = maxTime.getSeconds();
  hourStr = hour.toString().padStart(2, "0");
  minuteStr = minute.toString().padStart(2, "0");
  secondStr = second.toString().padStart(2, "0");
  timeStr = `${hourStr}:${minuteStr}:${secondStr}`;
	document.getElementById('toRangeDay').innerHTML = weekDays[maxTime.getDay()];
	document.getElementById('toRangeDate').innerHTML = dateStr;
	document.getElementById('toRangeTime').innerHTML = timeStr;

	let tspan = maxTime.getTime() - minTime.getTime();
	document.getElementById('spanRangeBtime').innerHTML = msToHHMMSS(tspan);

	document.getElementById('breathRangePopup').style.display = "block";
}

function fullRange() {
  let values = session.rangeSlider.getRange();
  let bmin = parseInt(values[0]);
  let bmax = parseInt(values[1]);

	updateSelectedSliderMinMax(bmin, bmax);
}

function forwardRange() {
  let values = session.rangeSlider.getRange();
  let minRange = parseInt(values[0]);
  let maxRange = parseInt(values[1]);
	if (maxRange <= 1) return;

	let bmin = selectedRangeMinBnum();
	let bmax = selectedRangeMaxBnum();
	let span = bmax - bmin + 1;

	if ((bmax + span) > maxRange) {
		bmax = maxRange;
	} else {
		bmax += span;
	}
	bmin = bmax - span + 1;

	updateSelectedSliderMinMax(bmin, bmax);
}

function rewindRange() {
  let values = session.rangeSlider.getRange();
  let minRange = parseInt(values[0]);
  let maxRange = parseInt(values[1]);
	if (maxRange <= 1) return;

	let bmin = selectedRangeMinBnum();
	let bmax = selectedRangeMaxBnum();
	let span = bmax - bmin + 1;

	if ((bmin - span) < minRange) {
		bmin = minRange;
	} else {
		bmin -= span;
	}
	bmax = bmin + span - 1;

	updateSelectedSliderMinMax(bmin, bmax);
}

window.addEventListener("load", function() {
  new KeypressEnterSubmit('rangeFromBnum', 'acceptRangeBtn');
  new KeypressEnterSubmit('rangeNumBreaths', 'acceptRangeBtn');
  new KeypressEnterSubmit('rangeFromBtime', 'acceptRangeBtn');
  new KeypressEnterSubmit('rangeDuration', 'acceptRangeBtn');
});

