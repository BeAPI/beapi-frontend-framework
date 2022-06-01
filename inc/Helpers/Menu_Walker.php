<?php

namespace BEA\Theme\Framework\Helpers;

use function BEA\Theme\Framework\Helpers\Svg\get_the_icon;

class Menu_Walker extends \Walker_Nav_Menu {

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
			$output .= '<button class="header__sub-menu-toggle" type="button"><span class="sr-only">Toggle menu</span>' . get_the_icon( 'down' ) . '</button>';
			$output .= '<div class="header__sub-menu header__sub-menu-level-' . $depth . '"><div>';
			$output .= '<ul>';
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
