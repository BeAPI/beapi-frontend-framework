<?php
header("Content-Type: text/css");
require dirname(__FILE__) . '/lib/lessc.inc.php';

// List my ressources	
$ressources = array(
	'ressources/reset.less',
	'ressources/text.less',
	'ressources/forms.less',
	'ressources/img.less',
	'ressources/elements.less',
	'ressources/superfish.less',
	'grids/desktop.less',
	'grids/tablet.less',
	'grids/mobile.less',
	'master.less',
	'ressources/print.less'
);

// Dynamic css
$dynamic_less = '';

// Parse & compile LESS
foreach ($ressources as $file) {
	$dynamic_less .= file_get_contents(dirname(__FILE__) . '/' . $file);
}

// Dynamic build URL
$dynamic_less = str_replace( '{theme_url}', 'http://'.$_SERVER['SERVER_NAME'].'/wp-content/html', $dynamic_less ); 

// Build CSS
$less = new lessc();
$css_output = $less -> parse($dynamic_less);

// Fix bug with IE6-IE7-IE8
$css_output = str_replace(' / ', '/', $css_output);

echo $css_output;
exit();
?>