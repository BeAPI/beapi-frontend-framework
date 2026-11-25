<?php

namespace BEA\Theme\Framework\Tests\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Assets;
use BEA\Theme\Framework\Services\Editor;
use BEA\Theme\Framework\Tools\Assets as Assets_Tools;
use ReflectionProperty;
use WP_Block_Editor_Context;
use WP_Block_Styles_Registry;
use WP_Block_Type_Registry;
use WP_UnitTestCase;

/**
 * The Editor relies on the Assets service, whose manifest and asset data are memoized in static variables: each test
 * needs a fresh process.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class EditorTest extends WP_UnitTestCase {

	private const FIXTURES_DIR = __DIR__ . '/../../assets/';

	private const THEME_URI = 'https://cdn.example.test/theme/';

	private const HANDLE = 'theme-admin-editor-script';

	private const DEFAULT_SETTINGS = [
		'disableAllBlocksStyles'  => [ 'core/separator', 'core/quote', 'core/pullquote', 'core/table', 'core/image' ],
		'disabledBlocksStyles'    => [],
		'allowedBlocksVariations' => [ 'core/embed' => [ 'youtube', 'vimeo', 'dailymotion' ] ],
	];

	private const DISALLOWED_BLOCKS = [
		'core/html',
		'core/freeform',
		'core/code',
		'core/preformatted',
		'core/verse',
		'core/footnotes',
		'core/shortcode',
		'core/math',
		'core/text-columns',
		'core/nextpage',
		'core/read-more',
		'core/embed',
		'core/legacy-widget',
		'core/widget-group',
		'core/accordion',
		'core/accordion-heading',
		'core/accordion-item',
		'core/accordion-panel',
		'core/archives',
		'core/calendar',
		'core/categories',
		'core/latest-comments',
		'core/latest-posts',
		'core/rss',
		'core/search',
		'core/tag-cloud',
		'core/site-tagline',
		'core/site-title',
		'core/breadcrumbs',
		'core/navigation-overlay-close',
		'core/post-author',
		'core/post-author-biography',
		'core/post-author-name',
		'core/post-navigation-link',
		'core/post-terms',
		'core/post-time-to-read',
		'core/avatar',
		'core/comments',
		'core/comments-pagination',
		'core/comments-pagination-next',
		'core/comments-pagination-numbers',
		'core/comments-pagination-previous',
		'core/comments-title',
		'core/comment-author-name',
		'core/comment-content',
		'core/comment-date',
		'core/comment-edit-link',
		'core/comment-reply-link',
		'core/comment-template',
		'core/post-comments',
		'core/post-comments-count',
		'core/post-comments-form',
		'core/post-comments-link',
		'core/query',
		'core/query-no-results',
		'core/query-pagination',
		'core/query-pagination-next',
		'core/query-pagination-numbers',
		'core/query-pagination-previous',
		'core/query-title',
		'core/query-total',
		'core/post-template',
		'core/term-count',
		'core/term-description',
		'core/page-list',
		'core/page-list-item',
		'core/loginout',
		'core/more',
		'core/social-link',
		'core/social-links',
	];

	/**
	 * Theme relative files (without leading slash) mapped to fixture files.
	 *
	 * @var array<string, string>
	 */
	private array $theme_files = [];

	/**
	 * @var array<string, mixed>
	 */
	private array $globals_backup = [];

	public function set_up(): void {
		parent::set_up();

		$GLOBALS['wp_scripts'] = null;
		$this->theme_files     = [];
		$this->globals_backup  = [
			'editor_styles'      => $GLOBALS['editor_styles'] ?? null,
			'_wp_theme_features' => $GLOBALS['_wp_theme_features'] ?? null,
		];

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
		foreach ( $this->globals_backup as $name => $value ) {
			$GLOBALS[ $name ] = $value;
		}
		set_current_screen( 'front' );

		if ( WP_Block_Type_Registry::get_instance()->is_registered( 'bff-test/hero' ) ) {
			unregister_block_type( 'bff-test/hero' );
		}

		parent::tear_down();
	}

	/**
	 * @param array<string, string> $map Theme relative file => fixture path relative to tests/assets.
	 */
	private function use_theme_files( array $map ): void {
		foreach ( $map as $file => $fixture ) {
			$this->theme_files[ $file ] = self::FIXTURES_DIR . $fixture;
		}
	}

	private function use_manifest(): void {
		$this->use_theme_files( [ 'dist/assets.json' => 'assets/assets.json' ] );
	}

	private function get_registered_editor(): Editor {
		$editor = new Editor();
		$editor->register( Framework::get_container() );

		return $editor;
	}

	/**
	 * @return mixed
	 */
	private function get_property( Editor $editor, string $property ) {
		return ( new ReflectionProperty( Editor::class, $property ) )->getValue( $editor );
	}

	/**
	 * @return array<int, array{0: string, 1: string, 2: string}> Block name, style name, style label.
	 */
	private function get_expected_block_styles(): array {
		$styles = [
			[ 'core/paragraph', 'small', 'Small' ],
			[ 'core/paragraph', 'large', 'Large' ],
			[ 'core/paragraph', 'huge', 'Huge' ],
		];

		for ( $i = 1; $i <= 6; $i++ ) {
			$styles[] = [ 'core/heading', 'h' . $i, 'Style H' . $i ];
			$styles[] = [ 'core/paragraph', 'h' . $i, 'Style H' . $i ];
		}

		return $styles;
	}

	private function get_editor_settings(): array {
		$before = array_values( array_filter( (array) wp_scripts()->get_data( self::HANDLE, 'before' ) ) );
		$this->assertCount( 1, $before );
		$this->assertStringStartsWith( 'const BFFEditorSettings = ', $before[0] );

		return json_decode( substr( $before[0], strlen( 'const BFFEditorSettings = ' ) ), true );
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'editor', ( new Editor() )->get_service_name() );
	}

	public function test_register(): void {
		$editor = $this->get_registered_editor();

		$this->assertInstanceOf( Assets_Tools::class, $this->get_property( $editor, 'assets_tools' ) );
		$this->assertInstanceOf( Assets::class, $this->get_property( $editor, 'assets' ) );
		$this->assertSame( Framework::get_container()->get_service( 'assets' ), $this->get_property( $editor, 'assets' ) );
	}

	public function test_register_reads_the_global_container(): void {
		// Suspected bug pinned as current behaviour: the Assets service comes from the global container, not from
		// the container given to register().
		$editor = new Editor();
		$editor->register( new Service_Container() );

		$this->assertSame( Framework::get_container()->get_service( 'assets' ), $this->get_property( $editor, 'assets' ) );
	}

	public function test_register_before_assets_service_is_instantiated(): void {
		$container_property = new ReflectionProperty( Framework::class, 'container' );
		$booted_container   = $container_property->getValue();

		try {
			// A new global container only knows the service class names until boot_services() instantiates them.
			$container_property->setValue( null, null );

			$editor = new Editor();
			$editor->register( Framework::get_container() );

			$this->assertFalse( $this->get_property( $editor, 'assets' ) );
		} finally {
			$container_property->setValue( null, $booted_container );
		}
	}

	public function test_boot_on_front(): void {
		$registry = WP_Block_Styles_Registry::get_instance();
		foreach ( $this->get_expected_block_styles() as [ $block, $name ] ) {
			if ( $registry->is_registered( $block, $name ) ) {
				$registry->unregister( $block, $name );
			}
		}
		$editor_styles = $GLOBALS['editor_styles'] ?? null;

		$editor = $this->get_registered_editor();
		$editor->boot( Framework::get_container() );

		$this->assertSame( 10, has_action( 'enqueue_block_assets', [ $editor, 'admin_editor_script' ] ) );
		$this->assertSame( 10, has_filter( 'allowed_block_types_all', [ $editor, 'gutenberg_blocks_allowed' ] ) );

		// No editor style outside the admin.
		$this->assertSame( $editor_styles, $GLOBALS['editor_styles'] ?? null );

		foreach ( $this->get_expected_block_styles() as [ $block, $name, $label ] ) {
			$style = $registry->get_registered( $block, $name );
			$this->assertIsArray( $style, sprintf( '%s style %s is not registered.', $block, $name ) );
			$this->assertSame( $label, $style['label'] );
		}
	}

	public function test_boot_in_admin_adds_minified_editor_style(): void {
		set_current_screen( 'edit.php' );
		$this->use_manifest();
		$this->use_theme_files( [ 'dist/editor.min.css' => 'editor/editor.css' ] );
		$GLOBALS['editor_styles'] = [];

		$this->get_registered_editor()->boot( Framework::get_container() );

		$this->assertSame( [ 'dist/editor.min.css' ], $GLOBALS['editor_styles'] );
		$this->assertTrue( current_theme_supports( 'editor-style' ) );
	}

	public function test_boot_in_admin_falls_back_on_editor_css(): void {
		set_current_screen( 'edit.php' );
		$this->use_theme_files( [ 'dist/editor.css' => 'editor/editor.css' ] );
		$GLOBALS['editor_styles'] = [];

		$this->get_registered_editor()->boot( Framework::get_container() );

		$this->assertSame( [ 'dist/editor.css' ], $GLOBALS['editor_styles'] );
	}

	public function test_boot_in_admin_skips_missing_editor_style(): void {
		set_current_screen( 'edit.php' );
		$this->use_manifest();
		$GLOBALS['editor_styles'] = [];

		$this->get_registered_editor()->boot( Framework::get_container() );

		$this->assertSame( [], $GLOBALS['editor_styles'] );
	}

	public function test_admin_editor_script_does_nothing_on_front(): void {
		$this->use_manifest();
		$this->use_theme_files( [ 'dist/editor.min.js' => 'editor/editor.min.js' ] );

		$this->get_registered_editor()->admin_editor_script();

		$this->assertFalse( wp_scripts()->query( self::HANDLE ) );
	}

	public function test_admin_editor_script_with_missing_file(): void {
		set_current_screen( 'edit.php' );

		$this->get_registered_editor()->admin_editor_script();

		$this->assertFalse( wp_scripts()->query( self::HANDLE ) );
	}

	public function test_admin_editor_script(): void {
		set_current_screen( 'edit.php' );
		$this->use_manifest();
		$this->use_theme_files(
			[
				'dist/editor.min.js'    => 'editor/editor.min.js',
				'dist/editor.asset.php' => 'editor/editor.asset.php',
			]
		);

		$this->get_registered_editor()->admin_editor_script();

		$script = wp_scripts()->query( self::HANDLE );
		$this->assertInstanceOf( \_WP_Dependency::class, $script );
		$this->assertSame( self::THEME_URI . 'dist/editor.min.js', $script->src );
		$this->assertSame( [ 'wp-blocks', 'wp-dom-ready' ], $script->deps );
		$this->assertSame( 'abc123', $script->ver );
		$this->assertSame( 1, wp_scripts()->get_data( self::HANDLE, 'group' ) );
		$this->assertTrue( wp_script_is( self::HANDLE, 'enqueued' ) );
		$this->assertSame( self::DEFAULT_SETTINGS, $this->get_editor_settings() );
		$this->assertFalse( wp_scripts()->get_data( self::HANDLE, 'after' ) );
	}

	public function test_admin_editor_script_falls_back_on_editor_js_and_settings_filter(): void {
		set_current_screen( 'edit.php' );
		$this->use_theme_files( [ 'dist/editor.js' => 'editor/editor.min.js' ] );

		$filter_args = null;
		add_filter(
			'bff_editor_custom_settings',
			static function ( $settings ) use ( &$filter_args ) {
				$filter_args = $settings;

				return [ 'custom' => true ];
			}
		);

		$this->get_registered_editor()->admin_editor_script();

		$script = wp_scripts()->query( self::HANDLE );
		$this->assertSame( self::THEME_URI . 'dist/editor.js', $script->src );
		$this->assertSame( [], $script->deps );
		$this->assertSame( '', $script->ver );
		$this->assertSame( self::DEFAULT_SETTINGS, $filter_args );
		$this->assertSame( [ 'custom' => true ], $this->get_editor_settings() );
	}

	public function test_gutenberg_blocks_allowed_true(): void {
		register_block_type( 'bff-test/hero', [] );
		$registered = array_keys( WP_Block_Type_Registry::get_instance()->get_all_registered() );

		$allowed = $this->get_registered_editor()->gutenberg_blocks_allowed( true, new WP_Block_Editor_Context() );

		$this->assertSame( array_values( array_diff( $registered, self::DISALLOWED_BLOCKS ) ), $allowed );
		$this->assertContains( 'core/paragraph', $allowed );
		$this->assertContains( 'bff-test/hero', $allowed );
		$this->assertNotContains( 'core/html', $allowed );
		$this->assertNotContains( 'core/embed', $allowed );
	}

	public function test_gutenberg_blocks_allowed_false(): void {
		$this->assertSame( [], $this->get_registered_editor()->gutenberg_blocks_allowed( false, new WP_Block_Editor_Context() ) );
	}

	public function test_gutenberg_blocks_allowed_array(): void {
		$this->assertSame(
			[ 'core/paragraph', 'core/image', 'acf/hero' ],
			$this->get_registered_editor()->gutenberg_blocks_allowed(
				[ 'core/paragraph', 'core/html', 'core/image', 'core/query', 'core/social-links', 'acf/hero', 'core/more' ],
				new WP_Block_Editor_Context()
			)
		);
	}

	public function test_gutenberg_blocks_allowed_array_without_disallowed_blocks(): void {
		$editor = $this->get_registered_editor();

		$this->assertSame(
			[ 'core/paragraph', 'core/image' ],
			$editor->gutenberg_blocks_allowed( [ 'core/paragraph', 'core/image' ], new WP_Block_Editor_Context() )
		);
		$this->assertSame( [], $editor->gutenberg_blocks_allowed( [], new WP_Block_Editor_Context() ) );
	}

	public function test_gutenberg_blocks_allowed_array_is_reindexed(): void {
		$this->assertSame(
			[ 'core/paragraph', 'acf/hero' ],
			$this->get_registered_editor()->gutenberg_blocks_allowed(
				[
					3     => 'core/paragraph',
					7     => 'core/code',
					'key' => 'acf/hero',
				],
				new WP_Block_Editor_Context()
			)
		);
	}

	public function test_gutenberg_blocks_allowed_removes_every_disallowed_block(): void {
		$this->assertSame(
			[ 'core/paragraph' ],
			$this->get_registered_editor()->gutenberg_blocks_allowed( array_merge( self::DISALLOWED_BLOCKS, [ 'core/paragraph' ] ), new WP_Block_Editor_Context() )
		);
	}

	public function test_allowed_block_types_filter_of_the_booted_theme(): void {
		$allowed = get_allowed_block_types( new WP_Block_Editor_Context( [ 'post' => self::factory()->post->create_and_get() ] ) );

		$this->assertIsArray( $allowed );
		$this->assertContains( 'core/paragraph', $allowed );
		$this->assertNotContains( 'core/html', $allowed );
	}
}
