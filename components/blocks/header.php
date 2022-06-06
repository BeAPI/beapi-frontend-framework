<?php
use BEA\Theme\Framework\Helpers\Accessible_Menu_Walker;
?>
<header id="header" class="header" role="banner" aria-label="Entête de page">
	<div class="header__inner">
		<div class="container">
			<a class="header__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<!-- TODO : add logo here -->
				<strong>Logo</strong>
				<span class="sr-only"><?php wp_title(); ?></span>
			</a>

			<button class="header__menu-toggle">
				<span aria-hidden="true"></span>
				<span class="sr-only"><?php _e( 'Open/Close the menu', 'beapi-frontend-framework' ); ?></span>
			</button>

			<nav id="menu" class="header__menu" aria-label="<?php _e( 'Main navigation', 'beapi-frontend-framework' ); ?>" role="navigation">
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
