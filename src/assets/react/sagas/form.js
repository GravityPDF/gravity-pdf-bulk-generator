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
 * Worker saga getSelectedEntryIds
 *
 * @param payload
 *
 * @since 1.0
 */
export function* getSelectedEntryIds(payload) {
  /**
   * Call fetch API 3x
   *
   * In case of failure will try to make another call after delay milliseconds
   */
  try {
    const response = yield retry(3, 500, apiRequestAllEntryIds, payload)

    if(!response.ok) {
      throw response
    }

    const responseBody = yield response.json()

    yield put({ type: GET_SELECTED_ENTRY_IDS_SUCCESS , payload: responseBody })
  } catch(error) {
    yield put({ type: FATAL_ERROR })
  }
}

/**
 * Watcher saga watchGetSelectedEntryIds
 *
 * @since 1.0
 */
export function* watchGetSelectedEntryIds() {
  yield takeLatest(GET_SELECTED_ENTRY_IDS, getSelectedEntryIds)
}

export function* processCheckbox() {
  yield put(push('/step/1'))
  yield put({ type: TOGGLE_MODAL })
}

export function * watcherProcessCheckbox() {
  yield takeLatest(PROCESS_CHECKBOX, processCheckbox)
}
