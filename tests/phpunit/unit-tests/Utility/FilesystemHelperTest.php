<?php

namespace GFPDF\Plugins\BulkGenerator\Utility;

use GFPDF\Plugins\BulkGenerator\EnhancedMemoryAdapter;
use League\Flysystem\Filesystem;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/**
 * Class FilesystemHelperTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Validation
 */
class FilesystemHelperTest extends \WP_UnitTestCase {

	/**
	 * @var FilesystemHelper
	 */
	protected $class;

	/**
	 * @var Filesystem
	 */
	protected $filesystem;

	public function setUp() {
		$this->filesystem = new Filesystem( new EnhancedMemoryAdapter() );
		$this->class      = new FilesystemHelper( $this->filesystem );

		parent::setUp();
	}

	protected function create_entry() {
		$form_id = \GFAPI::add_form( json_decode( file_get_contents( __DIR__ . '/../../json/sample.json' ), true ) );

		$entry_id = \GFAPI::add_entry(
			[
				'form_id'        => $form_id,
				'created_by'     => $this->factory->user->create(),
				'date_created'   => '2020-02-01 01:30:00',
				'payment_status' => 'Paid',
				'currency'       => 'USD',
				'1'              => 'Sample',
			]
		);

		return \GFAPI::get_entry( $entry_id );
	}

	public function test_overload() {
		$file = 'sample.txt';

		$this->class->put( $file, 'test' );
		$this->assertTrue( $this->class->has( $file ) );

		$this->class->delete( $file );
		$this->assertFalse( $this->class->has( $file ) );
	}

	public function test_overload_with_prefix() {
		$file = 'sample.txt';

		$this->class->set_prefix( '123456' );
		$this->class->put( $file, 'test' );
		$this->assertTrue( $this->class->has( $file ) );

		$this->class->set_prefix( '' );
		$this->assertFalse( $this->class->has( $file ) );
		$this->assertTrue( $this->class->has( '123456/' . $file ) );

		$this->class->set_prefix( '123456' );
		$this->class->delete( $file );
		$this->assertFalse( $this->class->has( $file ) );
	}

	public function test_get_filesystem() {
		return $this->assertInstanceOf( Filesystem::class, $this->class->get_filesystem() );
	}

	public function test_get_config_path() {
		$this->assertEquals( 'config.json', $this->class->get_config_path() );
	}

	public function test_get_zip_path() {
		$this->assertEquals( 'archive.zip', $this->class->get_zip_path() );
	}

	public function test_get_tmp_basepath() {
		$this->assertEquals( 'tmp/', $this->class->get_tmp_basepath() );
	}

	public function test_get_tmp_pdf_path() {
		$entry = $this->create_entry();
		$user  = get_userdata( $entry['created_by'] );

		$this->assertSame( 'tmp/', $this->class->get_tmp_pdf_path( '/', $entry ) );
		$this->assertSame( 'tmp/Sample/', $this->class->get_tmp_pdf_path( '/{Text:1}/', $entry ) );
		$this->assertSame( 'tmp/2020/', $this->class->get_tmp_pdf_path( '/{date_created:format:Y}/', $entry ) );
		$this->assertSame( 'tmp/02/', $this->class->get_tmp_pdf_path( '/{date_created:format:m}/', $entry ) );
		$this->assertSame( 'tmp/01/', $this->class->get_tmp_pdf_path( '/{date_created:format:d}/', $entry ) );

		$raw_path = '/{:1}/{date_created:format:Y}/{created_by:user_login}/{entry:payment_status}';
		$this->assertSame( 'tmp/Sample/2020/' . $user->user_login . '/Paid/', $this->class->get_tmp_pdf_path( $raw_path, $entry ) );
	}

	public function test_get_tmp_pdf_path_validation() {
		$entry = $this->create_entry();

		$this->assertSame( 'tmp/01_02_2020/', $this->class->get_tmp_pdf_path( '/{date_created:format:d/m/Y}/', $entry ) );
		$this->assertSame( 'tmp/', $this->class->get_tmp_pdf_path( '/{d/ate_cr\eated:format:Y}/', $entry ) );
		$this->assertSame( 'tmp/Sample/', $this->class->get_tmp_pdf_path( '/{Label/Here:1}', $entry ) );
		$this->assertSame( 'tmp/places/', $this->class->get_tmp_pdf_path( '/{d/ate_cr\eated:format:Y}/.././places//', $entry ) );
	}

	public function test_prefixes() {
		$this->class->set_prefix( '123456' );
		$this->assertSame( '123456/', $this->class->get_prefix() );
		$this->class->set_prefix( '' );
		$this->assertSame( '', $this->class->get_prefix() );
	}
}
