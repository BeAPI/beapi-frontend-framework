<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Image;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\get_the_image( 1, [  'data-location' => 'image-size' ] );
 *
 * @param int $image_id Attachment post ID
 *
 * @param array $attributes {
 *    Attributes for the image markup.
 *
 * @type string $src Image attachment URL.
 * @type string $data-location Location of image.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default `attachment-$size_class size-$size_class`,
 *                                 where `$size_class` is the image size being requested.
 * @type string $alt Image description for the alt attribute.
 * @type string $srcset The 'srcset' attribute value.
 * @type string $sizes The 'sizes' attribute value.
 * @type string|false $loading The 'loading' attribute value. Passing a value of false
 *                                 will result in the attribute being omitted for the image.
 *                                 Defaults to 'lazy', depending on wp_lazy_loading_enabled().
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the image markup.
 *
 * @type string $size Optional. The 'sizes' attribute value.
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 * @type boolean $default Optional. If WP image does not exists, display a default image.
 *
 * }
 *
 * @return string Return the markup of the image
 */
function get_the_image( int $image_id, array $attributes, array $settings = [] ): string {
	$attributes = wp_parse_args(
		$attributes,
		[
			'data-location' => '',
			'class'         => '',
		]
	);

	$attributes = apply_filters( 'bea_theme_framework_the_image_attributes', $attributes, $image_id, $settings );

	$settings = wp_parse_args(
		$settings,
		[
			'size'   => 'thumbnail',
			'before' => '',
			'after'  => '',
		]
	);

	$settings     = apply_filters( 'bea_theme_framework_the_image_settings', $settings, $image_id, $attributes );
	$image_markup = \wp_get_attachment_image(
		$image_id,
		$settings['size'],
		false,
		$attributes
	);

	if ( empty( $image_markup ) ) {
		return '';
	}

	$image_markup = apply_filters( 'bea_theme_framework_the_image_markup', $image_markup, $image_id, $attributes, $settings );

	return $settings['before'] . $image_markup . $settings['after'];
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Image\the_image( 1, [  'data-location' => 'image-size' ], ['before'  => '');
 *
 * @param int $image_id Attachment post ID
 *
 * @param array $attributes {
 *    Attributes for the image markup.
 *
 * @type string $src Image attachment URL.
 * @type string $data-location Location of image.
 * @type string $class CSS class name or space-separated list of classes.
 *                                 Default `attachment-$size_class size-$size_class`,
 *                                 where `$size_class` is the image size being requested.
 * @type string $alt Image description for the alt attribute.
 * @type string $srcset The 'srcset' attribute value.
 * @type string $sizes The 'sizes' attribute value.
 * @type string|false $loading The 'loading' attribute value. Passing a value of false
 *                                 will result in the attribute being omitted for the image.
 *                                 Defaults to 'lazy', depending on wp_lazy_loading_enabled().
 * }
 *
 * @param array $settings {
 *    Optional. Settings for the image markup.
 *
 * @type string $size Optional. The 'sizes' attribute value.
 * @type string $before Optional. Markup to prepend to the image. Default empty.
 * @type string $after Optional. Markup to append to the image. Default empty.
 *
 * }
 *
 * @return void Echo of the image markup
 */
function the_image( int $image_id, array $attributes, array $settings = [] ): void {
	echo get_the_image( $image_id, $attributes, $settings );
}
