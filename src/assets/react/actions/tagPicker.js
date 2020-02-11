import {
  UPDATE_DIRECTORY_STRUCTURE,
  RESET_TAGPICKER_STATE
} from '../actionTypes/tagPicker'

export const updateDirectoryStructure = directoryStructure => {
  return {
    type: UPDATE_DIRECTORY_STRUCTURE,
    payload: directoryStructure
  }
}

export const resetTagPickerState = () => {
  return {
    type: RESET_TAGPICKER_STATE
  }
}