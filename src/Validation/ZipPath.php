<?php

namespace GFPDF\Plugins\BulkGenerator\Validation;

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
 * Class ZipPath
 *
 * @package GFPDF\Plugins\BulkGenerator\Validation
 */
class ZipPath {

	/**
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * ZipPath constructor.
	 *
	 * @param LoggerInterface $log
	 */
	public function __construct( LoggerInterface $log ) {
		$this->logger = $log;
	}

	/**
	 * @param $zip_path
	 *
	 * @return bool
	 *
	 * @since 1.0
	 */
	public function __invoke( $zip_path ) {
		$this->logger->notice( 'Begin validation of zip path', [ 'path' => $zip_path ] );

		/* Check for backslashes and fail */
		if ( strpos( $zip_path, '\\' ) !== false ) {
			$this->logger->warning( 'Validation: Path contained backslashes', [ 'path' => $zip_path ] );

			return false;
		}

		/* Verify no segments contain .. or . */
		foreach ( explode( '/', $zip_path ) as $segment ) {
			if ( in_array( $segment, [ '.', '..' ], true ) ) {
				$this->logger->warning( 'Validation: Path contained . or .. path navigators', [ 'path' => $zip_path ] );

				return false;
			}
		}

		return true;
	}
}

