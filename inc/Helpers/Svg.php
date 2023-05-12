<?php
namespace BEA\Theme\Framework\Helpers\Svg;

use BEA\Theme\Framework\Services\Svg;

/**
 * @usage BEA\Theme\Framework\Helpers\Svg\get_the_icon( 'like' );
 *
 * @param string $icon_name
 *
 * @return string
 */
function get_the_icon( string $icon_name ): string {
	/**
	* @var Svg $svg
	*/
	$svg = \BEA\Theme\Framework\Framework::get_container()->get_service( 'svg' );
	return false !== $svg ? $svg->get_the_icon( $icon_name ) : '';
}

/**
 * @usage BEA\Theme\Framework\Helpers\Svg\the_icon( 'like' );
 *
 * @param string $icon_name
 *
 */
function the_icon( string $icon_name ): void {
	/**
	* @var Svg $svg
	*/
	$svg = \BEA\Theme\Framework\Framework::get_container()->get_service( 'svg' );
	false !== $svg ? $svg->the_icon( $icon_name ) : '';
}
