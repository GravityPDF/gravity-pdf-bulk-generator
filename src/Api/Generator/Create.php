<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Validation\SessionId;
use GFPDF\Plugins\BulkGenerator\Exceptions\SessionConfigNotLoaded;
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

class Create implements ApiEndpointRegistration {

	protected $save_pdf_path;

	public function __construct( $save_pdf_path ) {
		$this->save_pdf_path = $save_pdf_path;
	}

	public function endpoint() {
		register_rest_route( ApiNamespace::V1, '/generator/create/', [
			'methods'  => \WP_REST_Server::CREATABLE,
			'callback' => [ $this, 'response' ],

			'permission_callback' => function() {
				$gform = \GPDFAPI::get_form_class();

				/* @TODO - remove */
				return true;

				return $gform->has_capability( 'gravityforms_view_entries' );
			},

			'args' => [
				'sessionId' => [
					'required'          => true,
					'type'              => 'string',
					'description'       => 'An alphanumeric active session ID returned via the ' . ApiNamespace::V1 . '/generator/register/ endpoint.',
					'validate_callback' => new SessionId( $this->save_pdf_path ),
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
		$gform = \GPDFAPI::get_form_class();
		$misc  = \GPDFAPI::get_misc_class();

		$this->save_pdf_path = trailingslashit( $this->save_pdf_path . $request->get_param( 'sessionId' ) ); /* @TODO Abstract */

		/*
		 * Get required data
		 */
		$entry = $gform->get_entry( $request->get_param( 'entryId' ) );
		if ( is_wp_error( $entry ) ) {
			$entry->add_data( [ 'status' => 403 ] );

			return $entry;
		}

		$pdf = \GPDFAPI::get_pdf( $entry['form_id'], $request->get_param( 'pdfId' ) );
		if ( is_wp_error( $pdf ) ) {
			$pdf->add_data( [ 'status' => 403 ] );

			return $pdf;
		}

		/*
		 * @TODO refractor
		 * Validate PDF
		 */
		if ( $pdf['active'] !== true ) {
			return new \WP_Error( 'pdf_not_active', [ 'status' => 400 ] );
		}

		if ( isset( $pdf['conditionalLogic'] ) && ! $misc->evaluate_conditional_logic( $pdf['conditionalLogic'], $entry ) ) {
			return new \WP_Error( 'pdf_conditional_logic_failed', [ 'status' => 412 ] );
		}

		try {
			$config = $this->get_session_config( $this->save_pdf_path );
		} catch ( SessionConfigNotLoaded $e ) {
			return new \WP_Error( 'session_config_not_loaded', [ 'status' => 500 ] );
		}

		/* Create the PDF */
		$tmp_pdf_path = \GPDFAPI::create_pdf( $entry['id'], $pdf['id'] );
		if ( is_wp_error( $tmp_pdf_path ) ) {
			$tmp_pdf_path->add_data( [ 'status' => 500 ] );

			return $pdf;
		}

		/* Move to appropriate location */
		/* @TODO - how to handle PDFs with the same name - override, or rename? */
		$zip_pdf_path = $this->get_full_save_path( $config['path'], $entry ) . wp_basename( $tmp_pdf_path );
		if ( ! $this->copy_to_zip( $zip_pdf_path, file_get_contents( $tmp_pdf_path ) ) ) {
			return new \WP_Error( 'error_creating_pdf', [ 'status' => 500 ] );
		}

		/* Cleanup */
		$misc->rmdir( dirname( $tmp_pdf_path ) );
	}

	/* @TODO move to independant class */
	/* @TODO add logging */
	protected function get_full_save_path( $user_path, $entry ) {
		$misc  = \GPDFAPI::get_misc_class();
		$gform = \GPDFAPI::get_form_class();
		$form  = $gform->get_form( $entry['form_id'] );

		$user_path = explode( '/', $user_path );
		foreach ( $user_path as &$segment ) {
			$segment = trim( $gform->process_tags( $segment, $form, $entry ) );
			$segment = $misc->strip_invalid_characters( $segment );
		}

		$user_path = implode( '/', array_filter( $user_path ) );

		return trailingslashit( $user_path );
	}

	/* @TODO - allow zip name to be modified by the user? */
	public function copy_to_zip( $zip_path, $content ) {
		$zip = new Filesystem( new ZipArchiveAdapter( $this->save_pdf_path . 'archive.zip' ) );
		if ( ! $zip->put( $zip_path, $content ) ) {
			return false; /* @TODO Exception? */
		}

		/* Force the zip archive to close */
		$zip = null;

		return true;
	}

	/* @TODO move to dedicated class */
	protected function get_session_config( $path ) {
		$config_path = $path . 'config.json';

		if ( ! is_file( $config_path ) ) {
			throw new SessionConfigNotLoaded();
		}

		$config = json_decode( file_get_contents( $config_path ), true );

		if ( ! is_array( $config ) || count( $config ) === 0 ) {
			throw new SessionConfigNotLoaded();
		}

		return $config;
	}

}
