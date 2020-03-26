<?php

namespace GFPDF\Plugins\BulkGenerator\Api;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/**
 * Class DefaultApiTests
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Generator
 *
 * @mixin \PHPUnit\Framework\TestCase
 *
 * @since   1.0
 */
abstract class DefaultApiTests extends \WP_UnitTestCase {

	/**
	 * @var int The number of child routes registered on the endpoint being tested
	 * @internal Define in child class
	 */
	protected $endpoint_route_count;

	/**
	 * @var string The REST route path i.e /gravity-pdf-bulk-generator/generator/register
	 * @internal Define in child class
	 */
	protected $rest_route;

	/**
	 * @var bool Whether the route has parameters that are required to execute
	 * @internal Override in child class
	 */
	protected $has_required_params = true;

	/**
	 * Check that the route and child routes are registered in WordPress
	 *
	 * @since 1.0
	 */
	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( $this->rest_route, $routes );
		$this->assertCount( $this->endpoint_route_count, $routes[ $this->rest_route ] );
	}

	/**
	 * Test that the required parameter validation is checked automatically
	 *
	 * @since 1.0
	 */
	public function test_param_missing_check() {

		if ( ! $this->has_required_params ) {
			$this->markTestSkipped( 'Route does not have required params to check' );
		}

		/* Test for validation failure */
		$request  = new \WP_REST_Request( 'POST', $this->rest_route );
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 400, $response->get_status() );
		$this->assertSame( 'rest_missing_callback_param', $response->get_data()['code'] );
	}

	/**
	 * Verify endpoint has suitable authentication checks in place
	 *
	 * @internal Override this method if the endpoint doesn't do role-based authentication
	 *
	 * @since    1.0
	 */
	public function test_authentication_check() {
		wp_set_current_user( 0 );

		/* Bypass the parameter required checks */
		$request = $this->getMockBuilder( \WP_REST_Request::class )
		                ->setConstructorArgs( [ 'POST', $this->rest_route ] )
		                ->setMethods( [ 'set_attributes' ] )
		                ->getMock();

		/* Test logged out user auth failure */
		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'rest_forbidden', $response->get_data()['code'] );

		/* Test failed authentication as a logged in user */
		$this->authenticate( 'editor' );

		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 'rest_forbidden', $response->get_data()['code'] );

		/* Test for passed authentication */
		$this->authenticate();

		$response = rest_get_server()->dispatch( $request );
		$code     = isset( $response->get_data()['code'] ) ? $response->get_data()['code'] : '';
		$this->assertNotSame( 'rest_forbidden', $code );
	}

	/**
	 * Create a new user with the role passed and set as the current user
	 *
	 * @param string $role
	 */
	public function authenticate( $role = 'administrator' ) {
		wp_set_current_user( $this->factory->user->create( [ 'role' => $role ] ) );
	}
}
