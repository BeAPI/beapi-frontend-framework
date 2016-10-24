// detect loading of fonts using fontfaceobserver lib
var roboto = new FontFaceObserver("Roboto");

roboto.load().then(function () {
	document.documentElement.className += " fonts-loaded";
}).catch(function () {
  console.log('Font failed to load.');
});