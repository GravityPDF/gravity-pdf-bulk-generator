<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Validation\SessionId;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\ZipArchive\ZipArchiveAdapter;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Zip implements ApiEndpointRegistration {

	protected $save_pdf_path;

	public function __construct( $save_pdf_path ) {
		$this->save_pdf_path = $save_pdf_path;
	}

	public function endpoint() {
		/* @TODO - regex for session ID abstract */
		register_rest_route( ApiNamespace::V1, '/generator/zip/(?P<sessionId>.+?)', [
			'methods'  => \WP_REST_Server::CREATABLE,
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
		$this->save_pdf_path = trailingslashit( $this->save_pdf_path . $request->get_param( 'sessionId' ) );
		$tmp_path            = $this->save_pdf_path . 'tmp';
		$zip_path            = $this->save_pdf_path . 'archive.zip';

		try {
			$local = new Filesystem( new Local( $tmp_path ) );
			$zip   = new Filesystem( new ZipArchiveAdapter( $zip_path ) );

			$contents = $local->listContents( '', true );

			foreach ( $contents as $info ) {
				if ( $info['extension'] !== 'pdf' ) {
					continue;
				}

				$zip->put( $info['path'], $local->read( $info['path'] ) );
			}

			$zip = null;

			$misc = \GPDFAPI::get_misc_class();
			$misc->rmdir( $tmp_path );
		} catch ( \Exception $e ) {
			return new WP_Error( $e->getCode(), $e->getMessage(), [ 'status' => 500 ] );
		}
	}
}
