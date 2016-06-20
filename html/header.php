<?php
require( dirname( __FILE__ ) . '/functions/_init.php' );
?>
<!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie lte-ie9 lte-ie8 lte-ie7 ie6" lang="fr"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie lte-ie9 lte-ie8 lte-ie7 ie7" lang="fr"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie lte-ie9 lte-ie8 ie8" lang="fr"> <![endif]-->
<!--[if IE 9 ]> <html class="no-js ie lte-ie9 ie9" lang="fr"> <![endif]-->
<!--[if !(IE)]><! -->
<html class="no-js" lang="fr"><!--<![endif]-->
	<head>
		
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="initial-scale=1.0" />
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		
		<title>BeAPI FrontEnd Framework | The WordPress BFF</title>
		
		<link rel="apple-touch-icon" sizes="57x57" href="../assets/img/favicons/apple-touch-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="../assets/img/favicons/apple-touch-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="../assets/img/favicons/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="../assets/img/favicons/apple-touch-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="../assets/img/favicons/apple-touch-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="../assets/img/favicons/apple-touch-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="../assets/img/favicons/apple-touch-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="../assets/img/favicons/apple-touch-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="../assets/img/favicons/apple-touch-icon-180x180.png">
		<link rel="icon" type="image/png" href="../assets/img/favicons/favicon-32x32.png" sizes="32x32">
		<link rel="icon" type="image/png" href="../assets/img/favicons/favicon-230x230.png" sizes="230x230">
		<link rel="icon" type="image/png" href="../assets/img/favicons/favicon-96x96.png" sizes="96x96">
		<link rel="icon" type="image/png" href="../assets/img/favicons/android-chrome-192x192.png" sizes="192x192">
		<link rel="icon" type="image/png" href="../assets/img/favicons/favicon-16x16.png" sizes="16x16">
		<link rel="manifest" href="../assets/img/favicons/android-chrome-manifest.json">
		<link rel="shortcut icon" href="../assets/img/favicons/favicon.ico">
		<meta property="og:image" content="favicons/open-graph.png">
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-TileImage" content="favicons/mstile-144x144.png">
		<meta name="msapplication-config" content="favicons/browserconfig.xml">
		<meta name="theme-color" content="#ffffff">
		
		<!--[if lt IE 9]><script type="text/javascript" src="../assets/js/vendor_ie/html5shiv.min.js"></script><![endif]-->
		<!--[if lte IE 8]>
			<style type="text/css" media="screen">
				.css3-fix {
					behavior: url("../assets/htc/PIE.htc");
				}
			</style>
			<script type="text/javascript" src="../assets/js/vendor_ie/selectivizr.js"></script>
		<![endif]-->

		
		
		<link rel="stylesheet" type="text/css" media="all" href="../assets/css/style.dev.css?t=<?php echo time(); ?>" />
		
		<!-- Modernizr Custom (JS + SVG detection) -->
		<script type="text/javascript" src="../assets/js/vendor_async/modernizr.custom.min.js"></script>
		
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

	</head>
	<body itemscope itemtype="http://schema.org/WebPage" class="<?php echo $class; ?>">
		<!--[if lte IE 9]>
			<div class="message message__browserhappy">
				<p>
				You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/" target="_blank">upgrade your browser</a> to improve your experience.
				</p>
				<p>
				<button><span class="button-icon icon-close"></span>&nbsp;Close</button>
				</p>
			</div>
		<![endif]-->
		<div id="main">
			<ul class="menu__fastaccess">
				<li><a href="#main__content">Acces direct au contenu</a></li>
				<li><a href="#searchform">Acces direct à la recherche</a></li>
				<li><a href="#menu">Acces direct au menu</a></li>
			</ul>
			<div class="button__menu-container">
				<button class="button__menu-open"><span class="button__icon icon-menu"></span>Menu</button>
				<button class="button__menu-close"><span class="button__icon icon-close"></span>Fermer</button>
			</div>
			<header id="header" class="header">
				<div class="wrapper">
					<div class="header__logo">
						<a href="#" class="header__logo-link">
							<?php echo get_the_post_thumbnail( 0, 'logo-beapi', array( 'data-location' => 'header-logo', 'class' => 'header__img', 'alt' => 'Logo' ) ); ?> 
						</a>
					</div>
					<?php if ( $class == 'home' ) :?>
						<h1 class="header__title visuallyhidden"><a href="01-home.php">BeAPI FrontEnd Framework</a></h1>
					<?php else: ?>
						<div class="header__title visuallyhidden"><a href="01-home.php">BeAPI FrontEnd Framework</a></div>
					<?php endif; ?>
				</div>
			</header>
			<nav id="menu" class="menu menu__mobile" tabindex="-1">
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
			<main id="main__content" class="main__content" tabindex="-1" aria-label="Contenu Principal">
				<div class="wrapper">