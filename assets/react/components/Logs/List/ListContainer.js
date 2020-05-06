/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as Container } from 'react-window'
/* Components */
import List from './List'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.1
 */

/**
 * Display Logs ListContainer UI
 *
 * @param log
 * @param className
 *
 * @returns { ListContainer: component }
 *
 * @since 1.1
 */
const ListContainer = ({ logs, className }) => (
  <Container
    data-test='component-ListContainer'
    className='log-entries'
    height={155}
    itemCount={logs.length}
    itemSize={22}
    itemData={{ logs: logs, className: className }}
  >
    {List}
  </Container>
)

/**
 * PropTypes
 *
 * @since 1.1
 */
ListContainer.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string.isRequired
}

export default ListContainer
