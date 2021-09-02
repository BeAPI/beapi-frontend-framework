<?php

namespace BEA\Theme\Framework\Helpers\Formatting\Text;

use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Text\the_text( 'text' => 'Lorem ipsum', 'esc' => 'html', [ 'before' => '<p>', 'after' => '</p>' ] );
 *
 * @param string $value
 * @param array $settings
 *
 * @return void
 */
function the_text( string $value, array $settings = [] ): void {
	echo get_the_text( $value, $settings ); //phpcs:ignore
}

/**
 * Get the text
 * @usage BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text( 'Lorem ipsum', [ 'before' => '<p>', 'after' => '</p>' ] );
 *
 * @param string $value
 * @param array $settings
 *
 * @return string
 */
function get_the_text( string $value, array $settings = [] ): string {
	if ( empty( $value ) ) {
		return '';
	}

	$settings = wp_parse_args(
		$settings,
		[
			'before' => '',
			'after'  => '',
			'escape' => 'esc_html',
		]
	);

	$settings = apply_filters( 'bea_theme_framework_get_text_settings', $settings );
	$value    = apply_filters( 'bea_theme_framework_the_text', escape_content_value( $value, $settings['escape'] ) );

	// phpcs:ignore
	return sprintf( '%s%s%s', $settings['before'], $value, $settings['after'] );
}

