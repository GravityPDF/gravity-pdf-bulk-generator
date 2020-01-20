<?php

namespace GFPDF\Plugins\BulkGenerator\Api\Search;

use GFPDF\Plugins\BulkGenerator\Api\ApiEndpointRegistration;
use GFPDF\Plugins\BulkGenerator\Api\ApiNamespace;

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Entries implements ApiEndpointRegistration {

	public function endpoint() {
		register_rest_route( ApiNamespace::V1, '/search/(?P<form_id>[0-9]+)/entries', [
			'methods'  => \WP_REST_Server::READABLE,
			'callback' => [ $this, 'response' ],

			'permission_callback' => function() {
				$gform = \GPDFAPI::get_form_class();

				/* @TODO - remove */
				return true;

				return $gform->has_capability( 'gravityforms_view_entries' );
			},

			'args' => [
				'form_id' => [
					'required'    => true,
					'type'        => 'integer',
					'description' => 'The Gravity Forms ID to limit our search to',
				],

				's' => [
					'required'    => false,
					'type'        => 'string',
					'description' => 'A search parameter',
				],

				'field_id' => [
					'required'    => false,
					'type'        => 'string',
					'description' => 'What the search parameter will focus on',
				],

				'operator' => [
					'required'    => false,
					'type'        => 'string',
					'description' => 'The search parameter comparison type',
				],

				'order' => [
					'required'    => false,
					'type'        => 'string',
					'description' => 'Whether ASC or DESC order',
				],

				'orderby' => [
					'required'    => false,
					'type'        => 'string',
					'description' => 'The field ID to order against',
				],

				'filter' => [
					'required'    => false,
					'type'        => 'string',
					'description' => 'A filter paramter',
				],
			],
		] );
	}

	public function response( \WP_REST_Request $request ) {

		/*
		 * To prevent reinventing the wheel, we will tap into some required search argument prep code.
		 * This will require overriding superglobals to mimic the Entry List page in Gravity Forms,
		 * and use the Reflection API to set and change a few items. Because of the complexity of the
		 * search / filter / order code, this "raw" access method is worth it.
		 */
		require_once( \GFCommon::get_base_path() . '/entry_list.php' );

		/* Mimick an Entry List request */
		$_GET = $request->get_params();

		/* Setup the Entry List Table object that will do the heavy lifting for us */
		$entry_list_reflection = new \ReflectionClass( '\GF_Entry_List_Table' );
		$entry_list            = $entry_list_reflection->newInstanceWithoutConstructor();
		$entry_list->filter    = $_GET['filter'];

		$form_property_reflection = $entry_list_reflection->getProperty( '_form' );
		$form_property_reflection->setAccessible( true );
		$form_property_reflection->setValue( $entry_list, \GFAPI::get_form( $_GET['form_id'] ) );

		/* Get the search query criteria */
		$search_criteria = $entry_list->get_search_criteria();
		$paging          = [ 'offset' => 0, 'page_size' => true ];
		$sorting         = $this->get_sorting_query( $entry_list );

		/* Do the query and return just the Entry IDs (no data) */
		$q = new \GF_Query( $_GET['form_id'], $search_criteria, $sorting, $paging );

		$gf_query_reflection     = new \ReflectionObject( $q );
		$query_method_reflection = $gf_query_reflection->getMethod( 'query' );
		$query_method_reflection->setAccessible( true );

		$entry_ids = $query_method_reflection->invoke( $q );

		return array_merge(...$entry_ids);
	}

	protected function get_sorting_query( $entry_list ) {
		$sort_field = $entry_list->get_orderby();
		if ( empty( $sort_field ) ) {
			return [];
		}

		$sort_direction  = $entry_list->get_order();
		$sort_field_meta = \GFAPI::get_field( $_GET['form_id'], $sort_field );

		if ( $sort_field_meta instanceof \GF_Field ) {
			$is_numeric = $sort_field_meta->get_input_type() == 'number';
		} else {
			$entry_meta = \GFFormsModel::get_entry_meta( $_GET['form_id'] );
			$is_numeric = rgars( $entry_meta, $sort_field . '/is_numeric' );
		}

		return [
			'key'        => $sort_field,
			'direction'  => $sort_direction,
			'is_numeric' => $is_numeric,
		];
	}
}
