<?php

namespace GFPDF\Plugins\BulkGenerator\MergeTags;

require_once __DIR__ . '/DefaultDateTests.php';

/**
 * Class PaymentDateTest
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 */
class PaymentDateTest extends DefaultDateTests {
	protected $mergetag = 'payment_date';
}
