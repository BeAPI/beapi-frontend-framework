<?php include 'init.php'; ?>
<!doctype html>
<!--[if lte IE 9 ]> <html class="no-js ie lte-ie9 ie9" lang="fr"> <![endif]-->
<!--[if !(IE)]><! -->
<html class="fonts-loading no-js" lang="fr"><!--<![endif]-->
	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="initial-scale=1.0" />
		<meta http-equiv="x-ua-compatible" content="ie=edge">

		<title>BeAPI FrontEnd Framework | The WordPress BFF</title>

		<!-- Web App favicons from /assets/img/favicons/index_hd.html -->
		<link rel="manifest" href="assets/img/favicons/manifest.json">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="theme-color" content="#ffffff">
		<meta name="application-name" content="BFF">
		<link rel="apple-touch-icon" sizes="57x57" href="assets/img/favicons/apple-touch-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="assets/img/favicons/apple-touch-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="assets/img/favicons/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="assets/img/favicons/apple-touch-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="assets/img/favicons/apple-touch-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="assets/img/favicons/apple-touch-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="assets/img/favicons/apple-touch-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="assets/img/favicons/apple-touch-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="assets/img/favicons/apple-touch-icon-180x180.png">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		<meta name="apple-mobile-web-app-title" content="BFF">
		<link rel="icon" type="image/png" sizes="228x228" href="assets/img/favicons/coast-228x228.png">
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-TileImage" content="assets/img/favicons/mstile-144x144.png">
		<meta name="msapplication-config" content="assets/img/favicons/browserconfig.xml">
		<link rel="yandex-tableau-widget" href="assets/img/favicons/yandex-browser-manifest.json">

		<!-- Standard favicons from /assets/img/favicons/index_sd.html -->
		<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicons/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicons/favicon-16x16.png">
		<link rel="shortcut icon" href="assets/img/favicons/favicon.ico">

		<!--[if lte IE 9]>
			<script type="text/javascript" src="assets/js/vendor_ie/matchMedia-polyfill.js"></script>
			<script type="text/javascript" src="assets/js/vendor_ie/matchMedia.addListener.js"></script>
			<script type="text/javascript" src="assets/js/vendor_ie/placeholders.min.js"></script>
		<![endif]-->
		<!--[if lt IE 9]>
			<script type="text/javascript" src="assets/js/vendor_ie/html5shiv.min.js"></script>
		<![endif]-->
		<!--[if lte IE 8]>
			<script type="text/javascript" src="assets/js/vendor_ie/selectivizr.js"></script>
		<![endif]-->

		<?php
		if ( is_readable( dirname( __FILE__ ) . '/../WebpackBuiltFiles.php' ) ) {
			require_once dirname( __FILE__ ) . '/../WebpackBuiltFiles.php';
			foreach ( WebpackBuiltFiles::$cssFiles as $file ) { ?>
				<link rel="stylesheet" href="assets/<?php echo $file; ?>">
			<?php }
		}
		?>

		<!-- jQuery from official WordPress Core -->
		<script type="text/javascript" src="assets/js/vendor_async/jquery.js"></script>

	</head>
	<body class="<?php echo $bodyClass; ?>">
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
			<ul class="menu-fastaccess">
				<li class="menu-fastaccess__item"><a href="#main__content">Acces direct au contenu</a></li>
				<!-- <li class="menu-fastaccess__item"><a href="#searchform">Acces direct à la recherche</a></li> -->
				<li class="menu-fastaccess__item"><a href="#menu">Acces direct au menu</a></li>
			</ul>
			<div id="js-menu-trigger" class="menu-trigger">
				<button type="button" id="js-menu-open" class="menu-trigger__open button button--primary">
					<svg class="icon icon-menu" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-menu"></use>
					</svg>
					Menu
				</button>
				<button type="button" id="js-menu-close" class="menu-trigger__close button button--primary">
					<svg class="icon icon-close" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use>
					</svg>
					Fermer
				</button>
			</div>
			<header id="header" class="header" role="banner">
				<div class="container">
					<div class="header__logo">
						<a href="01-home.php" class="header__logo-link">
							<!-- <?php //echo get_the_post_thumbnail( 0, 'logo-beapi', array( 'data-location' => 'header-logo', 'class' => 'header__img', 'alt' => 'Logo' ) ); ?>  -->
							<svg class="header__icon icon" aria-hidden="true" role="img">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-beapi"></use>
							</svg>
							<?php if ( $bodyClass == 'home' ) :?>
								<h1 class="header__title visuallyhidden">BeAPI FrontEnd Framework</h1>
							<?php else: ?>
								<div class="header__title visuallyhidden">BeAPI FrontEnd Framework</div>
							<?php endif; ?>
						</a>
					</div>
					<nav id="menu" class="menu" role="navigation" tabindex="-1" aria-label="Navigation Principal">
						<ul class="menu__list sf-menu">
							<li class="menu-item current-menu-item menu-item-has-children">
								<a href="01-home.php">Home</a>
								<ul class="sub-menu">
									<li class="menu-item"><a href="#">Sub menu item</a></li>
								</ul>
							</li>
							<li class="menu-item"><a href="02-page-default.php">Page default</a></li>
							<li class="menu-item"><a href="03-archive-default.php">Archive default</a></li>
							<li class="menu-item"><a href="04-page-404.php">Page 404</a></li>
						</ul>
					</nav>
				</div>
			</header>
			<main id="main__content" class="main__content" role="main" tabindex="-1" aria-label="Contenu Principal">