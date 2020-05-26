<?php
namespace BEA\Theme\Framework;

/**
 * Interface Service
 *
 * @package BEA\Theme\Framework
 */
Interface Service extends Interface_Module {

	/**
	 * Register the service
	 */
	public function register( Service_Container $container );

	/**
	 * Boot the service
	 */
	public function boot( Service_Container $container );

	/**
	 * Get the service's name
	 *
	 * @return string
	 */
	public function get_service_name();
}
