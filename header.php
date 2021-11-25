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

	<header id="header" class="header" role="banner" aria-label="Entête de page"></header>

	<main id="content" role="main" tabindex="-1" aria-label="Zone de contenus">
<?php
	wp_body_open();
