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
 * @param path: string
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestSessionId = path => {
  const url = `${GPDF_BULK_GENERATOR.restUrl}/generator/register`

  return api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify({ path: path })
  })
}

/**
 * Fetch API request to generate PDF (POST)
 *
 * @param pdf: object
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestGeneratePdf = pdf => {
  const url = `${GPDF_BULK_GENERATOR.restUrl}/generator/create`

  return api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    },
    body: JSON.stringify(pdf)
  })
}

/**
 * Fetch API request to generate PDF zip file (POST)
 *
 * @param sessionId: string
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestGeneratePdfZip = sessionId => {
  const url = `${GPDF_BULK_GENERATOR.restUrl}/generator/zip/${sessionId}`

  return api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': GPDF_BULK_GENERATOR.nonce
    }
  })
}

/**
 * Fetch API request to check if zip file url works fine
 *
 * @param url: string
 *
 * @returns Response
 *
 * @since 1.0
 */
export const apiRequestDownloadZipFile = url => {
  return api(url, {
    method: 'HEAD',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
