<?php
define( 'BEA_IMG_SAMPLE_DIR', dirname( __FILE__ ).'/../../assets/img/sample/' );
define( 'FILE_CACHE_DIRECTORY', dirname( __FILE__ ).'/../../assets/img/sample/cache/' );

require( dirname( __FILE__ ) . '/load-scripts.php' );
require( dirname( __FILE__ ) . '/bea-images.php' );

global $bea_image;
$bea_image = new BEA_Images();

function has_post_thumbnail(){
	return true;
}

function get_the_post_thumbnail( $post_id = 0, $size_or_img_name = 'thumbnail', $attr = array() ){
	global $bea_image;
	if( !isset($attr['data-location']) ){
		return $attr;
	}
	
	$location_array = $bea_image::get_location( $attr['data-location'] );
	if( empty( $location_array ) ){
		$attr['data-location'] = 'No location found';
	}
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
	$matches = glob( BEA_IMG_SAMPLE_DIR.'*.jpg');
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

if( !function_exists('get_full_url') ){
	function get_full_url( $s, $only_dir_url = false ) {
		$ssl = (!empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on') ? true : false;
		$sp = strtolower( $s['SERVER_PROTOCOL'] );
		$protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . (($ssl) ? 's' : '');
		$port = $s['SERVER_PORT'];
		$port = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
		$host = isset( $s['HTTP_X_FORWARDED_HOST'] ) ? $s['HTTP_X_FORWARDED_HOST'] : isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : $s['SERVER_NAME'];

		if ( $only_dir_url == true ) {
			$s['REQUEST_URI'] = dirname( $s['REQUEST_URI'] ) . '/';
		}
		return $protocol . '://' . $host . $port . $s['REQUEST_URI'];
}
}

/*
 * Create Timthumb URL
 */
function get_timthumb_url( $path_img, $image_size ){
	if( !empty($image_size) ){
		return get_full_url($_SERVER, true).'html/functions/timthumb.php?src='.$path_img.'&h='.$image_size->height.'&w='.$image_size->width.'&zc='.(int)$image_size->crop;
	}else{
		return get_full_url($_SERVER, true).'html/functions/timthumb.php?src='.$path_img;
	}
}