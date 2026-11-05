<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Breadcrumb;

class BreadcrumbTest extends WP_UnitTestCase {

	/**
	 * Separator added after each link but the last one.
	 *
	 * Current behaviour: the separator is a raw ">" character, not an HTML entity.
	 */
	private const SEPARATOR = '<span class="breadcrumb__separator" aria-hidden="true">></span>';

	public function test_get_service_name(): void {
		$this->assertSame( 'breadcrumb', ( new Breadcrumb() )->get_service_name() );
	}

	public function test_service_is_booted_by_the_theme(): void {
		$breadcrumb = Framework::get_container()->get_service( 'breadcrumb' );

		$this->assertInstanceOf( Breadcrumb::class, $breadcrumb );
		$this->assertSame( 10, has_filter( 'wpseo_breadcrumb_output_wrapper', [ $breadcrumb, 'replace_breadcrumb_wrapper' ] ) );
	}

	public function test_register_adds_no_filter(): void {
		$breadcrumb = new Breadcrumb();

		$this->assertNull( $breadcrumb->register( new Service_Container() ) );
		$this->assertFalse( has_filter( 'wpseo_breadcrumb_output_wrapper', [ $breadcrumb, 'replace_breadcrumb_wrapper' ] ) );
	}

	public function test_boot_adds_filters(): void {
		$breadcrumb = new Breadcrumb();

		$breadcrumb->boot( new Service_Container() );

		$this->assertSame( 10, has_filter( 'wpseo_breadcrumb_output_wrapper', [ $breadcrumb, 'replace_breadcrumb_wrapper' ] ) );
		$this->assertSame( 10, has_filter( 'wpseo_breadcrumb_single_link_wrapper', [ $breadcrumb, 'replace_breadcrumb_link_wrapper' ] ) );
		$this->assertSame( 10, has_filter( 'wpseo_breadcrumb_single_link', [ $breadcrumb, 'replace_breadcrumb_link' ] ) );
		$this->assertSame( 10, has_filter( 'wpseo_breadcrumb_separator', [ $breadcrumb, 'remove_breadcrumb_separator' ] ) );
	}

	public function test_yoast_filters_are_replaced(): void {
		$this->assertSame( 'ol', apply_filters( 'wpseo_breadcrumb_output_wrapper', 'span' ) );
		$this->assertSame( 'li', apply_filters( 'wpseo_breadcrumb_single_link_wrapper', 'span' ) );
		$this->assertSame( '', apply_filters( 'wpseo_breadcrumb_separator', '&raquo;' ) );
		$this->assertSame(
			'<li><a href="https://example.org/">Home</a>' . self::SEPARATOR . '</li>',
			apply_filters( 'wpseo_breadcrumb_single_link', '<li><a href="https://example.org/">Home</a></li>' )
		);
	}

	public function test_replace_breadcrumb_wrapper(): void {
		$this->assertSame( 'ol', ( new Breadcrumb() )->replace_breadcrumb_wrapper() );
	}

	public function test_replace_breadcrumb_link_wrapper(): void {
		$this->assertSame( 'li', ( new Breadcrumb() )->replace_breadcrumb_link_wrapper() );
	}

	public function test_remove_breadcrumb_separator(): void {
		$this->assertSame( '', ( new Breadcrumb() )->remove_breadcrumb_separator() );
	}

	public function test_replace_breadcrumb_link_adds_separator(): void {
		$this->assertSame(
			'<li><a href="https://example.org/">Home</a>' . self::SEPARATOR . '</li>',
			( new Breadcrumb() )->replace_breadcrumb_link( '<li><a href="https://example.org/">Home</a></li>' )
		);
	}

	public function test_replace_breadcrumb_link_last_item_unchanged(): void {
		$link = '<li><span class="breadcrumb_last" aria-current="page">Current</span></li>';

		$this->assertSame( $link, ( new Breadcrumb() )->replace_breadcrumb_link( $link ) );
	}

	public function test_replace_breadcrumb_link_without_closing_li(): void {
		$link = '<span><a href="https://example.org/">Home</a></span>';

		$this->assertSame( $link, ( new Breadcrumb() )->replace_breadcrumb_link( $link ) );
	}

	public function test_replace_breadcrumb_link_empty(): void {
		$this->assertSame( '', ( new Breadcrumb() )->replace_breadcrumb_link( '' ) );
	}
}
