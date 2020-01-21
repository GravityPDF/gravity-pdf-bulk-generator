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

	public function init() {
		add_filter( 'gform_replace_merge_tags', [ $this, 'process' ], 10, 5 );
	}

	/**
	 * Search for the {created_by} merge tag and then replace
	 *
	 * @param string $text
	 * @param array  $form
	 * @param array  $entry
	 * @param bool   $url_encode
	 * @param bool   $esc_html
	 *
	 * @return string
	 */
	public function process( $text, $form = [], $entry = [], $url_encode = false, $esc_html = false ) {

		/* No user, exit early */
		if ( empty( $entry['created_by'] ) ) {
			return $text;
		}

		preg_match_all( sprintf( MergeTags::REGEX, 'created_by' ), $text, $matches, PREG_SET_ORDER );

		/* No matches, exit early */
		if ( empty( $matches ) ) {
			return $text;
		}

		$entry_creator = new \WP_User( $entry['created_by'] );
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
