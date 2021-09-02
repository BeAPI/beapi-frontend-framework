<?php

namespace BEA\Theme\Framework\Helpers\Formatting\Term;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Term\get_terms_array( 0, 'news-type' );
 *
 * @param int $post_id
 * @param string $taxonomy
 *
 * @return array
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
 * @param array $attributes
 * @param array $settings
 *
 * @return string
 */
function get_terms_list( array $attributes, array $settings = [] ): string {
	if ( empty( $attributes['post_id'] ) || empty( $attributes['taxonomy'] ) ) {
		return '';
	}

	$attributes = apply_filters( 'bea_theme_framework_term_list_attributes', $attributes );
	$terms      = get_terms_name( $attributes['post_id'], $attributes['taxonomy'] );

	if ( empty( $terms ) ) {
		return '';
	}

	$terms_str    = '';
	$terms_count  = count( $terms );
	$terms_length = 0;

	$settings = wp_parse_args(
		$settings,
		[
			'items'     => '<li>%s</li>',
			'wrapper'   => '<ul>%s</ul>',
			'separator' => '',
		]
	);

	$settings = apply_filters( 'bea_theme_framework_term_list_settings', $settings );

	if ( empty( $settings['terms_length'] ) || $settings['terms_length'] >= $terms_count ) {
		$terms_length = $terms_count;
	}

	if ( empty( $settings['wrapper'] ) ) {
		$settings['items'] = '%s';
	}

	foreach ( $terms as $key => $term ) {
		$terms_str .= sprintf( $settings['items'], esc_html( $term ) );
		if ( ( $key + 1 ) < $terms_length ) {
			$terms_str .= $settings['separator'];
		}
	}

	if ( ! empty( $settings['wrapper'] ) ) {
		$terms_str = sprintf( $settings['wrapper'], $terms_str );
	}

	return $terms_str;
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Term\the_terms_list( ['post_id' => 0,'taxonomy' => 'news-type'],['items'  => '<span>%s</span>', 'separator' => ' ', 'wrapper' => '<p>%s</p>'] );
 *
 * @param array $attributes
 * @param array $settings
 */
function the_terms_list( array $attributes, array $settings = [] ): void {
	echo get_terms_list( $attributes, $settings ); //phpcs:ignore
}
