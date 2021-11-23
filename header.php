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
	<ul class="fast-access fast-access--hidden" aria-label="<?php echo esc_attr( 'Fast access navigation' ); ?>">
		<li>
			<a href="#searchform"><?php echo esc_html( 'Searchform' ); ?></a>
		</li>
		<li>
			<a href="#content"><?php echo esc_html( 'Main content' ); ?></a>
		</li>
		<li>
			<a href="#footer"><?php echo esc_html( 'Footer' ); ?></a>
		</li>
	</ul>
<?php
	wp_body_open();
