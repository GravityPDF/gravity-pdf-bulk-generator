import {
  UPDATE_DIRECTORY_STRUCTURE
} from '../actionTypes/tagPicker'

export const updateDirectoryStructure = (directoryStructure) => {
  return {
    type: UPDATE_DIRECTORY_STRUCTURE,
    directoryStructure
  }
}