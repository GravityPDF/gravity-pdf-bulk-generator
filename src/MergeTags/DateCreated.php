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
 * Class DateCreated
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 */
class DateCreated extends Date {
	protected $name = 'date_created';
}
