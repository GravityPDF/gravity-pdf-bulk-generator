import React from 'react'
import PropTypes from 'prop-types'
import Switch from 'react-switch'

const ToggleSwitch = ({ id, active, screenReaderLabel, onChange }) => {
  return (
    <Switch
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
}

ToggleSwitch.propTypes = {
  id: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  screenReaderLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ToggleSwitch
