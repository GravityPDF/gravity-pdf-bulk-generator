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
use GFPDF\Plugins\BulkGenerator\Api\Generator\Zip;
use GFPDF\Plugins\BulkGenerator\Api\Search\Entries;
use GFPDF\Plugins\BulkGenerator\MergeTags\CreatedBy;
use GFPDF\Plugins\BulkGenerator\MergeTags\DateCreated;
use GFPDF\Plugins\BulkGenerator\MergeTags\DateUpdated;
use GFPDF\Plugins\BulkGenerator\MergeTags\PaymentDate;
use GFPDF\Plugins\BulkGenerator\Model\Config;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use GPDFAPI;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;

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

		$data = GPDFAPI::get_data_class();

		$filesystem = $this->get_local_filesystem( $data->template_tmp_location . 'bulk-generator/' );
		$config     = new Config( $filesystem );

		/* Register our classes and pass back up to the parent initialiser */
		$api_classes = $this->register_api_endpoints( [
			new Register( $config, $filesystem ),
			new Create( $config, $filesystem ),
			new Download( $config, $filesystem ),
			new Entries(),
			new Zip( $config, $filesystem ),
		] );

		$mergetag_classes = [];
		if ( ! defined( 'GV_PLUGIN_VERSION' ) ) {
			$mergetag_classes = [
				new DateCreated(),
				new DateUpdated(),
				new PaymentDate(),
				new CreatedBy(),
			];
		}

		$classes = array_merge(
			$classes,
			$api_classes,
			$mergetag_classes,
			[

			]
		);

		$this->move_to_class();

		/* Run the setup */
		parent::init( $classes );
	}

	/**
	 * Correctly initialise our local Filesystem with folder/file permissions matching WordPress functionality
	 *
	 * @param string $path
	 *
	 * @return FilesystemHelper
	 *
	 * @since 1.0
	 */
	protected function get_local_filesystem( $path ) {
		$stat         = @stat( $path );
		$folder_perms = $stat ? $stat['mode'] & 0007777 : 0777;
		$file_perms   = $folder_perms & 0000666;

		return new FilesystemHelper(
			new Filesystem(
				new Local(
					$path,
					LOCK_EX,
					Local::DISALLOW_LINKS,
					[
						'file' => [ 'public' => $file_perms ],
						'dir'  => [ 'public' => $folder_perms ],
					]
				)
			)
		);
	}

	/**
	 * Automatically register our endpoint methods on the `rest_api_init` hook
	 *
	 * @param array $classes
	 *
	 * @return array
	 *
	 * @since 1.0
	 */
	protected function register_api_endpoints( $classes ) {
		foreach ( $classes as $class ) {
			if ( $class instanceof ApiEndpointRegistration ) {
				add_action( 'rest_api_init', [ $class, 'endpoint' ] );
			}
		}

		return $classes;
	}

	/* @TODO */
	public function move_to_class() {
		if ( \GFForms::get_page() === 'entry_list' ) {

			$form_id = (int) rgget( 'id' );
			$pdfs    = \GPDFAPI::get_form_pdfs( $form_id );

			if ( is_wp_error( $pdfs ) ) {
				return;
			}

			$pdfs = array_filter( $pdfs, function( $pdf ) {
				return $pdf['active'] === true;
			} );

			if ( count( $pdfs ) === 0 ) {
				return;
			}

			add_filter( 'gform_entry_list_bulk_actions', function( $actions ) {
				$actions['download_pdf'] = esc_html__( 'Download PDF', 'gravity-pdf-bulk-generator' );

				return $actions;
			} );

			add_action( 'admin_enqueue_scripts', function() use ( $form_id, $pdfs ) {
				wp_enqueue_script(
					'gfpdf_bulk_generator',
					plugin_dir_url( GFPDF_PDF_BULK_GENERATOR_FILE ) . 'dist/bulk-generator.min.js',
					[],
					time(),
					true
				);

				wp_localize_script( 'gfpdf_bulk_generator', 'GPDF_BULK_GENERATOR', [
					'rest_url' => rest_url( ApiNamespace::V1 ),
					'nonce'    => wp_create_nonce( 'wp_rest' ),
					'form_id'  => $form_id,
					'pdfs'     => $pdfs,
				] );

				wp_enqueue_style(
					'gfpdf_bulk_generator',
					plugin_dir_url( GFPDF_PDF_BULK_GENERATOR_FILE ) . 'dist/bulk-generator.min.css',
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
