<?php

namespace Services;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Svg;
use WP_Mock;
use WP_Mock\Tools\TestCase;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_attribute_value;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;
use function BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text;
use function BEA\Theme\Framework\Helpers\Formatting\Text\the_text;
use function ob_get_clean;
use function ob_start;

class EscapeTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testAttribute() {
		$value = escape_attribute_value( 'ok', '' );
		$this->assertSame( 'ok', $value );

		$value = escape_attribute_value( 'ok', 'test_escape' );
		$this->assertSame( 'esc_ok', $value );
	}
	public function testContent() {
		$value = escape_content_value( 'ok', '' );
		$this->assertSame( 'ok', $value );

		$value = escape_content_value( 'ok', 'test_escape' );
		$this->assertSame( 'esc_ok', $value );
	}
}

