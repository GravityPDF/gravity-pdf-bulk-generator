import {
  TOGGLE_SUCCESS,
  TOGGLE_ERRORS,
  TOGGLE_WARNINGS
} from '../actionTypes/logs'

export const toggleSuccess = () => {
  return {
    type: TOGGLE_SUCCESS
  }
}

export const toggleErrors = () => {
  return {
    type: TOGGLE_ERRORS
  }
}

export const toggleWarnings = () => {
  return {
    type: TOGGLE_WARNINGS
  }
}
