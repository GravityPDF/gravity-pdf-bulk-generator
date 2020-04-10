/* Redux Action Types */
import { PROCEED_STEP_1, PROCESS_CHECKBOX, GET_SELECTED_ENTRIES_ID } from '../actionTypes/form'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Redux Actions - payloads of information that send data from application to store */

/**
 * Push to Step1 and show modal
 *
 * @returns {{ type: string }}
 *
 * @since 1.0
 */
export const proceedStep1 = () => {
  return {
    type: PROCEED_STEP_1
  }
}

/**
 * Process form checkbox values
 *
 * @param ids
 *
 * @returns {{ payload: array, type: string }}
 *
 * @since 1.0
 */
export const processCheckbox = ids => {
  return {
    type: PROCESS_CHECKBOX,
    payload: ids
  }
}

/**
 * Get selected entry IDs based by formId and filterData
 *
 * @param formId
 * @param filterData
 *
 * @returns {{ formId: string, filterData: object, type: string }}
 *
 * @since 1.0
 */
export const getSelectedEntriesId = (formId, filterData) => {
  return {
    type: GET_SELECTED_ENTRIES_ID,
    formId,
    filterData
  }
}
