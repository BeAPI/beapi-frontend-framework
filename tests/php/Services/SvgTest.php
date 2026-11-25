<?php

namespace BEA\Theme\Framework\Tests\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Services\Svg;
use WP_UnitTestCase;

/**
 * The sprite hashes are memoized in a static variable, each test needs a fresh process.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class SvgTest extends WP_UnitTestCase {

	private const FIXTURES_DIR = __DIR__ . '/../../assets/svg/';

	private const THEME_URI = 'https://cdn.example.test/theme/';

	/**
	 * Fixture used as the theme dist/sprite-hashes.asset.php file.
	 */
	private string $hashes_file = 'missing.asset.php';

	public function set_up(): void {
		parent::set_up();

		$this->hashes_file = 'missing.asset.php';

		// Map the theme dist/ folder onto the svg fixtures, never read the theme built files.
		add_filter(
			'theme_file_path',
			function ( $path, $file ) {
				if ( 'dist/sprite-hashes.asset.php' === $file ) {
					return self::FIXTURES_DIR . $this->hashes_file;
				}

				if ( str_starts_with( $file, 'dist/' ) ) {
					return self::FIXTURES_DIR . substr( $file, strlen( 'dist/' ) );
				}

				return self::FIXTURES_DIR . 'missing/' . $file;
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

	public function test_get_service_name(): void {
		$this->assertSame( 'svg', ( new Svg() )->get_service_name() );
	}

	public function test_allow_svg_tag(): void {
		$tags = ( new Svg() )->allow_svg_tag( [ 'p' => [] ] );

		$this->assertArrayHasKey( 'p', $tags );
		$this->assertArrayHasKey( 'svg', $tags );
		$this->assertArrayHasKey( 'path', $tags );
		$this->assertArrayHasKey( 'use', $tags );
		$this->assertArrayHasKey( 'aria-hidden', $tags['svg'] );
		$this->assertArrayHasKey( 'href', $tags['use'] );
	}

	public function test_register_adds_kses_filter(): void {
		$svg = new Svg();
		$svg->register( Framework::get_container() );

		$this->assertSame( 10, has_filter( 'wp_kses_allowed_html', [ $svg, 'allow_svg_tag' ] ) );
	}

	public function test_registered_filter_keeps_icon_markup_in_kses(): void {
		$markup = '<svg class="icon icon-test" aria-hidden="true" focusable="false"><use href="https://example.org/sprite.svg#icon-test"></use></svg>';

		// Drop the filter added by the booted theme service to check this instance alone.
		remove_all_filters( 'wp_kses_allowed_html' );
		$this->assertSame( '', wp_kses_post( $markup ) );

		( new Svg() )->register( Framework::get_container() );
		$this->assertSame( $markup, wp_kses_post( $markup ) );
	}

	public function test_get_the_icon_with_empty_identifier(): void {
		$this->assertSame( '', ( new Svg() )->get_the_icon( '' ) );
	}

	public function test_get_the_icon_without_sprite_hash(): void {
		$this->assertSame(
			'<svg class="icon icon-test" aria-hidden="true" focusable="false"><use href="' . self::THEME_URI . 'dist/icons/sprite.svg#icon-test"></use></svg>',
			( new Svg() )->get_the_icon( 'test' )
		);
	}

	public function test_get_the_icon_with_classes(): void {
		$this->assertSame(
			'<svg class="icon icon-test class2 class3" aria-hidden="true" focusable="false"><use href="' . self::THEME_URI . 'dist/icons/sprite.svg#icon-test"></use></svg>',
			( new Svg() )->get_the_icon( 'test', [ 'class2', 'class3' ] )
		);
	}

	public function test_get_the_icon_sanitizes_classes(): void {
		$this->assertStringStartsWith(
			'<svg class="icon icon-test bad-class" ',
			( new Svg() )->get_the_icon( 'test', [ 'bad"-class' ] )
		);
	}

	public function test_the_icon_echoes_the_icon(): void {
		$this->expectOutputString(
			'<svg class="icon icon-test" aria-hidden="true" focusable="false"><use href="' . self::THEME_URI . 'dist/icons/sprite.svg#icon-test"></use></svg>'
			. '<svg class="icon icon-test class1 class2" aria-hidden="true" focusable="false"><use href="' . self::THEME_URI . 'dist/icons/sprite.svg#icon-test"></use></svg>'
		);

		$svg = new Svg();
		$svg->the_icon( 'test' );
		$svg->the_icon( 'test', [ 'class1', 'class2' ] );
	}

	public function test_get_sprite_hash(): void {
		$this->hashes_file = 'sprite-hashes.asset.php';
		$svg               = new Svg();

		$this->assertSame( 'hash123', $svg->get_sprite_hash( 'sprite' ) );
		$this->assertNull( $svg->get_sprite_hash( 'social' ) );
	}

	public function test_get_sprite_hash_is_read_once_per_request(): void {
		$this->hashes_file = 'sprite-hashes.asset.php';
		$this->assertSame( 'hash123', ( new Svg() )->get_sprite_hash( 'sprite' ) );

		// The hashes are memoized and shared by every instance.
		$this->hashes_file = 'missing.asset.php';
		$this->assertSame( 'hash123', ( new Svg() )->get_sprite_hash( 'sprite' ) );
	}

	public function test_get_sprite_hash_with_invalid_file(): void {
		$this->hashes_file = 'invalid-hashes.asset.php';

		$this->assertNull( ( new Svg() )->get_sprite_hash( 'sprite' ) );
	}

	public function test_get_sprite_hash_with_missing_file(): void {
		$this->assertNull( ( new Svg() )->get_sprite_hash( 'sprite' ) );
	}

	public function test_get_the_icon_with_sprite_hash(): void {
		$this->hashes_file = 'sprite-hashes.asset.php';

		$this->assertSame(
			'<svg class="icon icon-arrow" aria-hidden="true" focusable="false"><use href="' . self::THEME_URI . 'dist/icons/sprite.svg?v=hash123#icon-arrow"></use></svg>',
			( new Svg() )->get_the_icon( 'icon-arrow' )
		);
	}

	/**
	 * @dataProvider data_icon_identifiers
	 */
	public function test_get_the_icon_identifiers( string $identifier, string $sprite, string $slug ): void {
		$this->assertSame(
			sprintf(
				'<svg class="icon %1$s" aria-hidden="true" focusable="false"><use href="%3$sdist/icons/%2$s.svg#%1$s"></use></svg>',
				$slug,
				$sprite,
				self::THEME_URI
			),
			( new Svg() )->get_the_icon( $identifier )
		);
	}

	public function data_icon_identifiers(): array {
		return [
			'default sprite'      => [ 'arrow', 'sprite', 'icon-arrow' ],
			'prefixed slug'       => [ 'icon-arrow', 'sprite', 'icon-arrow' ],
			'sprite folder'       => [ 'social/facebook', 'social', 'icon-facebook' ],
			'acf-svg-icon format' => [ 'social.svg#icon-facebook', 'social', 'icon-facebook' ],
			'sanitized sprite'    => [ 'So_Cial!/facebook', 'social', 'icon-facebook' ],
			'empty sprite name'   => [ '!!/facebook', 'sprite', 'icon-facebook' ],
		];
	}

	public function test_get_the_icon_inline_merges_classes(): void {
		$this->assertSame(
			'<svg class="custom icon icon-facebook extra" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M0 0"/></svg>' . "\n",
			( new Svg() )->get_the_icon( 'social/facebook', [ 'extra' ], false )
		);
	}

	public function test_get_the_icon_inline_keeps_existing_a11y_attributes(): void {
		$this->assertSame(
			'<svg viewBox="0 0 24 24" aria-hidden="false" focusable="true" class="icon icon-plain"></svg>' . "\n",
			( new Svg() )->get_the_icon( 'plain', [], false )
		);
	}

	public function test_get_the_icon_inline_with_invalid_files(): void {
		$svg = new Svg();

		// Missing and empty files.
		$this->assertSame( '', $svg->get_the_icon( 'missing', [], false ) );
		$this->assertSame( '', $svg->get_the_icon( 'empty', [], false ) );

		// Empty file base once sanitized.
		$this->assertSame( '', $svg->get_the_icon( '!!!', [], false ) );

		// Symlink resolved outside dist/images.
		$this->assertSame( '', $svg->get_the_icon( 'far', [], false ) );
	}

	public function test_get_the_icon_inline_accepts_sibling_folder_sharing_the_prefix(): void {
		// Suspected bug pinned as current behaviour: the containment check has no trailing separator, so a symlink
		// resolved into the sibling dist/images-outside folder is accepted.
		$this->assertSame(
			'<svg class="icon icon-outside" aria-hidden="true" focusable="false"></svg>' . "\n",
			( new Svg() )->get_the_icon( 'outside', [], false )
		);
	}
}
