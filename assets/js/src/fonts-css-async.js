// load webfonts asyncusing LoasCSS filament group lib
loadCSS("//fonts.googleapis.com/css?family=Roboto:400,500,700");

// detect loading of fonts using fontfaceobserver lib
var roboto400 = new FontFaceObserver("Roboto", {
	weight: 400
});
var roboto700 = new FontFaceObserver("Roboto", {
	weight: 700
});

Promise.all([
	roboto400.check(),
	roboto700.check()
]).then(function() {
	document.documentElement.className += " fonts-loaded";
});
