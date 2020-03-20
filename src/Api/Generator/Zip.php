<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Helper\Helper_Trait_Logger;
use GFPDF\Helper\Helper_Url_Signer;
use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Model\Config;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use GFPDF\Plugins\BulkGenerator\Validation\SessionId;
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

/**
 * Class Zip
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class Zip implements ApiEndpointRegistration {

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
			'/generator/zip/(?P<sessionId>.+?)',
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
					'sessionId' => [
						'required'          => true,
						'type'              => 'string',
						'description'       => sprintf( __( 'An alphanumeric active session ID returned via the %1$s/generator/register/ endpoint.', 'gravity-pdf-bulk-generator' ), ApiNamespace::V1 ),
						'validate_callback' => new SessionId( $this->filesystem, $this->logger ),
					],
				],
			]
		);
	}

	/**
	 * Move all unique PDFs to a zip file for the current session
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return array|\WP_Error
	 *
	 * @since 1.0
	 */
	public function response( \WP_REST_Request $request ) {
		$session_id = $request->get_param( 'sessionId' );
		$this->config->set_session_id( $session_id );

		try {
			$this->logger->notice( 'Begin PDF to Zip process', [ 'session' => $session_id ] );

			/* Create/load our Zip file */
			$zip = new Filesystem(
				new ZipArchiveAdapter( $this->filesystem->get_zip_path( FilesystemHelper::ADD_PREFIX ) )
			);

			$tmp_basepath = $this->filesystem->get_tmp_basepath();
			$contents     = $this->filesystem->listContents( $tmp_basepath, true );

			/* Loop over all the files in the tmp Session directory and move the unique PDFs to the zip */
			foreach ( $contents as $info ) {
				if ( ! isset( $info['extension'] ) || $info['extension'] !== 'pdf' ) {
					continue;
				}

				$basepath_pattern = '/^' . preg_quote( $tmp_basepath, '/' ) . '/';
				$zip_file_path    = preg_replace( $basepath_pattern, '', $info['path'] ); /* remove tmp basedir */

				/* If the zip doesn't already contain the file, include it in the archive */
				if ( ! $zip->has( $zip_file_path ) ) {
					$zip->put( $zip_file_path, $this->filesystem->read( $info['path'] ) );
					$this->logger->notice( 'Saved PDF in zip', [ 'file' => $zip_file_path ] );
				}
			}

			/* Force the zip file to close (a PHP thing) */
			$zip = null;

			return [
				'downloadUrl' => $this->generate_signed_download_url( $session_id ),
			];
		} catch ( \Exception $e ) {
			return new \WP_Error( $e->getCode(), $e->getMessage(), [ 'status' => 500 ] );
		}
	}

	/**
	 * Create a signed download URL with a default timeout of 12 hours
	 *
	 * @param $session_id
	 *
	 * @return string
	 * @throws \Spatie\UrlSigner\Exceptions\InvalidSignatureKey
	 *
	 * @internal The zip file is automatically deleted after it is 24 hours old
	 *
	 * @since 1.0
	 */
	protected function generate_signed_download_url( $session_id ) {
		$download_url = rest_url() . ApiNamespace::V1 . '/generator/download/' . $session_id;
		$signer       = new Helper_Url_Signer();

		/**
		 * Control the signed URL expiry period
		 *
		 * @param string an English textual datetime description as described in https://www.php.net/manual/en/datetime.formats.php
		 */
		$expiry = apply_filters( 'gfpdf_bg_download_url_timeout', '12 hours' );

		$url = $signer->sign( $download_url, $expiry );
		$this->logger->notice( 'Generated secure download URL', [ 'url' => $url ] );

		return $url;
	}
}
