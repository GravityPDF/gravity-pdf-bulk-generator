/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { PoseGroup } from 'react-pose'
/* Components */
import { cancelModal } from '../../helpers/cancelModal'
import { SlideDown } from './Animations'
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
export class PopUp extends React.Component {
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
    document.addEventListener('keydown', this.keyListener)
  }

  /**
   * Cleanup our document event listeners
   *
   * @since 1.0
   */
  componentWillUnmount () {
    document.removeEventListener('keydown', this.keyListener)
  }

  /**
   * Handle key presses from the keyboard
   *
   * @param e: object
   *
   * @since 1.0
   */
  keyListener = e => {
    const { modal, fatalError, history } = this.props

    /* Don't handle keys if the modal is currently closed */
    if (!modal) {
      return
    }

    switch (e.key) {
      case 'Escape':
        cancelModal({ e, fatalError, history })
        break

      case 'Enter':
        /* Skip this if on Step 1 (handled there) */
        if (history.location.pathname !== '/step/1') {
          e.preventDefault()
        }
        break
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
      <PoseGroup data-test='component-PopUp' flipMove={false}>
        {this.props.modal && [
          <Route
            key='overlay'
            path='/step'
            component={Overlay}
          />,

          <SlideDown
            key='slideDown'
            id='gfpdf-bulk-generator-popup'
          >
            <Route
              key='steps'
              path='/step/:stepId'
              component={Steps}
            />
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

export default connect(mapStateToProps, {})(PopUp)
