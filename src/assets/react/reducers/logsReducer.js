import {
  TOGGLE_SUCCESS,
  TOGGLE_ERRORS,
  TOGGLE_WARNINGS
} from '../actionTypes/logs'

export const initialState = {
  success: false,
  errors: false,
  warnings: false
}

export default function (state = initialState, action) {

  switch (action.type) {

    case TOGGLE_SUCCESS:
      return {
        ...state,
        success: !state.success
      }

    case TOGGLE_ERRORS:
      return {
        ...state,
        errors: !state.errors
      }

    case TOGGLE_WARNINGS:
      return {
        ...state,
        warnings: !state.warnings
      }
  }

  return state
}
