<?php

namespace GFPDF\Plugins\BulkGenerator;

use GFPDF\Helper\Helper_Abstract_Addon;
use GFPDF\Helper\Helper_Logger;
use GFPDF\Helper\Helper_Notices;
use GFPDF\Helper\Helper_Singleton;
use GFPDF\Helper\Licensing\EDD_SL_Plugin_Updater;
use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;
use GFPDF\Plugins\BulkGenerator\Api\Generator\Create;
use GFPDF\Plugins\BulkGenerator\Api\Generator\Download;
use GFPDF\Plugins\BulkGenerator\Api\Generator\Register;
use GFPDF\Plugins\BulkGenerator\Api\Search\Entries;
use GPDFAPI;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* Load Composer */
require_once( __DIR__ . '/../vendor/autoload.php' );

/**
 * Class Bootstrap
 *
 * @package GFPDF\Plugins\Previewer
 */
class Bootstrap extends Helper_Abstract_Addon {

	/**
	 * Initialise the plugin classes and pass them to our parent class to
	 * handle the rest of the bootstrapping (licensing ect)
	 *
	 * @param array $classes An array of classes to store in our singleton
	 *
	 * since 0.1
	 */
	public function init( $classes = [] ) {

		$data          = GPDFAPI::get_data_class();
		$pdf_save_path = $data->template_tmp_location . 'bulk-generator/';

		/* Register our classes and pass back up to the parent initialiser */
		$api_classes = $this->register_api_endpoints( [
			new Register( $pdf_save_path ),
			new Create( $pdf_save_path ),
			new Download( $pdf_save_path ),
			new Entries()
		] );

		$classes = array_merge(
			$classes,
			$api_classes,
			[

			]
		);

		$this->move_to_class();

		/* Run the setup */
		parent::init( $classes );
	}

	protected function register_api_endpoints( $classes ) {
		foreach ( $classes as $class ) {
			if ( $class instanceof ApiEndpointRegistration ) {
				add_action( 'rest_api_init', [ $class, 'endpoint' ] );
			}
		}

		return $classes;
	}

	public function move_to_class() {
		if( \GFForms::get_page() === 'entry_list' ) {

			$form_id = (int) rgget( 'id' );
			$pdfs = \GPDFAPI::get_form_pdfs( $form_id );

			if( is_wp_error($pdfs) || count( $pdfs ) === 0 ) {
				return;
			}

			add_filter( 'gform_entry_list_bulk_actions', function( $actions ) {
				$actions['download_pdf'] = esc_html__( 'Download PDF', 'gravity-pdf-bulk-generator' );

				return $actions;
			} );

			add_action( 'admin_enqueue_scripts', function() use( $form_id, $pdfs ) {
				wp_enqueue_script(
					'gfpdf_bulk_generator',
					plugin_dir_url( GFPDF_PDF_BULK_GENERATOR_FILE ) . 'dist/bulk-generator.js',
					[],
					time(),
					true
				);

				wp_localize_script( 'gfpdf_bulk_generator', 'GPDF_BULK_GENERATOR', [
					'rest_url' => rest_url( ApiNamespace::V1 ),
					'form_id'  => $form_id,
					'pdfs'     => $pdfs,
				] );

				wp_enqueue_style(
					'gfpdf_bulk_generator',
					plugin_dir_url( GFPDF_PDF_BULK_GENERATOR_FILE ) . 'dist/bulk-generator.css',
					[],
					time()
				);
			} );
		}
	}

	/**
	 * Check the plugin's license is active and initialise the EDD Updater
	 *
	 * since 0.1
	 */
	public function plugin_updater() {

		/* Skip over this addon if license status isn't active */
		$license_info = $this->get_license_info();

		new EDD_SL_Plugin_Updater(
			$this->data->store_url,
			$this->get_main_plugin_file(),
			[
				'version'   => $this->get_version(),
				'license'   => $license_info['license'],
				'item_name' => $this->get_short_name(),
				'author'    => $this->get_author(),
				'beta'      => false,
			]
		);

		$this->log->notice( sprintf( '%s plugin updater initialised', $this->get_name() ) );
	}
}

/* Use the filter below to replace and extend our Bootstrap class if needed */
$name = 'Gravity PDF Bulk Generator';
$slug = 'gravity-pdf-bulk-generator';

$plugin = apply_filters( 'gfpdf_bulk_generator_initialise', new Bootstrap(
	$slug,
	$name,
	'Gravity PDF',
	GFPDF_PDF_BULK_GENERATOR_VERSION,
	GFPDF_PDF_BULK_GENERATOR_FILE,
	GPDFAPI::get_data_class(),
	GPDFAPI::get_options_class(),
	new Helper_Singleton(),
	new Helper_Logger( $slug, $name ),
	new Helper_Notices()
) );

$plugin->set_edd_download_id( '' );
$plugin->set_addon_documentation_slug( 'shop-plugin-bulk-generator-add-on' );
$plugin->init();

/* Use the action below to access our Bootstrap class, and any singletons saved in $plugin->singleton */
do_action( 'gfpdf_bulk_generator_bootrapped', $plugin );
