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
 * @returns {result: json}
 *
 * @since 1.0
 */
export const apiRequestSessionId = async ({ path, concurrency }) => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/register`

  const response = await api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify({ 'path': path, 'concurrency': concurrency })
  })

  const result = await response.json()

  return result
}

/**
 * Fetch API request to generate PDF (POST)
 *
 * @param listItem
 * @param signal
 *
 * @returns {result: object}
 *
 * @since 1.0
 */
export const apiRequestGeneratePdf = async ({ listItem, signal }) => {

  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/create`

  const response = await api(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify(listItem)
  })

  const result = await response

  return result
}

/**
 * Fetch API request to generate PDF zip file (POST)
 *
 * @param sessionId
 *
 * @returns {result: json}
 *
 * @since 1.0
 */
export const apiRequestGeneratePdfZip = async sessionId => {
  const url = `${GPDF_BULK_GENERATOR.rest_url}/generator/zip/${sessionId}`

  const response = await api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    }
  })

  const result = await response.json()

  return result
}
