<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Search;

use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Api\DefaultApiTests;

/*
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

require_once __DIR__ . '/../DefaultApiTests.php';

/**
 * Class EntriesTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Search
 */
class EntriesTest extends DefaultApiTests {

	protected $endpoint_route_count = 1;

	protected $rest_route_raw = '/' . ApiNamespace::V1 . '/search/(?P<form_id>[0-9]+)/entries';

	protected $rest_route;

	protected $form_id;

	protected $endpoint;

	public function setUp() {
		parent::setUp();

		do_action( 'rest_api_init' );

		$this->authenticate();
		$this->setup_endpoint_class();
		$this->create_entries();

		$this->rest_route = str_replace( '(?P<form_id>[0-9]+)', $this->form_id, $this->rest_route_raw );
	}

	protected function setup_endpoint_class( $adapter = null, $config_adapter = null ) {

		$this->endpoint = new Entries();
		$this->endpoint->set_logger( $GLOBALS['GFPDF_Test']->log );

		/* Override the existing endpoint to take advantage of our test classes */
		rest_get_server()->override_by_default = true;
		$this->endpoint->endpoint();
	}

	protected function create_entries() {
		$this->form_id = \GFAPI::add_form( json_decode( file_get_contents( __DIR__ . '/../../../json/sample.json' ), true ) );

		\GFAPI::get_form( $this->form_id );

		\GFAPI::add_entry(
			[
				'form_id'  => $this->form_id,
				'currency' => 'USD',
				'status'   => 'trash',
				'1'        => 'Sample1',
			]
		);

		\GFAPI::add_entry(
			[
				'form_id'  => $this->form_id,
				'currency' => 'USD',
				'1'        => 'Sample2',
			]
		);

		\GFAPI::add_entry(
			[
				'form_id'  => $this->form_id,
				'currency' => 'USD',
				'1'        => 'Abc3',
			]
		);

		\GFAPI::add_entry(
			[
				'form_id'    => $this->form_id,
				'currency'   => 'USD',
				'is_starred' => 1,
				'1'          => 'Abc4',
			]
		);

		\GFAPI::add_entry(
			[
				'form_id'    => $this->form_id,
				'is_starred' => 1,
				'currency'   => 'USD',
				'1'          => 'XYZ5',
			]
		);
	}

	public function test_register_routes() {
		$this->rest_route = $this->rest_route_raw;
		parent::test_register_routes();
	}

	public function test_param_missing_check() {
		$this->markTestSkipped( 'No required parameters' );
	}

	public function test_all_non_trashed_response() {
		$request  = new \WP_REST_Request( 'POST', $this->rest_route );
		$response = rest_get_server()->dispatch( $request );
		$this->assertCount( 4, $response->get_data() );
	}

	public function test_order_response() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'order', 'asc' );
		$request->set_param( 'orderby', '1' );
		$response = rest_get_server()->dispatch( $request );

		$results = $response->get_data();

		$request->set_param( 'order', 'desc' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( array_reverse( $results ), $response->get_data() );
	}

	public function test_all_trashed_response() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 'filter', 'trash' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertCount( 1, $response->get_data() );
	}

	public function test_search_response() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 's', 'Abc' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertCount( 2, $response->get_data() );
	}

	public function test_search_starred_response() {
		$request = new \WP_REST_Request( 'POST', $this->rest_route );
		$request->set_param( 's', '1' );
		$request->set_param( 'field_id', 'is_starred' );
		$request->set_param( 'operator', 'is' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertCount( 2, $response->get_data() );
	}
}
