<?php

namespace BEA\Theme\Framework\Helpers;

class Custom_Menu_Walker extends \Walker_Nav_Menu {

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
			$sub_menu_id = 'header-sub-menu-' . $item->ID;

			$output .= '<button class="header__sub-menu-toggle" type="button" aria-expanded="false" aria-controls="' . esc_attr( $sub_menu_id ) . '">';
			$output .= sprintf( '<span class="aria-expanded-false-text">%s</span>', esc_html__( 'Open menu', 'beapi-frontend-framework' ) );
			$output .= sprintf( '<span class="aria-expanded-true-text">%s</span>', esc_html__( 'Close menu', 'beapi-frontend-framework' ) );
			$output .= '</button>';
			$output .= sprintf( '<div id="%s" class="header__sub-menu %s"><div>', esc_attr( $sub_menu_id ), esc_attr( 'header__sub-menu-level-' . $depth ) );
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
