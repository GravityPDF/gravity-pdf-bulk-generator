/* Dependencies */
import { cancel, fork, retry, take, takeLatest, put } from 'redux-saga/effects'
import { push } from 'connected-react-router'
/* Redux Action Types */
import { PROCEED_STEP_1, GET_SELECTED_ENTRIES_ID, GET_SELECTED_ENTRIES_ID_SUCCESS } from '../actionTypes/form'
import { TOGGLE_MODAL, FATAL_ERROR } from '../actionTypes/pdf'
import { RESET_ALL_STATE } from '../actionTypes/actionTypes'
/* APIs */
import { apiRequestAllEntryIds } from '../api/form'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Watch for our redux action proceedStep1 to be called and call our proceedStep1 generator
 *
 * @since 1.0
 */
export function * watchProceedStep1 () {
  yield takeLatest(PROCEED_STEP_1, proceedStep1)
}

/**
 * Proceed to Step1 and show modal
 *
 * @since 1.0
 */
export function * proceedStep1 () {
  yield put(push('/step/1'))
  yield put({ type: TOGGLE_MODAL })
}

/**
 * Watch for our redux action getSelectedEntriesId to be called and call our getSelectedEntriesId generator.
 *
 * This includes handling of task cancellation.
 *
 * @since 1.0
 */
export function * watchGetSelectedEntriesId () {
  while (true) {
    const payload = yield take(GET_SELECTED_ENTRIES_ID)

    const task = yield fork(getSelectedEntriesId, payload)

    yield take(RESET_ALL_STATE)
    yield cancel(task)
  }
}

/**
 * Call our API and process the response based on requested filter data. If we don't get a valid response,
 * a fatal error will be triggered.
 *
 * @param payload: object
 *
 * @since 1.0
 */
export function * getSelectedEntriesId (payload) {
  try {
    const response = yield retry(3, 100, apiRequestAllEntryIds, payload)

    if (!response.ok) {
      throw response
    }

    const responseBody = yield response.json()

    yield put({ type: GET_SELECTED_ENTRIES_ID_SUCCESS, payload: responseBody })
  } catch (error) {
    yield put({ type: FATAL_ERROR })
  }
}
