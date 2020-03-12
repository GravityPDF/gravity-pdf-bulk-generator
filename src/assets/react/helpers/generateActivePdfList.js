/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * A simple function that return only an array of active PDF list from the
 * orignal PDF list
 *
 * @param pdfList
 *
 * @returns {list: array}
 *
 * @since 1.0
 */
export const generateActivePdfList = (pdfList) => {
  const list = []

  pdfList.map(item => {
    const id = item.id
    const name = item.name

    /* Push the active ones to an array list */
    item.active && list.push({ id, name })
  })

  return list
}
