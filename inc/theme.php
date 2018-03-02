<?php

namespace BEA\Theme\Framework;


class Theme implements Service {

	/**
	 * The registered services.
	 *
	 * @var array
	 */
	private $services = [];

	/**
	 * The services container for quick access.
	 *
	 * @var array
	 */
	private $services_container = [];

	public function register() {
		\add_action( 'after_setup_theme', [ $this, 'after_setup_theme' ] );
	}

	public function get_service_name() {
		return 'theme';
	}

	public function after_setup_theme() {
		/**
		 * Init the supports.
		 */
		$this->add_theme_supports();

		/**
		 * Register all the Services.
		 */
		$this->register_services();

		/**
		 * Load translations.
		 */
		$this->i18n();
	}

	private function add_theme_supports() {
		// Add the theme support basic elements
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form' ) );
		add_theme_support( 'title-tag' );
		add_theme_support( 'async-css' );
	}

	private function i18n() {
		// Load theme texdomain
		load_theme_textdomain( 'framework-textdomain', \get_theme_file_path( '/languages' ) );
	}

	/**
	 * Instantiate a single service.
	 *
	 * @since 0.1.0
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
		$this->services_container[ $service->get_service_name() ] = $service;

		return $this->services_container[ $service->get_service_name() ];
	}

	public function register_services() {
		$services = array_unique( $this->get_services() );
		$services = array_map( [ $this, 'instantiate_service' ], $services );
		array_walk( $services, function ( Service $service ) {
			$service->register();
		} );
	}

	/**
	 * @param string $name : the service name.
	 *
	 * @return bool|Service
	 */
	public function get_service( $name ) {
		return isset( $this->services_container[ $name ] ) ? $this->services_container[ $name ] : false;
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

	public function register_service( string $service ) {
		if (
			! class_exists( $service )
			|| ! in_array( Service::class, class_implements( $service ) )
		) {
			return false;
		}

		$this->services[] = $service;

		return true;
	}
}