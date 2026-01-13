<?php


namespace BEA\Theme\Framework\Services;

use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;

class Editor_Patterns implements Service {
	/**
	 * @param Service_Container $container
	 */
	public function register( Service_Container $container ): void {
	}

	/**
	 * @return string
	 */
	public function get_service_name(): string {
		return 'editor-patterns';
	}

	/**
	 * @param Service_Container $container
	 */
	public function boot( Service_Container $container ): void {
		\add_action( 'init', [ $this, 'register_categories' ], 10 );
		\add_action( 'init', [ $this, 'register_patterns' ], 11 );
	}

	/**
	 * Register the patterns categories
	 */
	public function register_categories(): void {

		/**
		 * usage : 'common' => [ 'label' => __( 'Common', 'beapi-frontend-framework' ) ]
		 */
		$pattern_categories = [
			'common' => [ 'label' => __( 'Common', 'beapi-frontend-framework' ) ],
		];

		foreach ( $pattern_categories as $name => $properties ) {
			if ( \WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
				continue;
			}
			register_block_pattern_category( $name, $properties );
		}
	}

	/**
	 * Register any patterns that the active theme may provide under its
	 * `./patterns/` directory. Each pattern is defined as a PHP file and defines
	 * its metadata using plugin-style headers. The minimum required definition is:
	 *
	 *     /**
	 *      * Title: My Pattern
	 *      * Slug: my-theme/my-pattern
	 *      *
	 *
	 * The output of the PHP source corresponds to the content of the pattern, e.g.:
	 *
	 *     <main><p><?php echo "Hello"; ?></p></main>
	 *
	 * If applicable, this will collect from both parent and child theme.
	 *
	 * Other settable fields include:
	 *
	 *   - Description
	 *   - Viewport Width
	 *   - Categories       (comma-separated values)
	 *   - Keywords         (comma-separated values)
	 *   - Block Types      (comma-separated values)
	 *   - Inserter         (yes/no)
	 *
	 * @since 6.0.0
	 * @access private
	 * @internal
	 * @see https://github.com/WordPress/gutenberg/blob/trunk/lib/compat/wordpress-6.0/block-patterns.php
	 */
	public function register_patterns(): void {

		/**
		 * this function is already present in WordPress 6
		 */
		if ( version_compare( get_bloginfo( 'version' ), '6.0', '>=' ) ) {
			return;
		}

		$default_headers = [
			'title'         => 'Title',
			'slug'          => 'Slug',
			'description'   => 'Description',
			'viewportWidth' => 'Viewport Width',
			'categories'    => 'Categories',
			'keywords'      => 'Keywords',
			'blockTypes'    => 'Block Types',
			'inserter'      => 'Inserter',
		];

		// Register patterns for the active theme. If the theme is a child theme,
		// let it override any patterns from the parent theme that shares the same slug.
		$themes     = [];
		$stylesheet = get_stylesheet();
		$template   = get_template();
		if ( $stylesheet !== $template ) {
			$themes[] = wp_get_theme( $stylesheet );
		}
		$themes[] = wp_get_theme( $template );

		foreach ( $themes as $theme ) {
			$dirpath = $theme->get_stylesheet_directory() . '/patterns/';
			if ( ! is_dir( $dirpath ) || ! is_readable( $dirpath ) ) {
				continue;
			}
			$files = glob( $dirpath . '*.php' );
			if ( is_array( $files ) && count( $files ) > 0 ) {
				foreach ( $files as $file ) {
					$pattern_data = get_file_data( $file, $default_headers );
					if ( empty( $pattern_data['slug'] ) ) {
						_doing_it_wrong(
							'_register_theme_block_patterns',
							sprintf(
							/* translators: %s: file name. */
								esc_html__( 'Could not register file "%s" as a block pattern ("Slug" field missing)', 'beapi-frontend-framework' ),
								esc_html( $file )
							),
							'6.0.0'
						);
						continue;
					}

					if ( ! preg_match( '/^[A-z0-9\/_-]+$/', $pattern_data['slug'] ) ) {
						_doing_it_wrong(
							'_register_theme_block_patterns',
							sprintf(
							/* translators: %1s: file name; %2s: slug value found. */
								esc_html__( 'Could not register file "%1$s" as a block pattern (invalid slug "%2$s")', 'beapi-frontend-framework' ),
								esc_html( $file ),
								esc_html( $pattern_data['slug'] )
							),
							'6.0.0'
						);
					}
					if ( \WP_Block_Patterns_Registry::get_instance()->is_registered( $pattern_data['slug'] ) ) {
						continue;
					}

					// Title is a required property.
					if ( ! $pattern_data['title'] ) {
						_doing_it_wrong(
							'_register_theme_block_patterns',
							sprintf(
							/* translators: %1s: file name; %2s: slug value found. */
								esc_html__( 'Could not register file "%s" as a block pattern ("Title" field missing)', 'beapi-frontend-framework' ),
								esc_html( $file )
							),
							'6.0.0'
						);
						continue;
					}

					// For properties of type array, parse data as comma-separated.
					foreach ( [ 'categories', 'keywords', 'blockTypes' ] as $property ) {
						if ( ! empty( $pattern_data[ $property ] ) ) {
							$pattern_data[ $property ] = array_filter(
								preg_split(
									'/[\s,]+/',
									(string) $pattern_data[ $property ]
								)
							);
						} else {
							unset( $pattern_data[ $property ] );
						}
					}

					// Parse properties of type int.
					foreach ( [ 'viewportWidth' ] as $property ) {
						if ( ! empty( $pattern_data[ $property ] ) ) {
							$pattern_data[ $property ] = (int) $pattern_data[ $property ];
						} else {
							unset( $pattern_data[ $property ] );
						}
					}

					// Parse properties of type bool.
					foreach ( [ 'inserter' ] as $property ) {
						if ( ! empty( $pattern_data[ $property ] ) ) {
							$pattern_data[ $property ] = in_array(
								strtolower( $pattern_data[ $property ] ),
								[ 'yes', 'true' ],
								true
							);
						} else {
							unset( $pattern_data[ $property ] );
						}
					}

					// Translate the pattern metadata.
					$text_domain = $theme->get( 'TextDomain' );
					//phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText, WordPress.WP.I18n.NonSingularStringLiteralContext, WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
					$pattern_data['title'] = translate_with_gettext_context( $pattern_data['title'], 'Pattern title', $text_domain );
					if ( ! empty( $pattern_data['description'] ) ) {
						//phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText, WordPress.WP.I18n.NonSingularStringLiteralContext, WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						$pattern_data['description'] = translate_with_gettext_context( $pattern_data['description'], 'Pattern description', $text_domain );
					}

					// The actual pattern content is the output of the file.
					ob_start();
					include $file;
					$pattern_data['content'] = ob_get_clean();
					if ( empty( $pattern_data['content'] ) ) {
						continue;
					}

					register_block_pattern( $pattern_data['slug'], $pattern_data );
				}
			}
		}
	}
}
