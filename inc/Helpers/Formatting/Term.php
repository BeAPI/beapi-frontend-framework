<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Term;

use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;
/**
 * @usage Fncuma\Theme\FncumaUas\Helpers\Formatting\Term\get_terms_name( $terms );
 *
 * @param \WP_Term[] $terms list of terms
 *
 * @return array Return an array with the terms name
 */
function get_terms_name( array $terms ): array {
	return wp_list_pluck( $terms, 'name' );
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_list( $terms ,['items'  => '<span>%s</span>', 'separator' => ' ', 'wrapper' => '<p>%s</p>'] );
 *
 * @param \WP_Term[] $terms list of terms
 *
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
function get_terms_list( array $terms , array $settings = [] ): string {
	$attributes = apply_filters( 'bea_theme_framework_term_list_attributes', $terms, $settings );
	$terms      = get_terms_name( $terms );

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
		$value = escape_content_value( $term, 'esc_html' );
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
 * @usage BEA\Theme\Framework\Helpers\Formatting\Term\the_terms_list( $terms ,['items'  => '<span>%s</span>', 'separator' => ' ', 'wrapper' => '<p>%s</p>'] );
 *
 * @param \WP_Term[] $terms list of terms
 *
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
function the_terms_list( array $terms, array $settings = [] ): void {
	echo get_terms_list( $terms, $settings );
}
