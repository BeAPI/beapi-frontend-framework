<?php

namespace BEA\Theme\Framework\Helpers;

class Custom_Menu_Walker extends \Walker_Nav_Menu {

	private static $sub_menu_counter = 0;

	/**
	 * @param       $output
	 * @param int   $depth
	 * @param array $args
	 */
	public function start_lvl( &$output, $depth = 0, $args = [] ) {}

	/**
	 * @param         $output
	 * @param \WP_Post $item
	 * @param int     $depth
	 * @param array   $args
	 */
	public function start_el( &$output, $item, $depth = 0, $args = [], $id = 0 ) {
		parent::start_el( $output, $item, $depth, $args, $id );

		if ( in_array( 'menu-item-has-children', $item->classes, true ) ) {
			$output .= '<button class="header__sub-menu-toggle" type="button" aria-expanded="false" aria-controls="header-sub-menu-' . self::$sub_menu_counter . '">';
			$output .= esc_html__( 'Toggle menu', 'beapi-frontend-framework' );
			$output .= '</button>';
			$output .= '<div id="header-sub-menu-' . self::$sub_menu_counter . '" class="header__sub-menu header__sub-menu-level-' . $depth . '"><div>';
			$output .= '<ul>';

			self::$sub_menu_counter++;
		}
	}

	/**
	 * @param       $output
	 * @param int   $depth
	 * @param array $args
	 */
	public function end_lvl( &$output, $depth = 0, $args = [] ) {
		$output .= '</ul></div></div>';
	}
}
