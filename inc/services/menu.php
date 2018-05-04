<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Menu
 *
 * @package BEA\Theme\Framework
 */
class Menu implements Service {
	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		add_theme_support( 'menus' );

		$this->register_menus();
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'menu';
	}

	public function register_menus() {

	}
}