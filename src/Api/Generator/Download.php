<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Helper\Helper_Trait_Logger;
use GFPDF\Helper\Helper_Url_Signer;
use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Model\Config;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
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

/**
 * Class Download
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class Download implements ApiEndpointRegistration {

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
	 * Download constructor.
	 *
	 * @param Config           $config
	 * @param FilesystemHelper $filesystem
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
			'/generator/download/(?P<sessionId>.+?)',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'response' ],

				'permission_callback' => function( $request ) {
					if ( ! isset( $_SERVER['HTTP_HOST'] ) || ! isset( $_SERVER['REQUEST_URI'] ) ) {
						return false;
					}

					$signer = new Helper_Url_Signer();

					$protocol = isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
					$domain   = $_SERVER['HTTP_HOST'];
					$request  = $_SERVER['REQUEST_URI'];

					$url = $protocol . $domain . $request;

					$verified = $signer->verify( $url );
					if ( ! $verified ) {
						$this->logger->warning( 'Permission denied: signed URL is invalid' );
					}

					return $verified;
				},

				'args'                => [
					'sessionId' => [
						'required'          => true,
						'type'              => 'string',
						/* translators: %s is a relative path to the API endpoint */
						'description'       => sprintf( __( 'An alphanumeric active session ID returned via the %s endpoint.', 'gravity-pdf-bulk-generator' ), ApiNamespace::V1 . '/generator/register/' ),
						'validate_callback' => new SessionId( $this->filesystem, $this->logger ),
					],
				],
			]
		);
	}

	/**
	 * Locate the zip file on the filesystem and stream to the browser
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return void|\WP_Error
	 *
	 * @since 1.0
	 */
	public function response( \WP_REST_Request $request ) {
		try {
			$this->logger->notice( 'Begin Zip Download', [ 'session' => $request->get_param( 'sessionId' ) ] );
			$this->config->set_session_id( $request->get_param( 'sessionId' ) );

			/* Verify the zip file still exists, otherwise return error */
			$zip_path = $this->filesystem->get_zip_path();
			if ( ! $this->filesystem->has( $zip_path ) ) {
				return new \WP_Error( 'zip_not_found', '', [ 'status' => 404 ] );
			}

			/* Send zip file to browser */
			if ( ! headers_sent() ) {
				header( 'Content-Type: application/zip' );
				header( 'Content-Length: ' . $this->filesystem->getSize( $zip_path ) );
				header( 'Content-Disposition: attachment; filename="' . wp_basename( $zip_path ) . '"' );
			}

			$stream = $this->filesystem->readStream( $this->filesystem->get_zip_path() );
			while ( ! feof( $stream ) ) {
				echo fread( $stream, 2048 );
				if ( ob_get_level() ) {
					ob_flush();
				}
				flush();
			}

			fclose( $stream );
		} catch ( \Exception $e ) {
			$this->logger->error( $e->getMessage(), [ 'session' => $request->get_param( 'sessionId' ) ] );

			return new \WP_Error( $e->getMessage(), '', [ 'status' => 500 ] );
		}

		/*
		 * Cleanup the session tmp directory.
		 *
		 * We left this directory intact until now to ensure naming conflicts could be resolved with as little
		 * overhead as possible. Now we are finished with it, we'll clean it all up.
		 */
		try {
			$this->filesystem->deleteDir( $this->filesystem->get_tmp_basepath() );
		} catch ( \Exception $e ) {
			/* ignore */
		}

		$this->end();
	}

	/**
	 * @since    1.0
	 *
	 * @Internal Moved to own method so we can stub during unit testing
	 */
	protected function end() {
		exit;
	}
}
