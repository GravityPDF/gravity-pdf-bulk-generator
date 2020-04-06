/* Redux Action Types */
import { UPDATE_DIRECTORY_STRUCTURE, RESET_TAGPICKER_STATE } from '../actionTypes/tagPicker'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Redux Actions - payloads of information that send data from application to store */

/**
 * Update path directory structure
 *
 * @param directoryStructure
 *
 * @returns {{ payload: string, type: string }}
 *
 * @since 1.0
 */
export const updateDirectoryStructure = directoryStructure => {
  return {
    type: UPDATE_DIRECTORY_STRUCTURE,
    payload: directoryStructure
  }
}

/**
 * Reset tag picker directoryStructure state
 *
 * @returns {{ type: string }}
 *
 * @since 1.0
 */
export const resetTagPickerState = () => {
  return {
    type: RESET_TAGPICKER_STATE
  }
}
