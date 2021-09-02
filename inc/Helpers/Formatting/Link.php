<?php

namespace BEA\Theme\Framework\Helpers\Formatting\Link;

use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_attribute_value;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\get_custom_link( ['field' => ..., 'class' => ...], [ 'before' => '<p>%s', 'after' => '</p>' ] );
 *
 * @param array $attributes
 * @param array $settings
 *
 * @return string
 */
function get_acf_link( array $attributes, array $settings = [] ): string {
	if ( empty( $attributes['field']['url'] ) || empty( $attributes['field']['title'] ) ) {
		return '';
	}

	$attributes = wp_parse_args(
		$attributes,
		[
			'href'  => $attributes['field']['url'],
			'title' => $attributes['field']['title'],
		],
	);

	// Set rel attribute if target is _blank
	$target = $attributes['field']['target'];
	if ( '_blank' === $target ) {
		$attributes['target'] = $target;
		$attributes['rel']    = 'noopener';
	}

	// Unset unused field params
	unset( $attributes['field'] );

	$attributes = apply_filters( 'bea_theme_framework_acf_link_attribute', $attributes );

	$settings = wp_parse_args(
		$settings,
		[
			'content' => $attributes['title'],
			'before'  => '',
			'after'   => '',
			'escape'  => [
				'href' => 'esc_url',
			],
		],
	);

	$settings = apply_filters( 'bea_theme_framework_acf_link_settings', $settings );

	return get_custom_link( $attributes, $settings );
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\the_custom_link( ['url' => ..., 'title' => ...], [ 'wrapper' => '<p></p>' ] );
 *
 * @param array $attributes
 * @param array $settings
 *
 * @return void
 */
function the_acf_link( array $attributes, array $settings = [] ): void {
	echo get_acf_link( $attributes, $settings ); //phpcs:ignore
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\get_custom_link( ['href' => ..., 'title' => ...], [ 'wrapper' => '<p>%s</p>' ] );
 *
 * @param array $attributes
 * @param array $settings
 *
 * @return string
 */
function get_custom_link( array $attributes, array $settings = [] ): string {
	if ( empty( $attributes['href'] ) ) {
		return '';
	}

	$attributes = wp_parse_args(
		$attributes,
		[
			'title' => '',
		],
	);

	// Set rel attribute if target is _blank
	$target = $attributes['target'];
	if ( '_blank' === $target ) {
		$attributes['target'] = $target;
		$attributes['rel']    = 'noopener';
	}

	$attributes = apply_filters( 'bea_theme_framework_custom_link_attributes', $attributes );

	$settings = wp_parse_args(
		$settings,
		[
			'before' => '',
			'after'  => '',
			'escape' => [
				'href' => 'esc_url',
			],
		],
	);

	$settings = apply_filters( 'bea_theme_framework_custom_link_settings', $settings );

	/**************************************** START MARKUP LINK ****************************************/

	$attributes_escape = [];

	foreach ( $attributes as $name => $value ) {

		$escape_option       = $settings['escape'][ $name ] ?? 'esc_attr';
		$value               = escape_attribute_value( $value, $escape_option );
		$attributes_escape[] = null === $value ? sprintf( '%s', $name ) : sprintf( '%s="%s"', $name, $value );
	}

	$escape_content = $settings['escape']['content'] ?? '';
	$link_markup    = sprintf( '<a %s>%s</a>', implode( ' ', $attributes_escape ), escape_content_value( $settings['content'], $escape_content ) );

	/**************************************** END MARKUP LINK ****************************************/

	$link_markup = apply_filters( 'bea_theme_framework_acf_link_markup', $link_markup );

	return sprintf( '%s%s%s', $settings['before'], $link_markup, $settings['after'] );
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Link\the_custom_link( ['url' => ..., 'title' => ...], [ 'wrapper' => '<p></p>' ] );
 *
 * @param array $attributes
 * @param array $settings
 *
 * @return void
 */
function the_custom_link( array $attributes, array $settings = [] ): void {
	echo get_custom_link( $attributes, $settings ); //phpcs:ignore
}
