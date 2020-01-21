<?php

namespace GFPDF\Plugins\BulkGenerator\Model;

use GFPDF\Plugins\BulkGenerator\Exceptions\InvalidPdfId;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfConditionalLogicFailed;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfGenerationError;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfNotActive;
use League\Flysystem\Filesystem;

class Pdf {

	protected $form_id;
	protected $pdf_id;

	protected $settings = [];

	protected $output_path;

	public function __construct( $form_id, $pdf_id ) {
		$this->form_id = $form_id;
		$this->pdf_id  = $pdf_id;
	}

	public function fetch() {

		$settings = \GPDFAPI::get_pdf( $this->form_id, $this->pdf_id );
		if ( is_wp_error( $settings ) ) {
			throw new InvalidPdfId( $settings->get_error_code() );
		}

		$this->settings = $settings;

		return $this;
	}

	public function has_setting( $key ) {
		return isset( $this->settings[ $key ] );
	}

	public function get_setting( $key, $fallback = null ) {
		if ( $this->has_setting( $key ) ) {
			return $this->settings[ $key ];
		}

		return $fallback;
	}

	public function get_all_settings() {
		return $this->settings;
	}

	public function evaluate_active() {
		if ( ! $this->get_setting( 'active', false ) ) {
			throw new PdfNotActive();
		}

		return $this;
	}

	public function evaluate_conditional_logic( $entry ) {
		$misc = \GPDFAPI::get_misc_class();

		if ( $this->has_setting( 'conditionalLogic' ) && ! $misc->evaluate_conditional_logic( $this->get_setting( 'conditionalLogic' ), $entry ) ) {
			throw new PdfConditionalLogicFailed();
		}

		return $this;
	}

	public function generate( $entry_id ) {
		$output_path = \GPDFAPI::create_pdf( $entry_id, $this->settings['id'] );

		if ( is_wp_error( $output_path ) ) {
			throw new PdfGenerationError( $output_path->get_error_code() );
		}

		$this->output_path = $output_path;

		return $this;
	}

	public function get_path() {
		if ( empty( $this->output_path ) ) {
			throw new PdfGenerationError( 'Pdf::generate() needs to be run before Pdf::get_path()' );
		}

		return $this->output_path;
	}

	public function put( Filesystem $filesystem, $path ) {
		if ( empty( $this->output_path ) ) {
			throw new PdfGenerationError( 'Pdf::generate() needs to be run before Pdf::put()' );
		}

		if ( ! is_file( $this->output_path ) ) {
			throw new PdfGenerationError( 'Cannot find PDF' );
		}

		$filesystem->put( $path, file_get_contents( $this->output_path ) );

		return $this;
	}
}
