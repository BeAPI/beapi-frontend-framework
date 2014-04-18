<?php
/**
 * Allow to test if post have thumbnail or not.
 * 
 * @param boolean $return_value
 * @return boolean
 */
function has_post_thumbnail( $return_value = true ) {
	return $return_value;
}

/**
 * Get random image from assets/samples folder, emulate WP function with image location context
 * 
 * @global type $bea_image
 * @param integer $post_id
 * @param string $size_or_img_name
 * @param array $attr
 * @return string
 */
function get_the_post_thumbnail( $post_id = 0, $size_or_img_name = 'thumbnail', $attr = array() ){
	global $bea_image;
	
	// Test if data-location attribute exists ?
	if( !isset($attr['data-location']) ){
		return $attr; // TODO: Really return the array ?
	}
	
	// Check if location existant on JSON array
	$location_array = $bea_image::get_location( $attr['data-location'] );
	if( empty( $location_array ) ){
		$attr['data-location'] = 'No location found';
	}
	
	// Build SRCset attributes (each sizes for location)
	$srcset_attrs = array();
	foreach( $location_array as $location ){
		if( !isset( $location->size ) || empty( $location->size ) ){
			continue;
		}
		
		$image_size = $bea_image::get_image_size($location->size);
		if( empty($image_size) ){
			continue;
		}
		
		$img = get_attachment_image_src( $size_or_img_name, $image_size );
		if( empty($img) ){
			continue;
		}

		if( isset( $location->class ) && !empty( $location->class ) ){
			$attr['class'] = $attr['class']. ' '.$location->class;
		}

		$srcset_attrs[] = $img.' '.$location->srcset;
	}

	if( !empty($srcset_attrs) ){
		$attr['srcset'] = implode(', ', $srcset_attrs);
	}
	
	$is_img = is_size_or_img($size_or_img_name);
	if( $is_img === true ){
		$src= get_timthumb_url( BEA_IMG_SAMPLE_DIR.$size_or_img_name, ''  );
	}else{
		$img_url = get_random_sample_img_url();
		$src = get_timthumb_url( $img_url, ''  );
	}
	
	
	$html = '';
	$default_attr = array(
		'src'	=> $src,
		'class'	=> "attachment",
	);
	
	$attr = array_merge($attr, $default_attr);
	$html = rtrim("<img");
	foreach ( $attr as $name => $value ) {
		$html .= " $name=" . '"' . $value . '"';
	}
	$html .= ' />';
	
	return $html;
}


function get_attachment_image_src( $size_or_img_name = 'thumbnail', $image_size = '' ){
	$is_img = is_size_or_img($size_or_img_name);
	if( $is_img === true ){
		return get_timthumb_url( BEA_IMG_SAMPLE_DIR.$size_or_img_name, $image_size  );
	}else{
		$img_url = get_random_sample_img_url();
		return get_timthumb_url( $img_url, $image_size  );
	}
}

/*
 * Get random sample img url
 * @author Alexandre Sadowski
 */
function get_random_sample_img_url(){
	$matches = glob( BEA_IMG_SAMPLE_DIR.'{*.gif,*.jpg,*.png}', GLOB_BRACE);
	if( empty($matches) ){
		return false;
	}
	
	$rand_img = array_rand($matches, 1);
	return $matches[$rand_img];
}

/*
 * Check if is a img name or a size
 * @return bool true|false
 * @author Alexandre Sadowski
 */
function is_size_or_img( $size_or_img_name = 'thumbnail'  ){
	$extension = pathinfo( BEA_IMG_SAMPLE_DIR.$size_or_img_name, PATHINFO_EXTENSION);
	if( $extension == 'jpg' ){
		return true;
	}
	return false;
}

/**
 * Build Timthumb URL
 * 
 * @param string $path_img
 * @param BEA_Images|null $image_size
 * @return string
 */
function get_timthumb_url( $path_img, $image_size = null ){
	if( !empty($image_size) ){
		return get_full_url($_SERVER, true).'html/functions/timthumb.php?src='.$path_img.'&h='.$image_size->height.'&w='.$image_size->width.'&zc='.(int)$image_size->crop;
	}else{
		return get_full_url($_SERVER, true).'html/functions/timthumb.php?src='.$path_img;
	}
}