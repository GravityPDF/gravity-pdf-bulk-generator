<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

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

class Zip implements ApiEndpointRegistration {

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
					'validate_callback' => new SessionId( $this->filesystem ),
				],
			],
		] );
	}

	/* @TODO add logging */
	public function response( \WP_REST_Request $request ) {
		$this->config->set_session_id( $request->get_param( 'sessionId' ) );

		$tmp_basepath = $this->filesystem->get_tmp_basepath();

		try {
			$zip = new Filesystem(
				new ZipArchiveAdapter( $this->filesystem->get_zip_path( FilesystemHelper::ADD_PREFIX ) )
			);

			$contents = $this->filesystem->listContents( $tmp_basepath, true );
			foreach ( $contents as $info ) {
				if ( $info['extension'] !== 'pdf' ) {
					continue;
				}

				$zip_file_path = preg_replace( '/^' . preg_quote( $tmp_basepath, '/' ) . '/', '', $info['path'] ); /* remove tmp basedir */
				$zip->put( $zip_file_path, $this->filesystem->read( $info['path'] ) );
			}

			$zip = null;

			$this->filesystem->deleteDir( $tmp_basepath );
		} catch ( \Exception $e ) {
			return new \WP_Error( $e->getCode(), $e->getMessage(), [ 'status' => 500 ] );
		}
	}
}
