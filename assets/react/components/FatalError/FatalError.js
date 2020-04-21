/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { sprintf } from 'sprintf-js'
/* Helpers */
import language from '../../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display FatalError UI
 *
 * @param pluginUrl
 * @param adminUrl
 *
 * @returns { FatalError: component }
 *
 * @since 1.0
 */
const FatalError = ({ pluginUrl, adminUrl }) => (
  <section
    data-test='component-FatalError'
    id='gfpdf-fatal-error'
    className='gfpdf-step'
  >
    <div id='gfpdf-fatal-error-title'>{language.fatalErrorTitle}</div>
    <div id='gfpdf-fatal-error-desc'>{language.fatalErrorDescription}</div>

    <img
      src={pluginUrl + 'assets/images/Fatal-Error-Capt-Paws-Artwork.png'}
      alt={language.fatalErrorImageAlt}
    />

    <p dangerouslySetInnerHTML={{ __html: sprintf(language.fatalErrorInformation, '<a href="' + adminUrl + 'admin.php?page=gf_settings">', '<a href="https://gravitypdf.com/support/#contact-support">', '</a>') }} />
  </section>
)

FatalError.propTypes = {
  pluginUrl: PropTypes.string.isRequired,
  adminUrl: PropTypes.string.isRequired
}

export default FatalError
