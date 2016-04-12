<?php
/**
 * Version 2.1.0
 *
 * Implement default_img and img_base size
 * Implement lazysize
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
 * Get random image from assets/samples folder, emulate WP function with image location context
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
	global $bea_image;

	// Test if data-location attribute exists ?
	if ( ! isset( $attr['data-location'] ) ) {
		return 'missing data location';
	}

	// Check if location existant on JSON array
	$location_array = $bea_image::get_location( $attr['data-location'] );
	if ( empty( $location_array ) ) {
		return 'data location not found';
	}

	$location_array = array_shift( $location_array );
	if ( ! isset( $location_array->srcsets ) || empty( $location_array->srcsets ) ) {
		return 'No srcsets found or not V2 JSON';
	}
	// Build SRCset attributes (each sizes for location)
	$srcset_attrs = array();
	foreach ( $location_array->srcsets as $location ) {
		if ( ! isset( $location->size ) || empty( $location->size ) ) {
			continue;
		}

		$image_size = $bea_image::get_image_size( $location->size );
		if ( empty( $image_size ) ) {
			continue;
		}

		$img = get_attachment_image_src( $size_or_img_name, $image_size );
		if ( empty( $img ) ) {
			continue;
		}

		// add lazyload on all medias
		if ( defined( 'BEA_LAZYSIZE' ) && true === BEA_LAZYSIZE ) {
			$attr['class'] = $attr['class'] . ' lazyload';
		}

		if ( isset( $location->class ) && ! empty( $location->class ) ) {
			$attr['class'] = $attr['class'] . ' ' . $location->class;
		}

		$srcset_attrs[] = $img . ' ' . $location->srcset;
	}

	if ( ! empty( $srcset_attrs ) && defined( 'BEA_LAZYSIZE' ) ) {
		if ( false === BEA_LAZYSIZE ) {
			$attr['srcset'] = implode( ', ', $srcset_attrs );
		} else {
			$attr['data-srcset'] = implode( ', ', $srcset_attrs );
		}
	}

	//Get img_base size for base SRC
	if( isset( $location_array->img_base ) && !empty( isset( $location_array->img_base ) )  ){
		$_size = $bea_image::get_image_size( $location_array->img_base );
		if ( !empty( $_size ) ) {
			$image_size = $_size;
		}
	}

	$is_img = is_size_or_img( $size_or_img_name );
	if ( $is_img === true ) {
		$src = get_file( BEA_IMG_SAMPLE_DIR . $size_or_img_name, $image_size );
	} else {
		$img_url = get_random_sample_img_url( $size_or_img_name );
		$src     = get_timthumb_url( $img_url, $image_size );
	}

	// Merge with default
	$attr = array_merge( $attr, array( 'src' => 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' ) );

	// Write HTML
	$html = rtrim( "<img" );
	foreach ( $attr as $name => $value ) {
		$html .= " $name=" . '"' . $value . '"';
	}
	$html .= ' />';

	return $html;
}

/**
 * Emulate get_attachment_image_src for HTML context
 *
 * @param string $size_or_img_name
 * @param string $image_size
 *
 * @return string
 */
function get_attachment_image_src( $size_or_img_name = 'thumbnail', $image_size = '' ) {
	$is_img = is_size_or_img( $size_or_img_name );
	if ( $is_img === true ) {
		return get_file( BEA_IMG_SAMPLE_DIR . $size_or_img_name, $image_size );
	}

	$img_url = get_random_sample_img_url( $size_or_img_name );

	return get_timthumb_url( $img_url, $image_size );
}

/*
 * Get random sample img url
 * @author Alexandre Sadowski
 */
function get_random_sample_img_url( $img_prefix = 'thumbnail' ) {
	if ( strrpos( $img_prefix, '-' ) !== false ) {
		$matches = glob( BEA_IMG_SAMPLE_DIR . $img_prefix . '{*.gif,*.jpg,*.png}', GLOB_BRACE );
	} else {
		$matches = glob( BEA_IMG_SAMPLE_DIR . '{*.gif,*.jpg,*.png}', GLOB_BRACE );
	}
	if ( empty( $matches ) ) {
		return false;
	}

	$rand_img = array_rand( $matches, 1 );

	$img_path = $matches[ $rand_img ];

	return str_replace( BEA_IMG_SAMPLE_DIR, BEA_IMG_SAMPLE_URL, $img_path );
}

/*
 * Check if is a img name or a size
 * 
 * @return bool true|false
 * @author Alexandre Sadowski
 */
function is_size_or_img( $size_or_img_name = 'thumbnail' ) {
	global $bea_image;
	if ( $size_or_img_name == 'thumbnail' ) {
		return false;
	}

	foreach ( $bea_image::$allowed_ext as $ext ) {
		if ( is_file( BEA_IMG_SAMPLE_DIR . $size_or_img_name . $ext ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Build Timthumb URL
 *
 * @param string $path_img
 * @param BEA_Images|null $image_size
 *
 * @return string
 */
function get_timthumb_url( $path_img, $image_size = null ) {
	if ( ! empty( $image_size ) ) {
		return get_full_url( $_SERVER, true ) . 'functions/vendor/timthumb.php?src=' . $path_img . '&h=' . $image_size->height . '&w=' . $image_size->width . '&zc=' . (int) $image_size->crop;
	} else {
		return get_full_url( $_SERVER, true ) . 'functions/vendor/timthumb.php?src=' . $path_img;
	}
}

function get_file( $path = '', $image_size = '' ) {
	global $bea_image;
	foreach ( $bea_image::$allowed_ext as $ext ) {
		if ( is_file( $path . $ext ) ) {
			return get_timthumb_url( $path . $ext, $image_size );
		}
	}
}