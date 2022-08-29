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
	private $vars = [];

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'template-parts';
	}

	/**
	 * @param string $slug
	 * @param string $key
	 * @param string $value
	 *
	 * @return bool
	 */
	public function add_var( string $slug, string $key, string $value = '' ): bool {
		$this->vars[ $slug ][ $key ] = $value;

		return true;
	}

	/**
	 * @param string $slug
	 * @param string $key
	 *
	 * @return mixed
	 */
	public function get_var( string $slug = '', string $key = '' ) {
		return $this->vars[ $slug ][ $key ] ?? null;
	}

	/**
	 * @param string $slug
	 *
	 * @return mixed
	 */
	public function get_vars( $slug = '' ) {
		return $this->vars[ $slug ] ?? null;
	}
}
