<?php

namespace GFPDF\Plugins\BulkGenerator;

use GFPDF\Helper\Helper_Abstract_Addon;
use GFPDF\Helper\Helper_Logger;
use GFPDF\Helper\Helper_Notices;
use GFPDF\Helper\Helper_Singleton;
use GFPDF\Helper\Licensing\EDD_SL_Plugin_Updater;
use GPDFAPI;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2019, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
    This file is part of Gravity PDFBulk Generator.

    Copyright (C) 2019, Blue Liquid Designs

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

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
		$classes = array_merge( $classes, [

		] );

		$this->move_to_class();

		/* Run the setup */
		parent::init( $classes );
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
					'form_id' => $form_id,
					'pdfs'    => $pdfs,
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
