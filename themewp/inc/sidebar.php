<?php
/**
 * Register widgetized areas, including two sidebars and four widget-ready columns in the footer.
 *
 * To override beapi_base_theme_widgets_init() in a child theme, remove the action hook and add your own
 * function tied to the init hook.
 *
 *
 * @uses register_sidebar
 */
function beapi_base_theme_widgets_init() {
	// Area 1, located at the top of the sidebar.
	register_sidebar( array(
		'name' => __( 'Primary Widget Area', 'beapi-base-theme' ),
		'id' => 'primary-widget-area',
		'description' => __( 'The primary widget area', 'beapi-base-theme' ),
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 2, located below the Primary Widget Area in the sidebar. Empty by default.
	register_sidebar( array(
		'name' => __( 'Secondary Widget Area', 'beapi-base-theme' ),
		'id' => 'secondary-widget-area',
		'description' => __( 'The secondary widget area', 'beapi-base-theme' ),
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 3, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'First Footer Widget Area', 'beapi-base-theme' ),
		'id' => 'first-footer-widget-area',
		'description' => __( 'The first footer widget area', 'beapi-base-theme' ),
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 4, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'Second Footer Widget Area', 'beapi-base-theme' ),
		'id' => 'second-footer-widget-area',
		'description' => __( 'The second footer widget area', 'beapi-base-theme' ),
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 5, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'Third Footer Widget Area', 'beapi-base-theme' ),
		'id' => 'third-footer-widget-area',
		'description' => __( 'The third footer widget area', 'beapi-base-theme' ),
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 6, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'Fourth Footer Widget Area', 'beapi-base-theme' ),
		'id' => 'fourth-footer-widget-area',
		'description' => __( 'The fourth footer widget area', 'beapi-base-theme' ),
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
}
/** Register sidebars by running beapi_base_theme_widgets_init() on the widgets_init hook. */
add_action( 'widgets_init', 'beapi_base_theme_widgets_init' );