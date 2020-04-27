import {
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_WARNING,
  GENERATE_PDF_FAILED,
  RESET_LOGS_STATE
} from '../../../../assets/react/actionTypes/logs'
import { RESET_ALL_STATE } from '../../../../assets/react/actionTypes/actionTypes'
import reducer, { initialState } from '../../../../assets/react/reducers/logsReducer'

describe('/react/reducers/ - logsReducer.js', () => {
  let data
  let state
  let newState

  describe('Redux Reducers (logs) - ', () => {
    test('GENERATE_PDF_SUCCESS', () => {
      data = 'Generated First PDF template (#5e12a) for Entry #72'
      state = reducer(initialState, { type: GENERATE_PDF_SUCCESS, payload: data })
      newState = reducer(state, { type: GENERATE_PDF_SUCCESS, payload: data })

      expect(state.generatePdfSuccess.length).toBe(1)
      expect(newState.generatePdfSuccess.length).toBe(2)
    })

    test('GENERATE_PDF_WARNING', () => {
      data = 'Inactive PDF: Skipped Test2 (#5e2e1) for Entry #62'
      state = reducer(initialState, { type: GENERATE_PDF_WARNING, payload: data })
      newState = reducer(state, { type: GENERATE_PDF_WARNING, payload: data })

      expect(state.generatePdfWarning.length).toBe(1)
      expect(newState.generatePdfWarning.length).toBe(2)
    })

    test('GENERATE_PDF_FAILED', () => {
      data = 'Failed generating Certificate of Completion (#5e2e1) for Entry #45'
      state = reducer(initialState, { type: GENERATE_PDF_FAILED, payload: data })
      newState = reducer(state, { type: GENERATE_PDF_FAILED, payload: data })

      expect(state.generatePdfFailed.length).toBe(1)
      expect(newState.generatePdfFailed.length).toBe(2)
    })

    test('RESET_ALL_STATE', () => {
      state = reducer(initialState, { type: RESET_ALL_STATE })

      expect(state).toEqual(initialState)
    })

    test('RESET_LOGS_STATE', () => {
      state = reducer(initialState, { type: RESET_LOGS_STATE })

      expect(state).toEqual(initialState)
    })

    test('DEFAULT', () => {
      state = reducer(initialState, {})

      expect(state).toEqual(initialState)
    })
  })
})
