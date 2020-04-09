/* Dependencies */
import { sprintf } from 'sprintf-js'
import React from 'react'
import PropTypes from 'prop-types'
/* Components */
import Logs from '../Logs/Logs'

/* Helpers */
import language from '../../helpers/language'

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
      <h2>{language.stepDownloadTitle}</h2>

      <p dangerouslySetInnerHTML={{__html: sprintf(language.stepDownloadDescription, '<a href="'+downloadZipUrl+'" download>', '</a>')}}/>
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
