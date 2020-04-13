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
 * @param log
 * @param title
 *
 * @returns { List: component }
 *
 * @since 1.0
 */
const List = ({ log, title }) => (
  <div className={'log-entry ' + title.toLowerCase()}>
    {log}
  </div>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
List.propTypes = {
  log: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default List
