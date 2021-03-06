<?php

namespace GFPDF\Plugins\BulkGenerator\MergeTags;

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
 * Class DateUpdated
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 *
 * @since 1.0
 */
class DateUpdated extends DateHandler {

	/**
	 * @var string
	 */
	protected $name = 'date_updated';
}
