<?php
/**
 * Version 3.0.2
 *
 */

/**
 * Allow to test if post have thumbnail or not.
 *
 * @param boolean $return_value
 *
 * @return boolean
 */
function has_post_thumbnail( $return_value = true ) {
	return $return_value;
}

/**
 * Get random image from src/samples folder, emulate WP function with image location context
 *
 * @global $bea_image
 *
 * @param integer $post_id
 * @param string $size_or_img_name
 * @param array $attr
 *
 * @return string
 */
function get_the_post_thumbnail( $post_id = 0, $size_or_img_name = 'thumbnail', $attr = array() ) {
	if ( ! isset( $attr['data-location'] ) ) {
		return 'No location filled in';
	}

	/**
	 * @var $locations \ARI\Image_Locations
	 */
	$locations      = \ARI\Image_Locations::get_instance();
	$location_array = $locations->get_location( $attr['data-location'] );
	if ( empty( $location_array ) ) {
		return 'No location found in source file';
	}

	/**
	 * @var $mode \ARI\Modes
	 */
	$mode = \ARI\Modes::get_instance();
	try {
		$_mode_instance = $mode->get_mode( $attr );
		if ( false === $_mode_instance ) {
			return 'No mode found';
		}

		$_mode_instance->set_attachment_id( $post_id );
		$_mode_instance->set_img_name( $size_or_img_name );
		$_mode_instance->render_image();
	} catch ( \Exception $e ) {
		$args['data-location'] = $e->getMessage();
	}
}