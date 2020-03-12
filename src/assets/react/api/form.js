/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Fetch API request to obtain all entry IDs (POST)
 *
 * @param formId
 * @param filterData
 *
 * @returns {result: json}
 *
 * @since 1.0
 */
export const apiRequestAllEntryIds = async ({ formId, filterData }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/search/${formId}/entries`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify(filterData)
  })

  const result = await response.json()

  return result
}
