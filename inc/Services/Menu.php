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
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		add_theme_support( 'menus' );

		$this->register_menus();
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'menu';
	}

	public function register_menus(): void {
		$nav_menu = [
			'menu-main'   => __( 'Main menu', 'beapi-frontend-framework' ),
			'menu-footer' => __( 'Footer menu', 'beapi-frontend-framework' ),
		];
		register_nav_menus( $nav_menu );
	}
}
