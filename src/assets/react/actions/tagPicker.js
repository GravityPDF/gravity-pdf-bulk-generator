import {
  UPDATE_DIRECTORY_STRUCTURE,
  GET_ACTIVE_TAGS,
} from '../actionTypes/tagPicker'

export const updateDirectoryStructure = directoryStructure => {
  return {
    type: UPDATE_DIRECTORY_STRUCTURE,
    payload: directoryStructure
  }
}

export const getActiveTags = value => {
  return {
    type: GET_ACTIVE_TAGS,
    payload: value
  }
}
