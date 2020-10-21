<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Svg
 *
 * @package BEA\Theme\Framework
 */
class Svg implements Service {

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'svg';
	}

	/**
	 * @param       $icon_class
	 * @param array $additionnal_classes
	 *
	 * @return string
	 */
	public function get_the_icon( $icon_class, $additionnal_classes = [] ) {
		$classes = [ 'icon', sprintf( 'icon-%s', $icon_class ) ];
		$classes = array_merge( $classes, $additionnal_classes );
		$classes = array_map( 'sanitize_html_class', $classes );

		return sprintf( '<svg class="%s" aria-hidden="true" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="%s#icon-%s"></use></svg>', implode( ' ', $classes ), \get_theme_file_uri( '/dist/assets/img/icons/icons.svg' ), $icon_class ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * @param       $icon_class
	 * @param array $additionnal_classes
	 */
	public function the_icon( $icon_class, $additionnal_classes = [] ) {
		echo $this->get_the_icon( $icon_class, $additionnal_classes ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
