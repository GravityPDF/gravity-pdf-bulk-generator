/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * A simple function that strip out slashes '\, /' from inside directoryStructure / merge tags
 *
 * @param directoryStructure: string
 *
 * @returns { result|directoryStructure: string|* }
 *
 * @since 1.0
 */
export const stripOutSlashes = directoryStructure => {
  const matchPattern = directoryStructure.match(/\{(.*?)\}/g)

  if (matchPattern) {
    const structureArray = []
    const removeSlashes = []
    const addDelimiter =
      `{/${directoryStructure}{`
        .replace(/\/{/g, '/{{')
        .replace(/}\//g, '}/{{')

    const group = addDelimiter.match(/{(.*?){/g)

    group.map(item => removeSlashes.push(item.replace(/[/\\]/g, '')))

    const filterGroup =
      removeSlashes
        .filter(item => !item.includes('{{'))
        .filter(item => !item.includes('{/{'))

    filterGroup.map(item => {
      item = item.replace(/}{/g, '}')

      if (item.match(/{(.*?){/)) {
        return structureArray.push('/' + item.replace(/{/g, ''))
      }

      structureArray.push('/' + item.replace(/}{/, '}'))
    })

    const result = structureArray.join('')

    return result
  }

  return directoryStructure
}
