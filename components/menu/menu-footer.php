<nav id="nav-footer" class="amenu nav-footer" aria-label="<?php _e( 'Footer navigation' ); ?>" role="navigation">
	<?php
	wp_nav_menu(
		array(
			'theme_location' => 'menu-footer',
			'container'      => '',
			'menu_id'        => 'amenu-footer',
			'menu_class'     => 'amenu__footer',
			'walker'         => new \BEA\Theme\Framework\Services\Accessible_Menu_Walker(),
		)
	);
	?>
</nav>
