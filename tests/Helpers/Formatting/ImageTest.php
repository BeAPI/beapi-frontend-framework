<?php

namespace Services;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Svg;
use WP_Mock;
use WP_Mock\Tools\TestCase;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_attribute_value;
use function BEA\Theme\Framework\Helpers\Formatting\Escape\escape_content_value;
use function BEA\Theme\Framework\Helpers\Formatting\Image\get_the_image;
use function BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text;
use function BEA\Theme\Framework\Helpers\Formatting\Text\the_text;
use function ob_get_clean;
use function ob_start;

class ImageTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testGetZeroImage() {
		$this->assertSame( '', get_the_image( 0, [] ) );
	}

	public function testGetImageEmpty() {
		WP_Mock::userFunction( 'wp_get_attachment_image', [
				'return' => '',
			]
		);

		$this->assertSame( '', get_the_image( 10, [ 'size' => '', 'data-location' => '' ] ) );
	}

	public function testImageBeforeAfter() {
		WP_Mock::userFunction( 'wp_get_attachment_image', [
				'return' => '<img>',
			]
		);

		$this->assertSame( 'b<img>', get_the_image( 10, [], [ 'before' => 'b' ] ) );
		$this->assertSame( '<img>a', get_the_image( 10, [], [ 'after' => 'a' ] ) );
		$this->assertSame( 'b<img>a', get_the_image( 10, [], [ 'after' => 'a', 'before' => 'b' ] ) );
	}
}

