var $ = require('jquery');

// Detect CTRL pressed
var cntrlIsPressed = false;
$(document).keydown(function(event){
    if(event.which==="17") {
    	cntrlIsPressed = true;
    }
});
$(document).keyup(function(){
    cntrlIsPressed = false;
});

// Handle data-href on button components
$('body').on('mousedown', '[data-href]', function (e) {
	var href = $(this).data('href');
	var isBlank = $(this).attr('data-target', '_blank');
	var download = $(this).attr('data-target', 'download');
	var filename = $(this).data('filename');
	if (isBlank || e.which === 2 || cntrlIsPressed) {
		window.open(href, '_blank');
	} else if (e.which === 1) {
		window.location.href = href;
	}
	if (download) {
		var anchor = document.createElement('a');
		anchor.href = href;
		anchor.target = '_blank';
		anchor.download = filename;
		anchor.click();
	}
});