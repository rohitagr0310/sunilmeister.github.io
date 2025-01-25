// ///////////////////////////////////////////////////////////////
// Author: Sunil Nanda
// ///////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////
// Blinking timers
// ////////////////////////////////////////////////////////////////
var snapshotsTimerPaused = false;
var snapshotsTimer = setInterval(function () {
	executeSnapshotsTimer();
}, FASTEST_BLINK_INTERVAL_IN_MS)

function pauseSnapshotsTimer() {
	if (snapshotsTimerPaused) return;
	clearInterval(snapshotsTimer);
	snapshotsTimerPaused = true;
}

function resumeSnapshotsTimer() {
	if (!snapshotsTimerPaused) return;

	snapshotsTimer = setInterval(function () {
		executeSnapshotsTimer();
	}, FASTEST_BLINK_INTERVAL_IN_MS)

	snapshotsTimerPaused = false;
}

function executeSnapshotsTimer() {
	if (!session) return;
	let snap = session.snapshot.content;

	console.log("imgStateDIV",imgStateDIV);
	if (imgStateDIV) blinkStateImage();
  if ((snap.state == ERROR_STATE) || (snap.errorTag == true)) {
		blinkEntireFrontPanel();
	} else if (fpErrorBlank) {
		updateEntireFrontPanel();
	}

	if (snap.somePending) {
		blinkFrontPanelPendingSettings();
	} else if (!((snap.state == ERROR_STATE) || (snap.errorTag == true))) {
		updateEntireFrontPanel();
		blinkFrontPanelLEDs();
	}
}

