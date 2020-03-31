/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display Logs List UI
 *
 * @param list
 * @param state
 * @param title
 *
 * @returns {List: component}
 *
 * @since 1.0
 */
const List = ({ list, state, title }) => (
  <div className='items'>
    {
      list.map((item, index) => (
        <div key={index} className={'item ' + state.toString() + ' ' + title.toLowerCase()}>
          {title === 'Success' ? 'Completed' : 'Failed'} generation of {'"'+item.pdfName+'.pdf"'} (#{item.pdfId}) for entry
          #{item.entryId}
        </div>
      ))
    }
  </div>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
List.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      pdfName: PropTypes.string.isRequired,
      pdfId: PropTypes.string.isRequired,
      entryId: PropTypes.string.isRequired
    })
  ).isRequired,
  state: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default List
