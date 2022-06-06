<?php
use BEA\Theme\Framework\Helpers\Accessible_Menu_Walker;
?>
<header id="header" class="header" role="banner" aria-label="<?php esc_attr_e( 'Header', 'beapi-frontend-framework' ); ?>">
	<div class="header__inner">
		<div class="container">
			<a class="header__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<strong><?php echo esc_attr( get_bloginfo( 'name' ) ); ?></strong>
				<span class="sr-only"><?php echo esc_attr( get_bloginfo( 'name' ) ); ?></span>
			</a>

			<button class="header__menu-toggle">
				<span aria-hidden="true"></span>
				<span class="sr-only"><?php esc_html_e( 'Open/Close the menu', 'beapi-frontend-framework' ); ?></span>
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
							'walker'         => new Accessible_Menu_Walker(),
						]
					);
					?>
				</div>
			</nav>
		</div>
	</div>
</header>
