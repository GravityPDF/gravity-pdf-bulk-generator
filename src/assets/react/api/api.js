
/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/**
 * Wrapper for the fetch() API which throws an error when the response isn't `.ok`
 *
 * @param string url
 * @param object init
 * @returns {Promise<Response>}
 *
 * @since 1.0
 */
export const api = async (url, init) => {
  const response = await fetch(url, init)

  if(!response.ok) {
    throw new Error(response)
  }

  return response
}
