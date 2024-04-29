// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////
var appResizeFunction = null; // callback function for app to resize stuff

// APP bounds
var rootWidthDiv = null;
var rootHeightDiv = null;
var appWidth = null;
var appHeight = null;

// Design Params
const laptopDevFontSize = 16;
const mobileDevFontSize = 16;

// Ensure that some margin is left on the sides
const fontScaleFactor = 0.9;

function setRootFontSize(rootWidthDivId, rootHeightDivId) {
	//console.log("ROOT DIVs (W,H)", rootWidthDivId, rootHeightDivId);
	rootWidthDiv = document.getElementById(rootWidthDivId);
	rootHeightDiv = document.getElementById(rootHeightDivId);
	appWidth = rootWidthDiv.offsetWidth;
	appHeight = rootHeightDiv.offsetHeight;

	if (isMobileBrowser()) {
		setRootFontSizeDevice(mobileDevFontSize);
	} else {
		setRootFontSizeDevice(laptopDevFontSize);
	}
}

// ///////////////////////////////////////////////////////
// Figure out the root font size for proper scaling etc.
// ///////////////////////////////////////////////////////
function setRootFontSizeDevice(devFontSize) {
	const minFontSize = 6;
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	let wFontSize = (devFontSize * windowWidth) / appWidth;
	let hFontSize = (devFontSize * windowHeight) / appHeight;

	//console.log("rootDivBoundingRect",rootDivBoundingRect);
	console.log("windowWidth", windowWidth, "windowHeight", windowHeight);
	console.log("appWidth", appWidth, "appHeight", appHeight );
	console.log("wFontSize", wFontSize, "hFontSize", hFontSize);

	let fontSize = Math.min(wFontSize, hFontSize);
	fontSize *= fontScaleFactor;
	//if (fontSize > maxFontSize) fontSize = maxFontSize;
	if (fontSize < minFontSize) fontSize = minFontSize;
	console.log("root fontSize", fontSize);

	let root = document.documentElement;
 	root.style.fontSize = String(fontSize) + "px";
	if (appResizeFunction) appResizeFunction();
}

// Check if the browser is on a mobile
function isMobileBrowser() {
	if (/Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  	return true;
	} else {
  	return false;
	}
}

// Check whether true resize or simply zoom
var pxRatio = window.devicePixelRatio; 
function isZooming(){
	let newPxRatio = window.devicePixelRatio ;
  if(newPxRatio != pxRatio){
    pxRatio = newPxRatio;
    return true;
  } else {
    return false;
  }
}

// Add an event listener for the resize event.
var resizeTimeout;
window.addEventListener("resize", function() {
  // Clear the previous timeout.
  clearTimeout(resizeTimeout);

  // Set a new timeout to execute the function after 100 milliseconds.
  resizeTimeout = setTimeout(function() {
  	// Now resize if not zooming
		if (!isZooming()) {
			if (isMobileBrowser()) {
				setRootFontSizeDevice(mobileDevFontSize);
			} else {
				setRootFontSizeDevice(laptopDevFontSize);
			}
		}
  }, 100);
});

