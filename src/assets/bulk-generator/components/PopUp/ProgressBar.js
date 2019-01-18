import React from 'react'
import PropTypes from 'prop-types'

const steps = [
  'Configure',
  'Create',
  'Compress',
  'Download'
]

const ProgressBar = ({step}) => {
  return (
    <ol className="gfpdf-progress-steps">
      {steps.map((name, index) => (
        <li key={index} className={(step - 1) === index ? 'active' : ''}>{name}</li>
      ))}
    </ol>
  )
}

ProgressBar.propTypes = {}

export default ProgressBar