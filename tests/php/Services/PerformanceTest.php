<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Performance;

class PerformanceTest extends WP_UnitTestCase {

	/**
	 * Fixture font, relative to the theme root.
	 */
	private const FONT_FIXTURE = 'tests/assets/fonts/font.woff2';

	/**
	 * @var WP_Scripts|null
	 */
	private $wp_scripts;

	public function set_up(): void {
		parent::set_up();

		$this->wp_scripts = $GLOBALS['wp_scripts'] ?? null;
		// Fresh scripts registry, with the default scripts (jquery).
		$GLOBALS['wp_scripts'] = null;
	}

	public function tear_down(): void {
		$GLOBALS['wp_scripts'] = $this->wp_scripts;
		set_current_screen( 'front' );

		parent::tear_down();
	}

	/**
	 * Redirect the dist/fonts/ files to the font fixture (dist/ is not built in CI), other files are left as is.
	 *
	 * @param string[] $fonts Font file names available in dist/fonts/.
	 */
	private function use_font_fixtures( array $fonts ): void {
		add_filter(
			'theme_file_path',
			static function ( $path, $file ) use ( $fonts ) {
				if ( in_array( $file, $fonts, true ) ) {
					return get_stylesheet_directory() . '/' . self::FONT_FIXTURE;
				}

				return $path;
			},
			10,
			2
		);
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'performance', ( new Performance() )->get_service_name() );
	}

	public function test_service_is_booted_by_the_theme(): void {
		$performance = Framework::get_container()->get_service( 'performance' );

		$this->assertInstanceOf( Performance::class, $performance );
		$this->assertSame( 10, has_action( 'wp', [ $performance, 'register_assets' ] ) );
		$this->assertSame( 1, has_action( 'wp_head', [ $performance, 'preload_fonts' ] ) );
	}

	public function test_register_adds_no_hook(): void {
		$performance = new Performance();

		$this->assertNull( $performance->register( new Service_Container() ) );
		$this->assertFalse( has_action( 'wp', [ $performance, 'register_assets' ] ) );
		$this->assertFalse( has_action( 'wp_head', [ $performance, 'preload_fonts' ] ) );
	}

	public function test_boot_adds_actions(): void {
		$performance = new Performance();

		$performance->boot( new Service_Container() );

		$this->assertSame( 10, has_action( 'wp', [ $performance, 'register_assets' ] ) );
		$this->assertSame( 1, has_action( 'wp_head', [ $performance, 'preload_fonts' ] ) );
	}

	public function test_passive_touchstart(): void {
		$script = ( new Performance() )->passive_touchstart();

		$this->assertStringStartsWith( 'jQuery.event.special.touchstart=', $script );
		$this->assertStringContainsString( 'jQuery.event.special.touchmove=', $script );
		$this->assertStringContainsString( 'jQuery.event.special.wheel=', $script );
		$this->assertStringContainsString( 'jQuery.event.special.mousewheel=', $script );
		$this->assertStringEndsWith( ';', $script );
	}

	public function test_register_assets_in_admin(): void {
		set_current_screen( 'edit.php' );

		$this->assertNull( ( new Performance() )->register_assets() );
		$this->assertFalse( wp_scripts()->get_data( 'jquery', 'after' ) );
	}

	public function test_register_assets(): void {
		$performance = new Performance();

		$this->assertNull( $performance->register_assets() );
		// WP_Scripts::add_inline_script() casts the missing data (false) to an array, filter it out.
		$this->assertSame( [ $performance->passive_touchstart() ], array_values( array_filter( wp_scripts()->get_data( 'jquery', 'after' ) ) ) );
	}

	public function test_preload_fonts_in_admin(): void {
		set_current_screen( 'edit.php' );
		add_filter( 'bea_theme_framework_preload_fonts', static fn() => [ self::FONT_FIXTURE ] );

		$this->expectOutputString( '' );
		( new Performance() )->preload_fonts();
	}

	public function test_preload_fonts_empty_by_default(): void {
		$this->expectOutputString( '' );
		( new Performance() )->preload_fonts();
	}

	public function test_preload_fonts_filter_not_array(): void {
		$this->use_font_fixtures( [ 'dist/fonts/font.woff2' ] );
		add_filter( 'bea_theme_framework_preload_fonts', static fn() => 'dist/fonts/font.woff2' );

		$this->expectOutputString( '' );
		( new Performance() )->preload_fonts();
	}

	public function test_preload_fonts(): void {
		$this->use_font_fixtures( [ 'dist/fonts/font.woff2', 'dist/fonts/other.woff2' ] );
		add_filter(
			'bea_theme_framework_preload_fonts',
			static fn() => [
				'/dist/fonts/font.woff2', // Leading slash is trimmed.
				'dist/fonts/missing.woff2', // Not readable, skipped.
				'', // Empty, skipped.
				42, // Not a string, skipped.
				null, // Not a string, skipped.
				'dist/fonts/other.woff2',
			]
		);

		$theme_uri = get_stylesheet_directory_uri();

		$this->expectOutputString(
			'<link rel="preload" href="' . $theme_uri . '/dist/fonts/font.woff2" as="font" type="font/woff2" crossorigin>' . "\n" .
			'<link rel="preload" href="' . $theme_uri . '/dist/fonts/other.woff2" as="font" type="font/woff2" crossorigin>' . "\n"
		);
		( new Performance() )->preload_fonts();
	}

	public function test_preload_fonts_on_wp_head(): void {
		$this->use_font_fixtures( [ 'dist/fonts/font.woff2' ] );
		add_filter( 'bea_theme_framework_preload_fonts', static fn() => [ 'dist/fonts/font.woff2' ] );

		$performance = Framework::get_container()->get_service( 'performance' );

		// Only run the theme callback, wp_head prints a lot of unrelated markup.
		remove_all_actions( 'wp_head' );
		add_action( 'wp_head', [ $performance, 'preload_fonts' ], 1 );

		$this->expectOutputString( '<link rel="preload" href="' . get_stylesheet_directory_uri() . '/dist/fonts/font.woff2" as="font" type="font/woff2" crossorigin>' . "\n" );
		do_action( 'wp_head' );
	}

	public function test_preload_fonts_escapes_url(): void {
		$this->use_font_fixtures( [ 'dist/fonts/my font.woff2', 'dist/fonts/evil.woff2' ] );
		add_filter( 'bea_theme_framework_preload_fonts', static fn() => [ 'dist/fonts/my font.woff2', 'dist/fonts/evil.woff2' ] );
		add_filter(
			'theme_file_uri',
			static function ( $url, $file ) {
				return 'dist/fonts/evil.woff2' === $file ? 'javascript:alert(1)' : $url;
			},
			10,
			2
		);

		// Spaces are encoded, unsafe protocols are removed by esc_url().
		$this->expectOutputString(
			'<link rel="preload" href="' . get_stylesheet_directory_uri() . '/dist/fonts/my%20font.woff2" as="font" type="font/woff2" crossorigin>' . "\n" .
			'<link rel="preload" href="" as="font" type="font/woff2" crossorigin>' . "\n"
		);
		( new Performance() )->preload_fonts();
	}
}
