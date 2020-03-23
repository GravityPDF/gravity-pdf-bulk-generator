/* APIs */
import { api } from './api'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Fetch API request to obtain session ID (POST)
 *
 * @param path
 * @param concurrency
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestSessionId = ({ path, concurrency }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/register`

  return api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify({ 'path': path, 'concurrency': concurrency })
  })
}

/**
 * Fetch API request to generate PDF (POST)
 *
 * @param listItem
 * @param signal
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestGeneratePdf = ({ listItem, signal }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/create`

  return api(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify(listItem)
  })
}

/**
 * Fetch API request to generate PDF zip file (POST)
 *
 * @param string sessionId
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestGeneratePdfZip = sessionId => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/zip/${sessionId}`

  return api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    }
  })
}
