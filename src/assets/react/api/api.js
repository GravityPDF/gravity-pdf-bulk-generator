/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Wrapper for the fetch() API which return a promise reject for some status codes
 *
 * @param string url
 * @param object init
 *
 * @returns {Promise<Response>}
 *
 * @since 1.0
 */
export const api = async (url, init) => {
  const response = await fetch(url, init)

  /* Promise reject for status code 400 and 500 */
  if (response.status === 408 || response.status >= 500) {
    return Promise.reject(response)
  }

  return response
}
