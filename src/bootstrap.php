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
	 * @since 1.0
	 */
	public function init( $classes = [] ) {

		$data = GPDFAPI::get_data_class();

		$filesystem = $this->get_local_filesystem( $data->template_tmp_location . 'bulk-generator/' );
		$config     = new Config( $filesystem );

		/* Register our classes and pass back up to the parent initialiser */
		$api_classes = $this->register_api_endpoints(
			[
				new Register( $config, $filesystem ),
				new Create( $config, $filesystem ),
				new Download( $config, $filesystem ),
				new Entries(),
				new Zip( $config, $filesystem ),
			]
		);

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
			[]
		);

		if ( \GFForms::get_page() === 'entry_list' ) {
			$this->setup_bulk_generator();
		}

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

	/**
	 * Register the required assets to work
	 *
	 * @Internal Loaded on the Gravity Forms Entry List page in the WP Admin area by default
	 *
	 * @since    1.0
	 */
	public function setup_bulk_generator() {

		/* Get form and PDF info */
		$form_id = (int) rgget( 'id' );
		$pdfs    = \GPDFAPI::get_form_pdfs( $form_id );

		if ( is_wp_error( $pdfs ) ) {
			return;
		}

		/* Filter out non-active PDFs */
		$pdfs = array_filter(
			$pdfs,
			function( $pdf ) {
				return $pdf['active'] === true;
			}
		);

		if ( count( $pdfs ) === 0 ) {
			return;
		}

		/* Register our Bulk PDF Action */
		add_filter(
			'gform_entry_list_bulk_actions',
			function( $actions ) {
				$actions['download_pdf'] = esc_html__( 'Download PDF', 'gravity-pdf-bulk-generator' );

				return $actions;
			}
		);

		/* Load our assets */
		add_action(
			'admin_enqueue_scripts',
			function() use ( $form_id, $pdfs ) {

				$version = defined( 'WP_DEBUG' ) && WP_DEBUG === true ? time() : GFPDF_PDF_BULK_GENERATOR_VERSION;

				wp_enqueue_script(
					'gfpdf_bulk_generator',
					plugin_dir_url( GFPDF_PDF_BULK_GENERATOR_FILE ) . 'dist/bulk-generator.min.js',
					[],
					$version,
					true
				);

				wp_localize_script(
					'gfpdf_bulk_generator',
					'GPDF_BULK_GENERATOR',
					[
						'plugin_url' => plugin_dir_url( GFPDF_PDF_BULK_GENERATOR_FILE ),
						'admin_url'  => admin_url(),
						'rest_url'   => rest_url( ApiNamespace::V1 ),
						'nonce'      => wp_create_nonce( 'wp_rest' ),
						'form_id'    => $form_id,
						'pdfs'       => $pdfs,

						'language'   => [
							/* ListToggle */
							'label'                      => esc_html__( 'Label', 'gravityforms' ),

							/* Steps */
							'stepTitle'                  => esc_html__( 'PDF Bulk Download', 'gravity-pdf-bulk-generator' ),

							/* Step 1 */
							'stepActivePdfEmpty'         => esc_html__( 'Please select at least one PDF to generate for the entries.', 'gravity-pdf-bulk-generator' ),
							'stepCloseDialog'            => esc_html__( 'Close dialog', 'default' ),
							'stepBuild'                  => esc_html__( 'Build', 'gravity-pdf-bulk-generator' ),

							'stepSelectPdfs'             => esc_html__( 'Select PDFs', 'gravity-pdf-bulk-generator' ),
							'stepSelectPdfsDesc'         => esc_html__( 'Specify the PDFs you would like to generate for the selected entries.', 'gravity-pdf-bulk-generator' ),
							'stepDirectoryStructure'     => esc_html__( 'Directory Structure', 'gravity-pdf-bulk-generator' ),
							'stepDirectoryStructureDesc' => esc_html__( 'Specify the directory structure to use for the PDFs of the selected entries. Form merge tags are supported.', 'gravity-pdf-bulk-generator' ),
							'stepCommonTagsLabel'        => esc_html__( 'Common tags:', 'gravity-pdf-bulk-generator' ),

							/* Step 2 */
							'stepBuildingPdfs'           => esc_html__( 'Building your PDFs', 'gravity-pdf-bulk-generator' ),
							'stepDoNotNavigateAway'      => esc_html__( '(Please do not navigate away from this page)', 'gravity-pdf-bulk-generator' ),

							/* Step 3 */
							'stepDownloadTitle'          => esc_html__( 'Your PDFs are ready and the download will begin shortly.', 'gravity-pdf-bulk-generator' ),

							/* translators: 1: Open Anchor Tag 2: Close Anchor Tag */
							'stepDownloadDescription'    => esc_html__( 'The zip file contains the PDFs for your selected entries. %1$sClick here if the download does not start automatically%2$s.', 'gravity-pdf-bulk-generator' ),

							/* Cancel Button */
							'cancelLabel'                => esc_html__( 'Cancel', 'default' ),
							'cancelButtonConfirmation'   => esc_html__( 'Are you sure you want to cancel the download?', 'gravity-pdf-bulk-generator' ),

							/* Fatal Error */
							'fatalErrorTitle'            => esc_html__( 'Oops...', 'gravity-pdf-bulk-generator' ),
							'fatalErrorDescription'      => esc_html__( 'An error occurred which prevented the Bulk Generator from completing!', 'gravity-pdf-bulk-generator' ),

							/* translators: 1/2: Open Anchor Tag 3: Close Anchor Tag */
							'fatalErrorInformation'      => esc_html__( 'Reload the page and try again. If the issue persists, %1$senable Logging%3$s, re-run the generator and then %2$sfill out a support ticket%3$s. One of our tech boffins will be happy to assist.', 'gravity-pdf-bulk-generator' ),
							'fatalErrorImageAlt'         => esc_html__( 'Tech boffins at work.', 'gravity-pdf-bulk-generator' ),

							/* Log Messages */
							'successTitle'               => esc_html__( 'Success', 'gravityforms' ),
							'errorTitle'                 => esc_html__( 'Error', 'gravityforms' ),
							'warningTitle'               => esc_html__( 'Warning', 'gravityforms' ),

							/* translators: 1: PDF Name 2: PDF ID 3: Entry ID */
							'successMessage'             => esc_html__( 'Generated %1$s (#%2$s) for Entry #%3$s', 'gravity-pdf-bulk-generator' ),

							/* translators: 1: PDF Name 2: PDF ID 3: Entry ID */
							'errorMessage'               => esc_html__( 'Failed generating %1$s (#%2$s) for Entry #%3$s', 'gravity-pdf-bulk-generator' ),

							/* translators: 1: PDF Name 2: PDF ID 3: Entry ID */
							'skippedMessageInvalidId'    => esc_html__( 'Invalid PDF ID: Skipped %1$s (#%2$s) for Entry #%3$s', 'gravity-pdf-bulk-generator' ),

							/* translators: 1: PDF Name 2: PDF ID 3: Entry ID */
							'skippedMessageInactivePdf'  => esc_html__( 'Inactive PDF: Skipped %1$s (#%2$s) for Entry #%3$s', 'gravity-pdf-bulk-generator' ),

							/* translators: 1: PDF Name 2: PDF ID 3: Entry ID */
							'skippedMessageConditionalLogic' => esc_html__( 'Conditional Logic Check: Skipped %1$s (#%2$s) for Entry #%3$s', 'gravity-pdf-bulk-generator' ),

							/* Tag Cloud */
							'tagYear'                    => esc_html__( 'Year', 'default' ),
							'tagMonth'                   => esc_html__( 'Month', 'default' ),
							'tagDay'                     => esc_html__( 'Day', 'default' ),
							'tagHour'                    => esc_html__( 'Hour', 'default' ),
							'tagMinute'                  => esc_html__( 'Minute', 'default' ),
							'tagPaymentStatus'           => esc_html__( 'Payment Status', 'gravityforms' ),
							'tagEntryId'                 => esc_html__( 'Entry ID', 'gravityforms' ),
							'tagUserLogin'               => esc_html__( 'User Login Name', 'default' ),
							'tagUserEmail'               => esc_html__( 'User Email', 'default' ),
							'tagUserDisplayName'         => esc_html__( 'User Display Name', 'default' ),
						],
					]
				);

				wp_enqueue_style(
					'gfpdf_bulk_generator',
					plugin_dir_url( GFPDF_PDF_BULK_GENERATOR_FILE ) . 'dist/bulk-generator.min.css',
					[],
					$version
				);
			}
		);
	}

	/**
	 * Check the plugin's license is active and initialise the EDD Updater
	 *
	 * @since 1.0
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

		/* translators: %s: The plugin name */
		$this->log->notice( sprintf( '%s plugin updater initialised', $this->get_name() ) );
	}
}

/* Use the filter below to replace and extend our Bootstrap class if needed */
$name = 'Gravity PDF Bulk Generator';
$slug = 'gravity-pdf-bulk-generator';

$plugin = apply_filters(
	'gfpdf_bulk_generator_initialise',
	new Bootstrap(
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
	)
);

$plugin->set_edd_download_id( '40028' );
$plugin->set_addon_documentation_slug( 'shop-plugin-bulk-generator-add-on' );
$plugin->init();

/* Use the action below to access our Bootstrap class, and any singletons saved in $plugin->singleton */
do_action( 'gfpdf_bulk_generator_bootstrapped', $plugin );
