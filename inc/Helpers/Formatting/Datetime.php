<?php
namespace BEA\Theme\Framework\Helpers\Formatting\Datetime;

/**
 * Echo accessible <time> markup.
 *
 * @usage BEA\Theme\Framework\Helpers\Formatting\Datetime\the_datetime( get_the_date( 'd.m.Y' ), [ 'datetime' => get_the_date( 'Y-m-d' ), 'class' => 'crd__date' ] );
 *
 * @param string $display_date Formatted date string shown to users.
 * @param array  $settings {
 *     Optional. Settings for the datetime markup.
 *
 *     @type string $before           Markup before the <time> element. Default empty.
 *     @type string $after            Markup after the <time> element. Default empty.
 *     @type string $class            CSS class on the <time> element. Default empty.
 *     @type string $label            Screen-reader label prepended to the date. Default "Published on".
 *     @type string $datetime         Value for the datetime attribute. Required.
 *     @type bool   $show_label       Whether to output the screen-reader label. Default true.
 * }
 *
 * @return void
 */
function the_datetime( string $display_date, array $settings = [] ): void {
	echo get_the_datetime( $display_date, $settings ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

/**
 * Build accessible <time> markup.
 *
 * @usage BEA\Theme\Framework\Helpers\Formatting\Datetime\get_the_datetime( get_the_date( 'd.m.Y' ), [ 'datetime' => get_the_date( 'Y-m-d' ), 'class' => 'crd__date' ] );
 *
 * @param string $display_date Formatted date string shown to users.
 * @param array  $settings {
 *     Optional. Settings for the datetime markup.
 *
 *     @type string $before           Markup before the <time> element. Default empty.
 *     @type string $after            Markup after the <time> element. Default empty.
 *     @type string $class            CSS class on the <time> element. Default empty.
 *     @type string $label            Screen-reader label prepended to the date. Default "Published on".
 *     @type string $datetime         Value for the datetime attribute. Required.
 *     @type bool   $show_label       Whether to output the screen-reader label. Default true.
 * }
 *
 * @return string
 */
function get_the_datetime( string $display_date, array $settings = [] ): string {
	$settings = wp_parse_args(
		$settings,
		[
			'before'     => '',
			'after'      => '',
			'class'      => '',
			'label'      => __( 'Published on', 'beapi-frontend-framework' ),
			'datetime'   => '',
			'show_label' => true,
		]
	);

	if ( empty( $display_date ) || empty( $settings['datetime'] ) ) {
		return '';
	}

	$settings = apply_filters( 'bea_theme_framework_datetime_settings', $settings, $display_date, $settings['datetime'] );

	$class_attr = $settings['class'] ? sprintf( ' class="%s"', esc_attr( $settings['class'] ) ) : '';

	$label_markup = '';
	if ( $settings['show_label'] && ! empty( $settings['label'] ) ) {
		$label_markup = sprintf(
			'<span class="sr-only">%s </span>',
			esc_html( $settings['label'] )
		);
	}

	$datetime_markup = sprintf(
		'<time%s datetime="%s">%s%s</time>',
		$class_attr,
		esc_attr( $settings['datetime'] ),
		$label_markup,
		esc_html( $display_date )
	);

	$datetime_markup = apply_filters( 'bea_theme_framework_datetime_markup', $datetime_markup, $settings, $display_date, $settings['datetime'] );

	return $settings['before'] . $datetime_markup . $settings['after'];
}
