<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Api\DefaultApiTests;
use GFPDF\Plugins\BulkGenerator\EnhancedMemoryAdapter;
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
 * Class ZipTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class ZipTest extends DefaultApiTests {

	const SESSION_ID = '0bdff6b1954ebce8c0eac7a3a8203a6c';

	protected $endpoint_route_count = 1;

	protected $rest_route = '/' . ApiNamespace::V1 . '/generator/zip/' . self::SESSION_ID;

	protected $endpoint;

	/**
	 * @var FilesystemHelper
	 */
	protected $filesystem;

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

		/* Setup Test Folder Structure */
		$this->filesystem = new FilesystemHelper( new Filesystem( $adapter === null ? new EnhancedMemoryAdapter() : $adapter, [ 'disable_asserts' => true ] ) );

		$this->filesystem->createDir( self::SESSION_ID );
		$this->filesystem->write( self::SESSION_ID . '/tmp/2019/Zadani.pdf', 'content1' );
		$this->filesystem->write( self::SESSION_ID . '/tmp/2020/01/Zadani.pdf', 'content2' );
		$this->filesystem->write( self::SESSION_ID . '/tmp/2020/05/Zadani.pdf', 'content3' );

		$config = new Config( $config_adapter === null ? $this->filesystem : new FilesystemHelper( new Filesystem( $config_adapter, [ 'disable_asserts' => true ] ) ) );
		$config->set_session_id( self::SESSION_ID )
		       ->set_all_settings( [ 'path' => '/' ] )
		       ->save();

		$config->set_session_id( '' );

		$this->endpoint = new Zip( $config, $this->filesystem );
		$this->endpoint->set_logger( $GLOBALS['GFPDF_Test']->log );

		/* Override the existing endpoint to take advantage of our test classes */
		rest_get_server()->override_by_default = true;
		$this->endpoint->endpoint();
	}

	public function test_param_missing_check() {
		$this->markTestSkipped( 'No params in the arguments body' );
	}

	public function test_register_routes() {
		$this->rest_route = str_replace( self::SESSION_ID, '(?P<sessionId>.+?)', $this->rest_route );
		parent::test_register_routes();
	}

	public function test_create_zip() {
		$request  = new \WP_REST_Request( 'POST', $this->rest_route );
		$response = rest_get_server()->dispatch( $request );

		$this->assertTrue( $this->filesystem->has( $this->filesystem->get_zip_path() ) );
		$this->assertRegExp( '/expires=([0-9]{10})&signature=([A-Za-z0-9]{64})$/', $response->get_data()['downloadUrl'] );
	}

	public function test_no_pdfs_to_zip_error() {
		$this->filesystem->deleteDir( self::SESSION_ID );

		$request  = new \WP_REST_Request( 'POST', $this->rest_route );
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 400, $response->get_status() ); /* No PDFs to Zip */
	}
}