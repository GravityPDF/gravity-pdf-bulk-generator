import {
  TOGGLE_PDF_STATUS,
} from '../actionTypes/pdf'

export const initialState = {
  list: [
    {id: '123412425', label: 'Certificate of Completion', active: false},
    {id: '123412425', label: 'USA Government W4', active: false},
    {id: '123412425', label: 'User Invoice', active: false},
    {id: '123412425', label: 'Summary', active: false},
  ],
}

export default function (state = initialState, action) {

  switch (action.type) {

    case TOGGLE_PDF_STATUS:
      const newState = {
        ...state,
        list: [...state.list]
      }

      newState.list[action.index]['active'] = !newState.list[action.index]['active']

      return newState
  }

  return state
}