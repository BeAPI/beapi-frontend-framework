<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Theme;

class ThemeTest extends WP_UnitTestCase {

	private const FEATURES = [
		'align-wide',
		'responsive-embeds',
		'editor-styles',
		'wp-block-styles',
		'post-thumbnails',
		'html5',
		'title-tag',
		'yoast-seo-breadcrumbs',
	];

	private const HTML5 = [ 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'script', 'style' ];

	/**
	 * @var array
	 */
	private $theme_features = [];

	/**
	 * @var array|null Text domain custom paths of the registry, null when unavailable.
	 */
	private $textdomain_paths;

	public function set_up(): void {
		parent::set_up();

		$this->theme_features   = $GLOBALS['_wp_theme_features'] ?? [];
		$this->textdomain_paths = $this->get_textdomain_paths();
	}

	public function tear_down(): void {
		$GLOBALS['_wp_theme_features'] = $this->theme_features;

		if ( null !== $this->textdomain_paths ) {
			( new ReflectionProperty( WP_Textdomain_Registry::class, 'custom_paths' ) )->setValue( $GLOBALS['wp_textdomain_registry'], $this->textdomain_paths );
		}

		parent::tear_down();
	}

	/**
	 * Read the custom paths set by load_theme_textdomain() (WordPress 6.1+).
	 *
	 * @return array|null
	 */
	private function get_textdomain_paths(): ?array {
		if ( ! isset( $GLOBALS['wp_textdomain_registry'] ) || ! property_exists( WP_Textdomain_Registry::class, 'custom_paths' ) ) {
			return null;
		}

		return ( new ReflectionProperty( WP_Textdomain_Registry::class, 'custom_paths' ) )->getValue( $GLOBALS['wp_textdomain_registry'] );
	}

	/**
	 * Remove the supports managed by the service, restored in tear_down().
	 *
	 * 'title-tag' is kept: WordPress refuses to add it after wp_loaded, the tests run after it.
	 */
	private function reset_supports(): void {
		foreach ( array_diff( self::FEATURES, [ 'title-tag' ] ) as $feature ) {
			remove_theme_support( $feature );
		}
		add_theme_support( 'core-block-patterns' );
	}

	private function assert_theme_setup(): void {
		// get_theme_support(): current_theme_supports( 'title-tag' ) is only true when called from core title functions.
		foreach ( self::FEATURES as $feature ) {
			$this->assertNotFalse( get_theme_support( $feature ), $feature );
		}

		$this->assertSame( [ self::HTML5 ], get_theme_support( 'html5' ) );
		$this->assertFalse( current_theme_supports( 'core-block-patterns' ) );
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'theme', ( new Theme() )->get_service_name() );
	}

	public function test_theme_is_set_up_by_the_theme(): void {
		$this->assertInstanceOf( Theme::class, Framework::get_container()->get_service( 'theme' ) );

		// html5 is not checked: WP_UnitTestCase::tear_down() removes it after each test.
		foreach ( array_diff( self::FEATURES, [ 'html5' ] ) as $feature ) {
			$this->assertNotFalse( get_theme_support( $feature ), $feature );
		}
		$this->assertFalse( current_theme_supports( 'core-block-patterns' ) );
	}

	public function test_register_does_nothing(): void {
		$this->reset_supports();

		$this->assertNull( ( new Theme() )->register( new Service_Container() ) );

		foreach ( array_diff( self::FEATURES, [ 'title-tag' ] ) as $feature ) {
			$this->assertFalse( get_theme_support( $feature ), $feature );
		}
		$this->assertTrue( current_theme_supports( 'core-block-patterns' ) );
	}

	/**
	 * The service is meant to run on after_setup_theme, before wp_loaded.
	 *
	 * Called later, WordPress flags add_theme_support( 'title-tag' ) as an incorrect usage.
	 */
	private function expect_late_title_tag(): void {
		$this->setExpectedIncorrectUsage( "add_theme_support( 'title-tag' )" );
	}

	public function test_after_setup_theme(): void {
		$this->reset_supports();
		$this->expect_late_title_tag();

		$this->assertNull( ( new Theme() )->after_setup_theme() );

		$this->assert_theme_setup();
	}

	public function test_boot(): void {
		$this->reset_supports();
		$this->expect_late_title_tag();

		( new Theme() )->boot( new Service_Container() );

		$this->assert_theme_setup();
	}

	public function test_after_setup_theme_loads_textdomain_from_languages(): void {
		if ( null === $this->textdomain_paths ) {
			$this->markTestSkipped( 'Requires WordPress 6.1' );
		}

		$this->expect_late_title_tag();

		$requested = [];
		add_filter(
			'theme_file_path',
			static function ( $path, $file ) use ( &$requested ) {
				$requested[] = $file;

				return 'languages' === $file ? '/tmp/bea-tests/languages/' : $path;
			},
			10,
			2
		);

		( new Theme() )->after_setup_theme();

		// get_theme_file_path() trims the leading slash of '/languages'.
		$this->assertSame( [ 'languages' ], $requested );
		$this->assertSame( '/tmp/bea-tests/languages', $this->get_textdomain_paths()['framework-textdomain'] ?? null );
	}
}
