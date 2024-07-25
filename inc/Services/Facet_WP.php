<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Facet_WP implements Service {
	public function register( Service_Container $container ): void {
	}

	public function boot( Service_Container $container ): void {
		add_filter( 'facetwp_load_a11y', '__return_true' );
		add_filter( 'facetwp_facets', [ $this, 'register_facets' ], 40 );
		add_filter( 'facetwp_pager_html', [ $this, 'accessible_facetwp_pager_html' ], 10, 2 );
		add_filter( 'facetwp_facet_pager_link', [ $this, 'facetwp_facet_pager_link' ], 10, 2 );
		add_filter( 'facetwp_facet_html', [ $this, 'facetwp_add_labels' ], 10, 2 );
	}

	/**
	 * Get service name
	 *
	 * @return string
	 */
	public function get_service_name(): string {
		return 'facetwp';
	}

	/**
	 * Register facets from config file.
	 *
	 * @param array $facets
	 *
	 * @return array
	 * @author Egidio CORICA
	 */
	public function register_facets( array $facets ): array {

		$filename = get_theme_file_path( 'assets/facetwp/config.json' );
		if ( ! is_readable( $filename ) ) {
			return $facets;
		}

		$facet_content = file_get_contents( $filename ); // phpcs:ignore
		if ( empty( $facet_content ) ) {
			return $facets;
		}

		$facet_content = \json_decode( $facet_content, true );
		try {
			$facet_content = \json_decode( $facet_content, true, 512, JSON_THROW_ON_ERROR );
		} catch ( \JSONException $e ) {
			return $facets;
		}

		if ( ! is_array( $facet_content ) || empty( $facet_content['facets'] ) ) {
			return $facets;
		}

		return wp_parse_args( $facet_content['facets'], $facets );
	}

	/**
	 * Add custom and accessible FacetWP pagination.
	 * This function apply only with the old way to display a pager : facetwp_display( 'pager' );
	 * For customization of the pagination facet, see facetwp_facet_pager_link function.
	 *
	 * @param $output
	 * @param $params
	 *
	 * @return string
	 *
	 * @author Egidio CORICA
	 *
	 */
	public function accessible_facetwp_pager_html( $output, $params ): string {
		$defaults    = [
			'page'       => 1,
			'per_page'   => 10,
			'total_rows' => 1,
		];
		$params      = array_merge( $defaults, $params );
		$output      = '';
		$page        = (int) $params['page'];
		$total_pages = (int) $params['total_pages'];

		// Only show pagination when > 1 page
		if ( 1 < $total_pages ) {

			$text_page = esc_html__( 'Page', 'fwp-front' );
			$text_of   = esc_html__( 'of', 'fwp-front' );
			$step      = 10;

			$output .= '<span class="facetwp-pager-label sr-only">' . "$text_page $page $text_of $total_pages</span>";

			if ( $page > 1 ) {
				$output .= sprintf(
					'<button class="btn facetwp-page previouspostslink" data-page="%s">' . __( 'Previous', 'framework-textdomain' ) . '</button>',
					( $page - 1 )
				);
			} else {
				$output .= '<span class="facetwp-page previouspostslink" aria-hidden="true" tabindex="-1" style="visibility: hidden"></span>';
			}

			if ( 3 < $page ) {
				$output .= sprintf(
					'<button class="btn facetwp-page first-page" data-page="1"><span class="sr-only">%s</span><span aria-hidden="true">1</span></button>',
					__( 'First page', 'framework-textdomain' )
				);
			}

			if ( 1 < ( $page - $step ) ) {
				$output .= '<span class="facetwp-page-more" aria-hidden="true">...</span>';
			}

			for ( $i = 2; $i > 0; $i -- ) {
				if ( 0 < ( $page - $i ) ) {
					$output .= '<button class="btn facetwp-page" data-page="' . ( $page - $i ) . '"><span class="sr-only">' . __( 'Page', 'framework-textdomain' ) . '</span> ' . ( $page - $i ) . '</button>';
				}
			}

			// Current page
			$output .= '<span class="facetwp-page active" aria-current="true" data-page="' . $page . '"><span class="sr-only">' . __( 'Current page', 'framework-textdomain' ) . '</span> ' . $page . '</span>';

			for ( $i = 1; $i <= 2; $i ++ ) {
				if ( $total_pages >= ( $page + $i ) ) {
					$output .= '<button class="btn facetwp-page" data-page="' . ( $page + $i ) . '"><span class="sr-only">' . __( 'Page', 'framework-textdomain' ) . '</span> ' . ( $page + $i ) . '</button>';
				}
			}

			if ( $total_pages > ( $page + $step ) ) {
				$output .= '<span class="facetwp-page-more" aria-hidden="true">...</span>';
			}

			if ( $total_pages > ( $page + 2 ) ) {
				$output .= sprintf(
					'<button class="btn facetwp-page last-page" data-page="%1$s"><span class="sr-only">%2$s</span><span aria-hidden="true">%1$s</span></button>',
					$total_pages,
					__( 'Last page', 'framework-textdomain' )
				);
			}

			if ( $page < $total_pages && $total_pages > 1 ) {
				$output .= '<button class="btn facetwp-page nextpostslink" data-page="' . ( $page + 1 ) . '">' . __( 'Next', 'framework-textdomain' ) . '</button>';
			} else {
				$output .= '<span class="facetwp-page nextpostslink" aria-hidden="true" style="visibility: hidden;" tabindex="-1"></span>';
			}
		}

		return $output;
	}

	/**
	 * Customize pagination facet output
	 * This function apply only on pagination facets : facetwp_display( 'facet', 'pagination' );
	 * For customization of the old way to display a pager, see accessible_facetwp_pager_html function.
	 *
	 * https://facetwp.com/help-center/developers/hooks/output-hooks/facetwp_facet_pager_link/
	 *
	 * @param $output
	 * @param $params
	 *
	 * @return string
	 *
	 * @author Marie Comet
	 *
	 */
	public function facetwp_facet_pager_link( $html, $params ): string {
		// Replace current link by a span
		if ( str_contains( $html, 'active' ) ) {
			$html = str_replace( '<a', '<span', $html );
			$html = str_replace( '</a>', '</span>', $html );
		}

		// Replace links by buttons and add class
		$html = str_replace( [ '<a class="', '/a>' ], [ '<button class="btn ', '/button>' ], $html );

		// Remove link tag for dots
		if ( 'dots' === $params['extra_class'] ) {
			$html = str_replace( '<a class="facetwp-page dots">…</a>', '<span class="facetwp-page dots">…</span>', $html );
		}

		return $html;
	}

	/**
	 * Add labels or aria-label to facets
	 * Put in $excluded_facet_names the facets names for which you want to do not add the label.
	 * Put in $excluded_empty_facets the facets types for which you want to hide the label if the facet is empty.
	 *
	 * @param string $html
	 * @param array $args
	 *
	 * @return string
	 */
	public function facetwp_add_labels( string $html, array $args ): string {
		$facet_name  = $args['facet']['name'];
		$facet_label = $args['facet']['label'];
		if ( function_exists( 'facetwp_i18n' ) ) {
			$facet_label = facetwp_i18n( $facet_label );
		}

		// Return default HTML if the facet is excluded by its name
		$excluded_facet_names = apply_filters( 'facetwp_a11y_excluded_facet_names', [] );
		if ( in_array( $facet_name, $excluded_facet_names, true ) ) {
			return $html;
		}

		// Add aria-label attribute to per_page select
		if ( 'per_page' === $facet_name ) {
			return str_replace(
				'<select class="facetwp-per-page-select">',
				sprintf(
					'<select class="facetwp-per-page-select" aria-label="%s">',
					esc_attr( $facet_label )
				),
				$html
			);
		}

		// Return default HTML if these facets are empty
		$excluded_empty_facets = apply_filters( 'facetwp_a11y_excluded_empty_facets', [
			'checkboxes',
			'pager',
			'reset',
		] );
		if ( in_array( $args['facet']['type'], $excluded_empty_facets, true ) && empty( $args['values'] ) ) {
			return $html;
		}

		// Add fake labels
		return sprintf( '<p aria-hidden="true" class="facetwp-label">%s</p>%s', esc_html( $facet_label ), $html );
	}
}
