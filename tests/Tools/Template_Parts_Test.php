<?php

namespace Tools;

use BEA\Theme\Framework\Tools\Template_Parts;
use WP_Mock;
use WP_Mock\Tools\TestCase;

class Template_Parts_Test extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testAdd() {
		$template = new Template_Parts();

		$this->assertTrue( $template->add_var( 'slug', 'key', 'value' ) );
	}

	public function testGet() {
		$template = new Template_Parts();

		$this->assertNull( $template->get_var( 'slug', 'key' ) );

		$template->add_var( 'slug', 'key', 'value' );

		$this->assertSame( 'value', $template->get_var( 'slug', 'key' ) );
	}

	public function testGetOtherslug() {
		$template = new Template_Parts();

		$template->add_var( 'slug', 'key', 'value' );

		$this->assertEmpty( $template->get_var( 'slug2', 'key' ) );
	}

	public function testGetVars() {
		$template = new Template_Parts();

		$template->add_var( 'slug', 'key', 'value' );
		$template->add_var( 'slug', 'key2', 'value3' );
		$template->add_var( 'slug3', 'key', 'value3' );

		$this->assertSame( [ 'key' => 'value', 'key2' => 'value3' ], $template->get_vars( 'slug' ) );
		$this->assertNull( $template->get_vars( 'slug2' ) );
		$this->assertSame( 'value3', $template->get_var( 'slug3', 'key' ) );
	}

	public function testName() {
		$template = new Template_Parts();
		self::assertEquals( 'template-parts', $template->get_service_name() );
	}

}
