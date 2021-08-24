<?php

namespace BEA\Theme\Framework\Helpers;

use Walker_Nav_Menu;

class Accessible_Menu_Walker extends Walker_Nav_Menu {

	/**
	 * @param       $output
	 * @param int   $depth
	 * @param array $args
	 */
	public function start_lvl( &$output, $depth = 0, $args = null ): void {
		$indent  = str_repeat( "\t", $depth );
		$output .= "\n$indent<div class='amenu__panel'><ul class='sub-menu amenu__sub-menu'>\n";
	}

	/**
	 * @param       $output
	 * @param int   $depth
	 * @param array $args
	 */
	public function end_lvl( &$output, $depth = 0, $args = null ): void {
		$indent  = str_repeat( "\t", $depth );
		$output .= "$indent</ul></div>\n";
	}
}
