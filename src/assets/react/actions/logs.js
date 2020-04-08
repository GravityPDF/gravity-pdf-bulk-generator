import { RESET_LOGS_STATE } from '../actionTypes/logs'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Redux Actions - payloads of information that send data from application to store */

/**
 * Reset logs state
 *
 * @returns {{ type: string }}
 *
 * @since 1.0
 */
export const resetLogsState = () => {
  return {
    type: RESET_LOGS_STATE
  }
}
