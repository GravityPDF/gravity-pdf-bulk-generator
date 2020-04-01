/* Dependencies */
import { retry, takeLatest, put } from 'redux-saga/effects'

/* Redux Action Types */
import {
  GET_SELECTED_ENTRY_IDS,
  GET_SELECTED_ENTRY_IDS_SUCCESS,
  GET_SELECTED_ENTRY_IDS_FAILED
} from '../actionTypes/form'

/* APIs */
import { apiRequestAllEntryIds } from '../api/form'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

export function* getSelectedEntryIds(payload) {
  const { retryInterval, delayInterval } = payload

  try {
    const response = yield retry(retryInterval, delayInterval, apiRequestAllEntryIds, payload)

    if(!response.ok) {
      throw response
    }

    const responseBody = yield response.json()

    yield put({ type: GET_SELECTED_ENTRY_IDS_SUCCESS , payload: responseBody })
  } catch(error) {

    yield put({ type: GET_SELECTED_ENTRY_IDS_FAILED, payload: error.statusText })
  }
}

export function* watchGetSelectedEntryIds() {
  yield takeLatest(GET_SELECTED_ENTRY_IDS, getSelectedEntryIds)
}
