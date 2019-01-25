<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

/**
 * Class Favicons
 *
 * @package BEA\Theme\Framework
 */
class Favicons implements Service {

	/**
	 * The path suffix for the icons
	 *
	 * @var string
	 */
	private $path_suffix = '/dist/assets/img/favicons/';

	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ) {}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ) {
		add_action( 'wp_head', [ $this, 'the_favicons' ], 25 );
	}

	/**
	 * @return string
	 */
	public function get_service_name() {
		return 'favicons';
	}

	/**
	 * @param $suffix
	 */
	public function set_path_suffix( $suffix ) {
		$this->path_suffix = (string) $suffix;
	}

	/**
	 * Template method to display favicons and favicon dependencies
	 *
	 * @author Maxime CULEA
	 */
	public function the_favicons() {
		$favicons  = [];
		$base_path = \get_theme_file_path( $this->path_suffix );
		$base_url  = \get_theme_file_uri( $this->path_suffix );

		$favicons[] = '<meta name="mobile-web-app-capable" content="yes">';
		$favicons[] = '<meta name="theme-color" content="#ffffff">';
		$favicons[] = '<meta name="application-name" content="' . get_bloginfo( 'name' ) . '">';

		$favicons_atts = [
			[
				'sizes'         => [
					'57x57',
					'60x60',
					'72x72',
					'76x76',
					'114x114',
					'120x120',
					'144x144',
					'152x152',
					'180x180',
				],
				'rel'           => 'apple-touch-icon',
				'type'          => '',
				'filename_base' => 'apple-touch-icon',
				'file_type'     => 'png',
			],
		];

		$favicons = $this->generate_favicons( $favicons, $favicons_atts, $base_path, $base_url );

		$favicons[] = '<meta name="apple-mobile-web-app-capable" content="yes">';
		$favicons[] = '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">';
		$favicons[] = '<meta name="apple-mobile-web-app-title" content="' . get_bloginfo( 'name' ) . '">';


		$favicons_atts = [
			[
				'sizes'         => [
					'228x228',
				],
				'rel'           => 'icon',
				'type'          => 'image/png',
				'filename_base' => 'coast',
				'file_type'     => 'png',
			],
		];

		$favicons   = $this->generate_favicons( $favicons, $favicons_atts, $base_path, $base_url );
		$favicons[] = '<meta name="msapplication-TileColor" content="#ffffff">';
		if ( file_exists( $base_path . 'mstile-144x144.png' ) ) {
			$favicons[] = sprintf( '<meta name="msapplication-TileImage" content="%s">', esc_url( $base_url . 'mstile-144x144.png' ) );
		}
		if ( file_exists( $base_path . 'browserconfig.xml' ) ) {
			$favicons[] = sprintf( '<meta name="msapplication-config" content="%s">', esc_url( $base_url . 'browserconfig.xml' ) );
		}

		if ( file_exists( $base_path . 'yandex-browser-manifest.json' ) ) {
			$favicons[] = sprintf( '<link rel="yandex-tableau-widget" href="%s">', esc_url( $base_url . 'yandex-browser-manifest.json' ) );
		}

		$favicons[]    = '<!-- Standard favicons from /assets/img/favicons/index_sd.html -->';
		$favicons_atts = [
			[
				'sizes'         => [
					'16x16',
					'32x32',
				],
				'rel'           => 'icon',
				'type'          => 'image/png',
				'filename_base' => 'favicon',
				'file_type'     => 'png',
			],
		];
		$favicons      = $this->generate_favicons( $favicons, $favicons_atts, $base_path, $base_url );


		if ( file_exists( $base_path . 'favicon.ico' ) ) {
			$favicons[] = sprintf( '<link rel="shortcut icon" href="%s">', esc_url( $base_url . 'favicon.ico' ) );
		}

		printf( "\t%s", implode( "\n\t", $favicons ) );
	}


	/**
	 * @param array $favicons
	 * @param array $favicons_atts
	 * @param $base_path
	 * @param $base_url
	 *
	 * @return array
	 * @author Alexandre Sadowski
	 */
	private function generate_favicons( array $favicons, array $favicons_atts, $base_path, $base_url ) {
		foreach ( $favicons_atts as $type ) {
			if ( ! is_array( $type ) || empty( $type['sizes'] ) ) {
				continue;
			}

			$filename_base = $type['filename_base'];
			$file_type     = $type['file_type'];
			$tmp_type      = $type['type'];
			$tmp_rel       = $type['rel'];
			foreach ( $type['sizes'] as $size ) {
				$filename = $filename_base . '-' . $size . '.' . $file_type;
				$path     = $base_path . $filename;
				$url      = $base_url . $filename;
				if ( ! is_file( $path ) || ! file_exists( $path ) ) {
					continue;
				}

				$rel_attr = '';
				if ( ! empty( $tmp_rel ) ) {
					$rel_attr = sprintf( 'rel="%s"', esc_attr( $tmp_rel ) );
				}

				$type_attr = '';
				if ( ! empty( $tmp_type ) ) {
					$type_attr = sprintf( ' type="%s"', esc_attr( $tmp_type ) );
				}

				$size = sprintf( ' sizes="%s"', esc_attr( $size ) );
				$href = sprintf( ' href="%s"', esc_url( $url ) );

				$favicon = vsprintf( '<link %s%s%s%s>', [ $rel_attr, $type_attr, $size, $href ] );
				if ( ! empty( $favicon ) ) {
					$favicons[] = $favicon;
				}
			}
		}

		return $favicons;
	}
}
