import React from 'react'
import Logs from '../Logs/Logs'
import PropTypes from 'prop-types'

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
