<?php

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
		\BEA\Theme\Framework\Framework::register_service( 'not-a-service' );

		$this->assertFalse( \BEA\Theme\Framework\Framework::get_container()->get_service( 'not-a-service' ) );
	}

	public function testSameContainer() {
		$container = \BEA\Theme\Framework\Framework::get_container();

		$this->assertSame( $container, \BEA\Theme\Framework\Framework::get_container() );
	}

	public function testServiceSet() {
		\BEA\Theme\Framework\Framework::register_service( Acf::class );

		$this->assertNotEmpty( \BEA\Theme\Framework\Framework::get_container()->get_service( Acf::class ) );
	}
}
