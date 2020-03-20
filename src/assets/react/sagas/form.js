/* Dependencies */
import { retry, takeLatest, put } from 'redux-saga/effects'

/* Action Types */
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
  try {
    const result = yield retry(3, 3000, apiRequestAllEntryIds, payload)

    yield put({ type: GET_SELECTED_ENTRY_IDS_SUCCESS , payload: result })
  } catch(error) {
    yield put({ type: GET_SELECTED_ENTRY_IDS_FAILED, payload: 'Error occured. Something went wrong..' })
  }
}

export function* watchGetSelectedEntryIds() {
  yield takeLatest(GET_SELECTED_ENTRY_IDS, getSelectedEntryIds)
}
