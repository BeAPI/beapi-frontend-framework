<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
	<script type="text/javascript">
		//<![CDATA[
		(function(){
			var c = document.documentElement.className;
			c = c.replace(/no-js/, 'js');
			document.documentElement.className = c;
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
	<ul class="skip-links skip-links--hidden" aria-label="Liens d'évitement">
		<li>
			<a href="#content">Contenu principal</a>
		</li>
		<li>
			<a href="#footer">Pied de page</a>
		</li>
	</ul>

	<header id="header" class="header" role="banner" aria-label="Entête de page">
		<div class="container">
			<a class="header__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<!-- TODO : add logo here -->
				<span class="sr-only"><?php wp_title(); ?></span>
			</a>

			<button class="header__menu-toggle">
				<span aria-hidden="true"></span>
				<span class="sr-only">Ouvrir/Fermer le menu</span>
			</button>

			<nav id="menu" class="header__menu" aria-label="Main navigation" role="navigation">
				<div>
					<a class="header__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<?php
						if ( ! empty( $field_logo_white ) ) :
							the_image( $field_logo_white, [] );
						endif;
						?>
						<span class="sr-only"><?php wp_title(); ?></span>
					</a>
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

	<main id="content" role="main" tabindex="-1" aria-label="Zone de contenus">
<?php
	wp_body_open();
