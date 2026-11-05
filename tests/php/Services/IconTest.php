<?php

namespace BEA\Theme\Framework\Tests\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Services\Icon;
use ReflectionProperty;
use WP_Icon_Collections_Registry;
use WP_Icons_Registry;
use WP_UnitTestCase;

class IconTest extends WP_UnitTestCase {

	private const FIXTURES_DIR = __DIR__ . '/../../assets/icons/';

	/**
	 * Theme relative paths mapped to fixture paths, unknown paths resolve to a missing directory.
	 *
	 * @var array<string, string>
	 */
	private array $theme_files = [];

	/**
	 * Registries content saved before each test.
	 *
	 * @var array<string, array>
	 */
	private array $registries_backup = [];

	public function set_up(): void {
		parent::set_up();

		$this->theme_files = [
			'dist/images'        => self::FIXTURES_DIR . 'images',
			'dist/images/sprite' => self::FIXTURES_DIR . 'images/sprite',
			'dist/images/social' => self::FIXTURES_DIR . 'images/social',
		];

		add_filter(
			'theme_file_path',
			function ( $path, $file ) {
				return $this->theme_files[ $file ] ?? self::FIXTURES_DIR . 'missing/' . $file;
			},
			10,
			2
		);

		$this->backup_registries();
	}

	public function tear_down(): void {
		$this->restore_registries();

		parent::tear_down();
	}

	/**
	 * Icon registries have no reset API: save their content, and start each test without the theme collections
	 * registered while booting the theme.
	 */
	private function backup_registries(): void {
		if ( ! class_exists( WP_Icon_Collections_Registry::class ) || ! class_exists( WP_Icons_Registry::class ) ) {
			return;
		}

		$this->registries_backup = [
			'collections' => $this->collections_property()->getValue( WP_Icon_Collections_Registry::get_instance() ),
			'icons'       => $this->icons_property()->getValue( WP_Icons_Registry::get_instance() ),
		];

		foreach ( [ 'beapi-sprite', 'beapi-social' ] as $collection ) {
			if ( WP_Icon_Collections_Registry::get_instance()->is_registered( $collection ) ) {
				wp_unregister_icon_collection( $collection );
			}
		}
	}

	private function restore_registries(): void {
		if ( empty( $this->registries_backup ) ) {
			return;
		}

		$this->collections_property()->setValue( WP_Icon_Collections_Registry::get_instance(), $this->registries_backup['collections'] );
		$this->icons_property()->setValue( WP_Icons_Registry::get_instance(), $this->registries_backup['icons'] );
		$this->registries_backup = [];
	}

	private function collections_property(): ReflectionProperty {
		return new ReflectionProperty( WP_Icon_Collections_Registry::class, 'registered_collections' );
	}

	private function icons_property(): ReflectionProperty {
		return new ReflectionProperty( WP_Icons_Registry::class, 'registered_icons' );
	}

	private function require_icon_api(): void {
		if ( ! function_exists( 'wp_register_icon_collection' ) || ! function_exists( 'wp_register_icon' ) || ! function_exists( 'wp_unregister_icon_collection' ) ) {
			$this->markTestSkipped( 'Requires WordPress 7.1' );
		}
	}

	/**
	 * @param array<string, array> $collections
	 */
	private function use_collections( array $collections ): void {
		add_filter(
			'bff_icon_collections',
			static function () use ( $collections ) {
				return $collections;
			}
		);
	}

	/**
	 * @return string[] Registered icon names of a collection, sorted.
	 */
	private function get_collection_icon_names( string $collection ): array {
		$names = array_keys(
			array_filter(
				$this->icons_property()->getValue( WP_Icons_Registry::get_instance() ),
				static function ( $icon ) use ( $collection ) {
					return $collection === $icon['collection'];
				}
			)
		);
		sort( $names );

		return $names;
	}

