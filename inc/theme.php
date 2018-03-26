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

	/**
	 * @inheritdoc
	 */
	public function register() {
		\add_action( 'after_setup_theme', [ $this, 'after_setup_theme' ] );
	}

	/**
	 * @inheritdoc
	 */
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

	/**
	 * Set theme supports
	 */
	private function add_theme_supports() {
		// Add the theme support basic elements
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', [ 'comment-list', 'comment-form', 'search-form' ] );
		add_theme_support( 'title-tag' );
		add_theme_support( 'async-css' );
		add_theme_support( 'yoast-seo-breadcrumbs' );
	}

	private function i18n() {
		// Load theme texdomain
		load_theme_textdomain( 'framework-textdomain', \get_theme_file_path( '/languages' ) );
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
		$this->services_container[ $service->get_service_name() ] = $service;

		return $this->services_container[ $service->get_service_name() ];
	}

	/**
	 * Load all services.
	 */
	public function register_services() {
		$services = array_unique( $this->get_services() );
		$services = array_map( [ $this, 'instantiate_service' ], $services );
		array_walk( $services, function ( Service $service ) {
			$service->register();
		} );
	}

	/**
	 * Get a service's instance
	 *
	 * @param string $name the service name
	 *
	 * @return Service|bool The service instance or false if service not found
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

	/**
	 * Register a service
	 *
	 * @param string $service
	 *
	 * @return bool
	 * @author Clément Boirie
	 */
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