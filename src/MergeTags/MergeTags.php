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
 * Class MergeTags
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 */
class MergeTags {
	const REGEX = '/{%1$s:?(.*?)(?:\s)?}/ism';
}
