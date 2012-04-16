<?php
header("Content-Type: text/css");
require dirname(__FILE__) . '/lib/lessc.inc.php';
require dirname(__FILE__) . '/lib/JG_Cache.php';

//Make sure it exists and is writeable
$cache = new JG_Cache(dirname(__FILE__) . '/cache');

// Cache exist ?
$css_output = $cache -> get('css', 3600 * 24 ); // 24 hours
if ($css_output === FALSE) {
	// List my ressources	
	$ressources = array(
		'ressources/reset.less',
		'ressources/text.less',
		'ressources/forms.less',
		'ressources/img.less',
		'ressources/elements.less',
		'ressources/superfish.less',
		'grids/grid.less',
		'master.less',
		'grids/desktop.less',
		'grids/tablet.less',
		'grids/mobile.less',
		'ressources/print.less'
	);
	
	// Dynamic css
	$dynamic_less = '';
	
	// Parse & compile LESS
	foreach ($ressources as $file) {
		$dynamic_less .= file_get_contents(dirname(__FILE__) . '/' . $file);
	}
	
	// Build CSS
	$less = new lessc();
	$css_output = $less -> parse($dynamic_less);
	
	// Save output
	$cache -> set('css', $css_output);
}

echo $css_output;
exit();
?>