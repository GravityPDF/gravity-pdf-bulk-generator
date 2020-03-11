<?php

namespace GFPDF\Plugins\BulkGenerator\Api;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Interface ApiEndpointRegistration
 *
 * @package GFPDF\Plugins\BulkGenerator\Api
 *
 * @since 1.0
 */
interface ApiEndpointRegistration {

	/**
	 * This method is used to register the REST API endpoints (using function `register_rest_route()`)
	 *
	 * @return void
	 *
	 * @since 1.0
	 *
	 * @Internal this method is automatically run on the WordPress `rest_api_init` hook
	 * @link https://developer.wordpress.org/reference/functions/register_rest_route/
	 */
	public function endpoint();
}
