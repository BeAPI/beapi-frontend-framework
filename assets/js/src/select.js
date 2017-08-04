/**
 * Wrapper for select
 */
 
initCustomSelect(jQuery("select:not([multiple])"));
function initCustomSelect(el){
	el.wrap("<div class='select--custom'/>");	
}
