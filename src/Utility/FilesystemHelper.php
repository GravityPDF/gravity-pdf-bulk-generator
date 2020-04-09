<?php

namespace GFPDF\Plugins\BulkGenerator\Utility;

use League\Flysystem\Filesystem;

/**
 * Class FilesystemHelper
 *
 * @package GFPDF\Plugins\BulkGenerator\Utility
 *
 * @mixin Filesystem
 */
class FilesystemHelper {

	/**
	 * @var Filesystem
	 *
	 * @since 1.0
	 */
	protected $filesystem;

	/**
	 * Pre-define config file
	 *
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $config_filename = 'config.json';

	/**
	 * Generated zip file
	 *
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $zip_filename = 'archive.zip';

	/**
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $tmp_dirname = 'tmp/';

	/**
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $path_prefix = '';

	/**
	 * FilesystemHelper constructor.
	 *
	 * @param Filesystem $filesystem
	 */
	public function __construct( Filesystem $filesystem ) {
		$this->filesystem = $filesystem;
	}

	/**
	 * Proxy's requests to the filesystem
	 *
	 * @param string $method
	 * @param array  $arguments
	 *
	 * @return mixed
	 */
	public function __call( $method, $arguments ) {
		if ( ! method_exists( $this->get_filesystem(), $method ) ) {
			/* translators: %s is the name of a PHP class method (function) */
			throw new \BadMethodCallException( sprintf( 'Filesystem method "%s" does not exist', $method ) );
		}

		if ( isset( $arguments[0] ) && ! empty( $this->path_prefix ) ) {
			$arguments[0] = $this->get_prefix() . $arguments[0];
		}

		return call_user_func_array( [ $this->get_filesystem(), $method ], $arguments );
	}

	/**
	 * Return the current Flysystem Filesystem class
	 *
	 * @return Filesystem
	 *
	 * @since 1.0
	 */
	public function get_filesystem() {
		return $this->filesystem;
	}

	/**
	 * Return the full path to the config file
	 *
	 * @param int $prefix Configuration option to determine if the Filesystem path get_prefix should be returned
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function get_config_path() {
		return $this->config_filename;
	}

	/**
	 * Return the full path to the zip file
	 *
	 * @param int $prefix
	 *
	 * @return string Configuration option to determine if the Filesystem path get_prefix should be returned
	 *
	 * @since 1.0
	 */
	public function get_zip_path() {
		return $this->zip_filename;
	}

	/**
	 * Return the full path to the tmp directory
	 *
	 * @param int $prefix Configuration option to determine if the Filesystem path get_prefix should be returned
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function get_tmp_basepath() {
		return $this->tmp_dirname;
	}

	/**
	 * Return the full path to the PDF file in the tmp directory
	 *
	 * @param string $user_path The user-defined path the PDFs should be saved into in the zip file
	 * @param array  $entry     The Gravity Forms Entry array
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function get_tmp_pdf_path( $user_path, $entry ) {
		return $this->get_tmp_basepath() . $this->process_user_tags_in_path( $user_path, $entry );
	}

	/**
	 * Convert merge tags in user path and sanitize
	 *
	 * @param string $user_path The user-defined path the PDFs should be saved into in the zip file
	 * @param array  $entry     The Gravity Forms Entry array
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function process_user_tags_in_path( $user_path, $entry ) {
		$misc  = \GPDFAPI::get_misc_class();
		$gform = \GPDFAPI::get_form_class();
		$form  = $gform->get_form( $entry['form_id'] );

		$user_path = array_filter( explode( '/', $user_path ) );
		foreach ( $user_path as &$segment ) {
			$segment = trim( $gform->process_tags( $segment, $form, $entry ) );
			$segment = $misc->strip_invalid_characters( $segment );
		}

		$user_path = implode( '/', array_filter( $user_path ) );

		return ! empty( $user_path ) ? trailingslashit( $user_path ) : '';
	}

	/**
	 * Get the path prefix
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function get_prefix() {
		return $this->path_prefix;
	}

	/**
	 * Set the path prefix
	 *
	 * @param string $prefix
	 *
	 * @since 1.0
	 */
	public function set_prefix( $prefix ) {
		$this->path_prefix = ! empty( $prefix ) ? trailingslashit( $prefix ) : '';
	}
}
