<?php

namespace BEA\Theme\Framework;

class SVG implements Service{
	public function register() {
		add_action( 'wp_footer', [ $this, 'footer_icons' ] );
		add_action( 'embed_footer', [ $this, 'footer_icons' ] );
	}

	public function get_service_name() {
		return 'svg';
	}

	function footer_icons() {
		if ( ! locate_template( [ 'assets/icons/icons.svg' ], true ) ) {
			echo '<!-- No SVG File found -->';
		}
	}
}