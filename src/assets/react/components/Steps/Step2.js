/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
/* Redux Actions */
import { toggleModal } from '../../actions/pdf'
/* Components */
import ProgressBar from '../ProgressBar/ProgressBar'
import Step2Body from './Step2Body'
import FatalError from '../FatalError/FatalError'
/* Helpers */
import { cancelModal } from '../../helpers/cancelModal'
import language from '../../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Step2 Component
 *
 * @since 1.0
 */
class Step2 extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
  static propTypes = {
    downloadPercentage: PropTypes.number.isRequired,
    toggleModal: PropTypes.func.isRequired,
    fatalError: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
  }

  /**
   * On mount, Add focus event to document and call function errorHandling()
   *
   * @since 1.0
   */
  componentDidMount () {
    document.addEventListener('focus', this.handleFocus, true)
  }

  /**
   * Cleanup our document event listeners
   *
   * @since 1.0
   */
  componentWillUnmount () {
    document.removeEventListener('focus', this.handleFocus, true)
  }

  /**
   * When a focus event is fired and it's not apart of any DOM elements in our
   * container we will focus the container instead. In most cases this keeps the focus from
   * jumping outside our Template Container and allows for better keyboard navigation.
   *
   * @param e
   *
   * @since 1.0
   */
  handleFocus = e => {
    if (!this.container.contains(e.target)) {
      this.container.focus()
    }
  }

  /**
   * Display Step2 UI
   *
   * @returns { Step2: component }
   *
   * @since 1.0
   */
  render () {
    const { downloadPercentage, fatalError, toggleModal, history } = this.props

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <ProgressBar step={2} />

        {!fatalError && <Step2Body downloadPercentage={downloadPercentage} />}

        {
          fatalError &&
          <FatalError
            pluginUrl={GPDF_BULK_GENERATOR.plugin_url}
            adminUrl={GPDF_BULK_GENERATOR.admin_url} />
        }

        <footer>
          <button
            className='button cancel'
            onClick={e => cancelModal({ e, toggleModal, fatalError, history })}>
            {language.cancelLabel}
          </button>
        </footer>
      </div>
    )
  }
}

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns { downloadPercentage: int, fatalError: boolean }
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  downloadPercentage: state.pdf.downloadPercentage,
  fatalError: state.pdf.fatalError
})

/**
 * Connect and dispatch redux actions as props
 *
 * @since 1.0
 */
export default connect(mapStateToProps, { toggleModal })(Step2)
