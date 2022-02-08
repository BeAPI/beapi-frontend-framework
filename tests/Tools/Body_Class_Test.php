<?php

namespace Tools;

use BEA\Theme\Framework\Service_Container;
use WP_Mock;

class Body_Class_Test extends \WP_Mock\Tools\TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testAdd() {
		$body_class = new \BEA\Theme\Framework\Tools\Body_Class();

		$body_class->add( 'test' );
		$this->assertEquals( [ 'test' ], $body_class->body_class( [] ) );

	}

	public function testRemove() {
		$body_class = new \BEA\Theme\Framework\Tools\Body_Class();

		$body_class->add( 'test' );
		$body_class->remove( 'test' );
		$this->assertEquals( [], $body_class->body_class( [] ) );
	}

	public function testAddRemoveWithInitialData() {
		$body_class = new \BEA\Theme\Framework\Tools\Body_Class();

		$body_class->add( 'test' );
		$body_class->remove( 'test' );
		$this->assertEquals( [ 'leaveme' ], $body_class->body_class( [ 'leaveme' ] ) );
	}

	public function testName() {
		$body_class = new \BEA\Theme\Framework\Tools\Body_Class();
		self::assertEquals( 'body-class', $body_class->get_service_name() );
	}

	public function testBoot() {
		$body_class = new \BEA\Theme\Framework\Tools\Body_Class();
		$container  = $this->createStub( Service_Container::class );

		\WP_Mock::expectFilterAdded( 'body_class', [ $body_class, 'body_class' ] );

		$body_class->boot( $container );
	}
}
