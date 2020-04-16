<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Helper\Helper_Trait_Logger;
use GFPDF\Helper\Helper_Url_Signer;
use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Exceptions\FilesystemError;
use GFPDF\Plugins\BulkGenerator\Exceptions\NothingToZip;
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
						/* translators: %s is a relative path to the API endpoint */
						'description'       => sprintf( __( 'An alphanumeric active session ID returned via the %s endpoint.', 'gravity-pdf-bulk-generator' ), ApiNamespace::V1 . '/generator/register/' ),
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
			$this->filesystem->set_prefix( $session_id );
			$tmp_zip_path = $this->filesystem->get_base_prefix() . $this->filesystem->get_prefix() . $this->filesystem->get_zip_path();
			$zip          = new Filesystem(
				new ZipArchiveAdapter( $tmp_zip_path )
			);

			$tmp_basepath = $this->filesystem->get_tmp_basepath();
			$contents     = $this->filesystem->listContents( $tmp_basepath, true );
			$this->filesystem->set_prefix( '' );

			if ( count( $contents ) === 0 ) {
				throw new NothingToZip();
			}

			/* Loop over all the files in the tmp Session directory and move the unique PDFs to the zip */
			foreach ( $contents as $info ) {
				if ( ! isset( $info['extension'] ) || $info['extension'] !== 'pdf' ) {
					continue;
				}

				$basepath_pattern = '/^' . preg_quote( $session_id . '/' . $tmp_basepath, '/' ) . '/';
				$zip_file_path    = preg_replace( $basepath_pattern, '', $info['path'] ); /* remove tmp basedir */

				/* If the zip doesn't already contain the file, include it in the archive */
				if ( ! $zip->has( $zip_file_path ) ) {
					$zip->writeStream( $zip_file_path, $this->filesystem->readStream( $info['path'] ) );
					$this->logger->notice( 'Saved PDF in zip', [ 'file' => $zip_file_path ] );
				}
			}

			/* Force the zip file to close (a PHP thing) */
			$zip->getAdapter()->getArchive()->close();

			/* If no zip file exists, throw an error */
			if ( ! is_file( $tmp_zip_path ) ) {
				throw new FilesystemError();
			}

			/* If the Filesystem isn't using the Local adapter, we'll place the zip on the local disk in it */
			$this->filesystem->set_prefix( $session_id );
			if ( ! $this->filesystem->has( $this->filesystem->get_zip_path() ) ) {
				$zip_stream = fopen( $tmp_zip_path, 'rb' );
				$this->filesystem->putStream( $this->filesystem->get_zip_path(), $zip_stream );
				fclose( $zip_stream );
			}

			return [
				'downloadUrl' => $this->generate_signed_download_url( $session_id ),
			];
		} catch ( FilesystemError $e ) {
			return new \WP_Error( 'no_zip_file_exists', '', [ 'status' => 500 ] );
		} catch ( NothingToZip $e ) {
			return new \WP_Error( 'no_pdfs_to_zip', '', [ 'status' => 400 ] );
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
	 * @since    1.0
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
