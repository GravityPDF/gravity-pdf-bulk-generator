/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/* Helpers */
import language from '../../helpers/language'
import { sprintf } from 'sprintf-js'

const FatalError = ({ pluginUrl, adminUrl }) => (
  <section id='gfpdf-fatal-error' className='gfpdf-step'>
    <div id='gfpdf-fatal-error-title'>{language.fatalErrorTitle}</div>
    <div id='gfpdf-fatal-error-desc'>{language.fatalErrorDescription}</div>

    <img
      src={pluginUrl + 'src/assets/images/Fatal-Error-Capt-Paws-Artwork.png'}
      alt={language.fatalErrorImageAlt} />

    <p dangerouslySetInnerHTML={{__html: sprintf(language.fatalErrorInformation, '<a href="'+adminUrl+'admin.php?page=gf_settings">', '<a href="https://gravitypdf.com/support/#contact-support">', '</a>')}}/>
  </section>
)

FatalError.propTypes = {
  pluginUrl: PropTypes.string.isRequired,
  adminUrl: PropTypes.string.isRequired
}

export default FatalError