	private function is_collection_registered( string $collection ): bool {
		return WP_Icon_Collections_Registry::get_instance()->is_registered( $collection );
	}

	public function test_get_service_name(): void {
		$this->assertSame( 'icon', ( new Icon() )->get_service_name() );
	}

	public function test_boot_adds_init_hooks(): void {
		$icon = new Icon();
		$icon->boot( Framework::get_container() );

		$this->assertSame( 10, has_action( 'init', [ $icon, 'register_icon_collections' ] ) );
		$this->assertSame( 20, has_action( 'init', [ $icon, 'unregister_core_icon_collection' ] ) );
	}

	public function test_register_icon_collections(): void {
		$this->require_icon_api();

		$collections_filter_args = null;
		add_filter(
			'bff_icon_collections',
			static function ( $collections ) use ( &$collections_filter_args ) {
				$collections_filter_args = $collections;

				return $collections;
			}
		);

		( new Icon() )->register_icon_collections();

		$this->assertSame(
			[
				'beapi-sprite' => [
					'source_subdir' => 'sprite',
					'label'         => 'General',
					'description'   => 'Theme UI icons.',
				],
				'beapi-social' => [
					'source_subdir' => 'social',
					'label'         => 'Social',
					'description'   => 'Social network icons.',
				],
			],
			$collections_filter_args
		);

		$registry = WP_Icon_Collections_Registry::get_instance();
		$this->assertSame(
			[
				'description' => 'Theme UI icons.',
				'label'       => 'General',
				'slug'        => 'beapi-sprite',
			],
			$registry->get_registered( 'beapi-sprite' )
		);
		$this->assertSame(
			[
				'description' => 'Social network icons.',
				'label'       => 'Social',
				'slug'        => 'beapi-social',
			],
			$registry->get_registered( 'beapi-social' )
		);

		// readme.txt is not an SVG, ___.svg sanitizes to an empty slug.
		$this->assertSame( [ 'beapi-social/facebook' ], $this->get_collection_icon_names( 'beapi-social' ) );
		$this->assertSame( [ 'beapi-sprite/arrow-right', 'beapi-sprite/closeicon' ], $this->get_collection_icon_names( 'beapi-sprite' ) );

		$icons = WP_Icons_Registry::get_instance();

		$facebook = $icons->get_registered_icon( 'beapi-social/facebook' );
		$this->assertSame( 'Facebook', $facebook['label'] );
		$this->assertSame( realpath( self::FIXTURES_DIR . 'images/social/facebook.svg' ), $facebook['file_path'] );
		$this->assertStringStartsWith( '<svg', $facebook['content'] );

		$arrow = $icons->get_registered_icon( 'beapi-sprite/arrow-right' );
		$this->assertSame( 'Arrow Right', $arrow['label'] );
		$this->assertSame( realpath( self::FIXTURES_DIR . 'images/sprite/arrow-right.svg' ), $arrow['file_path'] );

		// Suspected bug pinned as current behaviour: the slug cleanup deletes underscores (allowed by WordPress)
		// instead of keeping or converting them, Close_Icon.svg becomes "closeicon".
		$close = $icons->get_registered_icon( 'beapi-sprite/closeicon' );
		$this->assertSame( 'Closeicon', $close['label'] );
		$this->assertSame( realpath( self::FIXTURES_DIR . 'images/sprite/Close_Icon.svg' ), $close['file_path'] );
	}

	public function test_register_icon_collections_renders_with_wp_get_icon(): void {
		$this->require_icon_api();

		( new Icon() )->register_icon_collections();

		$this->assertStringContainsString( 'class="my-icon"', wp_get_icon( 'beapi-sprite/arrow-right', [ 'class' => 'my-icon' ] ) );
	}

