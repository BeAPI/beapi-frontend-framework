<?php
header("Content-Type: text/css"); 
require '../lessc.inc.php';

foreach( array('desktop.less') as $file ) {
	$lc = new lessc( dirname(__FILE__) . '/'.$file ); 
	try{ 
		print $lc->parse(); 
	} catch (exception $ex){ 
		print "LESSC FEHLER:"; 
		print $ex->getMessage(); 
	} 
}
?>