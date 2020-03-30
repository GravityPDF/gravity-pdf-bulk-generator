<?php

namespace GFPDF\Plugins\BulkGenerator\Model;

use GFPDF\Plugins\BulkGenerator\EnhancedMemoryAdapter;
use League\Flysystem\Filesystem;

/**
 * Class PdfTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Model
 */
class PdfTest extends \WP_UnitTestCase {

	const PDF_ID = '5e7bfc55b6ec9';

	protected $pdf;
	protected $filesystem;
	protected $settings;

	private $form_id;
	private $entry;

	public function setUp() {
		$this->entry = $this->create_entry();

		$this->pdf        = new Pdf( $this->entry['form_id'], self::PDF_ID );
		$this->filesystem = new Filesystem( new EnhancedMemoryAdapter() );
		$this->pdf->fetch();

		parent::setUp();
	}

	protected function create_entry() {
		$this->form_id = \GFAPI::add_form( json_decode( file_get_contents( __DIR__ . '/../../json/sample.json' ), true ) );

		$entry_id = \GFAPI::add_entry(
			[
				'form_id'        => $this->form_id,
				'created_by'     => $this->factory->user->create(),
				'date_created'   => '2020-02-01 01:30:00',
				'payment_status' => 'Paid',
				'currency'       => 'USD',
				'active'         => true,
				'1'              => 'Sample',
			]
		);

		return \GFAPI::get_entry( $entry_id );
	}

	/**
	 * @expectedException GFPDF\Plugins\BulkGenerator\Exceptions\InvalidPdfId
	 */
	public function test_fetch_exemption_failed() {
		$pdf = new Pdf( 1231, self::PDF_ID );
		$pdf->fetch();
	}

	/**
	 * @param bool   $expected
	 * @param string $name
	 *
	 * @dataProvider has_setting_data_provider
	 */
	public function test_has_setting( $expected, $name ) {
		$this->assertSame( $expected, $this->pdf->has_setting( $name ) );
	}

	public function has_setting_data_provider() {
		return [
			[ true, 'name' ],
			[ true, 'filename' ],
			[ false, 'test' ],
			[ false, 'dummy_test' ],
		];
	}

	public function test_get_setting() {
		$this->assertSame( 'Zadani', $this->pdf->get_setting( 'name' ) );
		$this->assertNull( $this->pdf->get_setting( 'test' ) );
		$this->assertTrue( $this->pdf->get_setting( 'test', true ) );
		$this->assertSame( 'Yes', $this->pdf->get_setting( 'test', 'Yes' ) );
	}

	public function test_get_all_settings() {
		$this->assertSame( \GPDFAPI::get_pdf( $this->form_id, self::PDF_ID ), $this->pdf->get_all_settings() );
	}

	public function test_evaluate_active_success() {
		$this->assertSame( Pdf::class, get_class( $this->pdf->evaluate_active() ) );
	}

	/**
	 * @expectedException \GFPDF\Plugins\BulkGenerator\Exceptions\PdfNotActive
	 */
	public function test_evaluate_active_failed() {
		$pdf = new Pdf( $this->form_id, '5e7bfc6b2df87' );
		$pdf->fetch()
			->evaluate_active();
	}

	public function test_evaluate_conditional_logic_success() {
		$this->assertSame( Pdf::class, get_class( $this->pdf->evaluate_conditional_logic( $this->entry ) ) );
	}

	/**
	 * @expectedException \GFPDF\Plugins\BulkGenerator\Exceptions\PdfConditionalLogicFailed
	 */
	public function test_evaluate_conditional_logic_fail() {
		$pdf = new Pdf( $this->form_id, '5e7bfc6944ab6' );
		$pdf->fetch()
			->evaluate_conditional_logic( $this->entry );
	}

	/**
	 * @expectedException \GFPDF\Plugins\BulkGenerator\Exceptions\PdfGenerationError
	 */
	public function test_generate_exception() {
		$this->pdf->generate( $this->entry['id'] );
	}

	public function test_generate() {
		$this->setup_pdf_config();
		$this->pdf->generate( $this->entry['id'] );

		$this->assertSame( 'Zadani.pdf', wp_basename( $this->pdf->get_path() ) );
	}

	/**
	 * @expectedException \GFPDF\Plugins\BulkGenerator\Exceptions\PdfGenerationError
	 */
	public function test_get_path_exception() {
		$this->pdf->get_path();
	}

	/**
	 * @expectedException \GFPDF\Plugins\BulkGenerator\Exceptions\PdfGenerationError
	 */
	public function test_put_exception() {
		$this->pdf->put( $this->filesystem, 'Zadani.pdf' );
	}

	public function test_put() {
		$this->setup_pdf_config();
		$this->pdf->generate( $this->entry['id'] );

		$this->pdf->put( $this->filesystem, 'Zadani.pdf' );
		$this->assertStringStartsWith( '%PDF-1.4', $this->filesystem->read( 'Zadani.pdf' ) );
	}

	/**
	 * Configure mPDF so it'll generate PDFs with core fonts only
	 */
	protected function setup_pdf_config() {
		add_filter(
			'gfpdf_mpdf_class_config',
			function( $config ) {
				$config['mode']          = 'c';
				$config['biDirectional'] = false;

				return $config;
			}
		);
	}
}
