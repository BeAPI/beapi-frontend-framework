<?php

namespace BEA\Theme\Framework\Tools;


use BEA\Theme\Framework\Service;

class Template_Parts implements Service {
	/**
	 * Vars to store
	 *
	 * @var array
	 * @author Maxime Culea
	 */
	private $vars = array();

	public function register() {}

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
