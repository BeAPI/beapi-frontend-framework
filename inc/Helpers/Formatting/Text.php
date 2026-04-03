<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Text;

use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Text\the_text( $text, [ 'before' => '<p>', 'after' => '</p>' ] );
 * @usage BEA\Theme\Framework\Helpers\Formatting\Text\the_text( $text, [ 'has_textarea' => true, 'before' => '<div>', 'after' => '</div>' ] );
 *
 * @param string $value Text to display
 * @param array $settings {
 *   Optional. Settings for the text markup.
 *
 * @type string  $before Optional. Markup to prepend to the text. Default empty.
 * @type string  $after Optional. Markup to append after the text. Default empty.
 * @type string  $escape Optional. Escape callback name (e.g. esc_html, wp_kses_post). Default esc_html.
 * @type bool    $has_textarea Optional. When true, uses wp_kses_post if escape is still the default esc_html, then wpautop(). Default false.
 *
 * }
 *
 * @return void
 */
function the_text( string $value, array $settings = [] ): void {
	echo get_the_text( $value, $settings );
}

/**
 * Get the text
 * @usage BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text( 'Lorem ipsum', [ 'before' => '<p>', 'after' => '</p>' ] );
 *
 * @param string $value Text to display
 * @param array $settings {
 *   Optional. Settings for the text markup.
 *
 * @type string  $before Optional. Markup to prepend to the text. Default empty.
 * @type string  $after Optional. Markup to append after the text. Default empty.
 * @type string  $escape Optional. Escape callback name (e.g. esc_html, wp_kses_post). Default esc_html.
 * @type bool    $has_textarea Optional. When true, uses wp_kses_post if escape is still the default esc_html, then wpautop(). Default false.
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
			'before'       => '',
			'after'        => '',
			'escape'       => 'esc_html',
			'has_textarea' => false,
		]
	);

	$settings = apply_filters( 'bea_theme_framework_text_settings', $settings, $value );

	if ( ! empty( $settings['has_textarea'] ) && 'esc_html' === $settings['escape'] ) {
		$settings['escape'] = 'wp_kses_post';
	}

	$value = escape_content_value( $value, $settings['escape'] );

	if ( ! empty( $settings['has_textarea'] ) ) {
		$value = wpautop( $value );
	}

	$value = apply_filters( 'bea_theme_framework_text_value', $value, $settings );

	return $settings['before'] . $value . $settings['after'];
}
