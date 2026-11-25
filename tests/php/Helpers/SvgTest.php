<?php

use BEA\Theme\Framework\Framework;
use function BEA\Theme\Framework\Helpers\Svg\get_the_icon;
use function BEA\Theme\Framework\Helpers\Svg\the_icon;

class SvgTest extends WP_UnitTestCase {

	/**
	 * Services registered in the framework container, saved when a test removes them.
	 *
	 * @var array|null
	 */
	private $saved_services = null;

	public function set_up(): void {
		parent::set_up();

		// Read inline icons from the fixtures instead of the built dist/ folder.
		add_filter(
			'theme_file_path',
			static function ( string $path, string $file ): string {
				if ( str_starts_with( $file, 'dist/images' ) ) {
					return dirname( __DIR__, 2 ) . '/assets/icons/' . substr( $file, strlen( 'dist/' ) );
				}

				return $path;
			},
			10,
			2
		);
	}

	public function tear_down(): void {
		if ( null !== $this->saved_services ) {
			$this->get_services_property()->setValue( Framework::get_container(), $this->saved_services );
			$this->saved_services = null;
		}

		parent::tear_down();
	}

	/**
	 * The container has no API to unregister a service: Reflection is the only way to test the "not booted" branch.
	 */
	private function get_services_property(): ReflectionProperty {
		return new ReflectionProperty( Framework::get_container(), 'services' );
	}

	public function test_service_not_booted(): void {
		$property             = $this->get_services_property();
		$this->saved_services = $property->getValue( Framework::get_container() );
		$services             = $this->saved_services;
		unset( $services['svg'] );
		$property->setValue( Framework::get_container(), $services );

		$this->assertFalse( Framework::get_container()->get_service( 'svg' ) );
		$this->assertSame( '', get_the_icon( 'arrow-right' ) );

		ob_start();
		the_icon( 'arrow-right' );
		$this->assertSame( '', ob_get_clean() );
	}

	public function test_get_the_icon_sprite(): void {
		$markup = get_the_icon( 'arrow-right', [ 'extra' ] );

		$this->assertSame( Framework::get_container()->get_service( 'svg' )->get_the_icon( 'arrow-right', [ 'extra' ], true ), $markup );
		$this->assertStringStartsWith(
			sprintf( '<svg class="icon icon-arrow-right extra" aria-hidden="true" focusable="false"><use href="%s', get_theme_file_uri( 'dist/icons/sprite.svg' ) ),
			$markup
		);
		$this->assertStringEndsWith( '#icon-arrow-right"></use></svg>', $markup );
	}

	public function test_get_the_icon_inline(): void {
		$this->assertSame(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-arrow-right extra" aria-hidden="true" focusable="false"><path d="M0 0h24v24H0z"/></svg>' . "\n",
			get_the_icon( 'arrow-right', [ 'extra' ], false )
		);
		$this->assertSame(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-facebook" aria-hidden="true" focusable="false"><path d="M0 0h24v24H0z"/></svg>' . "\n",
			get_the_icon( 'social/facebook', [], false )
		);
	}

	public function test_get_the_icon_empty_or_missing(): void {
		$this->assertSame( '', get_the_icon( '' ) );
		$this->assertSame( '', get_the_icon( 'missing', [], false ) );
	}

	public function test_the_icon(): void {
		ob_start();
		the_icon( 'arrow-right', [ 'extra' ], false );
		$this->assertSame( get_the_icon( 'arrow-right', [ 'extra' ], false ), ob_get_clean() );

		ob_start();
		the_icon( 'arrow-right' );
		$this->assertSame( get_the_icon( 'arrow-right' ), ob_get_clean() );
	}
}
