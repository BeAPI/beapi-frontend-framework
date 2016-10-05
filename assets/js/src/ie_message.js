// Dependencies
var jQuery = require('jquery');


var ieUiMessage = jQuery('.message__browserhappy');
jQuery('.message__browserhappy button').on("click", function(){
	ieUiMessage.hide();
});