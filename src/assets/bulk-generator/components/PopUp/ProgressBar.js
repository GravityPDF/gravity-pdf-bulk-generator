import React from 'react'
import PropTypes from 'prop-types'

const ProgressBar = ({}) => {
  return (
    <ol className="gfpdf-progress-steps">
      <li className="active">Configure</li>
      <li>Create</li>
      <li>Compress</li>
      <li>Download</li>
    </ol>
  )
}

ProgressBar.propTypes = {

}

export default ProgressBar