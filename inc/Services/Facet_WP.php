<?php

namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Facet_WP implements Service {
	public function register( Service_Container $container ): void {
	}

	public function boot( Service_Container $container ): void {
		add_filter( 'facetwp_load_assets', '__return_true' );
		add_filter( 'facetwp_load_a11y', '__return_true' );
		add_filter( 'facetwp_facets', [ $this, 'register_facets' ], 40 );
		add_filter( 'facetwp_pager_html', [ $this, 'accessible_facetwp_pager_html' ], 10, 2 );
		add_filter( 'facetwp_facet_html', [ $this, 'accessible_facetwp_labels' ], 10, 2 );
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
		if (
			JSON_ERROR_NONE !== \json_last_error()
			|| ! is_array( $facet_content )
			|| empty( $facet_content['facets'] )
		) {
			return $facets;
		}

		return wp_parse_args( $facet_content['facets'], $facets );
	}

	/**
	 * Add custom and accessible FacetWP pagination.
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
				$output .= '<a href="#" class="facetwp-page previouspostslink" data-page="' . ( $page - 1 ) . '">Précédent</a>';
			} else {
				$output .= '<span class="facetwp-page previouspostslink" aria-hidden="true" tabindex="-1" style="visibility: hidden"></span>';
			}

			if ( 3 < $page ) {
				$output .= '<a href="#" class="facetwp-page first-page" data-page="1">
        <span class="sr-only">Première page</span>
        <span aria-hidden="true">1</span>
        </a>';
			}
			if ( 1 < ( $page - $step ) ) {
				$output .= '<span class="facetwp-page-more" aria-hidden="true">...</span>';
			}

			for ( $i = 2; $i > 0; $i -- ) {
				if ( 0 < ( $page - $i ) ) {
					$output .= '<a href="#" class="facetwp-page" data-page="' . ( $page - $i ) . '"><span class="sr-only">Page</span> ' . ( $page - $i ) . '</a>';
				}
			}

			// Current page
			$output .= '<a href="#" class="facetwp-page active" aria-current="true" data-page="' . $page . '"><span class="sr-only">Page courante</span> ' . $page . '</a>';

			for ( $i = 1; $i <= 2; $i ++ ) {
				if ( $total_pages >= ( $page + $i ) ) {
					$output .= '<a href="#" class="facetwp-page" data-page="' . ( $page + $i ) . '"><span class="sr-only">Page</span> ' . ( $page + $i ) . '</a>';
				}
			}

			if ( $total_pages > ( $page + $step ) ) {
				$output .= '<span class="facetwp-page-more" aria-hidden="true">...</span>';
			}

			if ( $total_pages > ( $page + 2 ) ) {
				$output .= '<a href="#" class="facetwp-page last-page" data-page="' . $total_pages . '">
        <span class="sr-only">Dernière page</span>
        <span aria-hidden="true">' . $total_pages . '</span>
        </a>';
			}

			if ( $page < $total_pages && $total_pages > 1 ) {
				$output .= '<a href="#" class="facetwp-page nextpostslink" data-page="' . ( $page + 1 ) . '">Suivant</a>';
			} else {
				$output .= '<span class="facetwp-page nextpostslink" aria-hidden="true" style="visibility: hidden;" tabindex="-1"></span>';
			}
		}

		return $output;
	}

	/**
	 * Fix Labels for supported facets.
	 * Put in show_label_not_empty the facets that only need to be visible in they have results.
	 *
	 * @param string $html
	 * @param array $args
	 *
	 * @return string
	 */
	public function accessible_facetwp_labels( string $html, array $args ): string {
		$show_label_not_empty = [
			'checkboxes',
			'radio',
		];

		if ( ( true === in_array( $args['facet']['type'], $show_label_not_empty, true ) && ! empty( $args['values'] ) ) || false === in_array( $args['facet']['type'], $show_label_not_empty, true ) ) {
			$html = sprintf( '<label class="facetwp-label" for="%s">%s</label>%s', esc_attr( $args['facet']['name'] ), esc_html( $args['facet']['label'] ), $html );
		}

		return $html;
	}
}
