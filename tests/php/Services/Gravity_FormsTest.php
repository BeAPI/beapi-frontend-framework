<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Gravity_Forms;

class Gravity_FormsTest extends WP_UnitTestCase {

	public function test_get_service_name(): void {
		$this->assertSame( 'gravity-forms', ( new Gravity_Forms() )->get_service_name() );
	}

	public function test_service_is_booted_by_the_theme(): void {
		$gravity_forms = Framework::get_container()->get_service( 'gravity-forms' );

		$this->assertInstanceOf( Gravity_Forms::class, $gravity_forms );
		$this->assertSame( 10, has_filter( 'gform_form_theme_slug', [ $gravity_forms, 'gform_form_theme_slug' ] ) );
	}

	public function test_register_adds_no_filter(): void {
		$gravity_forms = new Gravity_Forms();

		$this->assertNull( $gravity_forms->register( new Service_Container() ) );
		$this->assertFalse( has_filter( 'gform_form_theme_slug', [ $gravity_forms, 'gform_form_theme_slug' ] ) );
	}

	public function test_boot_adds_filter(): void {
		$gravity_forms = new Gravity_Forms();

		$gravity_forms->boot( new Service_Container() );

		$this->assertSame( 10, has_filter( 'gform_form_theme_slug', [ $gravity_forms, 'gform_form_theme_slug' ] ) );
	}

	public function test_form_theme_slug(): void {
		$this->assertSame( 'gravity-theme', ( new Gravity_Forms() )->gform_form_theme_slug() );
	}

	public function test_form_theme_slug_filter_ignores_incoming_value(): void {
		// The filter forces the slug whatever Gravity Forms passes.
		$this->assertSame( 'gravity-theme', apply_filters( 'gform_form_theme_slug', 'orbital', [ 'id' => 1 ] ) );
	}
}
