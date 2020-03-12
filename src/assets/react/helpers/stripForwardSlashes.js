/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * A simple function that strip out forward slashes '/' from inside directoryStructure / merge tags
 *
 * @param directoryStructure
 *
 * @returns {result|directoryStructure: string|*}
 *
 * @since 1.0
 */
export const stripForwardSlashes = directoryStructure => {
  const matchPattern = directoryStructure.match(/\{(.*?)\}/g)
  const structureArray = []

  if (matchPattern) {
    matchPattern.map(item => {
      /* Strip out forward slashes '/' */
      structureArray.push('/' + item.replace(/[/]/g, ''))
    })

    /* Join data and return as string */
    const result = structureArray.join('') + '/'

    return result
  }

  return directoryStructure
}
