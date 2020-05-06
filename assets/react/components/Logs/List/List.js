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
 * @param data
 * @param index
 * @param style
 *
 * @returns { List: component }
 *
 * @since 1.0
 */
const List = ({ data, index, style }) => (
  <div data-test='component-List' className={'log-entry ' + data.className} style={style}>
    {data.logs[index]}
  </div>
)

List.propTypes = {
  data: PropTypes.shape({
    className: PropTypes.string.isRequired,
    logs: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.string.isRequired
  }).isRequired
}

export default React.memo(List)
