<?php

/**
 * Plugin Name:     Gravity PDF Bulk Generator
 * Plugin URI:      https://gravitypdf.com/shop/bulk-generator-add-on/
 * Description:     Bulk export Gravity PDF documents for your Gravity Forms entries.
 * Author:          Gravity PDF
 * Author URI:      https://gravitypdf.com
 * Text Domain:     gravity-pdf-bulk-generator
 * Domain Path:     /languages
 * Version:         1.1.0
 */

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'GFPDF_PDF_BULK_GENERATOR_FILE', __FILE__ );
define( 'GFPDF_PDF_BULK_GENERATOR_VERSION', '1.1.0' );

/**
 * Class GPDF_Bulk_Generator_Checks
 *
 * @since 1.0
 */
class GPDF_Bulk_Generator_Checks {

	/**
	 * Holds any blocker error messages stopping plugin running
	 *
	 * @var array
	 *
	 * @since 1.0
	 */
	private $notices = [];

	/**
	 * @var string
	 *
	 * @since 1.0
	 */
	private $required_gravitypdf_version = '5.2.0';

	/**
	 * Run our pre-checks and if it passes bootstrap the plugin
	 *
	 * @return void
	 *
	 * @since 1.0
	 */
	public function init() {

		/* Test the minimum version requirements are met */
		$this->check_gravitypdf_version();
		$this->check_zip_support();

		/* Check if any errors were thrown, enqueue them and exit early */
		if ( count( $this->notices ) > 0 ) {
			add_action( 'admin_notices', [ $this, 'display_notices' ] );

			return null;
		}

		add_action(
			'gfpdf_fully_loaded',
			function() {
				require_once __DIR__ . '/src/bootstrap.php';
			}
		);
	}

	/**
	 * Check if the current version of Gravity PDF is compatible with this add-on
	 *
	 * @return bool
	 *
	 * @since 1.0
	 */
	public function check_gravitypdf_version() {

		/* Check if the Gravity PDF Minimum version requirements are met */
		if ( defined( 'PDF_EXTENDED_VERSION' ) &&
			 version_compare( PDF_EXTENDED_VERSION, $this->required_gravitypdf_version, '>=' )
		) {
			return true;
		}

		/* translators: %s is the current plugin version number */
		$this->notices[] = sprintf( esc_html__( 'Gravity PDF Version %s or higher is required to use this add-on. Please install/upgrade Gravity PDF to the latest version.', 'gravity-pdf-bulk-generator' ), $this->required_gravitypdf_version );
	}

	/**
	 * Verify PHP has Zip support
	 *
	 * @return bool
	 *
	 * @since 1.0.2
	 */
	public function check_zip_support() {
		if ( class_exists( '\ZipArchive' ) ) {
			return true;
		}

		$this->notices[] = esc_html__( 'The Zip PHP Extension could not be detected. Contact your web hosting provider to fix.', 'gravity-pdf-bulk-generator' );
	}

	/**
	 * Helper function to easily display error messages
	 *
	 * @return void
	 *
	 * @since 1.0
	 */
	public function display_notices() {
		?>
		<div class="error">
			<p>
				<strong><?php esc_html_e( 'Gravity PDF Bulk Generator Installation Problem', 'gravity-pdf-bulk-generator' ); ?></strong>
			</p>

			<p><?php esc_html_e( 'The minimum requirements for the Gravity PDF Bulk Generator plugin have not been met. Please fix the issue(s) below to continue:', 'gravity-pdf-bulk-generator' ); ?></p>
			<ul style="padding-bottom: 0.5em">
				<?php foreach ( $this->notices as $notice ): ?>
					<li style="padding-left: 20px;list-style: inside"><?php echo $notice; ?></li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
	}
}

/* Initialise the software */
add_action(
	'plugins_loaded',
	function() {
		$gravitypdf_bulk_generator = new GPDF_Bulk_Generator_Checks();
		$gravitypdf_bulk_generator->init();
	}
);
