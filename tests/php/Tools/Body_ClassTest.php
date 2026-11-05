<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Tools\Body_Class;

class Body_ClassTest extends WP_UnitTestCase {

	public function test_get_service_name(): void {
		$this->assertSame( 'body-class', ( new Body_Class() )->get_service_name() );
	}

	public function test_service_is_booted_by_the_theme(): void {
		$body_class = Framework::get_container()->get_service( 'body-class' );

		$this->assertInstanceOf( Body_Class::class, $body_class );
		$this->assertSame( 10, has_filter( 'body_class', [ $body_class, 'body_class' ] ) );
	}

	public function test_register_adds_no_filter(): void {
		$body_class = new Body_Class();

		$this->assertNull( $body_class->register( new Service_Container() ) );
		$this->assertFalse( has_filter( 'body_class', [ $body_class, 'body_class' ] ) );
	}

	public function test_boot_adds_filter(): void {
		$body_class = new Body_Class();

		$body_class->boot( new Service_Container() );

		$this->assertSame( 10, has_filter( 'body_class', [ $body_class, 'body_class' ] ) );
	}

	public function test_add(): void {
		$body_class = new Body_Class();

		$body_class->add( 'test' );

		$this->assertSame( [ 'test' ], $body_class->body_class( [] ) );
	}

	public function test_remove(): void {
		$body_class = new Body_Class();

		$body_class->add( 'test' );
		$body_class->remove( 'test' );

		$this->assertSame( [], $body_class->body_class( [] ) );
	}

	public function test_add_remove_with_initial_data(): void {
		$body_class = new Body_Class();

		$body_class->add( 'test' );
		$body_class->remove( 'test' );

		$this->assertSame( [ 'leaveme' ], $body_class->body_class( [ 'leaveme' ] ) );
	}

	public function test_remove_keeps_keys(): void {
		$body_class = new Body_Class();

		$body_class->remove( 'first' );

		// array_filter() preserves the keys of the remaining classes.
		$this->assertSame( [ 1 => 'second' ], $body_class->body_class( [ 'first', 'second' ] ) );
	}

	public function test_add_array_breaks_filter(): void {
		$body_class = new Body_Class();

		// Suspected bug, current behaviour: add() documents array|string, but the private filter() only accepts strings.
		$body_class->add( [ 'first', 'second' ] );

		$this->expectException( TypeError::class );

		$body_class->body_class( [] );
	}

	public function test_body_classes_on_front_page(): void {
		$this->go_to( home_url( '/' ) );
		$this->assertTrue( is_home() );

		$body_class = new Body_Class();
		$body_class->boot( new Service_Container() );
		$body_class->add( 'bea-custom' );
		// Removes a class added by WordPress.
		$body_class->remove( 'home' );

		$classes = get_body_class();

		$this->assertContains( 'bea-custom', $classes );
		$this->assertContains( 'blog', $classes );
		$this->assertNotContains( 'home', $classes );
	}

	public function test_body_classes_on_single_post(): void {
		$post_id = self::factory()->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$body_class = new Body_Class();
		$body_class->boot( new Service_Container() );
		$body_class->add( 'bea-single' );
		$body_class->remove( 'postid-' . $post_id );

		$classes = get_body_class( 'extra' );

		$this->assertContains( 'single', $classes );
		$this->assertContains( 'extra', $classes );
		$this->assertContains( 'bea-single', $classes );
		$this->assertNotContains( 'postid-' . $post_id, $classes );
	}

	public function test_body_class_markup(): void {
		$this->go_to( home_url( '/' ) );

		$body_class = new Body_Class();
		$body_class->boot( new Service_Container() );
		$body_class->add( 'bea-markup' );

		ob_start();
		body_class();
		$markup = ob_get_clean();

		$this->assertStringStartsWith( 'class="', $markup );
		$this->assertStringContainsString( 'bea-markup', $markup );
	}
}
