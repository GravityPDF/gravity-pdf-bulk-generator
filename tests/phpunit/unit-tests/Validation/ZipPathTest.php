<?php

namespace GFPDF\Plugins\BulkGenerator\Validation;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/**
 * Class ZipPathTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Validation
 */
class ZipPathTest extends \WP_UnitTestCase {

	/**
	 * @param $expected
	 * @param $path
	 *
	 * @dataProvider data_invoke
	 */
	public function test_invoke( $expected, $path ) {
		$object = new ZipPath( $GLOBALS['GFPDF_Test']->log );

		$this->assertSame( $expected, $object( $path ) );
	}

	/**
	 * @return array
	 */
	public function data_invoke() {
		return [
			0  => [ true, '/' ],
			1  => [ true, '/some/really/long/path' ],
			2  => [ true, 'folder/name' ],
			3  => [ true, '/0/123556/@8($!@*29' ],
			4  => [ false, '/soemthing\here\and\something/there' ],
			5  => [ false, '\\' ],
			6  => [ false, 'going\/places' ],
			7  => [ false, 'going\\\\' ],
			8  => [ false, '/./' ],
			9  => [ false, '/some/../really/long/path' ],
			10 => [ true, 'folder/name.jpg/test.test/fahiuf.fa.faj/' ],
			11 => [ false, './folder/name.jpg/' ],
			12 => [ false, './folder/../name.jpg/' ],
			13 => [ true, '/0/123556/@8(.$!@*29' ],
			14 => [ false, '/soemthing\here\and\something/there/..' ],
		];
	}
}
