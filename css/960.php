<?php
header("Content-Type: text/css"); 
require 'lessc.inc.php';

foreach( array('960.less') as $file ) {
	$less = new lessc( dirname(__FILE__) . '/'.$file);
	echo $less->parse();
}
?>