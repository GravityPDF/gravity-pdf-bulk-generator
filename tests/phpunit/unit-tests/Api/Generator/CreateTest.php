<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Api\DefaultApiTests;
use GFPDF\Plugins\BulkGenerator\EnhancedMemoryAdapter;
use GFPDF\Plugins\BulkGenerator\FailedNullAdapter;
use GFPDF\Plugins\BulkGenerator\Model\Config;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use GFPDF\Plugins\BulkGenerator\Validation\SessionId;
use League\Flysystem\Filesystem;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

require_once __DIR__ . '/../DefaultApiTests.php';

/**
 * Class CreateTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class CreateTest extends DefaultApiTests {

	protected $endpoint_route_count = 1;

	protected $rest_route = '/' . ApiNamespace::V1 . '/generator/create';

	protected $endpoint;

	protected $form_id;

	/**
	 * @var FilesystemHelper
	 */
	protected $filesystem;

	protected $session_id       = '0bdff6b1954ebce8c0eac7a3a8203a6c';
	protected $dummy_session_id = '0bdff6b1954ebce8c0eac7a3a8203123';

	/**
	 * @var SessionId
	 */
	protected $validator;

	public function setUp() {
		parent::setUp();

		do_action( 'rest_api_init' );

		$this->authenticate();
		$this->setup_endpoint_class();
	}

	protected function setup_endpoint_class( $adapter = null, $config_adapter = null ) {
		$this->filesystem = new FilesystemHelper( new Filesystem( $adapter === null ? new EnhancedMemoryAdapter() : $adapter, [ 'disable_asserts' => true ] ) );
		$this->filesystem->createDir( $this->session_id );
		$this->filesystem->createDir( $this->dummy_session_id );

		$config = new Config( $config_adapter === null ? $this->filesystem : new FilesystemHelper( new Filesystem( $config_adapter, [ 'disable_asserts' => true ] ) ) );
		$config->set_session_id( $this->session_id )
			   ->set_all_settings( [ 'path' => '/' ] )
			   ->save();

		$config->set_session_id( '' );

		$this->endpoint = new Create( $config, $this->filesystem );
		$this->endpoint->set_logger( $GLOBALS['GFPDF_Test']->log );

		/* Override the existing endpoint to take advantage of our test classes */
		rest_get_server()->override_by_default = true;
		$this->endpoint->endpoint();
	}

	protected function create_entry() {
		$this->form_id = \GFAPI::add_form( json_decode( file_get_contents( __DIR__ . '/../../../json/sample.json' ), true ) );

		\GFAPI::get_form( $this->form_id );

		return \GFAPI::add_entry(
			[
				'form_id'  => $this->form_id,
				'currency' => 'USD',
				'1'        => 'Sample',
			]
		);
	}

	public function test_entry_not_found_response() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', '0' );
		$request->set_param( 'pdfId', '5e7bfc55b6ec9' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'not_found', $response->get_data()['code'] );
	}

	public function test_config_file_not_found() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->dummy_session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '5e7bfc55b6ec9' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'session_config_not_loaded', $response->get_data()['code'] );
	}

	public function test_invalid_pdf_id() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '12345' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'invalid_pdf_id', $response->get_data()['code'] );
	}

	public function test_pdf_not_active() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '5e7bfc6b2df87' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'pdf_not_active', $response->get_data()['code'] );
	}

	public function test_pdf_conditional_logic_fail() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '5e7bfc6944ab6' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'pdf_conditional_logic_failed', $response->get_data()['code'] );
	}

	public function test_pdf_generation_error() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '5e7bfc55b6ec9' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'pdf_generation_failure', $response->get_data()['code'] );
	}

	public function test_filesystem_error() {
		$this->setup_endpoint_class( new FailedNullAdapter(), new EnhancedMemoryAdapter() );

		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '5e7bfc55b6ec9' );

		add_filter(
			'gfpdf_mpdf_class_config',
			function( $config ) {
				$config['mode']          = 'c';
				$config['biDirectional'] = false;

				return $config;
			}
		);

		$response = $this->endpoint->response( $request );
		$this->assertSame( 'filesystem_error', $response->get_error_code() );
	}

	public function test_create_pdf() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '5e7bfc55b6ec9' );

		add_filter(
			'gfpdf_mpdf_class_config',
			function( $config ) {
				$config['mode']          = 'c';
				$config['biDirectional'] = false;

				return $config;
			}
		);

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 200, $response->get_status() );
		$this->assertStringStartsWith( '%PDF-1.4', $this->filesystem->read( '/tmp/Zadani.pdf' ) );
	}

	public function test_create_multiple_pdf() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'sessionId', $this->session_id );
		$request->set_param( 'entryId', $this->create_entry() );
		$request->set_param( 'pdfId', '5e7bfc55b6ec9' );

		add_filter(
			'gfpdf_mpdf_class_config',
			function( $config ) {
				$config['mode']          = 'c';
				$config['biDirectional'] = false;

				return $config;
			}
		);

		$response = rest_get_server()->dispatch( $request );
		$this->filesystem->set_prefix( '' );

		$response = rest_get_server()->dispatch( $request );

		$this->assertStringStartsWith( '%PDF-1.4', $this->filesystem->read( '/tmp/Zadani.pdf' ) );
		$this->assertStringStartsWith( '%PDF-1.4', $this->filesystem->read( '/tmp/Zadani1.pdf' ) );
	}
}
