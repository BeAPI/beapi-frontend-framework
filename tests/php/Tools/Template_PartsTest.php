<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Tools\Template_Parts;

class Template_PartsTest extends WP_UnitTestCase {

	public function test_get_service_name(): void {
		$this->assertSame( 'template-parts', ( new Template_Parts() )->get_service_name() );
	}

	public function test_register_and_boot_do_nothing(): void {
		$template_parts = new Template_Parts();
		$container      = new Service_Container();

		$this->assertNull( $template_parts->register( $container ) );
		$this->assertNull( $template_parts->boot( $container ) );
		$this->assertNull( $template_parts->get_vars( '' ) );
	}

	public function test_add_var(): void {
		$this->assertTrue( ( new Template_Parts() )->add_var( 'slug', 'key', 'value' ) );
	}

	public function test_add_var_default_value(): void {
		$template_parts = new Template_Parts();

		$template_parts->add_var( 'slug', 'key' );

		$this->assertSame( '', $template_parts->get_var( 'slug', 'key' ) );
	}

	public function test_get_var(): void {
		$template_parts = new Template_Parts();

		$this->assertNull( $template_parts->get_var( 'slug', 'key' ) );
		$this->assertNull( $template_parts->get_var() );

		$template_parts->add_var( 'slug', 'key', 'value' );

		$this->assertSame( 'value', $template_parts->get_var( 'slug', 'key' ) );

		// Overwritten by a new value.
		$template_parts->add_var( 'slug', 'key', 'new value' );

		$this->assertSame( 'new value', $template_parts->get_var( 'slug', 'key' ) );
	}

	public function test_get_var_other_slug(): void {
		$template_parts = new Template_Parts();

		$template_parts->add_var( 'slug', 'key', 'value' );

		$this->assertNull( $template_parts->get_var( 'slug2', 'key' ) );
		$this->assertNull( $template_parts->get_var( 'slug', 'key2' ) );
	}

	public function test_get_vars(): void {
		$template_parts = new Template_Parts();

		$template_parts->add_var( 'slug', 'key', 'value' );
		$template_parts->add_var( 'slug', 'key2', 'value3' );
		$template_parts->add_var( 'slug3', 'key', 'value3' );

		$this->assertSame(
			[
				'key'  => 'value',
				'key2' => 'value3',
			],
			$template_parts->get_vars( 'slug' )
		);
		$this->assertNull( $template_parts->get_vars( 'slug2' ) );
		$this->assertNull( $template_parts->get_vars() );
		$this->assertSame( 'value3', $template_parts->get_var( 'slug3', 'key' ) );
	}

	public function test_vars_are_shared_with_template_parts(): void {
		$post_id = self::factory()->post->create( [ 'post_title' => 'Shared vars' ] );
		$this->go_to( get_permalink( $post_id ) );
		$this->assertTrue( is_singular() );

		$template_parts = Framework::get_container()->get_service( 'template-parts' );
		$this->assertInstanceOf( Template_Parts::class, $template_parts );

		// Unique slug: the booted instance keeps its vars for the whole tests run.
		$template_parts->add_var( 'bea-tests-vars', 'title', '<em>' . get_the_title( $post_id ) . '</em>' );

		// The fixture reads the var from the service and escapes it.
		$this->expectOutputString( '&lt;em&gt;Shared vars&lt;/em&gt;' );
		$this->assertNotFalse( get_template_part( 'tests/assets/template-parts/vars' ) );
	}
}
