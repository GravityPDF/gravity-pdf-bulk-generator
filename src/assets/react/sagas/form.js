import {
  retry,
  takeLatest,
  put
} from 'redux-saga/effects'
import {
  GET_SELECTED_ENTRY_IDS,
  GET_SELECTED_ENTRY_IDS_SUCCESS,
  GET_SELECTED_ENTRY_IDS_FAILED
} from '../actionTypes/form'
import { apiRequestAllEntryIds } from '../api/form'

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
