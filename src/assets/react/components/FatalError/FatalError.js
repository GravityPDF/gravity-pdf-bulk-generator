/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

const FatalError = ({ pluginUrl, adminUrl }) => (
  <section id='gfpdf-fatal-error' className='gfpdf-step'>
    <div id='gfpdf-fatal-error-title'>Oops...</div>
    <div id='gfpdf-fatal-error-desc'>An error occurred which prevented the Bulk Generator from completing!</div>

    <img
      src={pluginUrl + 'src/assets/images/Fatal-Error-Capt-Paws-Artwork.png'}
      alt='Tech boffins at work.' />

    <p>
      Reload the page and try again. If the issue persists, <a href={adminUrl + 'admin.php?page=gf_settings'}>enable
      Logging</a>, re-run the generator and then <a href='https://gravitypdf.com/support/#contact-support'>fill out a
      support ticket</a>. One of our tech boffins will be happy to assist.
    </p>
  </section>
)

FatalError.propTypes = {
  pluginUrl: PropTypes.string.isRequired,
  adminUrl: PropTypes.string.isRequired
}

export default FatalError
