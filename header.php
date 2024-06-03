<?php
use BEA\Theme\Framework\Helpers\Custom_Menu_Walker;
?>
<!DOCTYPE html>
<html class="no-js no-js-animation" <?php language_attributes(); ?>>
<head>
	<script type="text/javascript">
		//<![CDATA[
		(function(){
			function replaceHtmlClass(regexp, str) {
				var h = document.documentElement;
				h.className = h.className.replace(regexp, str);
			}

			replaceHtmlClass(/no-js/, 'js');

			if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				replaceHtmlClass(/no-js-animation/, 'js-animation');
			}
		})();
		//]]>
	</script>

	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta http-equiv="x-ua-compatible" content="ie=edge">

	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>
	<nav class="skip-links skip-links--hidden" role="navigation" aria-label="<?php esc_attr_e( 'Fast access links', 'beapi-frontend-framework' ); ?>">
		<ul>
			<li>
				<a href="#menu"><?php esc_html_e( 'Main navigation menu', 'beapi-frontend-framework' ); ?></a>
			</li>
			<li>
				<a href="#content"><?php esc_html_e( 'Main content', 'beapi-frontend-framework' ); ?></a>
			</li>
			<li>
				<a href="#footer"><?php esc_html_e( 'Footer', 'beapi-frontend-framework' ); ?></a>
			</li>
		</ul>
	</nav>
	<header id="header" class="header" role="banner" aria-label="<?php esc_attr_e( 'Header', 'beapi-frontend-framework' ); ?>">
		<div class="header__inner">
			<div class="container">
				<a class="header__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<strong><?php echo esc_html( get_bloginfo( 'name' ) ); ?></strong>
					<span class="sr-only"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></span>
				</a>
				<?php if ( has_nav_menu( 'menu-main' ) ) : ?>
					<button class="header__menu-toggle" aria-expanded="false" aria-controls="menu">
						<span></span>
						<span class="sr-only aria-expanded-false-text"><?php esc_html_e( 'Open the menu', 'beapi-frontend-framework' ); ?></span>
						<span class="sr-only aria-expanded-true-text"><?php esc_html_e( 'Close the menu', 'beapi-frontend-framework' ); ?></span>
					</button>

					<nav id="menu" class="header__menu" aria-label="<?php esc_attr_e( 'Main navigation', 'beapi-frontend-framework' ); ?>" role="navigation">
						<div>
							<?php
							wp_nav_menu(
								[
									'theme_location' => 'menu-main',
									'container'      => 'none',
									'menu_class'     => 'header__menu-list',
									'fallback_cb'    => false,
									'walker'         => new Custom_Menu_Walker(),
								]
							);
							?>
						</div>
					</nav>
				<?php endif; ?>
			</div>
		</div>
	</header>
	<main id="content" role="main" tabindex="-1" aria-label="<?php esc_attr_e( 'Main content', 'beapi-frontend-framework' ); ?>">
	<?php
	if ( ! is_front_page() && ! is_search() && ! is_404() ) {
		get_template_part( 'components/parts/common/breadcrumb' );
	}
