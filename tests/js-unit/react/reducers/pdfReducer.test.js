import {
  STORE_ABORT_CONTROLLER,
  GENERATE_PDF_LIST_SUCCESS,
  TOGGLE_MODAL,
  TOGGLE_PDF_STATUS,
  GENERATE_SESSION_ID_SUCCESS,
  REMOVE_TOGGLE_ALL,
  GENERATE_PDF_COUNTER,
  GENERATE_DOWNLOAD_ZIP_URL,
  FATAL_ERROR,
  RESET_PDF_STATE
} from '../../../../assets/react/actionTypes/pdf'
import { RESET_ALL_STATE } from '../../../../assets/react/actionTypes/actionTypes'
import reducer, { initialState } from '../../../../assets/react/reducers/pdfReducer'

describe('/react/reducers/ - pdfReducer.js', () => {

  let data
  let state
  let newState

  describe('Redux Reducers (pdf) - ', () => {

    test('STORE_ABORT_CONTROLLER', () => {
      data = {}
      state = reducer(initialState, { type: STORE_ABORT_CONTROLLER, payload: data })
      newState = reducer(state, { type: STORE_ABORT_CONTROLLER, payload: data })

      expect(state.abortControllers.length).toBe(1)
      expect(newState.abortControllers.length).toBe(2)
    })

    test('GENERATE_PDF_LIST_SUCCESS', () => {
      data = [
        { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false },
        { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }
      ]
      state = reducer(initialState, { type: GENERATE_PDF_LIST_SUCCESS, payload: data })

      expect(state.pdfList.length).toBe(2)
    })

    test('TOGGLE_MODAL', () => {
      state = reducer(initialState, { type: TOGGLE_MODAL })

      expect(state.modal).toBe(true)

      newState = reducer(state, { type: TOGGLE_MODAL })

      expect(newState.modal).toBe(false)
    })

    test('TOGGLE_PDF_STATUS', () => {
      data = [
        { id: '0', name: 'Toggle All', templateSelected: '', active: false },
        { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false },
        { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: true }
      ]
      state = reducer(initialState, { type: GENERATE_PDF_LIST_SUCCESS, payload: data })
      /* If toggle all pdf switch is clicked (0) */
      newState = reducer(state, { type: TOGGLE_PDF_STATUS, payload: 0 })

      expect(newState.pdfList).toEqual(
        [
          { id: '0', name: 'Toggle All', templateSelected: '', active: true },
          { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true },
          { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: true }
        ]
      )

      /* If toggle all pdf switch is clicked (0) */
      newState = reducer(newState, { type: TOGGLE_PDF_STATUS, payload: 0 })

      expect(newState.pdfList).toEqual(
        [
          { id: '0', name: 'Toggle All', templateSelected: '', active: false },
          { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false },
          { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }
        ]
      )

      /* If individual toggle pdf switch is clicked (1) */
      newState = reducer(newState, { type: TOGGLE_PDF_STATUS, payload: 1 })

      expect(newState.pdfList).toEqual(
        [
          { id: '0', name: 'Toggle All', templateSelected: '', active: false },
          { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true },
          { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }
        ]
      )

      /* If individual toggle pdf switch is clicked (2) */
      newState = reducer(newState, { type: TOGGLE_PDF_STATUS, payload: 2 })

      expect(newState.pdfList).toEqual(
        [
          { id: '0', name: 'Toggle All', templateSelected: '', active: true },
          { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true },
          { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: true }
        ]
      )
    })

    test('GENERATE_SESSION_ID_SUCCESS', () => {
      data = '846df'
      state = reducer(initialState, { type: GENERATE_SESSION_ID_SUCCESS, payload: data })

      expect(state.sessionId).toBe(data)
    })

    test('REMOVE_TOGGLE_ALL', () => {
      data = [
        { id: '0', name: 'Toggle All', templateSelected: '', active: false },
        { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false },
        { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }
      ]

      state = reducer(initialState, { type: GENERATE_PDF_LIST_SUCCESS, payload: data })
      newState = reducer(state, { type: REMOVE_TOGGLE_ALL })

      expect(newState.pdfList.length).toBe(2)
    })

    test('GENERATE_PDF_COUNTER', () => {
      data = [
        { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true },
        { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }
      ]
      state = reducer(initialState, { type: GENERATE_PDF_LIST_SUCCESS, payload: data })
      data = ['70', '71', '72', '73', '74']
      newState = reducer(state, { type: GENERATE_PDF_COUNTER, payload: data })

      expect(newState.generatePdfCounter).toBe(1)
      expect(newState.downloadPercentage).toBe(20)
    })

    test('GENERATE_DOWNLOAD_ZIP_URL', () => {
      data = 'https://gravitypdf.com/zkd3'
      state = reducer(initialState, { type: GENERATE_DOWNLOAD_ZIP_URL, payload: data })

      expect(state.downloadZipUrl).toBe(data)
    })

    test('FATAL_ERROR', () => {
      state = reducer(initialState, { type: FATAL_ERROR })

      expect(state.fatalError).toBe(true)
    })

    test('RESET_ALL_STATE', () => {
      state = reducer(initialState, { type: RESET_ALL_STATE })

      expect(state).toEqual(initialState)
    })

    test('RESET_PDF_STATE', () => {
      state = reducer(initialState, { type: RESET_PDF_STATE })

      expect(state).toEqual(initialState)
    })

    test('DEFAULT', () => {
      state = reducer(initialState, {})

      expect(state).toEqual(initialState)
    })
  })
})
