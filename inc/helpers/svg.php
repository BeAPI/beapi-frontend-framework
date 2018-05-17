<?php namespace BEA\Theme\Framework\Helpers\SVG;

/**
 * @usage BEA\Theme\Framework\Helpers\SVG\get_the_icon( 'like' );
 *
 * @param       $icon_class
 * @param array $additionnal_classes
 *
 * @return string
 */
function get_the_icon( $icon_class, $additionnal_classes = array() ) {
	return ( \BEA\Theme\Framework\Framework::get_container() )->get_service( 'svg' )->get_the_icon( $icon_class, $additionnal_classes );
}

/**
 * @usage BEA\Theme\Framework\Helpers\SVG\the_icon( 'like' );
 *
 * @param       $icon_class
 * @param array $additionnal_classes
 */
function the_icon( $icon_class, $additionnal_classes = array() ) {
	( \BEA\Theme\Framework\Framework::get_container() )->get_service( 'svg' )->the_icon( $icon_class, $additionnal_classes );
}