<?php
require( dirname( __FILE__ ) . '/functions/_init.php' );
?>
<!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie6 common-ie" lang="fr"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7 common-ie" lang="fr"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8 common-ie" lang="fr"> <![endif]-->
<!--[if IE 9 ]> <html class="no-js ie9 common-ie" lang="fr"> <![endif]-->
<!--[if !(IE)]><!-->
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
		
		<!--[if lt IE 9]><script type="text/javascript" src="../assets/bower_components/html5shiv/dist/html5shiv.min.js"></script><![endif]-->
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
		
		<!-- Load CSS JS -->
		<script type="text/javascript" src="../assets/bower_components/loadcss/loadCSS.js"></script>
		<!-- Font Face Observiser JS -->
		<script type="text/javascript" src="../assets/bower_components/fontfaceobserver/fontfaceobserver.js"></script>

		<script>
			// load webfonts
			loadCSS("//fonts.googleapis.com/css?family=Roboto:400,500,700");
			
			// detect loading of fonts
			var roboto400 = new FontFaceObserver("Roboto", {
			  weight: 400
			});
			var roboto700 = new FontFaceObserver("Roboto", {
			  weight: 700
			});

			Promise.all([
			  roboto400.check(),
			  roboto700.check()
			]).then(function() {
			  document.documentElement.className += " fonts-loaded";
			});
		</script>

	</head>
	<body class="<?php echo $class; ?>">
		<!--[if lte IE 9]>
			<div class="message message__browserhappy">
				<p>
				You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/" target="_blank">upgrade your browser</a> to improve your experience. <br>
				<a href="#" onclick="jQuery('.message__browserhappy').hide();"><small>Close</small></a>
				</p>
			</div>
		<![endif]-->
		<div id="main">
			<ul class="menu__fastaccess">
				<li><a href="#main-content">Acces direct au contenu</a></li>
				<li><a href="#search">Acces direct à la recherche</a></li>
				<li><a href="#menu">Acces direct au menu</a></li>
			</ul>
			<div class="button__menu-container">
				<button class="button__menu-open"><span class="icon-menu"></span>Menu</button>
				<button class="button__menu-close"><span class="icon-close"></span>Fermer</button>
			</div>
			<header id="header" class="header">
				<div class="wrapper">
					<div class="header__logo">
						<a href="#" class="header__logo-link">
							<img src="http://placehold.it/300x75&text=LOGO" alt="#" class="header__logo-img" />
						</a>
					</div>
					<?php if ( $class == 'home' ) :?>
						<h1 class="header__title visuallyhidden"><a href="01-home.php">BeAPI FrontEnd Framework</a></h1>
					<?php else: ?>
						<div class="header__title visuallyhidden"><a href="01-home.php">BeAPI FrontEnd Framework</a></div>
					<?php endif; ?>
				</div>
			</header>
			<nav id="menu" class="menu menu__mobile">
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