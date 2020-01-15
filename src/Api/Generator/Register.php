<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Validation\ZipPath;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Register implements ApiEndpointRegistration {

	protected $save_pdf_path;

	public function __construct( $save_pdf_path ) {
		$this->save_pdf_path = $save_pdf_path;
	}

	public function endpoint() {
		register_rest_route( ApiNamespace::V1, '/generator/register', [
			'methods'  => \WP_REST_Server::CREATABLE,
			'callback' => [ $this, 'response' ],

			'permission_callback' => function() {
				$gform = \GPDFAPI::get_form_class();

				/* @TODO - remove */
				return true;

				return $gform->has_capability( 'gravityforms_view_entries' );
			},

			'args' => [
				'path' => [
					'required'          => true,
					'type'              => 'string',
					'description'       => 'The path each generated PDF should be saved into in the zip file. Merge tags are supported.',
					'validate_callback' => new ZipPath(),
				],
			],
		] );
	}

	/* @TODO add logging */
	public function response( \WP_REST_Request $request ) {

		/* Get a unique Session ID not currently in use */
		do {
			$session_id   = $this->generate_unique_id();
			$session_path = $this->save_pdf_path . $session_id;
		} while ( is_dir( $session_path ) );

		if ( ! wp_mkdir_p( $session_path ) ) {
			return new \WP_Error( 'error_creating_path', [ 'status' => 500 ] );
		}

		/* Save session config file */
		$config_saved = $this->save_session_config( $session_path, [
			'path' => $request->get_param( 'path' ),
		] );

		if ( $config_saved === false ) {
			return new \WP_Error( 'error_creating_config', [ 'status' => 500 ] );
		}

		return [
			'sessionId' => $session_id,
		];
	}

	/* @TODO - move to dedicated class */
	public function save_session_config( $session_path, $args ) {
		return file_put_contents( $session_path . '/config.json', json_encode( $args ) );
	}

	protected function generate_unique_id( $length = 16 ) {
		try {
			$id = bin2hex( random_bytes( $length ) );
		} catch ( \Exception $e ) {
			$id = bin2hex( wp_generate_password( $length, false, false ) );
		}

		return $id;
	}
}