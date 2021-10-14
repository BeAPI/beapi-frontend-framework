<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Term;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_name( 0, 'news-type' );
 *
 * @param int $post_id Post ID
 * @param string $taxonomy Taxonomy name
 *
 * @return array Return an array with the terms name
 */
function get_terms_name( int $post_id, string $taxonomy ): array {
	if ( empty( $post_id ) || empty( $taxonomy ) ) {
		return [];
	}

	$terms = get_the_terms( $post_id, $taxonomy );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return [];
	}

	return wp_list_pluck( $terms, 'name' );
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_list( ['post_id' => 0,'taxonomy' => 'news-type'],['items'  => '<span>%s</span>', 'separator' => ' ', 'wrapper' => '<p>%s</p>'] );
 *
 * @param array $attributes {
 *   Attributes for generating the list of terms
 *
 * @type int $post_id ID of the post
 * @type string $taxonomy Name of the taxonomy
 *
 * }
 * @param array $settings {
 *   Optional. Settings for the terms list markup.
 *
 * @type string $before Optional. Markup to prepend to the wrapper of the item. Default <ul>.
 * @type string $after Optional. Markup to prepend to the wrapper of the item. Default </ul>.
 * @type string $before_item Optional. Markup to prepend to the item. Default <li>.
 * @type string $after_item Optional. Markup to prepend to the item. Default </li>.
 * @type string $separator Optional. Markup to prepend to the image. Default empty.
 *
 * }
 *
 * @return string
 */
function get_terms_list( array $attributes, array $settings = [] ): string {
	if ( empty( $attributes['post_id'] ) || empty( $attributes['taxonomy'] ) ) {
		return '';
	}

	$attributes = apply_filters( 'bea_theme_framework_term_list_attributes', $attributes, $settings );
	$terms      = get_terms_name( $attributes['post_id'], $attributes['taxonomy'] );

	if ( empty( $terms ) ) {
		return '';
	}

	$settings = wp_parse_args(
		$settings,
		[
			'before'      => '<ul>',
			'after'       => '</ul>',
			'before_item' => '<li>',
			'after_item'  => '</li>',
			'separator'   => '',
		]
	);

	$settings = apply_filters( 'bea_theme_framework_term_list_settings', $settings, $attributes );

	$items = [];
	foreach ( $terms as $term ) {
		$value = escape_content_value( $term );
		if ( empty( $value ) ) {
			continue;
		}

		$items[] = $settings['before_item'] . $value . $settings['after_item'];
	}

	if ( empty( $items ) ) {
		return '';
	}

	return $settings['before'] . implode( $settings['separator'], $items ) . $settings['after'];
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Term\the_terms_list( ['post_id' => 0,'taxonomy' => 'news-type'],['items'  => '<span>%s</span>', 'separator' => ' ', 'wrapper' => '<p>%s</p>'] );
 *
 * @param array $attributes {
 *   Attributes for generating the list of terms
 *
 * @type int $post_id ID of the post
 * @type string $taxonomy Name of the taxonomy
 *
 * }
 * @param array $settings {
 *   Optional. Settings for the terms list markup.
 *
 * @type string $before Optional. Markup to prepend to the wrapper of the item. Default <ul>.
 * @type string $after Optional. Markup to prepend to the wrapper of the item. Default </ul>.
 * @type string $before_item Optional. Markup to prepend to the item. Default <li>.
 * @type string $after_item Optional. Markup to prepend to the item. Default </li>.
 * @type string $separator Optional. Markup to prepend to the image. Default empty.
 *
 * }
 */
function the_terms_list( array $attributes, array $settings = [] ): void {
	echo get_terms_list( $attributes, $settings );
}
