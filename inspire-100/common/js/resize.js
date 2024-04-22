// ////////////////////////////////////////////////////
// Author: Sunil Nanda
// ////////////////////////////////////////////////////
var appResizeFunction = null;
var appScaleFactor = 1.0;
const laptopParams = { width: 1500, height: 800, fontSize: 18 };
const mobileParams = { width: 380, height: 850, fontSize: 13 };

// ///////////////////////////////////////////////////////
// Figure out the root font size for proper scaling etc.
// ///////////////////////////////////////////////////////
function setRootFontSizeLaptop() {
	const minFontSize = 6;
	const maxFontSize = 18;
	let dpxRatio = window.devicePixelRatio;
	let width = window.innerWidth / dpxRatio;
	let height = window.innerHeight / dpxRatio;
	let wFontSize = (laptopParams.fontSize * width) / laptopParams.width;
	let hFontSize = (laptopParams.fontSize * height) / laptopParams.height;
	let fontSize = Math.min(wFontSize, hFontSize);
	fontSize *= appScaleFactor;

	//console.log("height", height, "width", width, "dpxRatio", dpxRatio, "appScaleFactor", appScaleFactor);

	if (fontSize > maxFontSize) fontSize = maxFontSize;
	if (fontSize < minFontSize) fontSize = minFontSize;
	//console.log("root fontSize", fontSize);

	let root = document.documentElement;
 	root.style.fontSize = String(fontSize) + "px";
	if (appResizeFunction) appResizeFunction();
}

function setRootFontSizeMobile(orient) {
	if (isUndefined(orient)) orient = "portrait";
	const minFontSize = 4;
	const maxFontSize = 17;
	//let width = 375;
	//let height = 812;
	let dpxRatio = window.devicePixelRatio;
	let width = window.innerWidth / dpxRatio;
	let height = window.innerHeight / dpxRatio;
	let wFontSize = (mobileParams.fontSize * width) / mobileParams.width;
	let hFontSize = (mobileParams.fontSize * height) / mobileParams.height;
	let fontSize = 0;
	if (orient == "portrait") {
		fontSize = wFontSize;
	} else {
		fontSize = hFontSize;
	}
	fontSize *= appScaleFactor;

	//alert("height=" + height + "\nwidth=" + width + "\nappScaleFactor=" + appScaleFactor);

	if (fontSize > maxFontSize) fontSize = maxFontSize;
	if (fontSize < minFontSize) fontSize = minFontSize;
	//alert("root fontSize=" + fontSize);

	let root = document.documentElement;
 	root.style.fontSize = String(fontSize) + "px";
	if (appResizeFunction) appResizeFunction();
}

// Check for change in orientation
var portraitScreen = window.matchMedia("(orientation: portrait)");
var orientation = portraitScreen.matches ? "portrait" : "landscape";
portraitScreen.addEventListener("change", function(e) {
  if (e.matches) {
		orientation = "portrait";
  } else {
		orientation = "landscape";
  }
	setRootFontSizeMobile(orientation);
})


// Check if the browser is on a mobile
function isMobileBrowser() {
	if (/Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  	return true;
	} else {
  	return false;
	}
}

function setRootFontSize() {
	if (isMobileBrowser()) {
		if (isUndefined(portraitScreen)) {
			portraitScreen = window.matchMedia("(orientation: portrait)");
			orientation = portraitScreen.matches ? "portrait" : "landscape";
		}
		setRootFontSizeMobile(orientation);
	} else {
		setRootFontSizeLaptop();
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
	if (isMobileBrowser()) {
		// Handled above in the orientation change listener
		return;
	}

  // Clear the previous timeout.
  clearTimeout(resizeTimeout);

  // Set a new timeout to execute the function after 100 milliseconds.
  resizeTimeout = setTimeout(function() {
  	// Now resize if not zooming
		if (!isZooming()) {
			setRootFontSizeLaptop();
		}
  }, 100);
});

