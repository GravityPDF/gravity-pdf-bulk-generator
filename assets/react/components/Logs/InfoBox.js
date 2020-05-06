/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
/* Components */
import ListContainer from './List/ListContainer'

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
 * @param logs
 * @param toggle
 * @param state
 * @param className
 *
 * @returns { InfoBox: component }
 *
 * @since 1.0
 */
const InfoBox = ({ title, logs, toggle, state, className }) => (
  <div data-test='component-InfoBox' className='log-wrapper'>
    <div className={'log-container ' + state.toString()}>
      <h3 className={className} onClick={toggle}>
        <span data-test='component-InfoBox-length-icon' className='lines'>
          {title} ({logs.length})
          <span className='expand'>
            {state ? '-' : '+'}
          </span>
        </span>
      </h3>

      <ListContainer logs={logs} className={className} />
    </div>
  </div>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  logs: PropTypes.array.isRequired,
  toggle: PropTypes.func.isRequired,
  state: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired
}

export default InfoBox
