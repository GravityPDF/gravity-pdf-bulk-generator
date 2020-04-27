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
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $base_prefix = '';

	/**
	 * FilesystemHelper constructor.
	 *
	 * @param Filesystem $filesystem
	 * @param string $base_prefix
	 */
	public function __construct( Filesystem $filesystem, $base_prefix = '' ) {
		$this->filesystem  = $filesystem;
		$this->base_prefix = $base_prefix;
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
		$misc      = \GPDFAPI::get_misc_class();
		$gform     = \GPDFAPI::get_form_class();
		$form      = $gform->get_form( $entry['form_id'] );
		$mergetags = [];

		if ( preg_match_all( '/({.+?})/', $user_path, $mergetags ) ) {
			foreach ( $mergetags[0] as $tag ) {
				$segment = $gform->process_tags( $tag, $form, $entry );
				$segment = preg_replace( '({.+?})', '', $segment );
				$segment = $misc->strip_invalid_characters( $segment );
				if ( $tag !== $segment ) {
					$user_path = str_replace( $tag, $segment, $user_path );
				}
			}
		}

		/* Strip out any bad paths the merge tags might have been converted into */
		$user_path = str_replace( [ '/./', '/../', '//' ], '/', $user_path );
		$user_path = $user_path[0] === '/' ? substr( $user_path, 1 ) : $user_path;

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
	 * Get the base path prefix
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function get_base_prefix() {
		return $this->base_prefix;
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
