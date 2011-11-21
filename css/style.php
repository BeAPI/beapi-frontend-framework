<?php
header("Content-Type: text/css"); 
require 'lessc.inc.php';

// List my ressources	
$ressources = array(
	'ressources/reset.less',
	'ressources/text.less',
	'ressources/forms.less',
	'ressources/img.less',
	'master.less'
);

// Parse & compile LESS
foreach( $ressources as $file ) {
	$less = new lessc( dirname(__FILE__) . '/'.$file);
	echo $less->parse();
}
?>