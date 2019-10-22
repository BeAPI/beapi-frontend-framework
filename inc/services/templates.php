<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Templates
 *
 * @package Beapi\Theme\Framework
 */
class Templates implements Service, TemplatesInterface {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {

	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'templates';
	}

	/**
	 * Locate template in the theme or plugin if needed
	 *
	 * @param string $tpl : the tpl name, add automatically .php at the end of the file
	 *
	 * @return bool|string
	 */
	public static function locate_template( $tpl ) {
		if ( empty( $tpl ) ) {
			return false;
		}

		$path = apply_filters( 'BEA\Theme\Framework\Services\Templates', array( $tpl . '.php' ), $tpl, __NAMESPACE__ );

		// Locate from the theme
		$located = locate_template( $path, false, false );

		if ( ! empty( $located ) ) {
			return $located;
		}

		return false;
	}

	/**
	 * Include the template given
	 *
	 * @param string $tpl : the template name to load
	 *
	 * @return bool
	 */
	public static function include_template( $tpl ) {
		if ( empty( $tpl ) ) {
			return false;
		}

		$tpl_path = self::locate_template( $tpl );
		if ( false === $tpl_path ) {
			return false;
		}

		include( $tpl_path );

		return true;
	}

	/**
	 * Load the template given and return a view to be render
	 *
	 * @param string $tpl : the template name to load
	 *
	 * @return \Closure|false
	 */
	public static function load_template( $tpl ) {
		if ( empty( $tpl ) ) {
			return false;
		}

		$tpl_path = self::locate_template( $tpl );
		if ( false === $tpl_path ) {
			return false;
		}

		/**
		 * closure
		 *
		 * @param boolean $display return element or print it ?
		 *
		 * @return string element if display is false
		 */
		return function ( $data, $display = false ) use ( $tpl_path ) {
			if ( ! is_array( $data ) ) {
				$data = array( 'data' => $data );
			}

			extract( $data, EXTR_OVERWRITE );

			if ( false === $display ) {
				ob_start();
				include $tpl_path;

				return ob_get_clean();
			} else {
				include $tpl_path;

				return true;
			}

		};
	}

	/**
	 * Render a view
	 *
	 * @param string $tpl : the template's name
	 * @param array $data : the template's data
	 * @param boolean $display return element or print it ?
	 *
	 * @return string element if display is false
	 */
	public static function render( $tpl, $data = array(), $display = false ) {

		$view = self::load_template( $tpl );

		return $view ? $view( $data, $display ) : '';
	}

	/**
	 *
	 * load sample images (front-end like)
	 *
	 * @param $name filename
	 * @param string $xclass custom css class (lazyload) by default
	 * @param string $alt text alternative
	 * @param string $wrapBefore html before image (<picture>) by default
	 * @param string $wrapAfter html after image (</picture>) by default
	 *
	 * @return string html <img> rendered
	 */
	public static function get_sample_image( $name, $xclass = 'lazyload', $alt = '', $wrapBefore = '<picture>', $wrapAfter = '</picture>' ) {
		return $wrapBefore . '<img class=" ' . $xclass . '" src="' . get_theme_file_uri( 'dist/assets/img/sample/' . $name ) . '" alt="' . $alt . '">' . $wrapAfter;
	}

	public static function the_sample_image( $name, $xclass = 'lazyload', $alt = '', $wrapBefore = '<picture>', $wrapAfter = '</picture>' ) {
		echo self::get_sample_image( $name, $xclass, $alt, $wrapBefore, $wrapAfter );
	}

	/**
	 * multiple methods to include files easily
	 *
	 * @param string $block_name filename
	 * @param array $args arguments to pass
	 */
	public static function get_section( $block_name, array $args = [] ) {
		self::get_block( 'sections/' . $block_name, $args );
	}

	public static function get_svg( $block_name, array $args = [] ) {
		self::get_block( 'svg/' . $block_name, $args );
	}

	public static function get_block( $block_name, array $args = [] ) {
		if ( ! empty( $args ) ) {
			self::render( BLOCKS . $block_name, $args, true );
		} else {
			get_template_part( BLOCKS . $block_name );
		}
	}

	public static function get_part( $part_name, $module, array $args = [] ) {
		if ( ! empty( $args ) ) {
			self::render( PARTS . $module . '/' . $part_name, $args, true );
		} else {
			get_template_part( PARTS . $module . '/' . $part_name );
		}
	}
	/**
	 * example of optional helpers
	 * @param string $loop
	 * @param array $args
	 */
//
//	public static function get_hero( $hero_name, array $args = [] ) {
//		self::get_block( 'hero/' . $hero_name, $args, true );
//	}
//
//	public static function get_cards( $card_name, array $args = [] ) {
//		self::get_block( 'cards/' . $card_name, $args, true );
//	}

	public static function get_loop( string $loop, $args = [] ) {
		if ( ! empty( $args ) ) {
			self::render( 'components/loops/' . $loop, $args, true );
		} else {
			get_template_part( 'components/loops/' . $loop );
		}
	}
}
