<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Services\Acf;
use BEA\Theme\Framework\Services\Assets;

class FrameworkTest extends WP_UnitTestCase {

	public function test_theme_is_active(): void {
		$this->assertSame( 'beapi-frontend-framework', get_stylesheet() );
	}

	public function test_services_are_booted_on_after_setup_theme(): void {
		$container = Framework::get_container();

		$this->assertInstanceOf( Assets::class, $container->get_service( 'assets' ) );
		$this->assertInstanceOf( Acf::class, $container->get_service( 'acf' ) );
		$this->assertSame( 10, has_action( 'wp', [ $container->get_service( 'assets' ), 'register_assets' ] ) );
	}

	public function test_not_a_service(): void {
		Framework::register_service( 'not-a-service' );

		$this->assertFalse( Framework::get_container()->get_service( 'not-a-service' ) );
	}

	public function test_same_container(): void {
		$this->assertSame( Framework::get_container(), Framework::get_container() );
	}
}
