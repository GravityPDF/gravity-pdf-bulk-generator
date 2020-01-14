import {
  UPDATE_DIRECTORY_STRUCTURE,
  GET_ACTIVE_TAGS,
  INCREMENT_PERCENRAGE
} from '../actionTypes/tagPicker'

export const updateDirectoryStructure = directoryStructure => {
  return {
    type: UPDATE_DIRECTORY_STRUCTURE,
    directoryStructure
  }
}

export const getActiveTags = value => {
  return {
    type: GET_ACTIVE_TAGS,
    payload: value
  }
}

export const incrementPercentage = () => {
  return {
    type: INCREMENT_PERCENRAGE
  }
}
