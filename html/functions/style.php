<?php
header("Content-Type: text/css");

require dirname(__FILE__) . '/../assets/css/vendor/lessc.inc.php';

// List my ressources	
$ressources = array(
	'components/url-config.less',
	'components/reset.less',
	'components/text.less',
	'components/forms.less',
	'components/img.less',
	'components/elements.less',
	'components/superfish.less',
	'grids/grid.less',
	'grids/desktop.less',
	'grids/tablet.less',
	'grids/mobile.less',
	'components/variables.less',
	'master.less',
	'components/print.less'
);

// Dynamic css
$dynamic_less = '';

// Parse & compile LESS
foreach ($ressources as $file) {
	$dynamic_less .= file_get_contents(dirname(__FILE__) . '/../assets/css/' . $file);
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