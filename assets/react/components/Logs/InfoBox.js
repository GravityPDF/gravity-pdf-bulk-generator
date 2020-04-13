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
 * @param logs
 * @param toggle
 * @param state
 *
 * @returns { InfoBox: component }
 *
 * @since 1.0
 */
const InfoBox = ({ title, logs, toggle, state }) => (
  <div className='log-wrapper'>
    <div className={'log-container ' + state.toString()}>
      <h3 className={title.toLowerCase()} onClick={toggle}>
        <span className='lines'>
          {title} ({logs.length})
          <span className='expand'>
            {state ? '-' : '+'}
          </span>
        </span>
      </h3>

      <div className='log-entries'>
        {
          logs.map((log, index) => (
            <List
              log={log}
              title={title}
              key={index} />
          ))
        }
      </div>
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
  state: PropTypes.bool.isRequired
}

export default InfoBox
