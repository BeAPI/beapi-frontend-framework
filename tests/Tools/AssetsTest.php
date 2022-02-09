<?php

namespace Tools;

use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Tools\Assets;
use WP_Mock;
use WP_Mock\Tools\TestCase;

class AssetsTest extends TestCase {
	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function testRegisterScript() {
		WP_Mock::passthruFunction( 'get_theme_file_uri', [ 'times' => 1 ] );
		WP_Mock::passthruFunction(
			'wp_register_script',
			[
				'times' => 1,
				'args'  => [
					'handle',
					'src',
					[],
					false,
					false,
				],
			]
		);

		$assets = new Assets();
		$assets->register_script( 'handle', 'src' );
	}

	public function testEnqueueScript() {
		WP_Mock::passthruFunction(
			'wp_enqueue_script',
			[
				'times' => 1,
				'args'  => [
					'handle',
				],
			]
		);

		$assets = new Assets();
		$assets->enqueue_script( 'handle' );
	}

	public function testRegisterStyle() {
		WP_Mock::passthruFunction( 'get_theme_file_uri', [ 'times' => 1 ] );
		WP_Mock::passthruFunction(
			'wp_register_style',
			[
				'times' => 1,
				'args'  => [
					'handle',
					'src',
					[],
					false,
					'all',
				],
			]
		);

		$assets = new Assets();
		$assets->register_style( 'handle', 'src' );
	}

	public function testEnqueueStyle() {
		WP_Mock::passthruFunction(
			'wp_enqueue_style',
			[
				'times' => 1,
				'args'  => [
					'handle',
				],
			]
		);

		$assets = new Assets();
		$assets->enqueue_style( 'handle' );
	}
}
