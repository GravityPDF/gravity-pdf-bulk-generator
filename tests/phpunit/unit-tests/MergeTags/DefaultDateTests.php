<?php

namespace GFPDF\Plugins\BulkGenerator\MergeTags;

use GFCommon;

/**
 * Class DefaultDateTests
 *
 * @package GFPDF\Plugins\BulkGenerator\MergeTags
 */
abstract class DefaultDateTests extends \WP_UnitTestCase {

	protected $mergetag;
	protected $form;
	protected $entry;

	protected function create_entry() {
		$form_id = \GFAPI::add_form( json_decode( file_get_contents( __DIR__ . '/../../json/sample.json' ), true ) );

		$entry_id = \GFAPI::add_entry(
			[
				'form_id'      => $form_id,
				'date_created' => '2020-02-01 01:30:00',
				'date_updated' => '2020-02-28 11:10:00',
				'payment_date' => '2020-04-20 15:45:00',
				'currency'     => 'USD',
				'1'            => 'Sample',
			]
		);

		return \GFAPI::get_entry( $entry_id );
	}

	public function test_process() {
		$this->entry = $this->create_entry();
		$this->form  = \GFAPI::get_form( $this->entry['form_id'] );

		$date             = $this->entry[ $this->mergetag ];
		$entry_gmt_time   = mysql2date( 'G', $date );
		$entry_local_time = GFCommon::get_local_timestamp( $entry_gmt_time );
		$time_now         = time();

		/* Make sure the :raw option overrides all other options */
		$this->assertEquals( $date, $this->r( "{{$this->mergetag}:raw}" ) );
		$this->assertEquals( $date, $this->r( "{{$this->mergetag}:raw:timestamp}" ) );
		$this->assertEquals( $date, $this->r( "{{$this->mergetag}:raw:time}" ) );
		$this->assertEquals( $date, $this->r( "{{$this->mergetag}:raw:human}" ) );
		$this->assertEquals( $date, $this->r( "{{$this->mergetag}:raw:format:example}" ) );

		/* Make sure the :timestamp option overrides all options (except raw) */
		$this->assertEquals( $date, $this->r( "{{$this->mergetag}:timestamp:raw}" ) );
		$this->assertEquals( $entry_local_time, $this->r( "{{$this->mergetag}:timestamp}" ) );
		$this->assertEquals( $entry_local_time, $this->r( "{{$this->mergetag}:timestamp:time}" ) );
		$this->assertEquals( $entry_local_time, $this->r( "{{$this->mergetag}:timestamp:human}" ) );
		$this->assertEquals( $entry_local_time, $this->r( "{{$this->mergetag}:timestamp:format:example}" ) );

		$this->assertEquals( GFCommon::format_date( $date, false, '', false ), $this->r( "{{$this->mergetag}}" ) ); /* blog date format */
		$this->assertEquals( GFCommon::format_date( $date, true, '', false ), $this->r( "{{$this->mergetag}:human}" ) ); /* blog date format */
		$this->assertEquals( GFCommon::format_date( $date, false, '', true ), $this->r( "{{$this->mergetag}:time}" ) ); /* blog "date at time" format*/

		/* Diff tests */
		$this->assertEquals( sprintf( '%s ago', human_time_diff( $entry_gmt_time, $time_now ) ), $this->r( "{{$this->mergetag}:diff}" ) );
		$this->assertEquals( sprintf( '%s is so long ago', human_time_diff( $entry_gmt_time, $time_now ) ), $this->r( "{{$this->mergetag}:diff:format:%s is so long ago}" ) );

		/* Relative diff times should not process other modifiers */
		$this->assertEquals( sprintf( '%s ago', human_time_diff( $entry_gmt_time, $time_now ) ), $this->r( "{{$this->mergetag}:diff:time}" ) );
		$this->assertEquals( sprintf( '%s ago', human_time_diff( $entry_gmt_time, $time_now ) ), $this->r( "{{$this->mergetag}:diff:human}" ) );
		$this->assertEquals( sprintf( '%s ago', human_time_diff( $entry_gmt_time, $time_now ) ), $this->r( "{{$this->mergetag}:human:diff}" ) );

		/* Custom date formats */
		$this->assertEquals( GFCommon::format_date( $date, false, 'mdy', false ), $this->r( "{{$this->mergetag}:format:mdy}" ) );
		$this->assertEquals( GFCommon::format_date( $date, true, 'm/d/Y', false ), $this->r( "{{$this->mergetag}:human:format:m/d/Y}" ) );
		$this->assertEquals( GFCommon::format_date( $date, false, 'd', true ), $this->r( "{{$this->mergetag}:time:format:d}" ) );
		$this->assertEquals( GFCommon::format_date( $date, true, 'mdy', true ), $this->r( "{{$this->mergetag}:human:time:format:mdy}" ) );
		$this->assertEquals( date_i18n( 'm/d/Y', $entry_local_time, true ), $this->r( "{{$this->mergetag}:format:m/d/Y}" ) );
		$this->assertEquals( date_i18n( 'm/d/Y\ \w\i\t\h\ \t\i\m\e\ h:i:s', $entry_local_time, true ), $this->r( "{{$this->mergetag}:format:m/d/Y\ \w\i\\t\h\ \\t\i\m\\e\ h\:i\:s}" ) );
	}

	protected function r( $tag ) {
		return \GFCommon::replace_variables( $tag, $this->form, $this->entry );
	}
}
