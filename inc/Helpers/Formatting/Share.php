<?php

namespace BEA\Theme\Framework\Helpers\Formatting\Share;

use function BEA\Theme\Framework\Helpers\Formatting\Link\get_custom_link;
use function BEA\Theme\Framework\Helpers\Svg\get_the_icon;

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Share\get_share_link( ['name' => facebook'], [ 'u' => 'https://...'] );
 *
 * @param string $name
 * @param array $attributes
 * @param array $settings
 *
 * @return string
 */
function get_share_link( string $name, array $attributes = [], array $settings = [] ): string {
	if ( empty( $name ) ) {
		return '';
	}

	$current_permalink = get_the_permalink();
	$networks          = [
		'facebook' => [
			'share_label' => 'Partager sur Facebook',
			'share_href'  => 'http://www.facebook.com/sharer.php',
			'share_param' => [
				'u' => $current_permalink,
			],
			'share_icon'  => 'facebook',
			'share_class' => 'share__link',
		],
		'twitter'  => [
			'share_label' => 'Partager sur Twitter',
			'share_href'  => 'https://twitter.com/intent/tweet',
			'share_param' => [
				'url' => $current_permalink,
			],
			'share_icon'  => 'twitter',
			'share_class' => 'share__link',
		],
		'linkedin' => [
			'share_label' => 'Partager sur Linkedin',
			'share_href'  => 'https://www.linkedin.com/shareArticle',
			'share_param' => [
				'url' => $current_permalink,
			],
			'share_icon'  => 'linkedin',
			'share_class' => 'share__link',
		],
		'email'    => [
			'share_label' => 'Partager par email',
			'share_href'  => 'mailto:',
			'share_param' => [
				'body' => $current_permalink,
			],
			'share_icon'  => 'email',
			'share_class' => 'share__link',
		],
	];

	if ( ! empty( $attributes ) ) {
		if ( isset( $networks[ $name ] ) ) {
			$networks[ $name ] = wp_parse_args(
				$attributes,
				$networks[ $name ]
			);
		} else {
			$networks = wp_parse_args(
				[
					$name => $attributes,
				],
				$networks
			);
		}
	}

	$networks = apply_filters( 'bea_theme_framework_networks', $networks );
	$network  = $networks[ $name ] ?? false;

	if ( empty( $network ) ) {
		return '';
	}

	$settings = wp_parse_args(
		$settings,
		[
			'content' => get_the_icon( $network['share_icon'] ),
			'before'  => '<li>',
			'after'   => '</li>',
		]
	);

	$settings = apply_filters( 'bea_theme_framework_networks_settings', $settings );

	return get_custom_link(
		[
			'href'     => add_query_arg( $network['share_param'], $network['share_href'] ),
			'target'   => '_blank',
			'title'    => $network['share_label'],
			'class'    => $network['share_class'],
			'tabindex' => '-1',
		],
		$settings
	);
}

/**
 * @usage BEA\Theme\Framework\Helpers\Formatting\Share\the_share_link( ['name' => 'facebook' ], [ 'u' => 'https://...'] );
 *
 * @param string $name
 * @param array $attributes
 * @param array $settings
 *
 * @return void
 */
function the_share_link( string $name, array $attributes = [], array $settings = [] ): void {
	echo get_share_link( $name, $attributes, $settings ); //phpcs:ignore
}
