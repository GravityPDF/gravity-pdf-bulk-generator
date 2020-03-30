<?php

namespace GFPDF\Plugins\BulkGenerator\MergeTags;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @author      Original author GravityView (https://gravityview.co)
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class CreatedBy
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 */
class CreatedBy {

	/**
	 * @since 1.0
	 */
	public function init() {
		add_filter( 'gform_replace_merge_tags', [ $this, 'process' ], 10, 5 );
	}

	/**
	 * Search for the {created_by} merge tag and then replace
	 *
	 * @param string $text       String to replace merge tags on
	 * @param array  $form       Gravity Forms object
	 * @param array  $entry      Gravity Forms Entry object
	 * @param bool   $url_encode Encode replacement values or leave it raw
	 * @param bool   $esc_html   Escape replacement values or leave it raw
	 *
	 * @return string processed $text string
	 *
	 * @since 1.0
	 */
	public function process( $text, $form = [], $entry = [], $url_encode = false, $esc_html = false ) {

		preg_match_all( sprintf( MergeTags::REGEX, 'created_by' ), $text, $matches, PREG_SET_ORDER );

		/* No matches, exit early */
		if ( empty( $matches ) ) {
			return $text;
		}

		$entry_creator = new \WP_User( $entry['created_by'] );

		/* Loop over all the mergetag matches and replace with appropriate user data */
		foreach ( $matches as $match ) {
			$full_tag = $match[0];
			$property = $match[1];

			switch ( $property ) {
				case 'roles':
					$value = implode( ', ', $entry_creator->roles );
					break;

				default:
					$value = $entry_creator->get( $property );
					break;
			}

			$value = $url_encode ? urlencode( $value ) : $value;
			$value = $esc_html ? esc_html( $value ) : $value;

			$text = str_replace( $full_tag, $value, $text );
		}

		return $text;
	}
}
