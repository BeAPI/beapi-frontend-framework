<?php

namespace BEA\Theme\Framework\Tools;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Template_Parts
 *
 * @package BEA\Theme\Framework\Tools
 */
class Template_Parts implements Service {
	/**
	 * Vars to store
	 *
	 * @var array
	 * @author Maxime Culea
	 */
	private $vars = array();

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'template-parts';
	}

	/**
	 * @param        $slug
	 * @param        $key
	 * @param string $value
	 *
	 * @return bool
	 */
	public function add_var( $slug, $key, $value = '' ) {
		$this->vars[ $slug ][ $key ] = $value;

		return true;
	}

	/**
	 * @param string $slug
	 * @param string $key
	 *
	 * @return mixed
	 */
	public function get_var( $slug = '', $key = '' ) {
		return isset( $this->vars[ $slug ][ $key ] ) ? $this->vars[ $slug ][ $key ] : null;
	}

	/**
	 * @param string $slug
	 *
	 * @return mixed
	 */
	public function get_vars( $slug = '' ) {
		return isset( $this->vars[ $slug ] ) ? $this->vars[ $slug ] : null;
	}
}
