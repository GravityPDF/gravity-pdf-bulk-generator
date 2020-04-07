/* Dependencies */
import { retry, takeLatest, put } from 'redux-saga/effects'
import { push } from 'connected-react-router'
/* Redux Action Types */
import { GET_SELECTED_ENTRY_IDS, GET_SELECTED_ENTRY_IDS_SUCCESS, PROCESS_CHECKBOX } from '../actionTypes/form'
import { TOGGLE_MODAL, FATAL_ERROR } from '../actionTypes/pdf'
/* APIs */
import { apiRequestAllEntryIds } from '../api/form'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Call our API and process the response based on requested filter data. If we don't get a valid response,
 * a fatal error will be triggered.
 *
 * @param payload
 *
 * @since 1.0
 */
export function * getSelectedEntryIds (payload) {
  try {
    const response = yield retry(3, 500, apiRequestAllEntryIds, payload)

    if (!response.ok) {
      throw response
    }

    const responseBody = yield response.json()

    yield put({ type: GET_SELECTED_ENTRY_IDS_SUCCESS, payload: responseBody })
  } catch (error) {
    yield put({ type: FATAL_ERROR })
  }
}

/**
 * Watch for the selected entry IDs event and calls the function to handle it
 *
 * @since 1.0
 */
export function * watchGetSelectedEntryIds () {
  yield takeLatest(GET_SELECTED_ENTRY_IDS, getSelectedEntryIds)
}

/**
 * Handle the process checkbox logic
 *
 * @since 1.0
 */
export function * processCheckbox () {
  /* Show modal Step1 */
  yield put(push('/step/1'))

  yield put({ type: TOGGLE_MODAL })
}

/**
 * Watch for process checkbox event and calls the function to handle it
 *
 * @since 1.0
 */
export function * watcherProcessCheckbox () {
  yield takeLatest(PROCESS_CHECKBOX, processCheckbox)
}
