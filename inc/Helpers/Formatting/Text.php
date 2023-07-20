<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Text;

use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Text\the_text( 'text' => 'Lorem ipsum', [ 'before' => '<p>', 'after' => '</p>' ] );
 *
 * @param string $value Text to display
 * @param array $settings {
 *   Optional. Settings for the text markup.
 *
 * @type string $before Optional. Markup to prepend to the text. Default empty.
 * @type string $after Optional. Markup to prepend to the text. Default empty.
 * @type string $escape Optional. Markup to prepend to the item. Default esc_html.
 *
 * }
 *
 * @return void
 */
function the_text( string $value, array $settings = [] ): void {
	echo get_the_text( $value, $settings ); // phpcs:ignore
}

/**
 * Get the text
 * @usage BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text( 'Lorem ipsum', [ 'before' => '<p>', 'after' => '</p>' ] );
 *
 * @param string $value Text to display
 * @param array $settings {
 *   Optional. Settings for the text markup.
 *
 * @type string $before Optional. Markup to prepend to the text. Default empty.
 * @type string $after Optional. Markup to prepend to the text. Default empty.
 * @type string $escape Optional. Markup to prepend to the item. Default esc_html.
 *
 * }
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

	$settings = apply_filters( 'bea_theme_framework_text_settings', $settings, $value );
	$value    = apply_filters( 'bea_theme_framework_text_value', escape_content_value( $value, $settings['escape'] ), $settings );

	return $settings['before'] . $value . $settings['after'];
}
