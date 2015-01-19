<?php
require( dirname( __FILE__ ) . '/functions/_init.php' );
?>
<!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="fr"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7 modern-ie" lang="fr"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8 modern-ie" lang="fr"> <![endif]-->
<!--[if IE 9 ]> <html class="no-js ie9" lang="fr"> <![endif]-->
<!--[if !(IE)]><!-->
<html class="no-js" lang="fr"><!--<![endif]-->
	<head>
		
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="initial-scale=1.0" />
		
		<title>BeAPI Base theme</title>
		
		<link rel="shortcut icon" href="assets/img/favicon.ico" />
		<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png" />
		
		<!--[if lt IE 9]><script type="text/javascript" src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
		<!--[if lte IE 8]>
			<style type="text/css" media="screen">
				.css3-fix {
					behavior: url("../assets/htc/PIE.htc");
				}
			</style>
			<script type="text/javascript" src="../assets/bower_components/selectivizr/selectivizr.js"></script>
		<![endif]-->
		
		<link rel="stylesheet" type="text/css" media="all" href="../assets/css/style.dev.css?t=<?php echo time(); ?>" />
		
		<!-- Modernizr Custom (JS + SVG detection) -->
		<script type="text/javascript" src="../assets/js/vendor/modernizr.custom.min.js"></script>
		
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
		
	</head>
	<body class="<?php echo $class; ?>">
		<div id="main">
			<ul class="menu__fastaccess">
				<li><a href="#main-content">Acces direct au contenu</a></li>
				<li><a href="#search">Acces direct à la recherche</a></li>
				<li><a href="#menu">Acces direct au menu</a></li>
			</ul>
			<header id="header" class="header">
				<div class="wrapper">
					<h1 id="logo"><a href="01-home.php">Website title</a></h1>
				</div>
			</header>
			<nav id="menu" class="menu">
				<div class="wrapper">
					<ul class="sf-menu">
						<li>
							<a href="02-page-default.php">menu item</a>
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
				</div>
			</nav>
			<section id="main__content" class="main__content">
				<div class="wrapper">