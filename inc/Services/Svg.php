<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Svg
 *
 * @package BEA\Theme\Framework
 */
class Svg implements Service {
	/**
	 * @var Assets;
	 */
	private $assets;

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {
		$this->assets = Framework::get_container()->get_service( 'assets' );
		add_filter( 'wp_kses_allowed_html', [ $this, 'allow_svg_tag' ] );
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'svg';
	}

	/**
	 * @param string $icon_class
	 * @param array  $additionnal_classes
	 *
	 * @return string
	 */
	public function get_the_icon( string $icon_class, array $additionnal_classes = [] ): string {
		if ( empty( $icon_class ) ) {
			return '';
		}

		// acf-svg-icon already return sprite-name.svg#icon-name, ex: social.svg#icon-facebook
		// format the string to obtain sprite-name/icon-name
		$icon_class = str_replace( '.svg#icon-', '/', $icon_class );

		$sprite_name = 'sprite';

		if ( false !== strpos( $icon_class, '/' ) ) {
			$sprite_name = strtok( $icon_class, '/' );
			$icon_class  = substr( $icon_class, strpos( $icon_class, '/' ) + 1 );
		}

		$sprite_path = $this->assets->get_min_file( 'icons/' . $sprite_name . '.svg' );

		if ( ! file_exists( \get_theme_file_path( '/dist/' . $sprite_path ) ) ) {
			return '';
		}

		$icon_slug = strpos( $icon_class, 'icon-' ) === 0 ? $icon_class : sprintf( 'icon-%s', $icon_class );
		$classes   = [ 'icon', $icon_slug ];
		$classes   = array_merge( $classes, $additionnal_classes );
		$classes   = array_map( 'sanitize_html_class', $classes );

		return sprintf( '<svg class="%s" aria-hidden="true" focusable="false"><use href="%s#%s"></use></svg>', implode( ' ', $classes ), \get_theme_file_uri( sprintf( '/dist/%s', $sprite_path ) ), $icon_slug ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * @param string $icon_class
	 * @param array $additionnal_classes
	 */
	public function the_icon( string $icon_class, array $additionnal_classes = [] ): void {
		echo $this->get_the_icon( $icon_class, $additionnal_classes ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Allow svg tag
	 *
	 * @param $tags
	 *
	 * @return mixed
	 * @author Egidio CORICA
	 */
	public function allow_svg_tag( $tags ) {
		$tags['svg'] = [
			'xmlns'       => [],
			'fill'        => [],
			'viewbox'     => [],
			'role'        => [],
			'aria-hidden' => [],
			'focusable'   => [],
			'class'       => [],
			'style'       => [],
		];

		$tags['path'] = [
			'd'    => [],
			'fill' => [],
		];

		$tags['use'] = [
			'href'        => [],
			'xmlns:xlink' => [],
			'xlink:href'  => [],
		];

		return $tags;
	}
}
