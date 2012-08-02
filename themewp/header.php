<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *

 * @subpackage BeAPI_Base_Theme
 *
 */
?><!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="fr"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7 modern-ie" lang="fr"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8 modern-ie" lang="fr"> <![endif]-->
<!--[if IE 9 ]> <html class="no-js ie9" lang="fr"> <![endif]-->
<!--[if !(IE)]><!-->
<html class="no-js" <?php language_attributes(); ?>><!--<![endif]-->
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
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'stylesheet_url' ); ?>" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
	
	<link rel="shortcut icon" href="<?php bloginfo( 'stylesheet_directory' ); ?>/images/favicon.ico" />
	<link rel="apple-touch-icon" href="<?php bloginfo( 'stylesheet_directory' ); ?>/images/apple-touch-icon.png" />
	
	<?php
	// Enqueue jQuery CDN
	wp_deregister_script('jquery');
	wp_enqueue_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js', array(), '1.7.x', false );
	
	/* We add some JavaScript to pages with the comment form
	 * to support sites with threaded comments (when in use).
	 */
	if ( is_singular() && get_option( 'thread_comments' ) )
		wp_enqueue_script( 'comment-reply' );
	
	/* Always have wp_head() just before the closing </head>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to add elements to <head> such
	 * as styles, scripts, and meta tags.
	 */
	wp_head();
	?>
</head>

<body <?php body_class(); ?>>
<div id="wrapper" class="hfeed">
	<div id="header">
		<div id="masthead">
			<div id="branding" role="banner">
				<?php $heading_tag = ( is_home() || is_front_page() ) ? 'h1' : 'div'; ?>
				<<?php echo $heading_tag; ?> id="site-title">
					<span>
						<a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
					</span>
				</<?php echo $heading_tag; ?>>
				<div id="site-description"><?php bloginfo( 'description' ); ?></div>
			</div><!-- #branding -->

			<div id="access" role="navigation">
			  <?php /* Allow screen readers / text browsers to skip the navigation menu and get right to the good stuff */ ?>
				<div class="skip-link screen-reader-text"><a href="#content" title="<?php esc_attr_e( 'Skip to content', 'beapi-base-theme' ); ?>"><?php _e( 'Skip to content', 'beapi-base-theme' ); ?></a></div>
				<?php /* Our navigation menu. If one isn't filled out, wp_nav_menu falls back to wp_page_menu. The menu assiged to the primary position is the one used. If none is assigned, the menu with the lowest ID is used. */ ?>
				<?php wp_nav_menu( array( 'container_class' => 'menu-header', 'theme_location' => 'primary' ) ); ?>
			</div><!-- #access -->
		</div><!-- #masthead -->
	</div><!-- #header -->

	<div id="main">
