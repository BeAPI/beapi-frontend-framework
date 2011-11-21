<?php
header("Content-Type: text/css"); 
require '../lessc.inc.php';

foreach( array('desktop.less') as $file ) {
	$less = new lessc( dirname(__FILE__) . '/'.$file);
	echo $less->parse();
}
?>