<?php

namespace BEA\Theme\Framework\Tools;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Service;

/**
 * Class Body_Class
 *
 * @package BEA\Theme\Framework\Tools
 */
class Body_Class implements Service {
	/**
	 * @var array
	 * @author Maxime Culea
	 */
	private $body_class = [];

	/**
	 * The unwanted classes
	 *
	 * @var array
	 */
	private $unwanted_classes = [];

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		add_filter( 'body_class', [ $this, 'body_class' ] );
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'body-class';
	}

	/**
	 * Add a body class
	 *
	 * @author Maxime Culea
	 *
	 * @param $body_class array | String
	 */
	public function add( $body_class ) {
		$this->body_class[] = $body_class;
	}

	/**
	 * Stack unwanted body_classes
	 *
	 * @author Maxime Culea
	 *
	 * @param $body_class string
	 */
	public function remove( $body_class ) {
		$this->unwanted_classes[] = $body_class;
	}

	/**
	 *
	 * @param $classes
	 *
	 * @return array
	 */
	public function body_class( $classes ) {
		// Filter body classes
		return array_filter( \array_merge( $classes, $this->body_class ), [ $this, 'filter' ] );
	}

	/**
	 * Filter method which handle to delete wanted body_class
	 *
	 * @param $class
	 *
	 * @author Maxime CULEA
	 *
	 * @return bool
	 */
	private function filter( $class ) {
		return ! in_array( $class, $this->unwanted_classes, true );
	}
}