<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Validation\SessionId;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Download implements ApiEndpointRegistration {

	protected $save_pdf_path;

	public function __construct( $save_pdf_path ) {
		$this->save_pdf_path = $save_pdf_path;
	}

	public function endpoint() {
		/* @TODO - regex for session ID abstract */
		register_rest_route( ApiNamespace::V1, '/generator/download/(?P<sessionId>.+?)', [
			'methods'  => \WP_REST_Server::READABLE,
			'callback' => [ $this, 'response' ],

			'permission_callback' => function() {
				$gform = \GPDFAPI::get_form_class();

				return $gform->has_capability( 'gravityforms_view_entries' );
			},

			'args' => [
				'sessionId' => [
					'required'          => true,
					'type'              => 'string',
					'description'       => 'An alphanumeric active session ID returned via the ' . ApiNamespace::V1 . '/generator/register/ endpoint.',
					'validate_callback' => new SessionId( $this->save_pdf_path ),
				],
			],
		] );
	}

	/* @TODO add logging */
	public function response( \WP_REST_Request $request ) {
		$this->save_pdf_path = trailingslashit($this->save_pdf_path . $request->get_param( 'sessionId' ));
		$zip_path = $this->save_pdf_path . 'archive.zip';

		if ( ! is_file( $zip_path ) ) {
			return new \WP_Error( 'zip_not_found', [ 'status' => 404 ] );
		}

		header( 'Content-Type: application/zip' );
		header( 'Content-Length: ' . filesize( $zip_path ) );
		header( 'Content-Disposition: attachment; filename="'. wp_basename( $zip_path ) .'"' );
		readfile( $zip_path );

		$this->end();
	}

	protected function end() {
		exit;
	}
}
