<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Helper\Helper_Url_Signer;
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
 * Class DownloadTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class DownloadTest extends DefaultApiTests {

	const SESSION_ID = '0bdff6b1954ebce8c0eac7a3a8203a6c';

	protected $endpoint_route_count = 1;

	protected $rest_route = '/' . ApiNamespace::V1 . '/generator/download/' . self::SESSION_ID;

	/**
	 * @var Download
	 */
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

		$this->setup_endpoint_class();
	}

	protected function setup_endpoint_class( $adapter = null, $config_adapter = null ) {

		/* Setup Test Folder Structure */
		$this->filesystem = new FilesystemHelper( new Filesystem( $adapter === null ? new EnhancedMemoryAdapter() : $adapter, [ 'disable_asserts' => true ] ) );

		$config = new Config( $config_adapter === null ? $this->filesystem : new FilesystemHelper( new Filesystem( $config_adapter, [ 'disable_asserts' => true ] ) ) );
		$config->set_session_id( self::SESSION_ID )
			   ->set_all_settings( [ 'path' => '/' ] )
			   ->save();

		$config->set_session_id( '' );

		$this->endpoint = $this->getMockBuilder( Download::class )
							   ->setConstructorArgs( [ $config, $this->filesystem ] )
							   ->setMethods( [ 'end' ] )
							   ->getMock();

		$this->endpoint->set_logger( $GLOBALS['GFPDF_Test']->log );

		/* Override the existing endpoint to take advantage of our test classes */
		rest_get_server()->override_by_default = true;
		$this->endpoint->endpoint();
	}

	public function test_authentication_check() {
		$request  = new \WP_REST_Request( 'GET', $this->rest_route );
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 401, $response->get_status() );

		$signer = new Helper_Url_Signer();
		$url    = $signer->sign( 'http://sample.local', '12 hours' );

		$_SERVER['HTTP_HOST']   = 'sample.local';
		$_SERVER['REQUEST_URI'] = str_replace( 'http://sample.local', '', $url );

		$request  = new \WP_REST_Request( 'GET', $this->rest_route );
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 404, $response->get_status() );
		$this->assertSame( 'zip_not_found', $response->get_data()['code'] );
	}

	public function test_param_missing_check() {
		$this->markTestSkipped( 'No params in the arguments body' );
	}

	public function test_register_routes() {
		$this->rest_route = str_replace( self::SESSION_ID, '(?P<sessionId>.+?)', $this->rest_route );
		parent::test_register_routes();
	}

	public function test_download() {
		$this->filesystem->createDir( self::SESSION_ID );
		$this->filesystem->write( self::SESSION_ID . '/archive.zip', 'content1' );

		$request = new \WP_REST_Request( 'GET', $this->rest_route );
		$request->set_query_params( [ 'sessionId' => self::SESSION_ID ] );

		ob_start();
		$this->endpoint->response( $request );
		$this->assertStringStartsWith( 'content1', ob_get_clean() );
	}
}

function ob_flush() {

}

function flush() {

}
