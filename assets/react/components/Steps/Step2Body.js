/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgressbar } from 'react-circular-progressbar'
/* Components */
import LoadingDots from '../Loading/LoadingDots'
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
 * Display Step2Body UI
 *
 * @param downloadPercentage
 *
 * @returns { Step2Body: component }
 *
 * @since 1.0
 */
const Step2Body = ({ downloadPercentage }) => (
  <section data-test='component-Step2Body' className='gfpdf-step'>
    <div id='gfpdf-step-2'>
      <CircularProgressbar
        value={downloadPercentage}
        text={`${downloadPercentage}%`}
      />

      <h2>{language.stepBuildingPdfs}<LoadingDots /></h2>
      <em>{language.stepDoNotNavigateAway}</em>
    </div>

    <Logs data-test='component-Logs' />
  </section>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
Step2Body.propTypes = {
  downloadPercentage: PropTypes.number.isRequired
}

export default Step2Body
