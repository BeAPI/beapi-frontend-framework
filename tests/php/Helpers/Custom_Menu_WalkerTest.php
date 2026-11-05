<?php

use BEA\Theme\Framework\Helpers\Custom_Menu_Walker;

class Custom_Menu_WalkerTest extends WP_UnitTestCase {

	/**
	 * @var int
	 */
	private $menu_id;

	public function set_up(): void {
		parent::set_up();

		$this->menu_id = wp_create_nav_menu( 'Header' );
	}

	private function add_item( string $title, int $parent_id = 0 ): int {
		return wp_update_nav_menu_item(
			$this->menu_id,
			0,
			[
				'menu-item-title'     => $title,
				'menu-item-url'       => home_url( '/' . sanitize_title( $title ) . '/' ),
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $parent_id,
			]
		);
	}

	/**
	 * Build the menu item object as wp_nav_menu() passes it to the walker.
	 */
	private function get_item( int $item_id, array $classes ): WP_Post {
		$item          = wp_setup_nav_menu_item( get_post( $item_id ) );
		$item->classes = $classes;

		return $item;
	}

	/**
	 * Arguments as built by wp_nav_menu().
	 */
	private function get_args(): stdClass {
		return (object) [
			'before'       => '',
			'after'        => '',
			'link_before'  => '',
			'link_after'   => '',
			'item_spacing' => 'discard',
		];
	}

	public function test_extends_core_walker(): void {
		$this->assertInstanceOf( Walker_Nav_Menu::class, new Custom_Menu_Walker() );
	}

	public function test_start_lvl_outputs_nothing(): void {
		$walker = new Custom_Menu_Walker();
		$output = '';

		$walker->start_lvl( $output );

		$this->assertSame( '', $output );
	}

	public function test_end_lvl(): void {
		$walker = new Custom_Menu_Walker();
		$output = '';

		$walker->end_lvl( $output );

		$this->assertSame( '</ul></div></div>', $output );
	}

	public function test_start_el_without_children(): void {
		$item_id = $this->add_item( 'Item' );
		$walker  = new Custom_Menu_Walker();
		$output  = '';

		$walker->start_el( $output, $this->get_item( $item_id, [ 'menu-item' ] ), 0, $this->get_args() );

		$this->assertSame(
			sprintf( '<li id="menu-item-%1$d" class="menu-item menu-item-%1$d"><a href="%2$s">Item</a>', $item_id, home_url( '/item/' ) ),
			$output
		);
	}

	public function test_start_el_with_children(): void {
		$item_id = $this->add_item( 'Item' );
		$walker  = new Custom_Menu_Walker();
		$output  = '';

		$walker->start_el( $output, $this->get_item( $item_id, [ 'menu-item', 'menu-item-has-children' ] ), 1, $this->get_args() );

		$this->assertSame(
			sprintf(
				'<li id="menu-item-%1$d" class="menu-item menu-item-has-children menu-item-%1$d"><a href="%2$s">Item</a><button class="header__sub-menu-toggle" type="button" aria-expanded="false" aria-controls="header-sub-menu-%1$d"><span class="aria-expanded-false-text">Open menu</span><span class="aria-expanded-true-text">Close menu</span></button><div id="header-sub-menu-%1$d" class="header__sub-menu header__sub-menu-level-1"><div><ul>',
				$item_id,
				home_url( '/item/' )
			),
			$output
		);
	}

	public function test_wp_nav_menu(): void {
		$parent_id = $this->add_item( 'Parent' );
		$child_id  = $this->add_item( 'Child', $parent_id );
		$single_id = $this->add_item( 'Single' );

		$markup = wp_nav_menu(
			[
				'menu'         => $this->menu_id,
				'walker'       => new Custom_Menu_Walker(),
				'container'    => false,
				'echo'         => false,
				'fallback_cb'  => false,
				'item_spacing' => 'discard',
			]
		);

		$this->assertSame(
			sprintf(
				'<ul id="menu-header" class="menu">'
				. '<li id="menu-item-%1$d" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-%1$d"><a href="%4$s">Parent</a>'
				. '<button class="header__sub-menu-toggle" type="button" aria-expanded="false" aria-controls="header-sub-menu-%1$d"><span class="aria-expanded-false-text">Open menu</span><span class="aria-expanded-true-text">Close menu</span></button>'
				. '<div id="header-sub-menu-%1$d" class="header__sub-menu header__sub-menu-level-0"><div><ul>'
				. '<li id="menu-item-%2$d" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-%2$d"><a href="%5$s">Child</a></li>'
				. '</ul></div></div></li>'
				. '<li id="menu-item-%3$d" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-%3$d"><a href="%6$s">Single</a></li>'
				. '</ul>',
				$parent_id,
				$child_id,
				$single_id,
				home_url( '/parent/' ),
				home_url( '/child/' ),
				home_url( '/single/' )
			),
			$markup
		);
	}
}
