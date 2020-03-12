/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/* Components */
import List from './List'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display Logs InfoBox UI
 *
 * @param title
 * @param list
 * @param toggle
 * @param state
 *
 * @returns {InfoBox: component}
 *
 * @since 1.0
 */
const InfoBox = (
  {
    title,
    list,
    toggle,
    state
  }
) => (
  <div className={'errors-container ' + state.toString()}>
    <h3 className={title.toLowerCase()} onClick={toggle}>
        <span className='lines'>
          {title} ({list.length})
          <span className='expand'>
            {state ? '-' : '+'}
          </span>
        </span>
    </h3>

    <List
      list={list}
      state={state}
      title={title} />
  </div>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      pdfName: PropTypes.string,
      pdfId: PropTypes.string,
      entryId: PropTypes.string
    })
  ),
  toggle: PropTypes.func.isRequired,
  state: PropTypes.bool.isRequired
}

export default InfoBox
