<?php
/**
 * Sets the post excerpt length to 40 characters.
 *
 * To override this length in a child theme, remove the filter and add your own
 * function tied to the excerpt_length filter hook.
 *
 *
 * @return int
 */
function beapi_base_theme_excerpt_length( $length ) {
	return 40;
}
add_filter( 'excerpt_length', 'beapi_base_theme_excerpt_length' );

/**
 * Returns a "Continue Reading" link for excerpts
 *
 *
 * @return string "Continue Reading" link
 */
function beapi_base_theme_continue_reading_link() {
	return ' <a href="'. get_permalink() . '">' . __( 'Continue reading <span class="meta-nav">&rarr;</span>', 'beapi-base-theme' ) . '</a>';
}

/**
 * Replaces "[...]" (appended to automatically generated excerpts) with an ellipsis and beapi_base_theme_continue_reading_link().
 *
 * To override this in a child theme, remove the filter and add your own
 * function tied to the excerpt_more filter hook.
 *
 *
 * @return string An ellipsis
 */
function beapi_base_theme_auto_excerpt_more( $more ) {
	return ' &hellip;' . beapi_base_theme_continue_reading_link();
}
add_filter( 'excerpt_more', 'beapi_base_theme_auto_excerpt_more' );

/**
 * Adds a pretty "Continue Reading" link to custom post excerpts.
 *
 * To override this link in a child theme, remove the filter and add your own
 * function tied to the get_the_excerpt filter hook.
 *
 *
 * @return string Excerpt with a pretty "Continue Reading" link
 */
function beapi_base_theme_custom_excerpt_more( $output ) {
	if ( has_excerpt() && ! is_attachment() ) {
		$output .= beapi_base_theme_continue_reading_link();
	}
	return $output;
}
add_filter( 'get_the_excerpt', 'beapi_base_theme_custom_excerpt_more' );