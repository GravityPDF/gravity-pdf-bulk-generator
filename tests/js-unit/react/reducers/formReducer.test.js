import {
  PROCESS_CHECKBOX,
  GET_SELECTED_ENTRIES_ID_SUCCESS
} from '../../../../assets/react/actionTypes/form'
import { RESET_ALL_STATE } from '../../../../assets/react/actionTypes/actionTypes'
import reducer, { initialState } from '../../../../assets/react/reducers/formReducer'

describe('/react/reducers/ - formReducer.js', () => {
  let data
  let state

  describe('Redux Reducers (form) - ', () => {
    test('PROCESS_CHECKBOX', () => {
      data = [
        { checked: true, type: 'checkbox', value: '73' },
        { checked: true, type: 'checkbox', value: '74' },
        { checked: false, type: 'checkbox', value: '75' }
      ]
      state = reducer(initialState, { type: PROCESS_CHECKBOX, payload: data })

      expect(state.selectedEntriesId.length).toBe(2)
    })

    test('GET_SELECTED_ENTRY_IDS_SUCCESS', () => {
      data = ['70', '71']
      state = reducer(initialState, { type: GET_SELECTED_ENTRIES_ID_SUCCESS, payload: data })

      expect(state.selectedEntriesId.length).toBe(2)
    })

    test('RESET_ALL_STATE', () => {
      state = reducer(initialState, { type: RESET_ALL_STATE })

      expect(state).toEqual(initialState)
    })

    test('DEFAULT', () => {
      state = reducer(initialState, {})

      expect(state).toEqual(initialState)
    })
  })
})
