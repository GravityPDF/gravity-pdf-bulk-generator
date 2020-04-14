/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import language from '../../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/* Array of constants */
const steps = [
  language.stepConfigure,
  language.stepBuild,
  language.stepDownload
]

/**
 * Display ProgressBar UI
 *
 * @param step
 *
 * @returns { ProgressBar: component }
 *
 * @since 1.0
 */
const ProgressBar = ({ step }) => {
  return (
    <ol className='gfpdf-progress-steps'>
      {steps.map((name, index) => (
        <li
          key={index}
          className={(step - 1) === index ? 'active' : ''}>
          {name}
        </li>
      ))}
    </ol>
  )
}

/**
 * PropTypes
 *
 * @since 1.0
 */
ProgressBar.propTypes = {
  step: PropTypes.number.isRequired
}

export default ProgressBar
