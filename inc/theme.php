<?php
/**
 * Created by PhpStorm.
 * User: nicolasjuen
 * Date: 05/01/2018
 * Time: 18:30
 */

namespace BEA\Theme\Framework;


class Theme implements Service {

	private $services = [];

	private $services_container = [];

	public function register() {
		\add_action( 'after_setup_theme', [ $this, 'after_setup_theme' ] );
	}

	public function get_service_name() {
		return 'theme';
	}

	public function after_setup_theme() {
		/**
		 * Init the supports
		 */
		$this->add_theme_supports();

		/**
		 * Init menus
		 */
		$this->register_menus();

		/**
		 * Init sidebars
		 */
		$this->register_sidebars();

		$this->register_services();
	}

	public function add_theme_supports() {
		// Add the theme support basic elements
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form' ) );
		add_theme_support( 'title-tag' );
		add_theme_support( 'async-css' );
	}

	public function register_menus() {
	}

	public function register_sidebars() {
	}

	/**
	 * Instantiate a single service.
	 *
	 * @since 0.1.0
	 *
	 * @param string $class Service class to instantiate.
	 *
	 * @return Service
	 * @throws  If the service is not valid.
	 */
	private function instantiate_service( $class ) {
		/**
		 * @var $service Service
		 */
		$service                                            = new $class();
		$this->services_container[ $service->get_service_name() ] = $service;

		return $service;
	}

	public function register_services() {
		$services = $this->get_services();
		$services = array_map( [ $this, 'instantiate_service' ], $services );
		array_walk( $services, function ( Service $service ) {
			$service->register();
		} );
	}

	/**
	 * @param $name
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
	 * @return array<string> Array of fully qualified class names.
	 */
	private function get_services() {
		return $this->services;
	}

	public function register_service( string $service ) {
		if ( ! class_exists( $service ) ) {
			return false;
		}
		$reflection = new \ReflectionClass( $service );
		if ( ! $reflection->implementsInterface( Service::class ) ) {
			return false;
		}

		$this->services[] = $service;

		return true;
	}
}