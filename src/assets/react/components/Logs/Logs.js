/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
/* Components */
import InfoBox from './InfoBox'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display Logs UI
 *
 * @param success
 * @param errors
 * @param warnings
 * @param toggleSuccess
 * @param toggleErrors
 * @param toggleWarnings
 * @param generatePdfSuccess
 * @param generatePdfFailed
 * @param generatePdfWarning
 *
 * @returns { Logs: component }
 *
 * @since 1.0
 */
const Logs = (
  {
    success,
    errors,
    warnings,
    toggleSuccess,
    toggleErrors,
    toggleWarnings,
    generatePdfSuccess,
    generatePdfFailed,
    generatePdfWarning
  }
) => (
  <div className='logs'>
    {
      /* Display success logs */
      generatePdfSuccess.length > 0 && (
        <div className='log-box'>
          <InfoBox
            title='Success'
            state={success}
            toggle={toggleSuccess}
            list={generatePdfSuccess} />
        </div>
      )
    }

    {
      /* Display errors/failed logs */
      generatePdfFailed.length > 0 && (
        <div className='log-box'>
          <InfoBox
            title='Errors'
            state={errors}
            toggle={toggleErrors}
            list={generatePdfFailed} />
        </div>
      )
    }

    {
      /* Display warning logs */
      generatePdfWarning.length > 0 && (
        <div className='log-box'>
          <InfoBox
            title='Warnings'
            state={warnings}
            toggle={toggleWarnings}
            list={generatePdfWarning} />
        </div>
      )
    }
  </div>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
Logs.propTypes = {
  success: PropTypes.bool.isRequired,
  errors: PropTypes.bool.isRequired,
  warnings: PropTypes.bool.isRequired,
  toggleSuccess: PropTypes.func.isRequired,
  toggleErrors: PropTypes.func.isRequired,
  toggleWarnings: PropTypes.func.isRequired,
  generatePdfSuccess: PropTypes.arrayOf(PropTypes.object).isRequired,
  generatePdfFailed: PropTypes.arrayOf(PropTypes.object).isRequired,
  generatePdfWarning: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Logs
