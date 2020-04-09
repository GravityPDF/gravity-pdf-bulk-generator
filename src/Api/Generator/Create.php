<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Helper\Helper_Trait_Logger;
use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Exceptions\ConfigNotLoaded;
use GFPDF\Plugins\BulkGenerator\Exceptions\FilesystemError;
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

/**
 * Class Create
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class Create implements ApiEndpointRegistration {

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
	 * Create constructor.
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
			'/generator/create/',
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

					'entryId'   => [
						'required'    => true,
						'type'        => 'integer',
						'description' => __( 'The Gravity Forms Entry ID', 'gravity-pdf-bulk-generator' ),
					],

					'pdfId'     => [
						'required'    => true,
						'type'        => 'string',
						'description' => __( 'An alphanumeric ID used to represent the Gravity Forms PDF Settings ID', 'gravity-pdf-bulk-generator' ),
					],
				],
			]
		);
	}

	/**
	 * Generate the requested PDF and move to the appropriate Bulk Generator folder structure
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return void|\WP_Error
	 */
	public function response( \WP_REST_Request $request ) {
		$gform      = \GPDFAPI::get_form_class();
		$session_id = $request->get_param( 'sessionId' );

		$entry = $gform->get_entry( $request->get_param( 'entryId' ) );
		if ( is_wp_error( $entry ) ) {
			$entry->add_data( [ 'status' => 403 ] );

			$this->logger->error(
				'Entry not found',
				[
					'context' => $entry->get_error_messages(),
				]
			);

			return $entry;
		}

		try {
			$this->logger->notice(
				'Begin PDF Creation',
				[
					'session' => $session_id,
					'form'    => $entry['form_id'],
					'entry'   => $entry['id'],
					'pdf'     => $request->get_param( 'pdfId' ),
				]
			);

			/* Setup the current session ID and load the config file settings from filesystem */
			$settings = $this->config->set_session_id( $session_id )
									 ->fetch()
									 ->get_all_settings();

			/* Generate our PDF if we can get the settings, verify its active, and conditional logic passes */
			$pdf = new Pdf( $entry['form_id'], $request->get_param( 'pdfId' ) );
			$pdf->fetch()
				->evaluate_active()
				->evaluate_conditional_logic( $entry )
				->generate( $entry['id'] );

			/* Create the Bulk PDF folder structure in the filesystem */
			$tmp_pdf_path = $this->filesystem->get_tmp_pdf_path( $settings['path'], $entry );
			if ( ! $this->filesystem->createDir( $tmp_pdf_path ) || ! is_file( $pdf->get_path() ) ) {
				throw new FilesystemError();
			}

			/* Get the PDF filename (ensuring uniqueness) and save to the Bulk Generator filesystem location */
			$tmp_pdf_filename = $this->get_unique_filename( $this->filesystem, $tmp_pdf_path, wp_basename( $pdf->get_path() ), $entry['id'], $request->get_param( 'pdfId' ) );
			$pdf_stream       = fopen( $pdf->get_path(), 'rb' );
			if ( ! $this->filesystem->writeStream( "$tmp_pdf_path/$tmp_pdf_filename", $pdf_stream ) ) {
				throw new FilesystemError();
			}

			fclose( $pdf_stream );
			unlink( $pdf->get_path() );
		} catch ( FilesystemError $e ) {
			return new \WP_Error( 'filesystem_error', '', [ 'status' => 500 ] );
		} catch ( ConfigNotLoaded $e ) {
			return new \WP_Error( 'session_config_not_loaded', '', [ 'status' => 500 ] );
		} catch ( InvalidPdfId $e ) {
			return new \WP_Error( 'invalid_pdf_id', $e->getMessage(), [ 'status' => 403 ] );
		} catch ( PdfNotActive $e ) {
			return new \WP_Error( 'pdf_not_active', '', [ 'status' => 400 ] );
		} catch ( PdfConditionalLogicFailed $e ) {
			return new \WP_Error( 'pdf_conditional_logic_failed', '', [ 'status' => 412 ] );
		} catch ( PdfGenerationError $e ) {
			return new \WP_Error( 'pdf_generation_error', $e->getMessage(), [ 'status' => 500 ] );
		} catch ( \Exception $e ) {
			return new \WP_Error( 'unknown_error', $e->getMessage(), [ 'status' => 500 ] );
		} finally {
			if ( ! empty( $e ) ) {
				$this->logger->error(
					$e,
					[
						'session' => $session_id,
						'form'    => $entry['form_id'],
						'entry'   => $entry['id'],
						'pdf'     => $request->get_param( 'pdfId' ),
					]
				);
			}
		}
	}

	/**
	 * Check if a file already exists and then suffix the PDF name with an incrementing number until it is unique
	 *
	 * @param FilesystemHelper|Filesystem $filesystem
	 * @param string                      $basepath
	 * @param string                      $filename
	 * @param int                         $entry_id
	 * @param string                      $pdf_id
	 *
	 * @return string The unique filename
	 *
	 * @since 1.0
	 */
	protected function get_unique_filename( $filesystem, $basepath, $filename, $entry_id, $pdf_id ) {
		if ( $filesystem->has( "$basepath/$filename" ) ) {
			$pdf_id   = substr( $pdf_id, 0, 4 );
			$filename = substr( $filename, 0, -4 ) . " ({$entry_id}-{$pdf_id}).pdf";
		}

		return $filename;
	}
}
