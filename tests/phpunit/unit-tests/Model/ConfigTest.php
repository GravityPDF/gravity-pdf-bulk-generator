<?php

namespace GFPDF\Plugins\BulkGenerator\Model;

use GFPDF\Plugins\BulkGenerator\EnhancedMemoryAdapter;
use GFPDF\Plugins\BulkGenerator\Utility\FilesystemHelper;
use League\Flysystem\Filesystem;

/**
 * Class ConfigTest
 *
 * @package GFPDF\Plugins\BulkGenerator\Validation
 *
 * @mixin \PHPUnit\Framework\TestCase
 */
class ConfigTest extends \WP_UnitTestCase {

	const SESSION_ID = '0bdff6b1954ebce8c0eac7a3a8203123';

	/**
	 * @var Config
	 */
	protected $config;

	/**
	 * @var FilesystemHelper
	 */
	protected $filesystem;

	/**
	 * @var FilesystemHelper
	 */
	public function setUp() {
		$this->filesystem = new FilesystemHelper( new Filesystem( new EnhancedMemoryAdapter() ) );

		$this->config = new Config( $this->filesystem );
		$this->config->set_session_id( self::SESSION_ID );

		parent::setUp();
	}

	public function test_save_and_fetch() {
		$settings = [
			'key1' => 'value1',
			'key2' => 'value2',
		];

		/* Save the test settings */
		$this->assertEmpty( $this->config->get_all_settings() );
		$this->config->set_all_settings( $settings )
		             ->save();

		/* Load the test settings */
		$config = new Config ( $this->filesystem );
		$config->set_session_id( self::SESSION_ID )
		       ->fetch();

		$this->assertSame( $settings, $config->get_all_settings() );
	}

	/**
	 * @expectedException GFPDF\Plugins\BulkGenerator\Exceptions\ConfigNotLoaded
	 */
	public function test_fetch_exception() {
		$this->config->fetch();
	}

	public function test_has_setting() {
		$this->assertFalse( $this->config->has_setting( 'sample' ) );
		$this->config->set_setting( 'sample', 'yes' );
		$this->assertTrue( $this->config->has_setting( 'sample' ) );
	}

	public function test_get_setting() {
		$this->assertNull( $this->config->get_setting( 'sample' ) );
		$this->assertTrue( $this->config->get_setting( 'sample', true ) );
		$this->config->set_setting( 'sample', 'yes' );
		$this->assertSame( 'yes', $this->config->get_setting( 'sample', true ) );
	}

	public function test_generate_session_id() {
		$this->assertRegExp( '/^([A-Za-z0-9]{32})$/', $this->config->generate_session_id() );
	}
}
