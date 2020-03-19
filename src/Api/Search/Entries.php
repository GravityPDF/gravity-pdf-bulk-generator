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

/**
 * Class Entries
 *
 * @package GFPDF\Plugins\BulkGenerator\Api\Search
 */
class Entries implements ApiEndpointRegistration {

	/**
	 * Register the REST API Endpoints
	 *
	 * @since 1.0
	 */
	public function endpoint() {
		register_rest_route(
			ApiNamespace::V1,
			'/search/(?P<form_id>[0-9]+)/entries',
			[
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'response' ],

				'permission_callback' => function() {
					$gform = \GPDFAPI::get_form_class();

					return $gform->has_capability( 'gravityforms_view_entries' );
				},

				'args'                => [
					'form_id'  => [
						'required'    => true,
						'type'        => 'integer',
						'description' => __( 'The Gravity Forms ID to limit our search to', 'gravity-pdf-bulk-generator' ),
					],

					's'        => [
						'required'    => false,
						'type'        => 'string',
						'description' => __( 'A search parameter', 'gravity-pdf-bulk-generator' ),
					],

					'field_id' => [
						'required'    => false,
						'type'        => 'string',
						'description' => __( 'What the search parameter will focus on', 'gravity-pdf-bulk-generator' ),
					],

					'operator' => [
						'required'    => false,
						'type'        => 'string',
						'description' => __( 'The search parameter comparison type', 'gravity-pdf-bulk-generator' ),
					],

					'order'    => [
						'required'    => false,
						'type'        => 'string',
						'description' => __( 'Whether ASC or DESC order', 'gravity-pdf-bulk-generator' ),
					],

					'orderby'  => [
						'required'    => false,
						'type'        => 'string',
						'description' => __( 'The field ID to order against', 'gravity-pdf-bulk-generator' ),
					],

					'filter'   => [
						'required'    => false,
						'type'        => 'string',
						'description' => __( 'A filter parameter', 'gravity-pdf-bulk-generator' ),
					],
				],
			]
		);
	}

	/**
	 * Get all entry IDs that match the search params included in the request
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return array|\WP_Error
	 *
	 * @since 1.0
	 */
	public function response( \WP_REST_Request $request ) {

		/*
		 * To prevent reinventing the wheel, we will tap into some required search argument prep code.
		 * This will require overriding super globals to mimic the Entry List page in Gravity Forms,
		 * and use the Reflection API to set and change a few items. Because of the complexity of the
		 * search / filter / order code, this "raw" access method is worth it.
		 */
		require_once( \GFCommon::get_base_path() . '/entry_list.php' );

		try {
			/* Mimics an Entry List request */
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
			$paging          = [
				'offset'    => 0,
				'page_size' => true,
			];
			$sorting         = $this->get_sorting_query( $entry_list );

			/* Do the query and return just the Entry IDs (no data) */
			$q = new \GF_Query( $_GET['form_id'], $search_criteria, $sorting, $paging );

			$gf_query_reflection     = new \ReflectionObject( $q );
			$query_method_reflection = $gf_query_reflection->getMethod( 'query' );
			$query_method_reflection->setAccessible( true );

			$entry_ids = $query_method_reflection->invoke( $q );

			return array_merge( ...$entry_ids );
		} catch ( \Exception $e ) {
			return new \WP_Error( $e->getMessage(), '', [ 'status' => 500 ] );
		}
	}

	/**
	 * Get the correct sort configuration settings
	 *
	 * @param \GF_Entry_List_Table $entry_list
	 *
	 * @return array Return configuration based on $entry_list and the superglobals
	 *
	 * @since 1.0
	 */
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
