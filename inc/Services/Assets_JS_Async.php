<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Assets_JS_Async
 *
 * @package BEA\Theme\Framework
 */
class Assets_JS_Async implements Service {

	/**
	 * JS handlers for the script.
	 * @var array : the script styles to async load
	 */
	private $js_handlers = [ 'scripts' => 'async' ];

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		if ( current_theme_supports( 'async-js' ) && ! is_admin() ) {
			add_filter( 'script_loader_tag', array( $this, 'script_loader_tag' ), 20, 2 );
		}

		/**
		 * Example
		 *
		 * $this->add_handler( 'scripts', 'async defer' );
		 */
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'assets-js-async';
	}

	/**
	 * @param $handler
	 */
	public function add_handler( $handler, $type = 'async' ) {
		$this->js_handlers[ $handler ] = $type;
	}

	/**
	 * Replace default generated WP Link Tag
	 *
	 * @param string $html The link tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 *
	 * @return string
	 * @author Nicolas JUEN
	 */
	public function script_loader_tag( $html, $handle ) {
		if ( ! isset( $this->js_handlers[ $handle ] ) ) {
			return $html;
		}

		return  str_replace( ' src', sprintf( ' %s src', $this->js_handlers[ $handle ] ), $html );
	}
}
