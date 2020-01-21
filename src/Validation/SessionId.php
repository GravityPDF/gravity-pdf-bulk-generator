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

class SessionId {
	protected $save_pdf_path;

	public function __construct( $save_pdf_path ) {
		$this->save_pdf_path = $save_pdf_path;
	}

	public function __invoke( $session_id ) {

		if( preg_match( '/^[a-zA-Z0-9]{32}$/', $session_id ) !== 1 ) {
			return false;
		}

		if ( ! is_dir( $this->save_pdf_path . $session_id ) ) {
			return false;
		}

		return true;
	}
}
