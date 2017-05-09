/**
 * IE disclaimer
 */


// Dependencies
var $ = require('jquery');


var ieUiMessage = jQuery('.message__browserhappy');
$('.message__browserhappy button').on("click", function(){
	ieUiMessage.hide();
});