<?php

define( 'BEA_IMAGES_JSON_DIR', dirname( __FILE__ ) . '/../assets/conf-img/' );
define( 'BEA_IMAGES_VERSION', '2.1.1' );
define( 'BEA_LAZYSIZE', true ); //Set to false to have a no lazyload img markup

class BEA_Images {

	private static $locations;
	private static $image_sizes;
	private static $hooks;
	public static $allowed_ext = array( '.jpg', '.gif', '.png' );

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
		add_filter( 'wp_get_attachment_image_attributes', array( __CLASS__, 'get_attributes' ), 10, 2 );
		add_filter( 'post_thumbnail_html', array( __CLASS__, 'bea_default_img' ), 10, 5 );
	}

	/*
	 * Load JSON Image Sizes
	 *
	 * @author Alexandre Sadowski
	 */

	public static function load_image_sizes() {
		if ( ! is_file( BEA_IMAGES_JSON_DIR . 'image-sizes.json' ) ) {
			return false;
		}

		$file_content = file_get_contents( BEA_IMAGES_JSON_DIR . 'image-sizes.json' );
		$result       = json_decode( $file_content );
		if ( is_array( $result ) && ! empty( $result ) ) {
			self::$image_sizes = $result;
		}
	}

	/*
	 * Load locations JSON
	 *
	 * @author Alexandre Sadowski
	 */

	public static function load_locations() {
		if ( ! is_file( BEA_IMAGES_JSON_DIR . 'image-locations.json' ) ) {
			return false;
		}

		$file_content = file_get_contents( BEA_IMAGES_JSON_DIR . 'image-locations.json' );
		$result       = json_decode( $file_content );
		if ( is_array( $result ) && ! empty( $result ) ) {
			self::$locations = $result;
		}
	}

	/*
	 * Load hooks JSON
	 *
	 * @author Alexandre Sadowski
	 */

	public static function load_hooks() {
		if ( ! is_file( BEA_IMAGES_JSON_DIR . 'image-hooks.json' ) ) {
			return false;
		}

		$file_content = file_get_contents( BEA_IMAGES_JSON_DIR . 'image-hooks.json' );
		$result       = json_decode( $file_content );
		if ( is_array( $result ) && ! empty( $result ) ) {
			self::$hooks = $result;
		}
	}

	/*
	 * Add Image Sizes in WP
	 *
	 * @author Alexandre Sadowski
	 */

	public static function add_image_sizes() {
		if ( ! is_array( self::$image_sizes ) || empty( self::$image_sizes ) ) {
			return false;
		}

		foreach ( self::$image_sizes as $key => $value ) {
			foreach ( $value as $name => $attributes ) {
				if ( empty( $attributes ) ) {
					continue;
				}

				if ( isset( $attributes->width ) && ! empty( $attributes->width ) && isset( $attributes->height ) && ! empty( $attributes->height ) && isset( $attributes->crop ) ) {
					add_image_size( $name, $attributes->width, $attributes->height, $attributes->crop );
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

	public static function get_location( $location = '' ) {
		if ( ! is_array( self::$locations ) | empty( self::$locations ) ) {
			return false;
		}

		foreach ( self::$locations as $key => $value ) {
			foreach ( $value as $name => $attributes ) {
				if ( $name == $location ) {
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

	public static function get_image_size( $location = '' ) {
		if ( ! is_array( self::$image_sizes ) | empty( self::$image_sizes ) ) {
			return false;
		}

		foreach ( self::$image_sizes as $key => $value ) {
			foreach ( $value as $name => $attributes ) {
				if ( $name == $location ) {
					return $attributes;
				}
			}
		}

		return false;
	}

	/*
	 * Get all image sizes
	 *
	 * @return array : JSON image sizes
	 *
	 * @author Nicolas Juen
	 */
	public static function get_image_sizes() {
		if ( ! is_array( self::$image_sizes ) || empty( self::$image_sizes ) ) {
			return array();
		}

		return self::$image_sizes;
	}

	/*
	 * Get attributes of a hook
	 *
	 * @value string $hook The Hook name used in JSON
	 * @return array|false $attributes Array of attributes in JSON : srcset, size, class, default_src...
	 *
	 * @author Alexandre Sadowski
	 */

	public static function get_hook( $hook = '' ) {
		if ( ! is_array( self::$hooks ) | empty( self::$hooks ) ) {
			return false;
		}

		foreach ( self::$hooks as $key => $value ) {
			foreach ( $value as $name => $attributes ) {
				if ( $name == $hook ) {
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

	public static function get_attributes( $args = array(), WP_Post $attachment ) {
		if ( ! isset( $args['data-location'] ) ) {
			return $args;
		}

		$location_array = self::get_location( $args['data-location'] );
		if ( empty( $location_array ) ) {
			$args['data-location'] = 'No location found';
		} else {
			$location_array = reset( $location_array );
			$srcset_attrs   = array();
			if ( ! isset( $location_array->srcsets ) || empty( $location_array->srcsets ) ) {
				$args['data-location'] = 'No srcsets found or not V2 JSON';
			} else {
				// add lazyload on all medias
				if ( defined( 'BEA_LAZYSIZE' ) && true === BEA_LAZYSIZE ) {
					$args['class'] = $args['class'] . ' lazyload';
				}

				foreach ( $location_array->srcsets as $location ) {
					if ( ! isset( $location->size ) || empty( $location->size ) ) {
						continue;
					}

					$img = wp_get_attachment_image_src( $attachment->ID, (array) self::get_image_size( $location->size ) );
					if ( empty( $img ) ) {
						continue;
					}

					// Verif SSL
					$img[0] = ( function_exists( 'is_ssl' ) && is_ssl() ) ? str_replace( 'http://', 'https://', $img[0] ) : $img[0];

					if ( isset( $location->class ) && ! empty( $location->class ) ) {
						$args['class'] = $args['class'] . ' ' . $location->class;
					}

					$srcset_attrs[] = $img[0] . ' ' . $location->srcset;
				}
			}

			//Get img_base size for base SRC
			if ( isset( $location_array->img_base ) && ! empty( $location_array->img_base ) ) {
				$img = wp_get_attachment_image_src( $attachment->ID, (array) self::get_image_size( $location_array->img_base ) );
				if ( is_array( $img ) && ! empty( $img ) ) {
					$args['src'] = reset( $img );
				}
			}

			if ( ! empty( $srcset_attrs ) && defined( 'BEA_LAZYSIZE' ) ) {
				if ( false === BEA_LAZYSIZE ) {
					$args['srcset'] = implode( ', ', $srcset_attrs );
				} else {
					$args['data-srcset'] = implode( ', ', $srcset_attrs );
					$args['src'] = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
				}
			}
		}

		return $args;
	}

	/**
	 * Add default image on post_thumbnail empty
	 *
	 * @author Alexandre Sadowski
	 */
	public static function bea_default_img( $html, $post_id, $post_thumbnail_id, $size, $attr ) {
		if ( ! empty( $html ) ) {
			return $html;
		}
		if ( ! isset( $attr['data-location'] ) ) {
			return $html;
		}

		$location_array = self::get_location( $attr['data-location'] );
		if ( empty( $location_array ) ) {
			return $html;
		}

		$location_array = array_shift( $location_array );
		if ( ! isset( $location_array->default_img ) || empty( $location_array->default_img ) ) {
			return $html;
		}

		$default_path = apply_filters( 'bea_responsive_image_default_img_path', '/assets/img/default/', $attr );

		$img_path = $default_path . $location_array->default_img;
		if ( ! is_file( get_stylesheet_directory() . $img_path ) ) {
			return $html;
		}

		$classes = array( 'attachment-thumbnail', 'wp-post-image' );
		$classes[] = isset( $attr['class'] ) ? $attr['class'] : '';
		// add lazyload on all medias
		if ( defined( 'BEA_LAZYSIZE' ) && true === BEA_LAZYSIZE ) {
			$classes[] = 'lazyload';
			return '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-srcset="' . get_stylesheet_directory_uri() . $img_path . '" class="' . implode( ' ', $classes ) . '">';
		}

		return '<img src="' . get_stylesheet_directory_uri() . $img_path . '" class="' . implode( ' ', $classes ) . '">';
	}

}