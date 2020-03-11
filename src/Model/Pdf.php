<?php

namespace GFPDF\Plugins\BulkGenerator\Model;

use GFPDF\Plugins\BulkGenerator\Exceptions\InvalidPdfId;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfConditionalLogicFailed;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfGenerationError;
use GFPDF\Plugins\BulkGenerator\Exceptions\PdfNotActive;
use League\Flysystem\Filesystem;

/**
 * Class Pdf
 *
 * @package GFPDF\Plugins\BulkGenerator\Model
 */
class Pdf {

	/**
	 * @var int The Gravity Forms ID
	 */
	protected $form_id;

	/**
	 * @var string The form PDF ID
	 */
	protected $pdf_id;

	/**
	 * @var array The current PDF settings data
	 */
	protected $settings = [];

	/**
	 * @var string Where the generated PDF is output to
	 */
	protected $output_path;

	/**
	 * Pdf constructor.
	 *
	 * @param int    $form_id The Gravity Forms ID
	 * @param string $pdf_id  The form PDF ID
	 */
	public function __construct( $form_id, $pdf_id ) {
		$this->form_id = $form_id;
		$this->pdf_id  = $pdf_id;
	}

	/**
	 * Fetch the PDF settings from the database and store in the model
	 *
	 * @return $this
	 * @throws InvalidPdfId
	 *
	 * @since 1.0
	 */
	public function fetch() {
		$settings = \GPDFAPI::get_pdf( $this->form_id, $this->pdf_id );
		if ( is_wp_error( $settings ) ) {
			throw new InvalidPdfId( $settings->get_error_code() );
		}

		$this->settings = $settings;

		return $this;
	}

	/**
	 * Check if the stored PDF settings has a matching key
	 *
	 * @param string $key PDF settings ID
	 *
	 * @return bool
	 *
	 * @since 1.0
	 */
	public function has_setting( $key ) {
		return isset( $this->settings[ $key ] );
	}

	/**
	 * Retrieve the PDF setting
	 *
	 * @param string $key      PDF settings ID
	 * @param mixed  $fallback The fallback value to return if $key doesn't exist
	 *
	 * @return mixed The PDF setting or $fallback
	 *
	 * @since 1.0
	 */
	public function get_setting( $key, $fallback = null ) {
		if ( $this->has_setting( $key ) ) {
			return $this->settings[ $key ];
		}

		return $fallback;
	}

	/**
	 * Return allPDF settings
	 *
	 * @return array
	 *
	 * @since 1.0
	 */
	public function get_all_settings() {
		return $this->settings;
	}

	/**
	 * Check if the currentPDF setting is active
	 *
	 * @return $this
	 * @throws PdfNotActive
	 *
	 * @since 1.0
	 */
	public function evaluate_active() {
		if ( ! $this->get_setting( 'active', false ) ) {
			throw new PdfNotActive();
		}

		return $this;
	}

	/**
	 * Check if the entry passes the current PDF setting conditional logic
	 *
	 * @param array $entry A Gravity Forms entry array
	 *
	 * @return $this
	 * @throws PdfConditionalLogicFailed
	 *
	 * @since 1.0
	 */
	public function evaluate_conditional_logic( $entry ) {
		$misc = \GPDFAPI::get_misc_class();

		if ( $this->has_setting( 'conditionalLogic' ) && ! $misc->evaluate_conditional_logic( $this->get_setting( 'conditionalLogic' ), $entry ) ) {
			throw new PdfConditionalLogicFailed();
		}

		return $this;
	}

	/**
	 * Generate the PDF
	 *
	 * @param int $entry_id The Gravity Forms Entry ID
	 *
	 * @return $this
	 * @throws PdfGenerationError
	 *
	 * @Internal $this->output_path is only set after this method is successfully executed
	 *
	 * @since 1.0
	 */
	public function generate( $entry_id ) {
		$output_path = \GPDFAPI::create_pdf( $entry_id, $this->settings['id'] );

		if ( is_wp_error( $output_path ) ) {
			throw new PdfGenerationError( $output_path->get_error_code() );
		}

		$this->output_path = $output_path;

		return $this;
	}

	/**
	 * Get the PDF path
	 *
	 * @return string The PDF output path
	 * @throws PdfGenerationError
	 *
	 * @since 1.0
	 */
	public function get_path() {
		if ( empty( $this->output_path ) ) {
			throw new PdfGenerationError( 'Pdf::generate() needs to be run before Pdf::get_path()' );
		}

		return $this->output_path;
	}

	/**
	 * Save the PDF to the filesystem at the designated path
	 *
	 * @param Filesystem $filesystem
	 * @param string     $path Where the PDF should be saved to
	 *
	 * @return $this
	 * @throws PdfGenerationError
	 *
	 * @Internal This method acts much like `move` since the PDF is already on the local disk
	 *
	 * @since    1.0
	 */
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
