import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { PoseGroup } from 'react-pose'
import {
  escapeCloseModal,
  generatePdfCancel,
  generatePdfToggleCancel,
  resetPdfState
} from '../../actions/pdf'
import { resetTagPickerState } from '../../actions/tagPicker'
import { cancelButton } from '../../helpers/cancelButton'
import { Fade, SlideDown } from './Animations'
import { Overlay } from './Overlay'
import Steps from '../Steps/Steps'

class PopUp extends React.Component {

  static propTypes = {
    downloadPercentage: PropTypes.number.isRequired,
    escapeCloseModal: PropTypes.func.isRequired,
    generatePdfCancel: PropTypes.func.isRequired,
    generatePdfToggleCancel: PropTypes.func.isRequired,
    resetTagPickerState: PropTypes.func.isRequired,
    resetPdfState: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    modal: PropTypes.bool.isRequired
  }

  componentDidMount () {
    document.addEventListener('keydown', this.escapeKeyListener)
  }

  escapeKeyListener = e => {
    const {
      escapeCloseModal,
      downloadPercentage,
      generatePdfCancel,
      generatePdfToggleCancel,
      resetTagPickerState,
      resetPdfState,
      history
    } = this.props
    const { pathname } = history.location
    const { keyCode } = e
    const escapeKey = 27

    if (keyCode === escapeKey && pathname === '/step/1') {
      cancelButton({ escapeCloseModal, history })
    }

    if (keyCode === escapeKey && pathname === '/step/2') {
      cancelButton({
        escapeCloseModal,
        downloadPercentage,
        generatePdfCancel,
        generatePdfToggleCancel,
        history
      })
    }

    if (keyCode === escapeKey && pathname === '/step/3') {
      cancelButton({
        escapeCloseModal,
        resetTagPickerState,
        resetPdfState,
        history
      })
    }
  }

  render () {
    return (
      <PoseGroup flipMove={false}>
        {this.props.modal && (
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
        )}
      </PoseGroup>
    )
  }
}

const mapStateToProps = state => ({
  downloadPercentage: state.pdf.downloadPercentage
})

export default connect(mapStateToProps, {
  escapeCloseModal,
  generatePdfCancel,
  generatePdfToggleCancel,
  resetTagPickerState,
  resetPdfState
})(PopUp)
