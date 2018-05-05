<?php

namespace BEA\Theme\Framework;

/**
 * Class Service_Container
 *
 * @package BEA\Theme\Framework
 */
class Service_Container {

	/**
	 * The registered services.
	 *
	 * @var array
	 */
	private $services = [];

	/**
	 * Load all services.
	 */
	public function boot_services() {
		$services = array_unique( $this->get_services() );
		$services = array_map( [ $this, 'instantiate_service' ], $services );

		array_walk( $services, function ( Service $service ) {
			$service->boot( $this );
			$this->services[ $service->get_service_name() ] = $service;
		} );
	}

	/**
	 * Get the list of services to register.
	 *
	 * @since 0.1.0
	 *
	 * @return array[string] Array of fully qualified class names.
	 */
	private function get_services() {
		return $this->services;
	}

	/**
	 * Get a service's instance
	 *
	 * @param string $name the service name
	 *
	 * @return Service|bool The service instance or false if service not found
	 */
	public function get_service( $name ) {
		return isset( $this->services[ $name ] ) ? $this->services[ $name ] : false;
	}

	/**
	 * Register a service
	 *
	 * @param string $service
	 *
	 * @return bool
	 * @author Clément Boirie
	 */
	public function register_service( $service ) {
		if ( ! class_exists( $service ) || ! in_array( Service::class, class_implements( $service ) ) ) {
			return false;
		}

		$this->services[ $service ] = $service;

		return true;
	}

	/**
	 * Instantiate a single service.
	 *
	 * @param string $class Service class to instantiate.
	 *
	 * @return Service
	 */
	private function instantiate_service( $class ) {
		/**
		 * @var $service Service
		 */
		$service = new $class();
		$service->register( $this );
		$this->services[ $service->get_service_name() ] = $service;

		return $this->services[ $service->get_service_name() ];
	}
}