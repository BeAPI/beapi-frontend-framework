<?php

namespace BEA\Theme\Framework\Tests\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Services\Assets;
use WP_UnitTestCase;

/**
 * The assets manifest and the asset data are memoized in static variables, each test needs a fresh process.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class AssetsTest extends WP_UnitTestCase {

	private const FIXTURES_DIR = __DIR__ . '/../../assets/assets/';

	private const THEME_URI = 'https://cdn.example.test/theme/';

	/**
	 * Theme relative files (without leading slash) mapped to fixture files.
	 *
	 * @var array<string, string>
	 */
	private array $theme_files = [];

	public function set_up(): void {
		parent::set_up();

		$GLOBALS['wp_scripts'] = null;
		$GLOBALS['wp_styles']  = null;
		$this->theme_files     = [];

		// Never read the theme built dist/ folder: unknown files resolve to a missing path.
		add_filter(
			'theme_file_path',
			function ( $path, $file ) {
				return $this->theme_files[ $file ] ?? self::FIXTURES_DIR . 'missing/' . $file;
			},
			10,
			2
		);
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
		set_current_screen( 'front' );

		parent::tear_down();
	}

	/**
	 * @param array<string, string> $map Theme relative file => fixture file name.
	 */
	private function use_theme_files( array $map ): void {
		foreach ( $map as $file => $fixture ) {
			$this->theme_files[ $file ] = self::FIXTURES_DIR . $fixture;
		}
	}

	private function get_registered_assets(): Assets {
		$assets = new Assets();
		$assets->register( Framework::get_container() );

		return $assets;
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'assets', ( new Assets() )->get_service_name() );
	}

	public function test_boot_adds_hooks(): void {
		$assets = new Assets();
		$assets->boot( Framework::get_container() );

		$this->assertSame( 10, has_action( 'wp', [ $assets, 'register_assets' ] ) );
		$this->assertSame( 10, has_action( 'wp_enqueue_scripts', [ $assets, 'enqueue_scripts' ] ) );
		$this->assertSame( 10, has_action( 'wp_enqueue_scripts', [ $assets, 'enqueue_styles' ] ) );
		$this->assertSame( 10, has_filter( 'stylesheet_uri', [ $assets, 'stylesheet_uri' ] ) );
		$this->assertSame( 10, has_filter( 'wp_login_page_theme_css', [ $assets, 'login_stylesheet_uri' ] ) );
	}

	public function test_stylesheet_uri_without_manifest_and_files(): void {
		$this->assertSame( 'ok.css', ( new Assets() )->stylesheet_uri( 'ok.css' ) );
	}

	public function test_stylesheet_uri_without_manifest_falls_back_on_app_css(): void {
		$this->use_theme_files( [ 'dist/app.css' => 'app.css' ] );

		$this->assertSame( self::THEME_URI . 'dist/app.css', ( new Assets() )->stylesheet_uri( 'ok.css' ) );
	}

	public function test_stylesheet_uri_with_manifest(): void {
		$this->use_theme_files(
			[
				'dist/assets.json' => 'assets.json',
				'dist/app.min.css' => 'app.min.css',
			]
		);

		$this->assertSame( self::THEME_URI . 'dist/app.min.css', ( new Assets() )->stylesheet_uri( 'ok.css' ) );
	}

	public function test_stylesheet_uri_is_applied_by_get_stylesheet_uri(): void {
		$this->use_theme_files(
			[
				'dist/assets.json' => 'assets.json',
				'dist/app.min.css' => 'app.min.css',
			]
		);

		$assets = new Assets();
		$assets->boot( Framework::get_container() );

		$this->assertSame( self::THEME_URI . 'dist/app.min.css', get_stylesheet_uri() );
	}

	public function test_get_min_file_with_empty_type(): void {
		$this->assertSame( '', ( new Assets() )->get_min_file( '' ) );
	}

	public function test_get_min_file_without_manifest(): void {
		$this->assertSame( '', ( new Assets() )->get_min_file( 'css' ) );
	}

	public function test_get_min_file_with_empty_manifest(): void {
		$this->use_theme_files( [ 'dist/assets.json' => 'assets-empty.json' ] );

		$this->assertSame( '', ( new Assets() )->get_min_file( 'css' ) );
	}

	public function test_get_min_file_with_unknown_type(): void {
		$this->use_theme_files( [ 'dist/assets.json' => 'assets.json' ] );

		$this->assertSame( '', ( new Assets() )->get_min_file( 'non-existing' ) );
	}

	public function test_get_min_file_with_known_types(): void {
		$this->use_theme_files( [ 'dist/assets.json' => 'assets.json' ] );

		$assets = new Assets();

		$this->assertSame( 'app.min.css', $assets->get_min_file( 'css' ) );
		$this->assertSame( 'app.min.js', $assets->get_min_file( 'js' ) );
		$this->assertSame( 'editor.min.css', $assets->get_min_file( 'editor.css' ) );
		$this->assertSame( 'editor.min.js', $assets->get_min_file( 'editor.js' ) );
		$this->assertSame( 'login.min.css', $assets->get_min_file( 'login' ) );

		// Custom manifest key.
		$this->assertSame( 'custom.min.css', $assets->get_min_file( 'custom.css' ) );

		// Values are not keys.
		$this->assertSame( '', $assets->get_min_file( 'custom.min.css' ) );

		// Non string entries are ignored.
		$this->assertSame( '', $assets->get_min_file( 'imageDimensions' ) );
	}

	public function test_get_min_file_manifest_is_read_once_per_request(): void {
		$this->use_theme_files( [ 'dist/assets.json' => 'assets.json' ] );

		$assets = new Assets();
		$this->assertSame( 'app.min.css', $assets->get_min_file( 'css' ) );

		// The decoded manifest is memoized and shared by every instance.
		$this->theme_files = [];
		$this->assertSame( 'app.min.css', ( new Assets() )->get_min_file( 'css' ) );
	}

	public function test_get_static_image_dimensions(): void {
		$this->use_theme_files( [ 'dist/assets.json' => 'assets.json' ] );

		$assets = new Assets();

		$this->assertSame(
			[
				'width'  => 120,
				'height' => 40,
			],
			$assets->get_static_image_dimensions( '/dist/images/logo.svg' )
		);
		$this->assertNull( $assets->get_static_image_dimensions( 'dist/images/invalid.svg' ) );
		$this->assertNull( $assets->get_static_image_dimensions( 'dist/images/unknown.svg' ) );
	}

	public function test_get_static_image_dimensions_without_manifest(): void {
		$this->assertNull( ( new Assets() )->get_static_image_dimensions( 'dist/images/logo.svg' ) );
	}

	public function test_get_asset_data(): void {
		$empty  = [
			'dependencies' => [],
			'version'      => '',
		];
		$assets = new Assets();

		$this->assertSame( $empty, $assets->get_asset_data( ' ' ) );

		$this->use_theme_files( [ 'dist/app.asset.php' => 'app.asset.php' ] );

		$this->assertSame(
			[
				'dependencies' => [ 'wp-dom-ready' ],
				'version'      => 'abc123',
			],
			$assets->get_asset_data( 'app.min.js' )
		);
		$this->assertSame( $empty, $assets->get_asset_data( 'editor.js' ) );
	}

	public function test_login_stylesheet_uri_with_manifest(): void {
		$this->use_theme_files(
			[
				'dist/assets.json'   => 'assets.json',
				'dist/login.min.css' => 'app.min.css',
			]
		);

		$this->assertSame( 'dist/login.min.css', ( new Assets() )->login_stylesheet_uri() );
	}

	public function test_login_stylesheet_uri_falls_back_on_login_css(): void {
		// The manifest entry exists but the built file is missing.
		$this->use_theme_files(
			[
				'dist/assets.json' => 'assets.json',
				'dist/login.css'   => 'app.css',
			]
		);

		$this->assertSame( 'dist/login.css', ( new Assets() )->login_stylesheet_uri() );
	}

	public function test_login_stylesheet_uri_default(): void {
		$this->assertSame( 'default.css', ( new Assets() )->login_stylesheet_uri( 'default.css' ) );
	}

	public function test_login_stylesheet_uri_is_applied_by_login_filter(): void {
		$this->use_theme_files(
			[
				'dist/assets.json'   => 'assets.json',
				'dist/login.min.css' => 'app.min.css',
			]
		);

		$assets = new Assets();
		$assets->boot( Framework::get_container() );

		$this->assertSame( 'dist/login.min.css', apply_filters( 'wp_login_page_theme_css', '' ) );
	}

	public function test_register_assets_does_nothing_in_admin(): void {
		set_current_screen( 'edit.php' );

		$this->get_registered_assets()->register_assets();

		$this->assertFalse( wp_scripts()->query( 'scripts' ) );
		$this->assertFalse( wp_styles()->query( 'theme-style' ) );
	}

	public function test_register_assets_without_manifest(): void {
		$this->get_registered_assets()->register_assets();

		$script = wp_scripts()->query( 'scripts' );
		$this->assertInstanceOf( \_WP_Dependency::class, $script );
		$this->assertSame( self::THEME_URI . 'dist/app.js', $script->src );
		$this->assertSame( [ 'jquery', 'wp-i18n' ], $script->deps );
		// An empty version string makes WordPress use the WordPress version.
		$this->assertSame( '', $script->ver );
		$this->assertSame( 'defer', wp_scripts()->get_data( 'scripts', 'strategy' ) );

		$style = wp_styles()->query( 'theme-style' );
		$this->assertInstanceOf( \_WP_Dependency::class, $style );
		$this->assertSame( get_stylesheet_directory_uri() . '/style.css', $style->src );
		$this->assertSame( [], $style->deps );
		$this->assertSame( '', $style->ver );
	}

	public function test_register_assets_with_manifest(): void {
		$this->use_theme_files(
			[
				'dist/assets.json'   => 'assets.json',
				'dist/app.asset.php' => 'app.asset.php',
				'dist/app.min.css'   => 'app.min.css',
			]
		);

		$this->get_registered_assets()->register_assets();

		$script = wp_scripts()->query( 'scripts' );
		$this->assertSame( self::THEME_URI . 'dist/app.min.js', $script->src );
		$this->assertSame( [ 'jquery', 'wp-i18n', 'wp-dom-ready' ], $script->deps );
		$this->assertSame( 'abc123', $script->ver );
		$this->assertSame( 'defer', wp_scripts()->get_data( 'scripts', 'strategy' ) );

		$style = wp_styles()->query( 'theme-style' );
		// get_stylesheet_uri() goes through the stylesheet_uri filter of the booted theme service.
		$this->assertSame( self::THEME_URI . 'dist/app.min.css', $style->src );
		$this->assertSame( 'abc123', $style->ver );
	}

	public function test_register_assets_adds_theme_data_inline_script(): void {
		$this->get_registered_assets()->register_assets();

		// WP_Scripts stores a leading false entry when the first inline script is added.
		$inline = array_values( array_filter( (array) wp_scripts()->get_data( 'scripts', 'after' ) ) );
		$this->assertCount( 1, $inline );
		$this->assertStringStartsWith( 'const THEME_DATA = ', $inline[0] );
		$this->assertSame(
			[ 'themeUri' => get_template_directory_uri() ],
			json_decode( substr( $inline[0], strlen( 'const THEME_DATA = ' ) ), true )
		);
		$this->assertFalse( wp_scripts()->get_data( 'scripts', 'before' ) );
	}

	public function test_enqueue_scripts_and_styles(): void {
		$this->use_theme_files( [ 'languages' => 'languages' ] );

		$assets = $this->get_registered_assets();
		$assets->register_assets();
		$assets->enqueue_scripts();
		$assets->enqueue_styles();

		$this->assertTrue( wp_script_is( 'scripts', 'enqueued' ) );
		$this->assertSame( 'beapi-frontend-framework', wp_scripts()->registered['scripts']->textdomain );
		$this->assertSame( self::FIXTURES_DIR . 'languages', wp_scripts()->registered['scripts']->translations_path );
		$this->assertTrue( wp_style_is( 'theme-style', 'enqueued' ) );
	}

	public function test_assets_are_enqueued_on_wp_enqueue_scripts(): void {
		$assets = $this->get_registered_assets();
		$assets->boot( Framework::get_container() );

		do_action( 'wp' );
		do_action( 'wp_enqueue_scripts' );

		$this->assertTrue( wp_script_is( 'scripts', 'enqueued' ) );
		$this->assertTrue( wp_style_is( 'theme-style', 'enqueued' ) );
	}
}
