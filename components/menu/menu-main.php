<nav id="nav-primary" class="amenu nav-primary" aria-label="<?php _e('Main navigation','mosne');?>" role="navigation">
	<button class="amenu__toggle accessible-megamenu-toggle">
		<span class="visuallyhidden">Menu</span>
		<?php m_icon( 'menu' ); ?>
		<?php m_icon( 'close' ); ?>
	</button>
<?php
wp_nav_menu(
	array(
		'theme_location'  => 'primary',
		'container'       => '',
		'menu_id'         => 'amenu-main',
		'menu_class'      => 'amenu__main',
		'walker'          => new \BEA\Theme\Framework\Services\Accessible_Menu_Walker(),
	)
);
?>
</nav>
