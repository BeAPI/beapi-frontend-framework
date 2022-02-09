<?php

namespace Services;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Acf;
use BEA\Theme\Framework\Services\Assets;
use BEA\Theme\Framework\Services\Svg;
use InvalidArgumentException;
use WP_Mock;
use WP_Mock\Tools\TestCase;

class AssetsTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testName() {
		$assets = new Assets();
		$this->assertEquals( 'assets', $assets->get_service_name() );
	}

	public function testStyleSheetURIWithScriptDebug() {
		$assets = new Assets();

		WP_Mock::passthruFunction( 'get_theme_file_path', [ 'times' => 1 ] );

		$this->assertSame( 'ok.css', $assets->stylesheet_uri( 'ok.css' ) );
	}

}
