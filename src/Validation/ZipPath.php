<?php

namespace GFPDF\Plugins\BulkGenerator\Validation;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class ZipPath {

	/* @TODO - do very thorough unit testing on this */
	/* @TODO add logging */
	/* @TODO DEBBIE to AUTO STRIP `/` from inside merge tags on front-end */
	public function __invoke( $zip_path ) {
		/* Check for backslashes and fail */
		if ( strpos( $zip_path, '\\' ) !== false ) {
			return false;
		}

		/* Verify no segments contain .. or . */
		foreach ( explode( '/', $zip_path ) as $segment ) {
			if ( in_array( $segment, [ '.', '..' ], true ) ) {
				return false;
			}
		}

		return true;
	}
}

