<!DOCTYPE html>
<!--[if lte IE 9 ]> <html class="no-js ie lte-ie9 ie9" <?php language_attributes( ); ?>> <![endif]-->
<!--[if !(IE)]><! -->
<html class="fonts-loading no-js" <?php language_attributes( ); ?>>
<!--<![endif]-->
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
    <meta name="viewport" content="initial-scale=1.0" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
	<!--[if lte IE 9]>
		<div class="message message__browserhappy">
			<p>
			You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/" target="_blank">upgrade your browser</a> to improve your experience.
			</p>
			<p>
			<button><span class="button-icon icon-close"></span>&nbsp;Close</button>
			</p>
		</div>
	<![endif]-->
	<div class="cssloading__overlay"></div>