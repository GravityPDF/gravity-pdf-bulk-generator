<?php

namespace GFPDF\Plugins\BulkGenerator\Model;

use GFPDF\Plugins\BulkGenerator\Exceptions\ConfigCreateError;
use GFPDF\Plugins\BulkGenerator\Exceptions\ConfigNotLoaded;

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
	 * The root path of the Bulk PDF Generator tmp directory
	 *
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $basepath;

	/**
	 * Holds our generated session id
	 *
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $session_id;

	/**
	 * Pre-define config file
	 *
	 * @var string
	 *
	 * @since 1.0
	 */
	protected $filename = 'config.json';

	/**
	 * Holds our array data settings
	 *
	 * @var array
	 *
	 * @since 1.0
	 */
	protected $settings = [];

	/**
	 * @param string $path
	 *
	 * @since 1.0
	 */
	public function __construct( $path ) {
		$this->basepath = $path;
	}

	/**
	 * Get the completed file path for the config.json file
	 *
	 * @return string
	 *
	 * @since 1.0
	 */
	protected function get_config_file_path() {
		return $this->basepath . $this->session_id . '/' . $this->filename;
	}

	/**
	 * Check if the config file exists on disk
	 *
	 * @return bool
	 *
	 * @since 1.0
	 */
	protected function does_config_exist() {
		return is_file( $this->get_config_file_path() );
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
		if ( ! $this->does_config_exist() ) {
			throw new ConfigNotLoaded();
		}

		$config = json_decode( file_get_contents( $this->get_config_file_path() ), true );
		if ( ! is_array( $config ) || count( $config ) === 0 ) {
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
	 * Save sesson ID in this model
	 *
	 * @param string $session_id The session ID generated in register process
	 *
	 * @return $this
	 *
	 * @since 1.0
	 */
	public function set_session_id( $session_id ) {
		$this->session_id = $session_id;

		return $this;
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
	 *
	 * @since 1.0
	 */
	public function save() {
		if ( ! file_put_contents( $this->get_config_file_path(), json_encode( $this->settings ) ) ) {
			throw new ConfigCreateError();
		}

		return $this;
	}
}
