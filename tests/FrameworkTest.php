<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Acf;
use BEA\Theme\Framework\Services\Theme;
use PHPUnit\Framework\TestCase;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use WP_Mock\Functions;

class FrameworkTest extends \WP_Mock\Tools\TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testNotAService() {
		Framework::register_service( 'not-a-service' );

		$this->assertFalse( Framework::get_container()->get_service( 'not-a-service' ) );
	}

	public function testSameContainer() {
		$container = Framework::get_container();

		$this->assertSame( $container, Framework::get_container() );
	}

	public function testServiceSet() {
		Framework::register_service( Acf::class );

		$this->assertNotEmpty( Framework::get_container()->get_service( Acf::class ) );
	}
}
