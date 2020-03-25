<?php

namespace GFPDF\Plugins\BulkGenerator\Validation;

use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use League\Flysystem\Filesystem;
use League\Flysystem\Memory\MemoryAdapter;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/**
 * Class SessionIdTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Validation
 * @mixin \PHPUnit\Framework\TestCase
 */
class SessionIdTest extends \WP_UnitTestCase {

	/**
	 * @param $expected
	 * @param $path
	 * @param $create_dir
	 *
	 * @dataProvider data_invoke
	 */
	public function test_invoke( $expected, $path, $create_dir ) {

		$filesystem = $this->get_filesystem();
		if ( $create_dir ) {
			$filesystem->createDir( $path );
		}

		$object = new SessionId( $filesystem, $GLOBALS['GFPDF_Test']->log );

		$this->assertSame( $expected, $object( $path ) );
	}

	/**
	 * @return array
	 */
	public function data_invoke() {
		return [
			0  => [ false, '123456', false ],
			1  => [ false, '123456abcdef', false ],
			2  => [ false, '123456abcdefgABCDEFG', false ],
			3  => [ true, '123456abcdefABCDEF123456abcdefAB', true ],
			4  => [ false, '123456abcdefABCDEF123456abcdefAB123afawf', false ],
			5  => [ false, '!@#$%^abcdefABCDEF123456abcdefAB', false ],
			6  => [ false, '-20.30abcdefABCDEF123456abcdefAB', false ],
			7  => [ true, '0bdff6b1954ebce8c0eac7a3a8203a6c', true ],
			8  => [ false, '2e2663214143808c2603c6ea627f0b78', false ],
			9  => [ true, '964805bf8e8198ba0132e8d98a1b3b9a', true ],
			10 => [ true, 'eab89b039a7dcf720d59ef85c8c69db5', true ],
		];
	}

	/**
	 * @return FilesystemHelper
	 */
	protected function get_filesystem() {
		return new FilesystemHelper(
			new Filesystem(
				new MemoryAdapter()
			)
		);
	}
}
