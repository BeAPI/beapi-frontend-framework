<?php

use BEA\Theme\Framework\Framework;
use function BEA\Theme\Framework\Helpers\Formatting\Image\get_the_image;
use function BEA\Theme\Framework\Helpers\Formatting\Image\get_theme_static_image_dimensions;
use function BEA\Theme\Framework\Helpers\Formatting\Image\get_theme_static_image_markup;
use function BEA\Theme\Framework\Helpers\Formatting\Image\get_theme_static_image_uri;
use function BEA\Theme\Framework\Helpers\Formatting\Image\read_theme_static_image_dimensions_from_filesystem;
use function BEA\Theme\Framework\Helpers\Formatting\Image\the_image;
use function BEA\Theme\Framework\Helpers\Formatting\Image\the_theme_static_image;

/**
 * Static image URIs, dimensions and the assets manifest are memoized in static variables:
 * run each test in its own process.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class ImageTest extends WP_UnitTestCase {

	/**
	 * Attachments created by the test, deleted in tear_down.
	 *
	 * @var int[]
	 */
	private $attachment_ids = [];

	public function set_up(): void {
		parent::set_up();

		// Never read the built dist/ folder: use the fixtures for the manifest and the static images.
		add_filter( 'theme_file_path', [ $this, 'filter_theme_file_path' ], 10, 2 );
	}

	public function tear_down(): void {
		foreach ( $this->attachment_ids as $attachment_id ) {
			wp_delete_attachment( $attachment_id, true );
		}
		$this->attachment_ids = [];

		parent::tear_down();
	}

	public function filter_theme_file_path( string $path, string $file ): string {
		$fixtures = dirname( __DIR__, 3 ) . '/assets';

		if ( 'dist/assets.json' === $file ) {
			return $fixtures . '/assets/assets.json';
		}

		if ( str_starts_with( $file, 'dist/images/' ) ) {
			return $fixtures . '/images/' . substr( $file, strlen( 'dist/images/' ) );
		}

		return $path;
	}

	private function create_attachment(): int {
		$attachment_id = self::factory()->attachment->create_upload_object( dirname( __DIR__, 3 ) . '/assets/images/pixel-4x3.png' );
		$this->assertIsInt( $attachment_id );

		$this->attachment_ids[] = $attachment_id;

		return $attachment_id;
	}

	/**
	 * Expected markup: wp_get_attachment_image() called with the attributes the helper must forward
	 * (core output, e.g. decoding/loading/attributes order, depends on the WordPress version).
	 */
	private function get_expected_markup( int $attachment_id, array $attributes = [], string $size = 'thumbnail' ): string {
		return wp_get_attachment_image(
			$attachment_id,
			$size,
			false,
			array_merge(
				[
					'data-location' => '',
					'class'         => '',
				],
				$attributes
			)
		);
	}

	/*
	 * get_the_image() / the_image()
	 */

	public function test_get_zero_image(): void {
		$this->assertSame( '', get_the_image( 0, [] ) );
	}

	public function test_get_image_unknown_attachment(): void {
		$this->assertSame( '', get_the_image( PHP_INT_MAX, [ 'data-location' => '' ] ) );
		$this->assertSame( '', get_the_image( self::factory()->post->create(), [] ) );
	}

	public function test_get_image(): void {
		$attachment_id = $this->create_attachment();

		$markup = get_the_image( $attachment_id, [] );

		$this->assertSame( $this->get_expected_markup( $attachment_id ), $markup );
		$this->assertStringStartsWith( '<img ', $markup );
		$this->assertStringContainsString( sprintf( ' src="%s"', wp_get_attachment_url( $attachment_id ) ), $markup );
		$this->assertStringContainsString( ' width="4" height="3"', $markup );
		$this->assertStringContainsString( ' alt=""', $markup );
		$this->assertStringContainsString( ' data-location=""', $markup );

		// The helper default empty class replaces the core "attachment-thumbnail size-thumbnail" classes.
		$this->assertStringContainsString( ' class=""', $markup );
	}

	public function test_get_image_attributes(): void {
		$attachment_id = $this->create_attachment();

		$markup = get_the_image(
			$attachment_id,
			[
				'class'         => 'card__img',
				'data-location' => 'card"thumbnail',
			],
			[ 'size' => 'full' ]
		);

		$this->assertStringContainsString( ' class="card__img"', $markup );
		$this->assertStringContainsString( ' data-location="card&quot;thumbnail"', $markup );
		$this->assertStringContainsString( sprintf( ' src="%s"', wp_get_attachment_url( $attachment_id ) ), $markup );
	}

	public function test_image_before_after(): void {
		$attachment_id = $this->create_attachment();
		$expected      = $this->get_expected_markup( $attachment_id );

		$this->assertSame( 'b' . $expected, get_the_image( $attachment_id, [], [ 'before' => 'b' ] ) );
		$this->assertSame( $expected . 'a', get_the_image( $attachment_id, [], [ 'after' => 'a' ] ) );
		$this->assertSame(
			'b' . $expected . 'a',
			get_the_image(
				$attachment_id,
				[],
				[
					'after'  => 'a',
					'before' => 'b',
				]
			)
		);
	}

	public function test_image_default(): void {
		$received = [];

		// Provide a default image for the attachment 0, as a project would do.
		add_filter(
			'wp_get_attachment_image_src',
			static function ( $image, $attachment_id, $size ) use ( &$received ) {
				if ( 0 !== $attachment_id ) {
					return $image;
				}

				$received[] = $size;

				return [ 'https://localhost.dev/default.png', 10, 20, false ];
			},
			10,
			3
		);

		$this->assertSame( '', get_the_image( 0, [] ) );
		$this->assertSame( [], $received, 'Without "default" the attachment 0 is not requested.' );

		$markup = get_the_image( 0, [], [ 'default' => true ] );

		$this->assertStringStartsWith( '<img width="10" height="20" src="https://localhost.dev/default.png"', $markup );
		$this->assertSame( [ 'thumbnail' ], $received );
	}

	public function test_image_lcp(): void {
		$attachment_id = $this->create_attachment();

		$markup = get_the_image(
			$attachment_id,
			[ 'loading' => 'lazy' ],
			[
				'is_lcp' => true,
				'size'   => 'large',
			]
		);

		$this->assertSame(
			$this->get_expected_markup(
				$attachment_id,
				[
					'loading'       => false,
					'fetchpriority' => 'high',
				],
				'large'
			),
			$markup
		);
		$this->assertStringContainsString( ' fetchpriority="high"', $markup );
		$this->assertStringNotContainsString( 'loading=', $markup );
	}

	public function test_image_fetchpriority_disables_lazy(): void {
		$attachment_id = $this->create_attachment();

		$markup = get_the_image(
			$attachment_id,
			[
				'fetchpriority' => 'high',
				'loading'       => 'lazy',
			]
		);

		$this->assertStringContainsString( ' fetchpriority="high"', $markup );
		$this->assertStringNotContainsString( 'loading=', $markup );
	}

	public function test_image_alt(): void {
		$attachment_id = $this->create_attachment();
		update_post_meta( $attachment_id, '_wp_attachment_image_alt', 'Alt from media library' );

		$markup = get_the_image( $attachment_id, [] );
		$this->assertSame( $this->get_expected_markup( $attachment_id ), $markup );
		$this->assertStringContainsString( ' alt="Alt from media library"', $markup );

		$markup = get_the_image( $attachment_id, [ 'alt' => '' ] );
		$this->assertSame( $this->get_expected_markup( $attachment_id, [ 'alt' => '' ] ), $markup );
		$this->assertStringContainsString( ' alt=""', $markup );
	}

	public function test_image_force_empty_alt_over_filters(): void {
		$attachment_id = $this->create_attachment();

		add_filter(
			'wp_get_attachment_image_attributes',
			static function ( array $attributes ): array {
				$attributes['alt'] = 'Alt from a filter';

				return $attributes;
			}
		);

		$this->assertStringContainsString( ' alt="Alt from a filter"', get_the_image( $attachment_id, [] ) );
		$markup = get_the_image( $attachment_id, [ 'alt' => '' ] );
		$this->assertSame(
			str_replace( ' alt="Alt from a filter"', ' alt=""', $this->get_expected_markup( $attachment_id, [ 'alt' => '' ] ) ),
			$markup
		);
		$this->assertStringContainsString( ' alt=""', $markup );
	}

	public function test_image_filters(): void {
		$attachment_id = $this->create_attachment();
		$received      = [];

		add_filter(
			'bea_theme_framework_the_image_attributes',
			static function ( array $attributes, int $image_id, array $settings ) use ( &$received ): array {
				$received['attributes'] = [ $attributes, $image_id, $settings ];
				$attributes['class']    = 'from-filter';

				return $attributes;
			},
			10,
			3
		);
		add_filter(
			'bea_theme_framework_the_image_settings',
			static function ( array $settings ) use ( &$received ): array {
				$received['settings'] = $settings;
				$settings['before']   = '<figure>';
				$settings['after']    = '</figure>';

				return $settings;
			}
		);
		add_filter(
			'bea_theme_framework_the_image_markup',
			static function ( string $markup, int $image_id, array $attributes, array $settings ) use ( &$received ): string {
				$received['markup'] = [ $markup, $image_id, $attributes, $settings ];

				return '<picture>' . $markup . '</picture>';
			},
			10,
			4
		);

		$markup   = get_the_image( $attachment_id, [], [ 'size' => 'medium' ] );
		$expected = $this->get_expected_markup( $attachment_id, [ 'class' => 'from-filter' ], 'medium' );

		$this->assertSame( '<figure><picture>' . $expected . '</picture></figure>', $markup );
		$this->assertSame(
			[
				[
					'data-location' => '',
					'class'         => '',
				],
				$attachment_id,
				[ 'size' => 'medium' ],
			],
			$received['attributes']
		);
		$this->assertSame(
			[
				'size'    => 'medium',
				'before'  => '',
				'after'   => '',
				'default' => false,
				'is_lcp'  => false,
			],
			$received['settings']
		);
		$this->assertSame(
			[
				$expected,
				$attachment_id,
				[
					'data-location' => '',
					'class'         => 'from-filter',
				],
				[
					'size'    => 'medium',
					'before'  => '<figure>',
					'after'   => '</figure>',
					'default' => false,
					'is_lcp'  => false,
				],
			],
			$received['markup']
		);
	}

	public function test_the_image(): void {
		$attachment_id = $this->create_attachment();

		ob_start();
		the_image( $attachment_id, [] );
		$this->assertSame( $this->get_expected_markup( $attachment_id ), ob_get_clean() );
	}

	/*
	 * Static theme images.
	 */

	public function test_uri_parent_theme(): void {
		$calls = [];

		add_filter(
			'theme_file_uri',
			static function ( string $uri, string $file ) use ( &$calls ): string {
				$calls[] = [ $uri, $file ];

				return 'https://cdn.localhost.dev/' . $file;
			},
			10,
			2
		);

		$this->assertSame( get_stylesheet(), get_template() );
		$this->assertSame( 'https://cdn.localhost.dev/dist/images/logo.svg', get_theme_static_image_uri( '/dist/images/logo.svg' ) );
		$this->assertSame( [ [ get_stylesheet_directory_uri() . '/dist/images/logo.svg', 'dist/images/logo.svg' ] ], $calls );

		// Memoized: the filter is not applied again.
		$this->assertSame( 'https://cdn.localhost.dev/dist/images/logo.svg', get_theme_static_image_uri( 'dist/images/logo.svg' ) );
		$this->assertCount( 1, $calls );
	}

	public function test_uri_child_theme(): void {
		// Simulate an active child theme: the image does not exist in it, so get_theme_file_uri() falls back on the parent.
		add_filter(
			'stylesheet',
			static function (): string {
				return 'bea-child-theme';
			}
		);

		$this->assertNotSame( get_stylesheet(), get_template() );
		$this->assertSame( get_template_directory_uri() . '/dist/images/logo.svg', get_theme_static_image_uri( 'dist/images/logo.svg' ) );
	}

	public function test_filesystem_dimensions_svg(): void {
		// Width/height attributes win over the viewBox, values are rounded.
		$this->assertSame(
			[
				'width'  => 120,
				'height' => 40,
			],
			read_theme_static_image_dimensions_from_filesystem( 'dist/images/size.svg' )
		);
		$this->assertSame(
			[
				'width'  => 65,
				'height' => 32,
			],
			read_theme_static_image_dimensions_from_filesystem( 'dist/images/viewbox.svg' )
		);
		$this->assertNull( read_theme_static_image_dimensions_from_filesystem( 'dist/images/nosize.svg' ) );
		$this->assertNull( read_theme_static_image_dimensions_from_filesystem( 'dist/images/empty.svg' ) );
		$this->assertNull( read_theme_static_image_dimensions_from_filesystem( 'dist/images/missing.svg' ) );
	}

	public function test_filesystem_dimensions_raster(): void {
		$this->assertSame(
			[
				'width'  => 4,
				'height' => 3,
			],
			read_theme_static_image_dimensions_from_filesystem( 'dist/images/pixel-4x3.png' )
		);

		// Not a valid image.
		$this->assertNull( read_theme_static_image_dimensions_from_filesystem( 'dist/images/image.png' ) );
	}

	public function test_dimensions_from_manifest(): void {
		$expected = [
			'width'  => 120,
			'height' => 40,
		];

		// logo.svg only exists in the manifest fixture.
		$this->assertNull( read_theme_static_image_dimensions_from_filesystem( 'dist/images/logo.svg' ) );
		$this->assertSame( $expected, get_theme_static_image_dimensions( '/dist/images/logo.svg' ) );
		$this->assertSame( $expected, get_theme_static_image_dimensions( 'dist/images/logo.svg' ) );
	}

	public function test_dimensions_fallback_on_filesystem(): void {
		$expected = [
			'width'  => 120,
			'height' => 40,
		];

		$this->assertSame( $expected, get_theme_static_image_dimensions( 'dist/images/size.svg' ) );
		$this->assertNull( get_theme_static_image_dimensions( 'dist/images/missing.svg' ) );

		// Invalid manifest entry (width 0) and no file.
		$this->assertNull( get_theme_static_image_dimensions( 'dist/images/invalid.svg' ) );

		// Memoized: the filesystem is not read again.
		remove_filter( 'theme_file_path', [ $this, 'filter_theme_file_path' ] );
		$this->assertNull( read_theme_static_image_dimensions_from_filesystem( 'dist/images/size.svg' ) );
		$this->assertSame( $expected, get_theme_static_image_dimensions( '/dist/images/size.svg' ) );
	}

	/**
	 * Known issue: get_theme_static_image_dimensions() does not check that the assets service is booted.
	 */
	public function test_dimensions_without_assets_service(): void {
		$container = Framework::get_container();
		$property  = new ReflectionProperty( $container, 'services' );
		$services  = $property->getValue( $container );
		unset( $services['assets'] );
		$property->setValue( $container, $services );

		$this->expectException( Error::class );
		$this->expectExceptionMessage( 'Call to a member function get_static_image_dimensions() on false' );

		get_theme_static_image_dimensions( 'dist/images/size.svg' );
	}

	/**
	 * Parse the <img> markup: the attributes order depends on the WP_HTML_Tag_Processor version.
	 *
	 * @return array<string, string|true> Decoded attribute values by name.
	 */
	private function get_img_attributes( string $markup ): array {
		$processor = new WP_HTML_Tag_Processor( $markup );
		$this->assertTrue( $processor->next_tag( 'img' ) );

		$attributes = [];
		foreach ( $processor->get_attribute_names_with_prefix( '' ) as $name ) {
			$attributes[ $name ] = $processor->get_attribute( $name );
		}
		ksort( $attributes );

		$this->assertFalse( $processor->next_tag(), 'The markup contains a single tag.' );

		return $attributes;
	}

	public function test_static_image_markup(): void {
		$markup = get_theme_static_image_markup( '/dist/images/logo.svg' );

		$this->assertStringStartsWith( '<img ', $markup );
		$this->assertSame(
			[
				'alt'    => '',
				'height' => '40',
				'src'    => get_stylesheet_directory_uri() . '/dist/images/logo.svg',
				'width'  => '120',
			],
			$this->get_img_attributes( $markup )
		);
	}

	public function test_static_image_markup_without_dimensions(): void {
		$this->assertSame(
			[
				'alt' => '',
				'src' => get_stylesheet_directory_uri() . '/dist/images/missing.svg',
			],
			$this->get_img_attributes( get_theme_static_image_markup( 'dist/images/missing.svg' ) )
		);
	}

	public function test_static_image_markup_attributes(): void {
		$markup = get_theme_static_image_markup(
			'dist/images/logo.svg',
			[
				'src'           => 'https://cdn.localhost.dev/logo.svg?a=1&b=2',
				'alt'           => '"Logo" <BFF>',
				'width'         => 60,
				'class'         => 'logo',
				'id'            => '',
				'title'         => null,
				'hidden'        => false,
				'data-bool'     => true,
				'fetchpriority' => 'high',
				'loading'       => 'lazy',
			]
		);

		// Values are escaped by WP_HTML_Tag_Processor.
		$this->assertStringContainsString( ' alt="&quot;Logo&quot; &lt;BFF&gt;"', $markup );

		// Empty, null and false values are dropped (except alt), fetchpriority=high removes loading,
		// explicit width wins over the manifest while the missing height is completed.
		$this->assertSame(
			[
				'alt'           => '"Logo" <BFF>',
				'class'         => 'logo',
				'data-bool'     => '1',
				'fetchpriority' => 'high',
				'height'        => '40',
				'src'           => 'https://cdn.localhost.dev/logo.svg?a=1&b=2',
				'width'         => '60',
			],
			$this->get_img_attributes( $markup )
		);
	}

	public function test_the_theme_static_image(): void {
		ob_start();
		the_theme_static_image( 'dist/images/size.svg', [ 'alt' => 'Size' ] );
		$markup = ob_get_clean();

		$this->assertSame( get_theme_static_image_markup( 'dist/images/size.svg', [ 'alt' => 'Size' ] ), $markup );
		$this->assertSame(
			[
				'alt'    => 'Size',
				'height' => '40',
				'src'    => get_stylesheet_directory_uri() . '/dist/images/size.svg',
				'width'  => '120',
			],
			$this->get_img_attributes( $markup )
		);
	}
}
