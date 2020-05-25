import { cancel, fork, put, retry, take, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import {
  watchProceedStep1,
  proceedStep1,
  watchGetSelectedEntriesId,
  getSelectedEntriesId
} from '../../../../assets/react/sagas/form'
import {
  PROCEED_STEP_1,
  GET_SELECTED_ENTRIES_ID,
  GET_SELECTED_ENTRIES_ID_SUCCESS
} from '../../../../assets/react/actionTypes/form'
import { apiRequestAllEntryIds } from '../../../../assets/react/api/form'
import { FATAL_ERROR, TOGGLE_MODAL } from '../../../../assets/react/actionTypes/pdf'
import { RESET_ALL_STATE } from '../../../../assets/react/actionTypes/actionTypes'

describe('/react/sagas/ - form.js', () => {
  let payload
  let response
  let responseBody

  describe('Redux Sagas (form) - ', () => {
    describe('Watcher Saga - watchProceedStep1()', () => {
      test('should check the watcher to loads up the worker saga functions', () => {
        const gen = watchProceedStep1()

        expect(gen.next().value).toEqual(takeLatest(PROCEED_STEP_1, proceedStep1))
        expect(gen.next().done).toBeTruthy()
      })
    })

    describe('Worker Saga - proceedStep1()', () => {
      test('should check that saga calls push and TOGGLE_MODAL', () => {
        const gen = proceedStep1()

        expect(gen.next().value).toEqual(put(push('/step/1')))
        expect(gen.next().value).toEqual(put({ type: TOGGLE_MODAL }))
        expect(gen.next().done).toBeTruthy()
      })
    })

    describe('Watcher Saga - watchGetSelectedEntryIds()', () => {
      test('should check this watcher to load getSelectedEntriesId saga', () => {
        payload = {
          formId: '5',
          filterData: {}
        }
        const gen = watchGetSelectedEntriesId()

        expect(gen.next().value).toEqual(take(GET_SELECTED_ENTRIES_ID))
        expect(gen.next(payload).value).toEqual(fork(getSelectedEntriesId, payload))
        expect(gen.next().value).toEqual(take(RESET_ALL_STATE))
        expect(gen.next().value).toEqual(cancel())
        expect(gen.next().done).toBeFalsy()
      })
    })

    describe('Worker Saga - getSelectedEntryIds()', () => {
      payload = { formId: '5', filterData: {} }

      test('should check that saga calls the API apiRequestAllEntryIds', () => {
        response = { ok: true, json: jest.fn() }
        responseBody = []
        const gen = getSelectedEntriesId(payload)

        expect(
          gen.next().value
        ).toEqual(retry(3, 100, apiRequestAllEntryIds, payload))

        gen.next(response)

        expect(
          gen.next(responseBody).value
        ).toEqual(put({ type: GET_SELECTED_ENTRIES_ID_SUCCESS, payload: responseBody }))

        expect(gen.next().done).toBeTruthy()
      })

      test('should check that saga handles correctly the failure of the API call', () => {
        response = { ok: false }
        const gen = getSelectedEntriesId(payload)

        expect(gen.next().value).toEqual(retry(3, 100, apiRequestAllEntryIds, payload))
        expect(gen.next(response).value).toEqual(put({ type: FATAL_ERROR }))
        expect(gen.next().done).toBeTruthy()
      })
    })
  })
})
