<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Exceptions\ConfigNotLoaded;
use GFPDF\Plugins\BulkGenerator\Exceptions\InvalidPdfId;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfConditionalLogicFailed;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfGenerationError;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfNotActive;
use GFPDF\Plugins\BulkGenerator\Model\Config;
use GFPDF\Plugins\BulkGenerator\Model\Pdf;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use GFPDF\Plugins\BulkGenerator\Validation\SessionId;
use League\Flysystem\Filesystem;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Create implements ApiEndpointRegistration {

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
		register_rest_route( ApiNamespace::V1, '/generator/create/', [
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

				'entryId' => [
					'required'    => true,
					'type'        => 'integer',
					'description' => 'The Gravity Forms Entry ID',
				],

				'pdfId' => [
					'required'    => true,
					'type'        => 'string',
					'description' => 'An alphanumeric ID used to represent the Gravity Forms PDF Settings ID',
				],
			],
		] );
	}

	/* @TODO add logging */
	public function response( \WP_REST_Request $request ) {
		$gform      = \GPDFAPI::get_form_class();
		$session_id = $request->get_param( 'sessionId' );

		$entry = $gform->get_entry( $request->get_param( 'entryId' ) );
		if ( is_wp_error( $entry ) ) {
			$entry->add_data( [ 'status' => 403 ] );

			return $entry;
		}

		try {
			$settings = $this->config->set_session_id( $session_id )
			                         ->fetch()
			                         ->get_all_settings();

			$pdf = new Pdf( $entry['form_id'], $request->get_param( 'pdfId' ) );
			$pdf->fetch()
			    ->evaluate_active()
			    ->evaluate_conditional_logic( $entry )
			    ->generate( $entry['id'] );

			$tmp_pdf_path = $this->filesystem->get_tmp_pdf_path( $settings['path'], $entry );
			if ( ! $this->filesystem->createDir( $tmp_pdf_path ) ) {
				/* @todo throw exception */
			}

			$tmp_pdf_filename = $this->get_unique_filename( $this->filesystem->get_filesystem(), $tmp_pdf_path, wp_basename( $pdf->get_path() ) );
			if ( ! $this->filesystem->writeStream( "$tmp_pdf_path/$tmp_pdf_filename", fopen( $pdf->get_path(), 'r' ) ) ) {
				/* @todo throw exception */
			}
		} catch ( ConfigNotLoaded $e ) {
			return new \WP_Error( 'session_config_not_loaded', '', [ 'status' => 500 ] );
		} catch ( InvalidPdfId $e ) {
			return new \WP_Error( $e->getMessage(), '', [ 'status' => 403 ] );
		} catch ( PdfNotActive $e ) {
			return new \WP_Error( 'pdf_not_active', '', [ 'status' => 400 ] );
		} catch ( PdfConditionalLogicFailed $e ) {
			return new \WP_Error( 'pdf_conditional_logic_failed', '', [ 'status' => 412 ] );
		} catch ( PdfGenerationError $e ) {
			return new \WP_Error( $e->getMessage(), '', [ 'status' => 500 ] );
		} catch ( \Exception $e ) {
			return new \WP_Error( 'unknown_error', '', [ 'status' => 500 ] );
		}
	}

	/**
	 * Check if a file already exists and then suffix the name with an incrementing number until it is unique
	 *
	 * @param Filesystem $filesystem
	 * @param string     $basepath
	 * @param string     $filename
	 *
	 * @return string The unique filename
	 *
	 * @since 1.0
	 */
	protected function get_unique_filename( Filesystem $filesystem, $basepath, $filename ) {
		$i = 1;
		$unique_filename = $filename;

		while ( $filesystem->has( "$basepath/$unique_filename" ) ) {
			$unique_filename = substr( $filename, 0, -4 ) . $i . '.pdf';
			$i++;
		}

		return $unique_filename;
	}
}
