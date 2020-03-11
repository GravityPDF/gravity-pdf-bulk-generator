<?php

namespace GFPDF\Plugins\BulkGenerator\MergeTags;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs |
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @author      Original author GravityView (https://gravityview.co)
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Date
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 */
abstract class Date {

	/**
	 * @var string
	 */
	protected $name;

	/**
	 * @since 1.0
	 */
	public function init() {
		add_filter( 'gform_replace_merge_tags', [ $this, 'process' ], 10, 3 );
	}

	/**
	 * Search for the matching merge tag and then replace
	 *
	 * @param string $text  String to replace merge tags on
	 * @param array  $form  Gravity Forms object
	 * @param array  $entry Gravity Forms Entry object
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function process( $text, $form = [], $entry = [] ) {

		preg_match_all( sprintf( MergeTags::REGEX, $this->name ), $text, $matches, PREG_SET_ORDER );

		/* No matches, exit early */
		if ( empty( $matches ) ) {
			return $text;
		}

		$date_created = isset( $entry[ $this->name ] ) ? $entry[ $this->name ] : '';

		/* Loop over all the mergetag matches and replace with appropriate date */
		foreach ( $matches as $match ) {
			$full_tag = $match[0];
			$property = $match[1];

			$formatted_date = $this->format_date( $date_created, $property );

			$text = str_replace( $full_tag, $formatted_date, $text );
		}

		return $text;
	}

	/**
	 * Get merge tag modifiers and then offload for formatting
	 *
	 * @param string $date_created The Gravity Forms date created format
	 * @param string $property     Any modifiers for the merge tag (`human`, `format:m/d/Y`)
	 *
	 * @return int|string If timestamp requested, timestamp int. Otherwise, string output.
	 *
	 * @since 1.0
	 */
	public function format_date( $date_created = '', $property = '' ) {

		/* Expand all modifiers, skipping escaped colons. str_replace worked better than preg_split( "/(?<!\\):/" ) */
		$exploded = explode( ':', str_replace( '\:', '|COLON|', $property ) );

		$atts = [
			'format'    => $this->get_format_from_modifiers( $exploded, false ),
			'human'     => in_array( 'human', $exploded ), // {date_created:human}
			'diff'      => in_array( 'diff', $exploded ), // {date_created:diff}
			'raw'       => in_array( 'raw', $exploded ), // {date_created:raw}
			'timestamp' => in_array( 'timestamp', $exploded ), // {date_created:timestamp}
			'time'      => in_array( 'time', $exploded ),  // {date_created:time}
		];

		return $this->get_formatted_date( $date_created, $atts );
	}

	/**
	 * Allow formatting date and time based on GravityView standards
	 *
	 * @param string       $date_string The date as stored by Gravity Forms (`Y-m-d h:i:s` GMT)
	 * @param string|array $args        Array or string of settings for output parsed by `wp_parse_args()`; Can use `raw=1` or `array('raw' => true)` \n
	 *                                  - `raw` Un-formatted date string in original `Y-m-d h:i:s` format
	 *                                  - `timestamp` Integer timestamp returned by GFCommon::get_local_timestamp()
	 *                                  - `diff` "%s ago" format, unless other `format` is defined
	 *                                  - `human` Set $is_human parameter to true for `GFCommon::format_date()`. Shows `diff` within 24 hours or date after. Format based on blog setting, unless `format` is defined.
	 *                                  - `time` Include time in the `GFCommon::format_date()` output
	 *                                  - `format` Define your own date format, or `diff` format
	 *
	 * @return int|string Formatted date based on the original date
	 *
	 * @since 1.0
	 */
	public function get_formatted_date( $date_string = '', $args = [] ) {

		$default_atts = [
			'raw'       => false,
			'timestamp' => false,
			'diff'      => false,
			'human'     => false,
			'format'    => '',
			'time'      => false,
		];

		$atts = wp_parse_args( $args, $default_atts );

		/**
		 * Gravity Forms code to adjust date to locally-configured Time Zone
		 *
		 * @see GFCommon::format_date() for original code
		 */
		$date_gmt_time        = mysql2date( 'G', $date_string );
		$date_local_timestamp = \GFCommon::get_local_timestamp( $date_gmt_time );

		$format       = $atts['format'];
		$is_human     = ! empty( $atts['human'] );
		$is_diff      = ! empty( $atts['diff'] );
		$is_raw       = ! empty( $atts['raw'] );
		$is_timestamp = ! empty( $atts['timestamp'] );
		$include_time = ! empty( $atts['time'] );

		/* If we're using time diff, we want to have a different default format */
		if ( empty( $format ) ) {
			/* translators: %s: relative time from now, used for generic date comparisons. "1 day ago", or "20 seconds ago" */
			$format = $is_diff ? esc_html__( '%s ago', 'gravity-pdf-bulk-generator' ) : get_option( 'date_format' );
		}

		if ( $is_raw ) {
			$formatted_date = $date_string;
		} elseif ( $is_timestamp ) {
			$formatted_date = $date_local_timestamp;
		} elseif ( $is_diff ) {
			$formatted_date = sprintf( $format, human_time_diff( $date_gmt_time ) );
		} else {
			$formatted_date = \GFCommon::format_date( $date_string, $is_human, $format, $include_time );
		}

		return $formatted_date;
	}

	/**
	 * If there is a `:format` modifier in a merge tag, grab the formatting
	 *
	 * The `:format` modifier should always have the format follow it; it's the next item in the array
	 * In `foo:format:bar`, "bar" will be the returned format
	 *
	 * @param array  $exploded Array of modifiers with a possible `format` value
	 * @param string $backup   The backup value to use, if not found
	 *
	 * @return string If format is found, the passed format. Otherwise, the backup.
	 *
	 * @since 1.0
	 */
	protected function get_format_from_modifiers( $exploded, $backup = '' ) {
		$format_key_index = array_search( 'format', $exploded );

		/* If there's a "format:[php date format string]" date format, grab it */
		if ( false !== $format_key_index && isset( $exploded[ $format_key_index + 1 ] ) ) {
			/* Return escaped colons placeholder */
			return str_replace( '|COLON|', ':', $exploded[ $format_key_index + 1 ] );
		}

		return $backup;
	}
}
