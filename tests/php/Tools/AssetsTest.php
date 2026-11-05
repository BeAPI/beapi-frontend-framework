<?php

namespace BEA\Theme\Framework\Tests\Tools;

use BEA\Theme\Framework\Tools\Assets;
use WP_UnitTestCase;

class AssetsTest extends WP_UnitTestCase {

	private const THEME_URI = 'https://cdn.example.test/theme/';

	public function set_up(): void {
		parent::set_up();

		$GLOBALS['wp_scripts'] = null;
		$GLOBALS['wp_styles']  = null;

		add_filter(
			'theme_file_uri',
			static function ( $url, $file ) {
				return self::THEME_URI . $file;
			},
			10,
			2
		);
	}

	public function tear_down(): void {
		$GLOBALS['wp_scripts'] = null;
		$GLOBALS['wp_styles']  = null;

		parent::tear_down();
	}

	public function test_register_script_with_defaults(): void {
		$this->assertTrue( ( new Assets() )->register_script( 'handle', 'src.js' ) );

		$script = wp_scripts()->query( 'handle' );
		$this->assertSame( self::THEME_URI . 'src.js', $script->src );
		$this->assertSame( [], $script->deps );
		$this->assertFalse( $script->ver );
		$this->assertFalse( wp_scripts()->get_data( 'handle', 'strategy' ) );
		$this->assertFalse( wp_scripts()->get_data( 'handle', 'group' ) );
	}

	public function test_register_script_with_arguments(): void {
		$strategy = [
			'strategy'  => 'defer',
			'in_footer' => true,
		];
		( new Assets() )->register_script( 'handle', 'dist/app.js', [ 'jquery' ], '1.2.3', $strategy );

		$script = wp_scripts()->query( 'handle' );
		$this->assertSame( self::THEME_URI . 'dist/app.js', $script->src );
		$this->assertSame( [ 'jquery' ], $script->deps );
		$this->assertSame( '1.2.3', $script->ver );
		$this->assertSame( 'defer', wp_scripts()->get_data( 'handle', 'strategy' ) );
		$this->assertSame( 1, wp_scripts()->get_data( 'handle', 'group' ) );
	}

	public function test_register_script_already_registered(): void {
		$assets = new Assets();
		$assets->register_script( 'handle', 'first.js' );

		$this->assertFalse( $assets->register_script( 'handle', 'second.js' ) );
		$this->assertSame( self::THEME_URI . 'first.js', wp_scripts()->query( 'handle' )->src );
	}

	public function test_add_inline_script(): void {
		$assets = new Assets();
		$assets->register_script( 'handle', 'src.js' );

		$this->assertTrue( $assets->add_inline_script( 'handle', 'const after = 1;' ) );
		$this->assertTrue( $assets->add_inline_script( 'handle', 'const before = 1;', 'before' ) );

		$this->assertContains( 'const after = 1;', wp_scripts()->get_data( 'handle', 'after' ) );
		$this->assertContains( 'const before = 1;', wp_scripts()->get_data( 'handle', 'before' ) );
	}

	public function test_add_inline_script_on_unregistered_handle(): void {
		$this->assertFalse( ( new Assets() )->add_inline_script( 'unknown', 'const a = 1;' ) );
	}

	public function test_enqueue_script(): void {
		$assets = new Assets();
		$assets->register_script( 'handle', 'src.js' );
		$assets->enqueue_script( 'handle' );

		$this->assertTrue( wp_script_is( 'handle', 'enqueued' ) );
	}

	public function test_register_style_with_defaults(): void {
		$this->assertTrue( ( new Assets() )->register_style( 'handle', 'src.css' ) );

		$style = wp_styles()->query( 'handle' );
		$this->assertSame( self::THEME_URI . 'src.css', $style->src );
		$this->assertSame( [], $style->deps );
		$this->assertFalse( $style->ver );
		$this->assertSame( 'all', $style->args );
	}

	public function test_register_style_with_arguments(): void {
		( new Assets() )->register_style( 'handle', 'dist/app.css', [ 'dep' ], '1.2.3', 'print' );

		$style = wp_styles()->query( 'handle' );
		$this->assertSame( self::THEME_URI . 'dist/app.css', $style->src );
		$this->assertSame( [ 'dep' ], $style->deps );
		$this->assertSame( '1.2.3', $style->ver );
		$this->assertSame( 'print', $style->args );
	}

	public function test_enqueue_style(): void {
		$assets = new Assets();
		$assets->register_style( 'handle', 'src.css' );
		$assets->enqueue_style( 'handle' );

		$this->assertTrue( wp_style_is( 'handle', 'enqueued' ) );
	}
}
