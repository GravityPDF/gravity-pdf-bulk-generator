<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Exceptions\BulkPdfGenerator;
use GFPDF\Plugins\BulkGenerator\Model\Config;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
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

	/**
	 * @var Config
	 *
	 * @since 1.0
	 */
	protected $config;

	/**
	 * @var FilesystemHelper
	 *
	 * @since 1.0
	 */
	protected $filesystem;

	/**
	 * Register constructor.
	 *
	 * @param Config $config
	 */
	public function __construct( Config $config, FilesystemHelper $filesystem ) {
		$this->config     = $config;
		$this->filesystem = $filesystem;
	}

	public function endpoint() {
		register_rest_route( ApiNamespace::V1, '/generator/register', [
			'methods'  => \WP_REST_Server::CREATABLE,
			'callback' => [ $this, 'response' ],

			'permission_callback' => function() {
				$gform = \GPDFAPI::get_form_class();

				return $gform->has_capability( 'gravityforms_view_entries' );
			},

			'args' => [
				'path' => [
					'required'          => true,
					'type'              => 'string',
					'description'       => 'The path each generated PDF should be saved into in the zip file. Merge tags are supported.',
					'validate_callback' => new ZipPath(),
				],

				'concurrency' => [
					'required'    => true,
					'type'        => 'integer',
					'description' => 'The number of concurrent PDFs that should be generated simultaneously.',
				],
			],
		] );
	}

	/* @TODO add logging */
	public function response( \WP_REST_Request $request ) {

		/* Get a unique Session ID not currently in use */
		do {
			$session_id = $this->config->generate_session_id();
		} while ( $this->filesystem->has( $session_id ) );

		/* @TODO - check folder permissions */
		if ( ! $this->filesystem->createDir( $session_id ) ) {
			return new \WP_Error( 'error_creating_path', [ 'status' => 500 ] );
		}

		/* Save session config file */
		try {
			$this->config->set_session_id( $session_id )
			             ->set_all_settings( [
				             'path'        => $request->get_param( 'path' ),
				             'concurrency' => $request->get_param( 'concurrency' ),
			             ] )
			             ->save();
		} catch ( BulkPdfGenerator $e ) {
			return new \WP_Error( 'error_creating_config', [ 'status' => 500 ] );
		}

		return [
			'sessionId' => $session_id,
		];
	}
}
