<?php

namespace BEA\Theme\Framework;

/**
 * Class Framework
 *
 * @package BEA\Theme\Framework
 */
class Framework {
	/**
	 * @var Service_Container
	 */
	protected static $container;

	/**
	 * @var $services
	 */
	protected static $services = [
		// Services
		\BEA\Theme\Framework\Theme::class,
		\BEA\Theme\Framework\Assets::class,
		\BEA\Theme\Framework\Assets_CSS_Async::class,
		\BEA\Theme\Framework\Assets_JS_Async::class,
		\BEA\Theme\Framework\SVG::class,
		\BEA\Theme\Framework\Favicons::class,
		\BEA\Theme\Framework\Acf::class,
		\BEA\Theme\Framework\Sidebar::class,
		\BEA\Theme\Framework\Menu::class,

		// Services as Tools
		\BEA\Theme\Framework\Tools\Body_Class::class,
		\BEA\Theme\Framework\Tools\Template_Parts::class,
	];

	/**
	 * @return Service_Container
	 */
	public static function get_container() {
		if ( is_null( self::$container ) ) {
			self::$container = new Service_Container();
			array_map( [ __CLASS__, 'register_service' ], self::$services );
		}

		return self::$container;
	}

	/**
	 * Register Service
	 *
	 * @param $name
	 */
	public static function register_service( $name ) {
	 	self::get_container()->register_service( $name );
	}
}