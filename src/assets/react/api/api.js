/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
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
  let result

  /* If response.ok is false, return an error */
  if (!response.ok) {
    result = await response.json()

    return throw new Error(JSON.stringify({ response: result.message }))
  }

  result = await response

  return result
}
