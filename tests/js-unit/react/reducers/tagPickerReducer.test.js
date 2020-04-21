import { UPDATE_DIRECTORY_STRUCTURE, RESET_TAGPICKER_STATE } from '../../../../assets/react/actionTypes/tagPicker'
import { RESET_ALL_STATE } from '../../../../assets/react/actionTypes/actionTypes'
import reducer, { initialState } from '../../../../assets/react/reducers/tagPickerReducer'

describe('/react/reducers/ - tagPickerReducer.js', () => {

  let data
  let state

  describe('Redux Reducers (tagPicker) - ', () => {

    test('UPDATE_DIRECTORY_STRUCTURE', () => {
      data = '/{date_created:format:Y}/{date_created:format:m}/{date_created:format:i}/'
      state = reducer(initialState, { type: UPDATE_DIRECTORY_STRUCTURE, payload: data })

      expect(state.directoryStructure).toBe(data)
    })

    test('RESET_ALL_STATE', () => {
      state = reducer(initialState, { type: RESET_ALL_STATE })

      expect(state).toEqual(initialState)
    })

    test('RESET_TAGPICKER_STATE', () => {
      state = reducer(initialState, { type: RESET_TAGPICKER_STATE })

      expect(state).toEqual(initialState)
    })

    test('DEFAULT', () => {
      state = reducer(initialState, {})

      expect(state).toEqual(initialState)
    })
  })
})