	public function test_register_icon_collections_on_init(): void {
		$this->require_icon_api();

		// The theme unregistered the core collection while bootstrapping WordPress, and unregistering a missing
		// collection triggers a doing it wrong notice.
		if ( ! $this->is_collection_registered( 'core' ) ) {
			wp_register_icon_collection( 'core', [ 'label' => 'WordPress' ] );
		}

		// Only run this service callbacks, core and theme ones already ran while bootstrapping WordPress.
		remove_all_actions( 'init' );
		( new Icon() )->boot( Framework::get_container() );
		do_action( 'init' );

		$this->assertTrue( $this->is_collection_registered( 'beapi-sprite' ) );
		$this->assertTrue( $this->is_collection_registered( 'beapi-social' ) );
		$this->assertFalse( $this->is_collection_registered( 'core' ) );
	}

	public function test_register_icon_collections_without_source_subdir(): void {
		$this->require_icon_api();

		$this->use_collections(
			[
				'no-subdir'    => [ 'label' => 'No subdir' ],
				'empty-subdir' => [ 'source_subdir' => '' ],
			]
		);
		$this->theme_files = [];

		( new Icon() )->register_icon_collections();

		$this->assertFalse( $this->is_collection_registered( 'no-subdir' ) );
		$this->assertFalse( $this->is_collection_registered( 'empty-subdir' ) );
	}

	public function test_register_icon_collections_defaults_and_missing_directory(): void {
		$this->require_icon_api();

		$this->use_collections(
			[
				'custom' => [ 'source_subdir' => 'unknown' ],
				42       => [
					'source_subdir' => 'unknown',
					'label'         => 'Numeric',
				],
			]
		);

		( new Icon() )->register_icon_collections();

		$registry = WP_Icon_Collections_Registry::get_instance();
		$this->assertSame(
			[
				'description' => '',
				'label'       => 'custom',
				'slug'        => 'custom',
			],
			$registry->get_registered( 'custom' )
		);
		$this->assertSame(
			[
				'description' => '',
				'label'       => 'Numeric',
				'slug'        => '42',
			],
			$registry->get_registered( '42' )
		);
		$this->assertSame( [], $this->get_collection_icon_names( 'custom' ) );
		$this->assertSame( [], $this->get_collection_icon_names( '42' ) );
	}

	public function test_register_icon_collections_sanitizes_subdir(): void {
		$this->require_icon_api();

		$this->use_collections(
			[
				// Sanitized to an empty string: collection registered, no icon lookup.
				'traversal' => [ 'source_subdir' => '../..' ],
				// Sanitized to "social".
				'upper'     => [ 'source_subdir' => '../SOCIAL/' ],
			]
		);

		( new Icon() )->register_icon_collections();

		$this->assertTrue( $this->is_collection_registered( 'traversal' ) );
		$this->assertTrue( $this->is_collection_registered( 'upper' ) );
		$this->assertSame( [], $this->get_collection_icon_names( 'traversal' ) );
		$this->assertSame( [ 'upper/facebook' ], $this->get_collection_icon_names( 'upper' ) );
	}

	public function test_register_icon_collections_outside_base_directory(): void {
		$this->require_icon_api();

		$this->use_collections( [ 'outside' => [ 'source_subdir' => 'sprite' ] ] );
		$this->theme_files['dist/images/sprite'] = self::FIXTURES_DIR . 'outside/images/sprite';

		( new Icon() )->register_icon_collections();

		$this->assertTrue( $this->is_collection_registered( 'outside' ) );
		$this->assertSame( [], $this->get_collection_icon_names( 'outside' ) );
	}

	public function test_register_icon_collections_accepts_sibling_folder_sharing_the_prefix(): void {
		$this->require_icon_api();

		// Suspected bug pinned as current behaviour: the containment check has no trailing separator, so a
		// sibling folder sharing the base prefix (images-outside) is accepted.
		$svg_fixtures      = dirname( self::FIXTURES_DIR ) . '/svg/';
		$this->theme_files = [
			'dist/images'        => $svg_fixtures . 'images',
			'dist/images/sprite' => $svg_fixtures . 'images-outside/sprite',
		];
		$this->use_collections( [ 'sibling' => [ 'source_subdir' => 'sprite' ] ] );

		( new Icon() )->register_icon_collections();

		$this->assertSame( [ 'sibling/outside' ], $this->get_collection_icon_names( 'sibling' ) );
	}

