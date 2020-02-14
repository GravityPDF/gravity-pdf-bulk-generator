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

	const NO_PREFIX = 1;
	const ADD_PREFIX = 2;

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
			throw new \BadMethodCallException( sprintf( 'Filesystem method "%s" does not exist', $method ) );
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


	public function get_config_path( $prefix = self::NO_PREFIX ) {
		return $this->prefix( $prefix ) . $this->config_filename;
	}


	public function get_zip_path( $prefix = self::NO_PREFIX ) {
		return $this->prefix( $prefix ) . $this->zip_filename;
	}


	public function get_tmp_basepath( $prefix = self::NO_PREFIX ) {
		return $this->prefix( $prefix ) . $this->tmp_dirname;
	}

	/**
	 * @param string $user_path
	 * @param array  $entry
	 *
	 * @return string
	 */
	public function get_tmp_pdf_path( $user_path, $entry, $prefix = self::NO_PREFIX ) {
		return $this->get_tmp_basepath( $prefix ) . $this->process_user_tags_in_path( $user_path, $entry );
	}

	/**
	 * Convert merge tags in user path and sanitize
	 *
	 * @param string $user_path
	 * @param array  $entry
	 *
	 * @return string
	 *
	 * @TODO logging
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

		return trailingslashit( $user_path );
	}

	/**
	 * Determine if the path prefix should be returned
	 *
	 * @param int $prefix
	 *
	 * @return string
	 */
	protected function prefix( $prefix ) {
		switch ( $prefix ) {
			case self::NO_PREFIX:
				return '';
			break;

			case self::ADD_PREFIX:
				return $this->get_filesystem()->getAdapter()->getPathPrefix();
			break;
		}
	}

}