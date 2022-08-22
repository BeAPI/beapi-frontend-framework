<?php

namespace Services;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Svg;
use WP_Mock;
use WP_Mock\Tools\TestCase;
use function ob_end_clean;
use function ob_start;

class SvgTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testName() {
		$svg = new Svg();
		$this->assertEquals( 'svg', $svg->get_service_name() );
	}

	public function testTags() {
		$svg = new Svg();
		$this->assertIsArray( $svg->allow_svg_tag( [] ) );
		$this->assertArrayHasKey( 'path', $svg->allow_svg_tag( [] ) );
		$this->assertArrayHasKey( 'svg', $svg->allow_svg_tag( [] ) );
		$this->assertArrayHasKey( 'use', $svg->allow_svg_tag( [] ) );
	}

	public function testRegister() {
		$svg       = new Svg();
		$container = $this->createStub( Service_Container::class );

		WP_Mock::expectFilterAdded( 'wp_kses_allowed_html', [ $svg, 'allow_svg_tag' ] );

		$svg->register( $container );
	}

	public function testEmptyIcon() {
		$svg = new Svg();
		$this->assertEmpty( $svg->get_the_icon('') );
	}

	public function testGetIcon() {
		$svg = new Svg();
		WP_Mock::passthruFunction( 'sanitize_html_class' );
		WP_Mock::userFunction( 'get_theme_file_uri', [
			'return' => 'test.example.fr',
		] );

		$this->assertSame(
			'<svg class="icon icon-test" aria-hidden="true" focusable="false"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="test.example.fr#icon-test"></use></svg>',
			$svg->get_the_icon( 'test' )
		);
	}
	public function testTheIcon() {
		$svg = new Svg();
		WP_Mock::passthruFunction( 'sanitize_html_class' );
		WP_Mock::userFunction( 'get_theme_file_uri', [
			'return' => 'test.example.fr',
		] );

		ob_start();
		$this->AssertNull( $svg->the_icon( 'test' ) );
		$this->AssertNull( $svg->the_icon( 'test', [ 'class1', 'class2' ] ) );
		ob_end_clean();
	}

	public function testGetIconWithClass() {
		$svg = new Svg();
		WP_Mock::passthruFunction( 'sanitize_html_class' );

		WP_Mock::userFunction( 'get_theme_file_uri', [
			'return' => 'test.example.fr',
		] );

		$this->assertSame(
			'<svg class="icon icon-test class2 class3" aria-hidden="true" focusable="false"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="test.example.fr#icon-test"></use></svg>',
			$svg->get_the_icon( 'test', [ 'class2', 'class3' ] )
		);
	}
}
