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

			if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('screen').matches) {
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
	<?php
	get_template_part( 'components/parts/common/skip-links' );
	get_template_part( 'components/parts/common/header' );
	?>
	<main id="content" role="main" tabindex="-1" aria-label="<?php esc_attr_e( 'Main content', 'beapi-frontend-framework' ); ?>">
