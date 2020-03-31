/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgressbar } from 'react-circular-progressbar'

/* Components */
import LoadingDots from '../LoadingDots/LoadingDots'
import Logs from '../Logs/Logs'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display Step2Body UI
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
 * @param downloadPercentage
 *
 * @returns {Step2Body: component}
 *
 * @since 1.0
 */
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
  <section className='gfpdf-step'>
    <div id='gfpdf-step-2'>
      <CircularProgressbar
        value={downloadPercentage}
        text={`${downloadPercentage}%`} />

      <h2>Building your PDFs<LoadingDots /></h2>
      <em>(Please do not navigate away from this page)</em>
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

/**
 * PropTypes
 *
 * @since 1.0
 */
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
