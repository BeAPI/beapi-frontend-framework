<?php require 'init.php'; ?>
<!doctype html>
<!--[if lte IE 9 ]>
<html class="no-js ie lte-ie9 ie9" lang="fr"> <![endif]-->
<!--[if !(IE)]><! -->
<html class="fonts-loading no-js" lang="fr"><!--<![endif]-->
<head>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="viewport" content="initial-scale=1.0"/>
	<meta http-equiv="x-ua-compatible" content="ie=edge">

	<title>BeAPI FrontEnd Framework | The WordPress BFF</title>

	<link rel="stylesheet" href="assets/app.css">

	<!-- jQuery from official WordPress Core -->
	<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>

</head>
<body class="<?php echo $bodyClass; ?>">
<!--[if lte IE 9]>
	<div class="message message__browserhappy">
		<p>
		You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/" target="_blank">upgrade your browser</a> to improve your experience.
		</p>
		<p>
		<button><span class="btn-icon icon-close"></span>&nbsp;Close</button>
		</p>
	</div>
<![endif]-->
<div id="main">
	<ul class="menu-fastaccess">
		<li class="menu-fastaccess__item"><a href="#main__content">Acces direct au contenu</a></li>
		<!-- <li class="menu-fastaccess__item"><a href="#searchform">Acces direct à la recherche</a></li> -->
		<li class="menu-fastaccess__item"><a href="#menu">Acces direct au menu</a></li>
	</ul>
	<header id="header" class="header" role="banner">
		<div class="container">
			<div class="header__logo">
				<a href="01-home.php" class="header__logo-link">
					<!-- <?php //echo get_the_post_thumbnail( 0, 'logo-beapi', array( 'data-location' => 'header-logo', 'class' => 'header__img', 'alt' => 'Logo' ) ); ?>  -->
					<?php the_icon( 'logo-beapi', [ 'header__icon' ] ); ?>
					<?php if ( $bodyClass == 'home' ) : ?>
						<h1 class="header__title visuallyhidden">BeAPI FrontEnd Framework</h1>
					<?php else: ?>
						<div class="header__title visuallyhidden">BeAPI FrontEnd Framework</div>
					<?php endif; ?>
				</a>
			</div>
			<nav id="nav-primary" class="amenu nav-primary" aria-label="Main navigation" role="navigation">
				<button class="amenu__toggle accessible-megamenu-toggle">
					<span class="visuallyhidden">Menu</span>
					<svg class="icon icon-menu" aria-hidden="true" role="img">
						<use xlink:href="#icon-menu"></use>
					</svg>
					<svg class="icon icon-close" aria-hidden="true" role="img">
						<use xlink:href="#icon-close"></use>
					</svg>
				</button>
				<ul id="amenu-main" class="menu amenu__main js-amenu__main">
					<li class="menu-item current-menu-item menu-item-has-children">
						<a href="01-home.php">Home</a>
						<div class='amenu__panel'>
							<ul class='sub-menu amenu__sub-menu'>
								<li class="menu-item"><a href="#">Sub menu item</a></li>
							</ul>
						</div>
					</li>
					<li class="menu-item"><a href="02-single-default.php">Single default</a></li>
					<li class="menu-item"><a href="03-archive-default.php">Archive default</a></li>
					<li class="menu-item"><a href="04-page-404.php">Page 404</a></li>
				</ul>
			</nav>


		</div>
	</header>
	<main id="main__content" class="main__content" role="main" tabindex="-1" aria-label="Contenu Principal">
