import React from 'react'
import InfoBox from './InfoBox'
import PropTypes from 'prop-types'

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
