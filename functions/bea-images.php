<?php
define( 'BEA_IMAGES_JSON_DIR', dirname( __FILE__ ).'/../assets/conf-img/' );

class BEA_Images{
	
	private static $locations;
	private static $image_sizes;
	private static $hooks;

	/**
	 * Construct
	 */
	public function __construct() {
		// Get data from JSON
		self::load_image_sizes();
		self::load_locations();
		self::load_hooks();
		
		// Set image size to WP
		self::add_image_sizes();
		
		// Hook WP function for add new attribute
		add_filter('wp_get_attachment_image_attributes', array(__CLASS__, 'get_attributes'),10,2 );
	}
	/*
	 * Load JSON Image Sizes
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function load_image_sizes(){
		if( !is_file( BEA_IMAGES_JSON_DIR.'image-sizes.json' ) ){
			return false;
		}
		
		$file_content = file_get_contents( BEA_IMAGES_JSON_DIR.'image-sizes.json' );
		$result = json_decode( $file_content );
		if( is_array( $result ) && !empty( $result ) ){
			self::$image_sizes = $result;
		}
	}
	
	/*
	 * Load locations JSON
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function load_locations(  ){
		if( !is_file( BEA_IMAGES_JSON_DIR.'image-locations.json' ) ){
			return false;
		}
		
		$file_content = file_get_contents( BEA_IMAGES_JSON_DIR.'image-locations.json' );
		$result = json_decode( $file_content );
		if( is_array( $result ) && !empty( $result ) ){
			self::$locations = $result;
		}
	}
	
	/*
	 * Load hooks JSON
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function load_hooks(  ){
		if( !is_file( BEA_IMAGES_JSON_DIR.'image-hooks.json' ) ){
			return false;
		}
		
		$file_content = file_get_contents( BEA_IMAGES_JSON_DIR.'image-hooks.json' );
		$result = json_decode( $file_content );
		if( is_array( $result ) && !empty( $result ) ){
			self::$hooks = $result;
		}
	}
	
	/*
	 * Add Image Sizes in WP
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function add_image_sizes() {
		if( !is_array(self::$image_sizes) || empty(self::$image_sizes) ) {
			return false;
		}
		
		foreach ( self::$image_sizes as $key => $value ) {
			foreach( $value as $name => $attributes ){
				if( empty($attributes) ){
					continue;
				}
				
				if( isset($attributes->width) && !empty( $attributes->width ) && isset($attributes->height) && !empty( $attributes->height ) && isset($attributes->crop) ){
					add_image_size($name, $attributes->width, $attributes->height, $attributes->crop);
				}
			}
		}
		
		return true;
	}
	
	/*
	 * Get attributes of a location
	 * 
	 * @value string $location The location name used in JSON
	 * @return array|false $attributes Array of attributes in JSON : srcset, size, class, default_src...
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function get_location( $location = ''){
		if( !is_array(self::$locations) | empty(self::$locations) ){
			return false;
		}
		
		foreach ( self::$locations as $key => $value ) {
			foreach( $value as $name => $attributes ){
				if( $name == $location ){
					return $attributes;
				}
			}
		}
		
		return false;
	}
	
	
	/*
	 * Get attributes of an image size
	 * 
	 * @value string $location The location name used in JSON
	 * @return array|false $attributes Array of attributes in JSON : width, height, crop
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function get_image_size( $location = ''){
		if( !is_array(self::$image_sizes) | empty(self::$image_sizes) ){
			return false;
		}
		
		foreach ( self::$image_sizes as $key => $value ) {
			foreach( $value as $name => $attributes ){
				if( $name == $location ){
					return $attributes;
				}
			}
		}
		return false;
	}
	
	/*
	 * Get attributes of a hook
	 * 
	 * @value string $hook The Hook name used in JSON
	 * @return array|false $attributes Array of attributes in JSON : srcset, size, class, default_src...
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function get_hook( $hook = ''){
		if( !is_array(self::$hooks) | empty(self::$hooks) ){
			return false;
		}
		
		foreach ( self::$hooks as $key => $value ) {
			foreach( $value as $name => $attributes ){
				if( $name == $hook ){
					return $attributes;
				}
			}
		}
		
		return false;
	}
	
	/*
	 * Add filter on "wp_get_attachment_image_attributes" to add srcset attributes
	 * 
	 * @value array $args attributes for the image markup.
	 * @value object $attachment WP_Post of attachment
	 * @return array $attributes attributes for the image markup.
	 * 
	 * @author Alexandre Sadowski
	 */
	public static function get_attributes( $args = array(),WP_Post $attachment ){
		if( !isset($args['data-location']) ){
			return $args;
		}
		
		$location_array = self::get_location( $args['location'] );
		if( empty( $location_array ) ){
			$args['data-location'] = 'No location found';
		} else {
			$srcset_attrs = array();
			foreach( $location_array as $location ){
				if( !isset( $location->size ) || empty( $location->size ) ){
					continue;
				}

				$img = wp_get_attachment_image_src( $attachment->ID, $location->size );
				if( empty($img) ){
					continue;
				}

				if( isset( $location->class ) && !empty( $location->class ) ){
					$args['class'] = $args['class']. ' '.$location->class;
				}

				$srcset_attrs[] = $img[0].' '.$location->srcset;
			}
		
			if( !empty($srcset_attrs) ){
				$args['srcset'] = implode(', ', $srcset_attrs);
			}
		}
		
		return $args;
	}
}