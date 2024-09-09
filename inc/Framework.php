<?php

namespace BEA\Theme\Framework;

use BEA\Theme\Framework\Services\Acf;
use BEA\Theme\Framework\Services\Assets;
use BEA\Theme\Framework\Services\Performance;
use BEA\Theme\Framework\Services\Assets_JS_Async;
use BEA\Theme\Framework\Services\Editor;
use BEA\Theme\Framework\Services\Editor_Patterns;
use BEA\Theme\Framework\Services\Gravity_Forms;
use BEA\Theme\Framework\Services\Menu;
use BEA\Theme\Framework\Services\Sidebar;
use BEA\Theme\Framework\Services\Svg;
use BEA\Theme\Framework\Services\Theme;
use BEA\Theme\Framework\Tools\Body_Class;
use BEA\Theme\Framework\Tools\Template_Parts;

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
	 * @var array $services
	 */
	protected static $services = [
		// Services
		Theme::class,
		Assets::class,
		Performance::class,
		Assets_JS_Async::class,
		Editor::class,
		Editor_Patterns::class,
		Gravity_Forms::class,
		Svg::class,
		Acf::class,
		Menu::class,

		// Services as Tools
		Body_Class::class,
		Template_Parts::class,
	];

	/**
	 * @return Service_Container
	 */
	public static function get_container(): Service_Container {
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
	public static function register_service( $name ): void {
		self::get_container()->register_service( $name );
	}
}
