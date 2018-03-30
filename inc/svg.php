<?php

namespace BEA\Theme\Framework;

class SVG implements Service {
	public function register() {
		add_action( 'wp_footer', [ $this, 'footer_icons' ] );
		add_action( 'embed_footer', [ $this, 'footer_icons' ] );
	}

	public function get_service_name() {
		return 'svg';
	}

	public function footer_icons() {
		if ( ! file_exists( \get_theme_file_path( '/dist/assets/icons/icons.svg' ) ) ) {
			echo '<!-- No SVG File found -->';
		}

		require_once( \get_theme_file_path( '/dist/assets/icons/icons.svg' ) );
	}

	public function get_the_icon( $icon_class, $additionnal_classes = array() ) {
		$classes[] = 'icon';
		$classes[] = sprintf( 'icon-%s', $icon_class );
		$classes   = array_merge( $classes, $additionnal_classes );
		$classes   = array_map('sanitize_html_class', $classes );

		return sprintf( '<svg class="%s" aria-hidden="true" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-%s"></use></svg>', implode( ' ', $classes ), $icon_class );
	}

	public function the_icon( $icon_class, $additionnal_classes = array() ) {
		echo $this->get_the_icon( $icon_class, $additionnal_classes );
	}
}