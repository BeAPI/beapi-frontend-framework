<?php
namespace BEA\Theme\Framework;

Interface Service extends Interface_Module {

	/**
	 * Register the service
	 */
	public function register();

	/**
	 * Get the service's name
	 *
	 * @return string
	 */
	public function get_service_name();
}
