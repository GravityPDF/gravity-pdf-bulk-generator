<?php

namespace GFPDF\Plugins\BulkGenerator\Validation;

use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use Psr\Log\LoggerInterface;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SessionId
 *
 * @package GFPDF\Plugins\BulkGenerator\Validation
 */
class SessionId {

	/**
	 * @var FilesystemHelper
	 */
	protected $filesystem;

	/**
	 * SessionId constructor.
	 *
	 * @param FilesystemHelper $filesystem
	 */
	public function __construct( FilesystemHelper $filesystem, LoggerInterface $log ) {
		$this->filesystem = $filesystem;
		$this->logger     = $log;
	}

	/**
	 * Check if the user-supplied ID matches the pattern we expect and the matching folder exists
	 *
	 * @param string $session_id
	 *
	 * @return bool
	 *
	 * @since 1.0
	 */
	public function __invoke( $session_id ) {
		if ( preg_match( '/^[a-zA-Z0-9]{32}$/', $session_id ) !== 1 ) {
			$this->logger->warning( 'Validation: session ID is not a 32 character alpha-numeric string', [ 'session' => $session_id ] );
			return false;
		}

		if ( ! $this->filesystem->has( $session_id ) ) {
			$this->logger->warning( 'Validation: cannot find session directory', [ 'session' => $session_id ] );
			return false;
		}

		return true;
	}
}
