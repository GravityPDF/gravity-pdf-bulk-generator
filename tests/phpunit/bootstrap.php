<?php

namespace GFPDF\Plugins\BulkGenerator;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

if ( function_exists( 'xdebug_disable' ) ) {
	xdebug_disable();
}

require_once __DIR__ . '/helpers/EnhancedMemoryAdapter.php';
require_once __DIR__ . '/helpers/FailedNullAdapter.php';

/**
 * Class GravityPDF_Bulk_Generator_Unit_Tests_Bootstrap
 *
 * @package GFPDF\Plugins\BulkGenerator
 */
class GravityPDF_Bulk_Generator_Unit_Tests_Bootstrap {

	/** @var string directory where wordpress-tests-lib is installed */
	public $wp_tests_dir;

	/** @var string testing directory */
	public $tests_dir;

	/** @var string plugin directory */
	public $plugin_dir;

	/** @var \Monolog\Logger */
	public $log;

	/**
	 * GravityPDF_Bulk_Generator_Unit_Tests_Bootstrap constructor.
	 */
	public function __construct() {

		$this->tests_dir    = dirname( __FILE__ );
		$this->plugin_dir   = dirname( $this->tests_dir ) . '/..';
		$this->wp_tests_dir = $this->plugin_dir . '/tmp/wordpress-tests-lib';

		/* load test function so tests_add_filter() is available */
		require_once $this->wp_tests_dir . '/includes/functions.php';

		/* load Gravity PDF */
		tests_add_filter( 'muplugins_loaded', [ $this, 'load' ] );

		/* load the WP testing environment */
		require_once( $this->wp_tests_dir . '/includes/bootstrap.php' );
	}

	/**
	 * Load Gravity Forms and Gravity PDF
	 */
	public function load() {
		require_once $this->plugin_dir . '/tmp/gravityforms/gravityforms.php';
		require_once $this->plugin_dir . '/tmp/gravity-forms-pdf-extended/pdf.php';

		/* set up Gravity Forms database */
		\RGFormsModel::drop_tables();
		( function_exists( 'gf_upgrade' ) ) ? gf_upgrade()->maybe_upgrade() : \GFForms::setup( true );

		require $this->plugin_dir . '/gravity-pdf-bulk-generator.php';

		/* Setup testing logger */
		require $this->plugin_dir . '/tmp/gravity-forms-pdf-extended/vendor/autoload.php';
		$this->log = new \GFPDF\Vendor\Monolog\Logger( 'test' );
		$this->log->pushHandler( new \GFPDF\Vendor\Monolog\Handler\NullHandler( \GFPDF\Vendor\Monolog\Logger::INFO ) ); /* throw logs away */
	}
}

$GLOBALS['GFPDF_Test'] = new GravityPDF_Bulk_Generator_Unit_Tests_Bootstrap();
