<?php

namespace BEA\Theme\Framework\Helpers\Formatting\Image;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\get_the_image( 1, [  'data-location' => 'image-size' ] );
 *
 * @param int $image_id
 * @param array $attributes
 * @param array $settings
 *
 * @return string
 */
function get_the_image( int $image_id, array $attributes, array $settings = [] ): string {
	if ( $image_id <= 0 ) {
		return '';
	}

	$attributes = wp_parse_args(
		$attributes,
		[
			'data-location' => '',
			'class'         => '',
		]
	);

	$attributes = apply_filters( 'bea_theme_framework_the_image_attributes', $attributes );

	$settings = wp_parse_args(
		$settings,
		[
			'before' => '',
			'after'  => '',
		]
	);

	$settings = apply_filters( 'bea_theme_framework__the_image_settings', $settings );

	$image_markup = \wp_get_attachment_image(
		$image_id,
		'thumbnail',
		false,
		$attributes
	);

	$image_markup = apply_filters( 'bea_theme_framework_the_image_markup', $image_markup );

	// phpcs:ignore
	return sprintf( '%s%s%s', $settings['before'], $image_markup, $settings['after'] );
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\the_image( 1, [  'data-location' => 'image-size' ] );
 *
 * @param int $image_id
 * @param array $attributes
 * @param array $settings
 *
 * @return void
 */
function the_image( int $image_id, array $attributes, array $settings = [] ): void {
	echo get_the_image( $image_id, $attributes, $settings ); // phpcs:ignore
}
