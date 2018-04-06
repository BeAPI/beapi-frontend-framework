<?php

namespace BEA\Theme\Framework;


class Assets_JS_Async implements Service {

	/**
	 * JS handlers for the script.
	 * @var array : the script styles to async load
	 */
	private $js_handlers = [ 'scripts' => true ];

	/**
	 * @inheritdoc
	 */
	public function register() {
		if ( current_theme_supports( 'async-js' ) && ! is_admin() ) {
			add_filter( 'script_loader_tag', array( $this, 'script_loader_tag' ), 20, 2 );
		}
	}

	/**
	 * @inheritdoc
	 */
	public function get_service_name() {
		return 'assets-js-async';
	}

	/**
	 * @param $handler
	 */
	public function add_js_handler( $handler ) {
		$this->js_handlers[ $handler ] = true;
	}

	/**
	 * Replace default generated WP Link Tag
	 *
	 * @param string $html The link tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 *
	 * @return string
	 * @author Nicolas JUEN
	 */
	public function script_loader_tag( $html, $handle ) {
		if ( ! isset( $this->js_handlers[ $handle ] ) ) {
			return $html;
		}

		return  str_replace( ' src', ' async="async" src', $html );
	}
}
