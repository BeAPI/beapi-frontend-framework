<?php

namespace BEA\Theme\Framework\Helpers;

class Accessible_Menu_Walker extends Walker_Nav_Menu {

	/**
	 * @param       $output
	 * @param int   $depth
	 * @param array $args
	 */
	function start_lvl( &$output, $depth = 0, $args = array() ) {
		$indent  = str_repeat( "\t", $depth );
		$output .= "\n$indent<div class='amenu__panel'><ul class='sub-menu amenu__sub-menu'>\n";
	}

	/**
	 * @param       $output
	 * @param int   $depth
	 * @param array $args
	 */
	function end_lvl( &$output, $depth = 0, $args = array() ) {
		$indent  = str_repeat( "\t", $depth );
		$output .= "$indent</ul></div>\n";
	}
}
