<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Sidebar
 *
 * @package BEA\Theme\Framework
 */
class Sidebar implements Service {
	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		$this->register_sidebars();
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'sidebar';
	}

	public function register_sidebars(): void {

	}
}
