// load webfonts asyncusing LoasCSS filament group lib
loadCSS("//fonts.googleapis.com/css?family=Roboto:400,500,700");

// detect loading of fonts using fontfaceobserver lib
var roboto = new FontFaceObserver("Roboto");

roboto.load().then(function () {
	document.documentElement.className += " fonts-loaded";
}).catch(function () {
  console.log('Font failed to load.');
});