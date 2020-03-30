<?php

namespace GFPDF\Plugins\BulkGenerator\MergeTags;

/**
 * Class CreatedByTest
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 */
class CreatedByTest extends \WP_UnitTestCase {

	protected $user_id;

	protected function create_entry( $create_user = 1 ) {
		$form_id       = \GFAPI::add_form( json_decode( file_get_contents( __DIR__ . '/../../json/sample.json' ), true ) );
		$this->user_id = $this->factory->user->create();

		$entry_id = \GFAPI::add_entry(
			[
				'form_id'    => $form_id,
				'created_by' => $create_user ? $this->user_id : 0,
				'currency'   => 'USD',
				'1'          => 'Sample',
			]
		);

		return \GFAPI::get_entry( $entry_id );
	}

	public function test_process() {
		$entry = $this->create_entry();
		$form  = \GFAPI::get_form( $entry['form_id'] );
		$user  = get_userdata( $this->user_id );

		$this->assertEquals( $user->ID, \GFCommon::replace_variables( '{created_by:ID}', $form, $entry ) );
		$this->assertSame( implode( ', ', $user->roles ), \GFCommon::replace_variables( '{created_by:roles}', $form, $entry ) );
		$this->assertSame( $user->user_firstname, \GFCommon::replace_variables( '{created_by:first_name}', $form, $entry ) );
	}

	public function test_process_entry_with_no_user() {
		$entry = $this->create_entry( 0 );
		$form  = \GFAPI::get_form( $entry['form_id'] );

		$this->assertSame( '', \GFCommon::replace_variables( '{created_by:ID}', $form, $entry ) );
		$this->assertSame( '', \GFCommon::replace_variables( '{created_by:roles}', $form, $entry ) );
		$this->assertSame( '', \GFCommon::replace_variables( '{created_by:first_name}', $form, $entry ) );
	}
}
