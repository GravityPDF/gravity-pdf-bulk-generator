/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/* Components */
import Logs from '../Logs/Logs'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display Step3Body UI
 *
 * @param downloadZipUrl
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
 * @returns {Step3Body: component}
 *
 * @since 1.0
 */
const Step3Body = (
  {
    downloadZipUrl,
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
  <section>
    <div id='gfpdf-step-3' className='gfpdf-step'>
      <h2>Your PDFs are ready and the download will begin shortly.</h2>

      <p>
        The zip file contains the PDFs for your selected entries. <a href={downloadZipUrl} download>Click here if
        the download does not
        start automatically</a>.
      </p>
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
Step3Body.propTypes = {
  downloadZipUrl: PropTypes.string.isRequired,
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

export default Step3Body
