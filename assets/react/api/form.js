/* APIs */
import { api } from './api'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Fetch API request to obtain all entry IDs (POST)
 *
 * @param formId: string
 * @param filterData: object
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestAllEntryIds = ({ formId, filterData }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/search/${formId}/entries`

  return api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify(filterData)
  })
}
