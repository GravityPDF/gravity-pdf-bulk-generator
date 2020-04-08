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
 *
 * @returns { Step3Body: component }
 *
 * @since 1.0
 */
const Step3Body = ({ downloadZipUrl }) => (
  <section>
    <div id='gfpdf-step-3' className='gfpdf-step'>
      <h2>Your PDFs are ready and the download will begin shortly.</h2>

      <p>
        The zip file contains the PDFs for your selected entries.
        <a href={downloadZipUrl} download>Click here if the download does not start automatically</a>.
      </p>
    </div>

    <Logs />
  </section>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
Step3Body.propTypes = {
  downloadZipUrl: PropTypes.string.isRequired
}

export default Step3Body
