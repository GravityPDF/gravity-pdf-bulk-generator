<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

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

class Download implements ApiEndpointRegistration {

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

	public function endpoint() {
		/* @TODO - regex for session ID abstract */
		register_rest_route( ApiNamespace::V1, '/generator/download/(?P<sessionId>.+?)', [
			'methods'  => \WP_REST_Server::READABLE,
			'callback' => [ $this, 'response' ],

			'permission_callback' => function( $request ) {
				$signer   = new Helper_Url_Signer();
				$home_url = untrailingslashit( strtok( home_url(), '?' ) );

				return $signer->verify( $home_url . $_SERVER['REQUEST_URI'] );
			},

			'args' => [
				'sessionId' => [
					'required'          => true,
					'type'              => 'string',
					'description'       => 'An alphanumeric active session ID returned via the ' . ApiNamespace::V1 . '/generator/register/ endpoint.',
					'validate_callback' => new SessionId( $this->filesystem ),
				],
			],
		] );
	}

	/* @TODO add logging */
	public function response( \WP_REST_Request $request ) {
		try {
			$this->config->set_session_id( $request->get_param( 'sessionId' ) );
			$this->filesystem->deleteDir( $this->filesystem->get_tmp_basepath() );

			$zip_path = $this->filesystem->get_zip_path();
			if ( ! $this->filesystem->has( $zip_path ) ) {
				return new \WP_Error( 'zip_not_found', [ 'status' => 404 ] );
			}

			header( 'Content-Type: application/zip' );
			header( 'Content-Length: ' . $this->filesystem->getSize( $zip_path ) );
			header( 'Content-Disposition: attachment; filename="' . wp_basename( $zip_path ) . '"' );
			readfile( $this->filesystem->get_zip_path( FilesystemHelper::ADD_PREFIX ) );
		} catch( \Exception $e ) {
			return new \WP_Error( $e->getMessage(), [ 'status' => 500 ] );
		}

		$this->end();
	}

	protected function end() {
		exit;
	}
}
