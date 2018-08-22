<?php
require( dirname( __FILE__ ) . '/functions/_init.php' );
?>
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
			<script type="text/javascript" src="assets/js/vendor_ie/matchmedia-polyfill.js"></script>
			<script type="text/javascript" src="assets/js/vendor_ie/matchMedia.addListener.js"></script>
			<script type="text/javascript" src="assets/js/vendor_ie/placeholders.min.js"></script>
		<![endif]-->
		<!--[if lt IE 9]>
			<script type="text/javascript" src="assets/js/vendor_ie/html5shiv.min.js"></script>
		<![endif]-->
		<!--[if lte IE 8]>
			<script type="text/javascript" src="assets/js/vendor_ie/selectivizr.js"></script>
		<![endif]-->

		<style>
			.cssloading__overlay {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: #fff;
				opacity: 1;
				z-index: 10001;
				transition: opacity .25s ease, z-index .25s ease .5s, width .25s ease .5s, height .25s ease .25s, visibility .25s ease .25s;
			}
		</style>

		<link rel="preload" href="assets/app.css" as="style" onload="this.rel='stylesheet'">
		<noscript>
			<link rel="stylesheet" href="assets/app.css">
		</noscript>

		<script>
		/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
		!function(a){"use strict";var b=function(b,c,d){function e(a){return h.body?a():void setTimeout(function(){e(a)})}function f(){i.addEventListener&&i.removeEventListener("load",f),i.media=d||"all"}var g,h=a.document,i=h.createElement("link");if(c)g=c;else{var j=(h.body||h.getElementsByTagName("head")[0]).childNodes;g=j[j.length-1]}var k=h.styleSheets;i.rel="stylesheet",i.href=b,i.media="only x",e(function(){g.parentNode.insertBefore(i,c?g:g.nextSibling)});var l=function(a){for(var b=i.href,c=k.length;c--;)if(k[c].href===b)return a();setTimeout(function(){l(a)})};return i.addEventListener&&i.addEventListener("load",f),i.onloadcssdefined=l,l(f),i};"undefined"!=typeof exports?exports.loadCSS=b:a.loadCSS=b}("undefined"!=typeof global?global:this);
		/*! loadCSS rel=preload polyfill. [c]2017 Filament Group, Inc. MIT License */
		!function(a){if(a.loadCSS){var b=loadCSS.relpreload={};if(b.support=function(){try{return a.document.createElement("link").relList.supports("preload")}catch(b){return!1}},b.poly=function(){for(var b=a.document.getElementsByTagName("link"),c=0;c<b.length;c++){var d=b[c];"preload"===d.rel&&"style"===d.getAttribute("as")&&(a.loadCSS(d.href,d,d.getAttribute("media")),d.rel=null)}},!b.support()){b.poly();var c=a.setInterval(b.poly,300);a.addEventListener&&a.addEventListener("load",function(){b.poly(),a.clearInterval(c)}),a.attachEvent&&a.attachEvent("onload",function(){a.clearInterval(c)})}}}(this);
		</script>

		<!-- Modernizr Custom (JS + SVG detection) -->
		<script type="text/javascript" src="assets/js/vendor_async/modernizr.custom.min.js"></script>

		<!-- jQuery from official WordPress Core -->
		<script type="text/javascript" src="assets/js/vendor_async/jquery.js"></script>

	</head>
	<body class="<?php echo $class; ?>">
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
		<div class="cssloading__overlay"></div>
		<div id="main">
			<ul class="menu-fastaccess">
				<li class="menu-fastaccess__item"><a href="#main__content">Acces direct au contenu</a></li>
				<!-- <li class="menu-fastaccess__item"><a href="#searchform">Acces direct à la recherche</a></li> -->
				<li class="menu-fastaccess__item"><a href="#menu">Acces direct au menu</a></li>
			</ul>
			<div id="js-menu-trigger" class="menu-trigger">
				<button type="button" id="js-menu-open" class="menu-trigger__open">
					<svg class="button__icon icon icon-menu" aria-hidden="true" role="img">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-menu"></use>
					</svg>
					Menu
				</button>
				<button type="button" id="js-menu-close" class="menu-trigger__close">
					<svg class="button__icon icon icon-close" aria-hidden="true" role="img">
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
							<?php if ( $class == 'home' ) :?>
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
									<li class="menu-item"><a href="../livingcss/html/index.html">Living CSS</a></li>
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