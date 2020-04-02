/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { PoseGroup } from 'react-pose'

/* Redux Actions */
import { escapeCloseModal, generatePdfCancel, resetPdfState } from '../../actions/pdf'
import { resetTagPickerState } from '../../actions/tagPicker'

/* Components */
import { cancelButton } from '../../helpers/cancelButton'
import { Fade, SlideDown } from './Animations'
import { Overlay } from './Overlay'
import Steps from '../Steps/Steps'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * PopUp Component
 *
 * @since 1.0
 */
class PopUp extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
  static propTypes = {
    escapeCloseModal: PropTypes.func.isRequired,
    generatePdfCancel: PropTypes.func.isRequired,
    resetTagPickerState: PropTypes.func.isRequired,
    resetPdfState: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    modal: PropTypes.bool.isRequired,
    selectedEntryIdsError: PropTypes.string.isRequired
  }

  /**
   * Assign keyword listener to document on mount
   *
   * @since 1.0
   */
  componentDidMount () {
    document.addEventListener('keydown', this.escapeKeyListener)
  }

  /**
   * Listen if 'escape' key is pressed from the keyboard
   *
   * @param event
   *
   * @since 1.0
   */
  escapeKeyListener = e => {
    const {
      escapeCloseModal,
      generatePdfCancel,
      selectedEntryIdsError,
      resetTagPickerState,
      resetPdfState,
      history
    } = this.props
    const { pathname } = history.location
    const { keyCode } = e
    const escapeKey = 27

    /* 'escape' key is pressed at Step1 */
    if (keyCode === escapeKey && pathname === '/step/1') {
      cancelButton({ escapeCloseModal, history })
    }

    /* 'escape' key is pressed at Step2 */
    if (keyCode === escapeKey && pathname === '/step/2') {
      cancelButton({
        escapeCloseModal,
        generatePdfCancel,
        selectedEntryIdsError,
        history
      })
    }

    /* 'escape' key is pressed at Step3 */
    if (keyCode === escapeKey && pathname === '/step/3') {
      cancelButton({
        escapeCloseModal,
        resetTagPickerState,
        resetPdfState,
        history
      })
    }
  }

  /**
   * Display PopUp UI
   *
   * @returns {PopUp: component}
   *
   * @since 1.0
   */
  render () {
    return (
      <PoseGroup flipMove={false}>
        {this.props.modal && [
          <Fade key='fade'>
            <Route
              key='overlay'
              path='/step'
              component={Overlay} />
          </Fade>,

          <SlideDown
            key='slidedown'
            id='gfpdf-bulk-generator-popup'>
            <Route
              key='steps'
              path='/step/:stepId'
              component={Steps} />
          </SlideDown>
        ]}
      </PoseGroup>
    )
  }
}

/**
 * Map redux state to props
 *
 * @param state
 *
 * @returns {selectedEntryIdsError: string}
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  selectedEntryIdsError: state.form.selectedEntryIdsError
})

/**
 * Connect and dispatch redux actions as props
 *
 * @since 1.0
 */
export default connect(mapStateToProps, {
  escapeCloseModal,
  generatePdfCancel,
  resetTagPickerState,
  resetPdfState
})(PopUp)
