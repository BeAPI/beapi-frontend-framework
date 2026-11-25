<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Menu;

class MenuTest extends WP_UnitTestCase {

	/**
	 * @var array
	 */
	private $registered_nav_menus = [];

	/**
	 * @var array
	 */
	private $theme_features = [];

	public function set_up(): void {
		parent::set_up();

		$this->registered_nav_menus = $GLOBALS['_wp_registered_nav_menus'] ?? [];
		$this->theme_features       = $GLOBALS['_wp_theme_features'] ?? [];
	}

	public function tear_down(): void {
		$GLOBALS['_wp_registered_nav_menus'] = $this->registered_nav_menus;
		$GLOBALS['_wp_theme_features']       = $this->theme_features;

		parent::tear_down();
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'menu', ( new Menu() )->get_service_name() );
	}

	public function test_menus_are_registered_by_the_theme(): void {
		$this->assertInstanceOf( Menu::class, Framework::get_container()->get_service( 'menu' ) );
		$this->assertTrue( current_theme_supports( 'menus' ) );
		$this->assertSame(
			[
				'menu-main'   => 'Main menu',
				'menu-footer' => 'Footer menu',
			],
			array_intersect_key( get_registered_nav_menus(), array_flip( [ 'menu-main', 'menu-footer' ] ) )
		);
	}

	public function test_register_does_nothing(): void {
		$this->clear_menus();

		$this->assertNull( ( new Menu() )->register( new Service_Container() ) );
		$this->assertSame( [], get_registered_nav_menus() );
		$this->assertFalse( current_theme_supports( 'menus' ) );
	}

	public function test_register_menus(): void {
		$this->clear_menus();

		$this->assertNull( ( new Menu() )->register_menus() );
		$this->assertSame(
			[
				'menu-main'   => 'Main menu',
				'menu-footer' => 'Footer menu',
			],
			get_registered_nav_menus()
		);
	}

	public function test_register_menus_are_translated(): void {
		$this->clear_menus();
		add_filter(
			'gettext',
			static function ( $translation, $text, $domain ) {
				return $domain . ':' . $text;
			},
			10,
			3
		);

		( new Menu() )->register_menus();

		$this->assertSame(
			[
				'menu-main'   => 'beapi-frontend-framework:Main menu',
				'menu-footer' => 'beapi-frontend-framework:Footer menu',
			],
			get_registered_nav_menus()
		);
	}

	public function test_boot(): void {
		$this->clear_menus();

		( new Menu() )->boot( new Service_Container() );

		$this->assertTrue( current_theme_supports( 'menus' ) );
		$this->assertSame( [ 'menu-main', 'menu-footer' ], array_keys( get_registered_nav_menus() ) );
	}

	/**
	 * Remove every menu location and the menus support, restored in tear_down().
	 */
	private function clear_menus(): void {
		foreach ( array_keys( get_registered_nav_menus() ) as $location ) {
			unregister_nav_menu( $location );
		}
		remove_theme_support( 'menus' );
	}
}
