/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { PoseGroup } from 'react-pose'
/* Components */
import { cancelModal } from '../../helpers/cancelModal'
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
    fatalError: PropTypes.bool.isRequired,
    modal: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
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
   * @param e
   *
   * @since 1.0
   */
  escapeKeyListener = e => {
    const { keyCode } = e
    const escapeKey = 27
    const { fatalError, history } = this.props

    /* 'escape' key is pressed */
    if (keyCode === escapeKey) {
      cancelModal({ e, fatalError, history })
    }
  }

  /**
   * Display PopUp UI
   *
   * @returns { PopUp: component }
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
 * @returns { fatalError: boolean }
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  fatalError: state.pdf.fatalError
})

export default connect(mapStateToProps, null)(PopUp)
