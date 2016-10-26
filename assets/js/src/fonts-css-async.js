// load webfonts asyncusing LoasCSS filament group lib
loadCSS("//fonts.googleapis.com/css?family=Roboto:400,500,700");

// detect loading of fonts using fontfaceobserver lib
var roboto400 = new FontFaceObserver("Roboto", {
	weight: 400
});

roboto400.check().then(function () {
	document.documentElement.className += " fonts-loaded";
});

if (typeof Promise === 'function') { // < IE9
	Promise.all([
		roboto400.check(),
	]).then(function() {
		document.documentElement.className += " fonts-loaded";
	});
}else{
	document.documentElement.className += " fonts-loaded";
}