	public function test_register_icon_collections_missing_base_directory(): void {
		$this->require_icon_api();

		$this->use_collections( [ 'social' => [ 'source_subdir' => 'social' ] ] );
		unset( $this->theme_files['dist/images'] );

		( new Icon() )->register_icon_collections();

		$this->assertTrue( $this->is_collection_registered( 'social' ) );
		$this->assertSame( [], $this->get_collection_icon_names( 'social' ) );
	}

	public function test_register_icon_label_and_properties_filters(): void {
		$this->require_icon_api();

		$this->use_collections( [ 'beapi-social' => [ 'source_subdir' => 'social' ] ] );

		$file        = realpath( self::FIXTURES_DIR . 'images/social/facebook.svg' );
		$label_args  = null;
		$filter_args = null;
		add_filter(
			'bff_icon_label',
			static function ( ...$args ) use ( &$label_args ) {
				$label_args = $args;

				return 'FB';
			},
			10,
			3
		);
		add_filter(
			'bff_icon_properties',
			static function ( ...$args ) use ( &$filter_args ) {
				$filter_args = $args;

				return [
					'label'   => 'FB',
					'content' => '<svg></svg>',
				];
			},
			10,
			3
		);

		( new Icon() )->register_icon_collections();

		$this->assertSame( [ 'Facebook', 'facebook', 'beapi-social' ], $label_args );
		$this->assertSame(
			[
				[
					'label'     => 'FB',
					'file_path' => $file,
				],
				'beapi-social/facebook',
				'beapi-social',
			],
			$filter_args
		);

		$icon = WP_Icons_Registry::get_instance()->get_registered_icon( 'beapi-social/facebook' );
		$this->assertSame( 'FB', $icon['label'] );
		$this->assertSame( '<svg></svg>', $icon['content'] );
		$this->assertArrayNotHasKey( 'file_path', $icon );
	}

	public function test_register_icon_skipped_without_file_or_content(): void {
		$this->require_icon_api();

		$this->use_collections( [ 'beapi-social' => [ 'source_subdir' => 'social' ] ] );
		add_filter(
			'bff_icon_properties',
			static function () {
				return [
					'label'     => 'Facebook',
					'file_path' => '',
				];
			}
		);

		( new Icon() )->register_icon_collections();

		$this->assertTrue( $this->is_collection_registered( 'beapi-social' ) );
		$this->assertSame( [], $this->get_collection_icon_names( 'beapi-social' ) );
	}

	public function test_unregister_core_icon_collection(): void {
		$this->require_icon_api();

		if ( ! $this->is_collection_registered( 'core' ) ) {
			wp_register_icon_collection( 'core', [ 'label' => 'WordPress' ] );
		}
		wp_register_icon(
			'core/bff-test',
			[
				'label'   => 'Test',
				'content' => '<svg></svg>',
			]
		);

		( new Icon() )->unregister_core_icon_collection();

		$this->assertFalse( $this->is_collection_registered( 'core' ) );
		$this->assertFalse( WP_Icons_Registry::get_instance()->is_registered( 'core/bff-test' ) );
	}

	public function test_unregister_core_icon_collection_disabled_by_filter(): void {
		$this->require_icon_api();

		if ( ! $this->is_collection_registered( 'core' ) ) {
			wp_register_icon_collection( 'core', [ 'label' => 'WordPress' ] );
		}
		add_filter( 'bff_unregister_core_icon_collection', '__return_false' );

		( new Icon() )->unregister_core_icon_collection();

		$this->assertTrue( $this->is_collection_registered( 'core' ) );
	}
}
