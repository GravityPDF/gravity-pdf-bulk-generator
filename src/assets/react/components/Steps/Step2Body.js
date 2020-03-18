import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgressbar } from 'react-circular-progressbar'
import LoadingDots from '../LoadingDots/LoadingDots'
import Logs from '../Logs/Logs'

const Step2Body = (
  {
    success,
    errors,
    warnings,
    toggleSuccess,
    toggleErrors,
    toggleWarnings,
    generatePdfSuccess,
    generatePdfFailed,
    generatePdfWarning,
    downloadPercentage,
  }
) => (
  <section>
    <div id='gfpdf-step-2' className='gfpdf-step'>
      <CircularProgressbar
        value={downloadPercentage}
        text={`${downloadPercentage}%`} />

      <h2>Building your PDFs<LoadingDots /></h2>
    </div>

    <Logs
      success={success}
      errors={errors}
      warnings={warnings}
      toggleSuccess={toggleSuccess}
      toggleErrors={toggleErrors}
      toggleWarnings={toggleWarnings}
      generatePdfSuccess={generatePdfSuccess}
      generatePdfFailed={generatePdfFailed}
      generatePdfWarning={generatePdfWarning} />
  </section>
)

Step2Body.propTypes = {
  success: PropTypes.bool.isRequired,
  errors: PropTypes.bool.isRequired,
  warnings: PropTypes.bool.isRequired,
  toggleSuccess: PropTypes.func.isRequired,
  toggleErrors: PropTypes.func.isRequired,
  toggleWarnings: PropTypes.func.isRequired,
  generatePdfSuccess: PropTypes.arrayOf(PropTypes.object).isRequired,
  generatePdfFailed: PropTypes.arrayOf(PropTypes.object).isRequired,
  generatePdfWarning: PropTypes.arrayOf(PropTypes.object).isRequired,
  downloadPercentage: PropTypes.number.isRequired
}

export default Step2Body
