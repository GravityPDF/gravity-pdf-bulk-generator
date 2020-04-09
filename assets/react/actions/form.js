/* Redux Action Types */
import { PROCESS_CHECKBOX, GET_SELECTED_ENTRY_IDS } from '../actionTypes/form'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Redux Actions - payloads of information that send data from application to store */

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
export const getSelectedEntryIds = (formId, filterData) => {
  return {
    type: GET_SELECTED_ENTRY_IDS,
    formId,
    filterData
  }
}
