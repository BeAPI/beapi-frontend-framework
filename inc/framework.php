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
		\BEA\Theme\Framework\Services\Theme::class,
		\BEA\Theme\Framework\Services\Assets::class,
		\BEA\Theme\Framework\Services\Assets_Fonts_Async::class,
		\BEA\Theme\Framework\Services\Assets_JS_Async::class,
		\BEA\Theme\Framework\Services\SVG::class,
		\BEA\Theme\Framework\Services\Favicons::class,
		\BEA\Theme\Framework\Services\Acf::class,
		\BEA\Theme\Framework\Services\Sidebar::class,
		\BEA\Theme\Framework\Services\Menu::class,

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