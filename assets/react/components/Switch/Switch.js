/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import Switch from 'react-switch'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Toggle PDF switch to active or inactive
 *
 * @param id
 * @param active
 * @param screenReaderLabel
 * @param onChange
 *
 * @returns { ToggleSwitch: component }
 *
 * @since 1.0
 */
const ToggleSwitch = ({ id, active, screenReaderLabel, onChange }) => (
  <Switch
    data-test='component-ToggleSwitch'
    checked={active}
    onChange={() => onChange(id)}
    offColor='#AAA'
    onColor='#5BC236'
    uncheckedIcon={false}
    height={26}
    width={52}
    aria-label={screenReaderLabel}
  />
)

/**
 * PropTypes
 *
 * @since 1.0
 */
ToggleSwitch.propTypes = {
  id: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  screenReaderLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ToggleSwitch
