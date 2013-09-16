<!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="fr"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7 modern-ie" lang="fr"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8 modern-ie" lang="fr"> <![endif]-->
<!--[if IE 9 ]> <html class="no-js ie9" lang="fr"> <![endif]-->
<!--[if !(IE)]><!-->
<html class="no-js" lang="fr"><!--<![endif]-->
	<head>
		<script type="text/javascript">
			//<![CDATA[
			(function(){
				var c = document.documentElement.className;
				c = c.replace(/no-js/, 'js');
				document.documentElement.className = c;
			})();
			//]]>
		</script>
		
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width" />
		
		<title>BeAPI Base theme</title>
		
		<link rel="shortcut icon" href="assets/images/favicon.ico" />
		<link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png" />
		
		<!--[if lt IE 9]><script type="text/javascript" src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
		<!--[if lte IE 8]>
			<style type="text/css" media="screen">
				.css3-fix {
					behavior: url(<?php echo 'http://'.$_SERVER['SERVER_NAME']; ?>/wp-content/html/assets/htc/PIE.php);
				}
			</style>
		<![endif]-->
		
		<link rel="stylesheet" type="text/css" media="all" href="functions/style.php" />
		
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
		
	</head>
	<body class="<?php echo $class; ?>">
		<div class="wrapper">
			<ul id="fast-access">
				<li><a href="#content">Acces direct au contenu</a></li>
				<li><a href="#search">Acces direct à la recherche</a></li>
				<li><a href="#menu">Acces direct au menu</a></li>
			</ul>
			<header id="header">
				<h1 id="logo">Website title</h1>
			</header>
			<nav class="horizontal-nav full-width" id="menu" >
				<ul class="sf-menu">
					<li>
						<a href="#">menu item</a>
						<ul>
							<li><a href="#">menu item</a></li>
							<li><a href="#">menu item</a></li>
							<li><a href="#">menu item</a></li>
							<li><a href="#">menu item</a></li>
							<li><a href="#">menu item</a></li>
							<li><a href="#">menu item</a></li>
						</ul>
					</li>
					<li class="current-menu-item"><a href="#">menu item</a></li>
					<li><a href="#">menu item</a></li>
					<li><a href="#">menu item</a></li>
					<li><a href="#">menu item</a></li>
				</ul>
			</nav>