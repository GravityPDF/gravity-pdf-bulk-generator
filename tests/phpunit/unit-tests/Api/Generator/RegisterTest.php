<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Generator;

use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Api\DefaultApiTests;
use GFPDF\Plugins\BulkGenerator\Model\Config;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use GFPDF\Plugins\BulkGenerator\Validation\SessionId;
use League\Flysystem\Adapter\NullAdapter;
use League\Flysystem\Filesystem;
use League\Flysystem\Memory\MemoryAdapter;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

require_once __DIR__ . '/../DefaultApiTests.php';

/**
 * Class RegisterTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 */
class RegisterTest extends DefaultApiTests {

	protected $endpoint_route_count = 1;

	protected $rest_route = '/' . ApiNamespace::V1 . '/generator/register';

	protected $endpoint;

	/**
	 * @var SessionId
	 */
	protected $validator;

	public function setUp() {
		parent::setUp();

		$this->setup_endpoint_class();
	}

	protected function setup_endpoint_class( $adapter = null, $config_adapter = null ) {
		$filesystem = new FilesystemHelper( new Filesystem( $adapter === null ? new MemoryAdapter() : $adapter ) );
		$config     = new Config( $config_adapter === null ? $filesystem : new FilesystemHelper( new Filesystem( $config_adapter ) ) );

		$this->validator = new SessionId( $filesystem, $GLOBALS['GFPDF_Test']->log );

		$this->endpoint = new Register( $config, $filesystem );
		$this->endpoint->set_logger( $GLOBALS['GFPDF_Test']->log );

		/* Override the existing endpoint to take advantage of our test classes */
		add_action( 'rest_api_init', function() {
			rest_get_server()->override_by_default = true;
			$this->endpoint->endpoint();
			remove_all_actions( 'rest_api_init' );
		}, 100 );
	}

	public function test_successful_response() {
		$this->authenticate();

		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'path', '/' );

		$response  = rest_get_server()->dispatch( $request );
		$validator = $this->validator;
		$this->assertTrue( $validator( $response->get_data()['sessionId'] ) );
	}

	public function test_failed_response() {
		$this->authenticate();

		/* Setup our endpoint again with an adapters designed to fail */
		$this->setup_endpoint_class( new FailedNullAdapter() );
		do_action('rest_api_init');

		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'path', '/' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 500, $response->get_status() ); /* Session directory creation Failed */

		$this->setup_endpoint_class( null, new FailedNullAdapter() );
		do_action('rest_api_init');

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 500, $response->get_status() ); /* Config file creation failed */
	}
}

class FailedNullAdapter extends NullAdapter {
	public function write( $path, $contents, \League\Flysystem\Config $config ) {
		return false;
	}

	public function createDir( $dirname, \League\Flysystem\Config $config ) {
		return false;
	}

}