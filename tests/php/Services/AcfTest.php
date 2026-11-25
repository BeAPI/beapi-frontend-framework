<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Acf;

class AcfTest extends WP_UnitTestCase {

	public function tear_down(): void {
		unset( $GLOBALS['bea_acf_fixture_loads'] );

		parent::tear_down();
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'acf', ( new Acf() )->get_service_name() );
	}

	public function test_service_is_booted_by_the_theme(): void {
		$acf = Framework::get_container()->get_service( 'acf' );

		$this->assertInstanceOf( Acf::class, $acf );
		$this->assertSame( 0, has_action( 'template_redirect', [ $acf, 'warning' ] ) );
		$this->assertSame( 0, has_action( 'init', [ $acf, 'init' ] ) );
		$this->assertSame( 4, has_action( 'init', [ $acf, 'init_acf' ] ) );
	}

	public function test_register_adds_no_hook(): void {
		$acf = new Acf();

		$acf->register( new Service_Container() );

		$this->assertFalse( has_action( 'template_redirect', [ $acf, 'warning' ] ) );
		$this->assertFalse( has_action( 'init', [ $acf, 'init' ] ) );
		$this->assertFalse( has_action( 'init', [ $acf, 'init_acf' ] ) );
	}

	public function test_boot_adds_hooks(): void {
		$acf = new Acf();

		$acf->boot( new Service_Container() );

		$this->assertSame( 0, has_action( 'template_redirect', [ $acf, 'warning' ] ) );
		$this->assertSame( 0, has_action( 'init', [ $acf, 'init' ] ) );
		$this->assertSame( 4, has_action( 'init', [ $acf, 'init_acf' ] ) );
	}

	public function test_warning_does_nothing_when_acf_is_active(): void {
		$this->assertTrue( function_exists( 'get_field' ), 'ACF must be loaded by the tests bootstrap.' );

		// wp_die() would throw a WPDieException.
		$this->assertNull( ( new Acf() )->warning() );
	}

	public function test_init_does_nothing_by_default(): void {
		$acf = new Acf();

		$this->assertNull( $acf->init() );
		$this->assertSame( [], $acf->get_files() );
	}

	public function test_register_files(): void {
		$acf = new Acf();

		$this->assertSame( [], $acf->get_files() );

		$acf->register_files( [ 'myfile' ] );
		$this->assertSame( [ 'myfile' => 'myfile' ], $acf->get_files() );

		// Empty values are ignored.
		$acf->register_files( [ 'myfile', '' ] );
		$this->assertSame( [ 'myfile' => 'myfile' ], $acf->get_files() );

		// Files are registered once.
		$acf->register_files( [ 'myfile', 'other' ] );
		$this->assertSame(
			[
				'myfile' => 'myfile',
				'other'  => 'other',
			],
			$acf->get_files()
		);
	}

	public function test_init_acf_without_files(): void {
		$acf = new Acf();
		$acf->set_path( 'tests/assets/acf/' );

		$this->assertNull( $acf->init_acf() );
		$this->assertArrayNotHasKey( 'bea_acf_fixture_loads', $GLOBALS );
	}

	public function test_init_acf_with_missing_directory(): void {
		$acf = new Acf();
		$acf->set_path( 'tests/assets/missing-acf-directory/' );
		$acf->register_files( [ 'field-group' ] );

		$this->assertNull( $acf->init_acf() );
		$this->assertArrayNotHasKey( 'bea_acf_fixture_loads', $GLOBALS );
	}

	/**
	 * The fixture is loaded with require_once: isolate the process so the load is observable.
	 *
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_init_acf_loads_registered_files(): void {
		$acf = new Acf();
		// The default path is assets/acf/php/, set_path() changes it to the fixtures directory.
		$acf->set_path( 'tests/assets/acf/' );
		$acf->register_files( [ 'missing-file', 'field-group', 'other-missing-file' ] );

		$acf->init_acf();

		// Missing files are skipped, existing ones are loaded once.
		$this->assertSame( 1, $GLOBALS['bea_acf_fixture_loads'] );

		$acf->init_acf();

		$this->assertSame( 1, $GLOBALS['bea_acf_fixture_loads'] );
	}

	public function test_init_acf_resolves_files_with_theme_file_path(): void {
		$requested = [];
		add_filter(
			'theme_file_path',
			static function ( $path, $file ) use ( &$requested ) {
				$requested[] = $file;

				return $path;
			},
			10,
			2
		);

		$acf = new Acf();
		$acf->register_files( [ 'options-theme' ] );
		$acf->init_acf();

		// Default path, the theme has no assets/acf/php/options-theme.php file.
		$this->assertContains( 'assets/acf/php/', $requested );
	}

	public function test_acf_add_options_page_without_acf_pro(): void {
		if ( function_exists( 'acf_add_options_page' ) ) {
			$this->markTestSkipped( 'Requires ACF without the options pages (ACF PRO is active).' );
		}

		$acf = new Acf();

		// No exception: the function check happens before the menu slug check.
		$this->assertFalse( $acf->acf_add_options_page( [] ) );
		$this->assertFalse( $acf->acf_add_options_page( [ 'menu_slug' => 'ok' ] ) );
	}

	public function test_acf_add_options_sub_page_without_acf_pro(): void {
		if ( function_exists( 'acf_add_options_sub_page' ) ) {
			$this->markTestSkipped( 'Requires ACF without the options pages (ACF PRO is active).' );
		}

		$acf = new Acf();

		$this->assertFalse( $acf->acf_add_options_sub_page( [] ) );
		$this->assertFalse( $acf->acf_add_options_sub_page( [ 'menu_slug' => 'ok' ] ) );
	}

	/**
	 * Uses ACF PRO when active, otherwise declares stand-in functions, hence the separate process.
	 *
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_acf_add_options_page(): void {
		require_once dirname( __DIR__, 2 ) . '/assets/acf/acf-pro-stand-in.php';

		$page = ( new Acf() )->acf_add_options_page(
			[
				'page_title' => 'Theme options',
				'menu_slug'  => 'bea-theme-options',
			]
		);

		$this->assertIsArray( $page );
		$this->assertSame( 'bea-theme-options', $page['menu_slug'] );
	}

	/**
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_acf_add_options_page_requires_menu_slug(): void {
		require_once dirname( __DIR__, 2 ) . '/assets/acf/acf-pro-stand-in.php';

		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'You must specify menu slug for ACF options page.' );

		( new Acf() )->acf_add_options_page( [ 'page_title' => 'Theme options' ] );
	}

	/**
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_acf_add_options_sub_page(): void {
		require_once dirname( __DIR__, 2 ) . '/assets/acf/acf-pro-stand-in.php';

		$page = ( new Acf() )->acf_add_options_sub_page(
			[
				'page_title'  => 'Theme options 1',
				'menu_slug'   => 'bea-theme-options-1',
				'parent_slug' => 'bea-theme-options',
			]
		);

		$this->assertIsArray( $page );
		$this->assertSame( 'bea-theme-options-1', $page['menu_slug'] );
	}

	/**
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_acf_add_options_sub_page_requires_menu_slug(): void {
		require_once dirname( __DIR__, 2 ) . '/assets/acf/acf-pro-stand-in.php';

		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'You must specify menu slug for ACF options page.' );

		( new Acf() )->acf_add_options_sub_page( [ 'parent_slug' => 'bea-theme-options' ] );
	}
}
