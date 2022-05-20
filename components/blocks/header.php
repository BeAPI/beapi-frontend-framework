<header id="header" class="header" role="banner" aria-label="Entête de page">
	<div class="container">
		<a class="header__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<!-- TODO : add logo here -->
			<strong>Un joli logo</strong>
			<span class="sr-only"><?php wp_title(); ?></span>
		</a>

		<button class="header__menu-toggle">
			<span aria-hidden="true"></span>
			<span class="sr-only">Ouvrir/Fermer le menu</span>
		</button>

		<nav id="menu" class="header__menu" aria-label="Main navigation" role="navigation">
			<div>
				<?php
				wp_nav_menu(
					[
						'theme_location' => 'menu-main',
						'container'      => 'none',
						'menu_class'     => 'header__menu-list',
						'fallback_cb'    => false,
						'walker'         => new BEA\Theme\Framework\Helpers\Menu_Walker(),
					]
				);
				?>
			</div>
		</nav>
	</div>
</header>
