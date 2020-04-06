/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * A simple function that parse URL filter data into an object
 *
 * @param currentUrl
 *
 * @returns { data: object }
 *
 * @since 1.0
 */
export const parseUrlForSearchParameters = (currentUrl) => {
  const filterDetails = [
    ['s', /s=(.*)/],
    ['field_id', /field_id=(.*)/],
    ['operator', /operator=(.*)/],
    ['filter', /filter=(.*)/],
    ['order', /order=(.*)/],
    ['orderby', /orderby=(.*)/]
  ]
  const data = {}

  /* Process to construct an object using regex */
  for (let x = 0; x < filterDetails.length; x++) {
    /* If corresponding filter data value is not empty, include it in the object */
    data[filterDetails[x][0]] = filterDetails[x][1].exec(currentUrl) ? filterDetails[x][1].exec(currentUrl)[1].replace(/&.*$/, '') : ''
  }

  return data
}
