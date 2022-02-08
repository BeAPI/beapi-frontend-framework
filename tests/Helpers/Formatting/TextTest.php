<?php

namespace Services;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Svg;
use WP_Mock;
use WP_Mock\Tools\TestCase;
use function BEA\Theme\Framework\Helpers\Formatting\Text\get_the_text;
use function BEA\Theme\Framework\Helpers\Formatting\Text\the_text;
use function ob_get_clean;
use function ob_start;

class TextTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testEmpty() {
		$test = get_the_text( '' );
		$this->assertEmpty( $test );

		ob_start();
		the_text( '' );
		$buffer = ob_get_clean();
		$this->assertSame( $test, $buffer );

	}

	public function testBeforeAfter() {
		WP_Mock::userFunction( 'wp_parse_args', [
			'times'           => 6,
			'return_in_order' => [
				[
					'before' => 'b',
					'after'  => '',
					'escape' => '',
				],
				[
					'before' => '',
					'after'  => 'a',
					'escape' => '',
				],
				[
					'before' => 'b',
					'after'  => 'a',
					'escape' => '',
				],
				[
					'before' => 'b',
					'after'  => '',
					'escape' => '',
				],
				[
					'before' => '',
					'after'  => 'a',
					'escape' => '',
				],
				[
					'before' => 'b',
					'after'  => 'a',
					'escape' => '',
				],
			],
		] );

		$val  = get_the_text( 'val', [ 'before' => 'b' ] );
		$val2 = get_the_text( 'val', [ 'after' => 'a' ] );
		$val3 = get_the_text( 'val', [ 'before' => 'b', 'after' => 'a' ] );

		ob_start();
		the_text( 'val', [ 'before' => 'b' ] );
		$buffer = ob_get_clean();

		ob_start();
		the_text( 'val', [ 'after' => 'a' ] );
		$buffer2 = ob_get_clean();

		ob_start();
		the_text( 'val', [ 'before' => 'b', 'after' => 'a' ] );
		$buffer3 = ob_get_clean();

		// Test returns
		$this->assertSame( 'bval', $val );
		$this->assertSame( 'vala', $val2 );
		$this->assertSame( 'bvala', $val3 );

		// Test Buffer and generated the same
		$this->assertSame( $val, $buffer );
		$this->assertSame( $val2, $buffer2 );
		$this->assertSame( $val3, $buffer3 );
	}

	public function testEscape() {
		WP_Mock::userFunction( 'wp_parse_args', [
			'times'           => 4,
			'return_in_order' => [
				[
					'before' => '',
					'after'  => '',
					'escape' => 'test_escape',
				],
				[
					'before' => 'b',
					'after'  => '',
					'escape' => 'test_escape',
				],
				[
					'before' => '',
					'after'  => 'a',
					'escape' => 'test_escape',
				],
				[
					'before' => 'b',
					'after'  => 'a',
					'escape' => 'test_escape',
				],
			],
		] );

		$this->assertSame( 'esc_val', get_the_text( 'val', [
			'before' => '',
			'after'  => '',
			'escape' => 'test_escape',
		] ) );
		$this->assertSame( 'besc_val', get_the_text( 'val', [
			'before' => 'b',
			'after'  => '',
			'escape' => 'test_escape',
		] ) );
		$this->assertSame( 'esc_vala', get_the_text( 'val', [
			'before' => '',
			'after'  => 'a',
			'escape' => 'test_escape',
		] ) );
		$this->assertSame( 'besc_vala', get_the_text( 'val', [
			'before' => 'b',
			'after'  => 'a',
			'escape' => 'test_escape',
		] ) );
	}

	public function testFilterSettings() {
		WP_Mock::userFunction( 'wp_parse_args', [
			'return' =>
				[
					'before' => '',
					'after'  => '',
					'escape' => 'test_escape',
				],
		] );

		WP_Mock::onFilter( 'bea_theme_framework_text_settings' )->with( [
			'before' => '',
			'after'  => '',
			'escape' => 'test_escape',
		], 'val' )->reply( [
			'before' => 'b',
			'after'  => 'a',
			'escape' => 'esc_html',
		] );

		$this->assertSame( 'bvala', get_the_text( 'val' ) );
	}

	public function testFilterValue() {
		WP_Mock::userFunction( 'wp_parse_args', [
			'return' =>
				[
					'before' => '',
					'after'  => '',
					'escape' => 'test_escape',
				],
		] );

		WP_Mock::onFilter( 'bea_theme_framework_text_value' )->with( 'esc_val', [
			'before' => '',
			'after'  => '',
			'escape' => 'test_escape',
		] )->reply( 'filtered' );

		$this->assertSame( 'filtered', get_the_text( 'val' ) );
	}
}

