<?php

namespace GFPDF\Plugins\BulkGenerator\Model;

use GFPDF\Plugins\BulkGenerator\Exceptions\ConfigCreateError;
use GFPDF\Plugins\BulkGenerator\Exceptions\ConfigNotLoaded;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use League\Flysystem\FileNotFoundException;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Config
 *
 * @package GFPDF\Plugins\BulkGenerator\Model
 */
class Config {

	/**
	 * @var FilesystemHelper
	 *
	 * @since 1.0
	 */
	protected $filesystem;

	/**
	 * Holds our array data settings
	 *
	 * @var array
	 *
	 * @since 1.0
	 */
	protected $settings = [];

	/**
	 * Config constructor.
	 *
	 * @param FilesystemHelper $filesystem
	 */
	public function __construct( FilesystemHelper $filesystem ) {
		$this->filesystem = $filesystem;
	}

	/**
	 * @param string $session_id
	 *
	 * @return Config
	 *
	 * @since 1.0
	 */
	public function set_session_id( $session_id ) {
		$this->filesystem->set_prefix( $session_id );

		return $this;
	}

	/**
	 * Load the config.json settings data and store in our model
	 *
	 * @return $this
	 *
	 * @throws ConfigNotLoaded
	 *
	 * @since 1.0
	 */
	public function fetch() {
		try {
			$config = json_decode( $this->filesystem->read( $this->filesystem->get_config_path() ), true );
			if ( ! is_array( $config ) || count( $config ) === 0 ) {
				throw new ConfigNotLoaded();
			}
		} catch ( FileNotFoundException $e ) {
			throw new ConfigNotLoaded();
		}

		$this->settings = $config;

		return $this;
	}

	/**
	 * Check if the config property exists
	 *
	 * @param string $key The key value to check
	 *
	 * @return bool
	 *
	 * @since 1.0
	 */
	public function has_setting( $key ) {
		return isset( $this->settings[ $key ] );
	}

	/**
	 * Retrieve config property value if it exists, otherwise return fallback value.
	 *
	 * @param mixed   $key      The key value that we're looking for
	 * @param boolean $fallback Assigned False depends on the usage of the method
	 *
	 * @return mixed
	 *
	 * @since 1.0
	 */
	public function get_setting( $key, $fallback = null ) {
		if ( $this->has_setting( $key ) ) {
			return $this->settings[ $key ];
		}

		return $fallback;
	}

	/**
	 * Return all config properties
	 *
	 * @return array
	 *
	 * @since 1.0
	 */
	public function get_all_settings() {
		return $this->settings;
	}

	/**
	 * Stores an individual config property into settings property
	 *
	 * @param string $key   The settings config key
	 * @param string $value The settings config value
	 *
	 * @return $this
	 *
	 * @since 1.0
	 */
	public function set_setting( $key, $value ) {
		$this->settings[ $key ] = $value;

		return $this;
	}

	/**
	 * Override all settings in the model with the $data value
	 *
	 * @param array $data The data value assigned to the settings config
	 *
	 * @return $this
	 *
	 * @since 1.0
	 */
	public function set_all_settings( $data ) {
		$this->settings = $data;

		return $this;
	}

	/**
	 * Store all settings in the model into the config.json file
	 *
	 * @return $this
	 *
	 * @throws ConfigCreateError
	 * @throws \League\Flysystem\FileExistsException
	 *
	 * @since 1.0
	 */
	public function save() {
		if ( ! $this->filesystem->write( $this->filesystem->get_config_path(), json_encode( $this->settings ) ) ) {
			throw new ConfigCreateError();
		}

		return $this;
	}

	/**
	 * @param int $length
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	public function generate_session_id( $length = 16 ) {
		try {
			$id = bin2hex( random_bytes( $length ) );
		} catch ( \Exception $e ) {
			$id = bin2hex( wp_generate_password( $length, false, false ) );
		}

		return $id;
	}
}
