<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Helper\Helper_Trait_Logger;
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

/**
 * Class Register
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class Register implements ApiEndpointRegistration {

	use Helper_Trait_Logger;

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

	/**
	 * Register the REST API Endpoints
	 *
	 * @since 1.0
	 */
	public function endpoint() {
		register_rest_route(
			ApiNamespace::V1,
			'/generator/register',
			[
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'response' ],

				'permission_callback' => function() {
					$gform = \GPDFAPI::get_form_class();

					$capabilities = $gform->has_capability( 'gravityforms_view_entries' );
					if ( ! $capabilities ) {
						$this->logger->warning( 'Permission denied: user does not have "gravityforms_view_entries" capabilities' );
					}

					return $capabilities;
				},

				'args'                => [
					'path' => [
						'required'          => true,
						'type'              => 'string',
						'description'       => __( 'The path each generated PDF should be saved into in the zip file. Merge tags are supported.', 'gravity-pdf-bulk-generator' ),
						'validate_callback' => new ZipPath( $this->get_logger() ),
					],
				],
			]
		);
	}

	/**
	 * Generate a new session ID and create appropriate folder structures on disk
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return array|\WP_Error
	 *
	 * @since 1.0
	 */
	public function response( \WP_REST_Request $request ) {

		$this->logger->notice( 'Begin Bulk Generator registration' );

		/* Get a unique Session ID not currently in use */
		do {
			$session_id = $this->config->generate_session_id();
		} while ( $this->filesystem->has( $session_id ) );

		/* Create tmp Session directory */
		if ( ! $this->filesystem->createDir( $session_id ) ) {
			$this->logger->error( 'Could not create temporary session directory', [ 'session' => $request->get_param( 'sessionId' ) ] );
			return new \WP_Error( 'error_creating_path', '', [ 'status' => 500 ] );
		}

		/* Save session config file */
		try {
			$this->config->set_session_id( $session_id )
						->set_all_settings(
							[
								'path' => $request->get_param( 'path' ),
							]
						)
						 ->save();
		} catch ( BulkPdfGenerator $e ) {
			$this->logger->error( 'Could not create session config file', [ 'session' => $request->get_param( 'sessionId' ) ] );
			return new \WP_Error( 'error_creating_config', '', [ 'status' => 500 ] );
		}
		return [
			'sessionId' => $session_id,
		];
	}
}
