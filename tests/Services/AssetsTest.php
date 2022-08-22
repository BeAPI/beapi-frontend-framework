<?php

namespace Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Acf;
use BEA\Theme\Framework\Services\Assets;
use BEA\Theme\Framework\Services\Svg;
use InvalidArgumentException;
use stdclass;
use WP_Mock;
use WP_Mock\Tools\TestCase;
use function define;

class AssetsTest extends TestCase {
	/**
	 * Since we have CONSTANTS, run all tests in separate processes
	 */
	protected $preserveGlobalState = false;
	protected $runTestInSeparateProcess = true;

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

	public function testStyleSheetURIWithScriptDebugAndNoFiles() {
		$assets = new Assets();

		define( 'SCRIPT_DEBUG', true );

		WP_Mock::userFunction( 'get_theme_file_path', [
			'times'  => 1,
			'return' => 'ok.css',
			'args'   => [ '/dist/app.css' ],
		] );

		$this->assertSame( 'ok.css', $assets->stylesheet_uri( 'ok.css' ) );
	}

	public function testStyleSheetURIWithScriptDebugAndFiles() {
		$assets = new Assets();

		define( 'SCRIPT_DEBUG', true );

		$assets_file = __DIR__ . '/../data/assets/app.css';

		WP_Mock::userFunction(
			'get_theme_file_path',
			[
				'times'  => 1,
				'return' => $assets_file,
				'args'   => [
					'/dist/app.css',
				],
			]
		);
		WP_Mock::userFunction(
			'get_theme_file_uri',
			[
				'times'  => 1,
				'args'   => [
					'/dist/app.css',
				],
				'return' => 'https://localhost.dev/data/assets/app.css',
			]
		);

		$this->assertSame( 'https://localhost.dev/data/assets/app.css', $assets->stylesheet_uri( 'ok.css' ) );
	}

	public function testStyleSheetURIWithOutScriptDebugAndNoFiles() {
		$assets = new Assets();

		define( 'SCRIPT_DEBUG', false );

		WP_Mock::passthruFunction( 'get_theme_file_path', [ 'times' => 2 ] );

		$this->assertSame( 'ok.css', $assets->stylesheet_uri( 'ok.css' ) );
	}

	public function testGetMinFileEmpty() {
		$assets = new Assets();

		$this->assertSame( '', $assets->get_min_file( '' ) );
	}

	public function testGetMinFileAssetsExistsAndEmpty() {
		$assets      = new Assets();
		$assets_file = __DIR__ . '/../data/assets/assets-empty.json';

		WP_Mock::userFunction( 'get_theme_file_path', [ 'args' => '/dist/assets.json', 'return' => $assets_file ] );

		$this->assertSame( '', $assets->get_min_file( 'css' ) );
	}

	public function testGetMinFileAssetsExistsNotEmptyNonExistingType() {
		$assets      = new Assets();
		$assets_file = __DIR__ . '/../data/assets/assets.json';

		WP_Mock::userFunction( 'get_theme_file_path', [ 'args' => '/dist/assets.json', 'return' => $assets_file ] );

		$this->assertSame( '', $assets->get_min_file( 'non-existing' ) );
	}

	public function testGetMinFileAssetsExistsNotEmptyExistingType() {
		$assets      = new Assets();
		$assets_file = __DIR__ . '/../data/assets/assets.json';

		WP_Mock::userFunction( 'get_theme_file_path', [ 'args' => '/dist/assets.json', 'return' => $assets_file ] );

		// Existing
		$this->assertSame( 'app.min.css', $assets->get_min_file( 'css' ) );
		$this->assertSame( 'app.min.js', $assets->get_min_file( 'js' ) );
		$this->assertSame( 'editor.min.css', $assets->get_min_file( 'editor.css' ) );
		$this->assertSame( 'editor.min.js', $assets->get_min_file( 'editor.js' ) );
		$this->assertSame( 'login.min.css', $assets->get_min_file( 'login' ) );

		// Custom
		$this->assertSame( 'custom.min.css', $assets->get_min_file( 'custom.css' ) );

		// Non existing
		$this->assertSame( '', $assets->get_min_file( 'custom.min.css' ) );
	}

	public function testGetLoginStyleSheet() {
		$assets      = new Assets();
		$assets_file = __DIR__ . '/../data/assets/assets.json';

		WP_Mock::userFunction( 'get_theme_file_path', [ 'args' => '/dist/assets.json', 'return' => $assets_file ] );

		// Existing
		$this->assertSame( 'dist/login.min.css', $assets->login_stylesheet_uri() );
	}

	public function testGetLoginStyleSheetDebug() {
		$assets      = new Assets();
		$assets_file = __DIR__ . '/../data/assets/assets.json';
		define( 'SCRIPT_DEBUG', true );

		WP_Mock::userFunction( 'get_theme_file_path', [ 'args' => '/dist/assets.json', 'return' => $assets_file ] );

		// Existing
		$this->assertSame( 'dist/login.css', $assets->login_stylesheet_uri() );
	}

	public function testRegisterFilesAdmin() {
		$assets = new Assets();

		WP_Mock::userFunction( 'is_admin', [ 'return' => true, 'times' => 1 ] );
		WP_Mock::passthruFunction( 'wp_get_theme', [ 'times' => 0 ] );

		$this->assertNull( $assets->register_assets() );
	}

	public function testRegisterFiles() {
		$assets     = new Assets();
		$container  = Framework::get_container();
		$theme_mock = $this->getMockBuilder( stdclass::class )->addMethods( [ 'get' ] )->getMock();
		$assets->register( $container );

		WP_Mock::userFunction(
			'is_admin',
			[
				'return' => false,
				'times'  => 1,
			]
		);
		WP_Mock::userFunction(
			'wp_get_theme',
			[
				'times'  => 1,
				'return' => $theme_mock,
			]
		);
		WP_Mock::passthruFunction( 'wp_register_script', [ 'times' => 2 ] );
		WP_Mock::passthruFunction( 'wp_register_style', [ 'times' => 1 ] );
		WP_Mock::passthruFunction( 'get_theme_file_path', [ 'times' => 1 ] );
		WP_Mock::passthruFunction( 'get_theme_file_uri' );
		WP_Mock::userFunction( 'get_stylesheet_uri', [ 'return' => false ] );

		// Check the version is called
		$theme_mock->expects( $this->atLeastOnce() )->method( 'get' );

		$this->assertNull( $assets->register_assets() );
	}

	public function testCheckFiltersAdded() {
		$assets = new Assets();

		// Check filters
		WP_Mock::expectFilterAdded( 'stylesheet_uri', [ $assets, 'stylesheet_uri' ] );
		WP_Mock::expectFilterAdded( 'wp_login_page_theme_css', [ $assets, 'login_stylesheet_uri' ] );

		// Check Action
		WP_Mock::expectActionAdded( 'wp', [ $assets, 'register_assets' ] );
		WP_Mock::expectActionAdded( 'wp_enqueue_scripts', [ $assets, 'enqueue_scripts' ] );
		WP_Mock::expectActionAdded( 'wp_print_styles', [ $assets, 'enqueue_styles' ] );

		$assets->boot( Framework::get_container() );
	}
}
