<?php

namespace BEA\Theme\Framework\Tools;

/**
 * Class Assets
 *
 * @package BEA\Theme\Framework\Tools
 */
class Assets {

	/**
	 * Register a script with the get_theme_file_uri function.
	 *
	 *
	 * @param $handle
	 * @param $src : Have to be a relative filename
	 * @param array $deps
	 * @param bool $ver
	 * @param bool $in_footer
	 *
	 * @return bool
	 */
	public function register_script( $handle, $src, $deps = array(), $ver = false, $in_footer = false ) {
		return \wp_register_script( $handle, \get_theme_file_uri( $src ), $deps, $ver, $in_footer );
	}

	/**
	 * @param $handle
	 */
	public function enqueue_script( $handle ) {
		\wp_enqueue_script( $handle );
	}

	/**
	 * Register a style with the get_theme_file_uri function.
	 *
	 *
	 * @param $handle
	 * @param $src : Have to be a relative filename
	 * @param array $deps
	 * @param bool $ver
	 * @param bool $in_footer
	 *
	 * @return bool
	 */
	public function register_style( $handle, $src, $deps = array(), $ver = false, $media = 'all' ) {
		return \wp_register_style( $handle, \get_theme_file_uri( $src ), $deps, $ver, $media );
	}

	/**
	 * @param $handle
	 */
	public function enqueue_style( $handle ) {
		\wp_enqueue_style( $handle );
	}
}