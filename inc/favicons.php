<?php

namespace BEA\Theme\Framework;

class Favicons implements Service {

	/**
	 * The path suffix for the icons
	 *
	 * @var string
	 */
	private $path_suffix = '/assets/img/favicons/';

	public function register() {
		add_action( 'wp_head', [ $this, 'the_favicons' ], 25 );
	}

	public function get_service_name() {
		return 'favicons';
	}

	public function set_path_suffix( $suffix ) {
		$this->path_suffix = (string) $suffix;
	}

	/**
	 * Template method to display favicons and favicon dependencies
	 *
	 * @author Maxime CULEA
	 */
	public function the_favicons() {
		$favicons  = array();
		$base_path = \get_theme_file_path( $this->path_suffix );
		$base_url  = \get_theme_file_uri( $this->path_suffix );

		$favicons_atts = array(
			array(
				'sizes'         => array(
					'57x57',
					'60x60',
					'72x72',
					'76x76',
					'114x114',
					'120x120',
					'144x144',
					'152x152',
					'180x180',
				),
				'rel'           => 'apple-touch-icon',
				'type'          => '',
				'filename_base' => 'apple-touch-icon',
				'file_type'     => 'png',
			),
			array(
				'sizes'         => array(
					'16x16',
					'32x32',
				),
				'rel'           => 'icon',
				'type'          => 'image/png',
				'filename_base' => 'favicon',
				'file_type'     => 'png',
			),
			array(
				'sizes'         => array( '228x228' ),
				'rel'           => 'icon',
				'type'          => 'image/png',
				'filename_base' => 'coast',
				'file_type'     => 'png',
			),
		);

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

				$favicon = vsprintf( '<link %s%s%s%s>', array( $rel_attr, $type_attr, $size, $href ) );
				if ( ! empty( $favicon ) ) {
					$favicons[] = $favicon;
				}
			}
		}

		if ( file_exists( $base_path . 'favicon.ico' ) ) {
			$favicons[] = sprintf( '<link rel="shortcut icon" href="%s">', esc_url( $base_url . 'favicon.ico' ) );
		}
		$favicons[] = '<meta name="theme-color" content="#ffffff">';
		$favicons[] = '<meta name="msapplication-TileColor" content="#ffffff">';
		if ( file_exists( $base_path . 'mstile-144x144.png' ) ) {
			$favicons[] = sprintf( '<link name="msapplication-TileImage" content="%s">', esc_url( $base_url . 'mstile-144x144.png' ) );
		}
		if ( file_exists( $base_path . 'browserconfig.xml' ) ) {
			$favicons[] = sprintf( '<meta name="msapplication-config" content="%s">', esc_url( $base_url . 'browserconfig.xml' ) );
		}

		$favicons[] = '<meta name="mobile-web-app-capable" content="yes">';
		$favicons[] = '<meta name="application-name" content="Journal du Geek">';

		$favicons[] = '<meta name="apple-mobile-web-app-capable" content="yes">';
		$favicons[] = '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">';
		$favicons[] = '<meta name="apple-mobile-web-app-title" content="Journal du Geek">';

		if ( empty( $favicons ) ) {
			return;
		}

		printf( "\t%s", implode( "\n\t", $favicons ) );
	}
}