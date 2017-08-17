/**
 * IE disclaimer
 */

import $ from 'jquery';

var ieUiMessage = $('.message__browserhappy');

$('.message__browserhappy button').on('click', function() {
	ieUiMessage.hide();
});