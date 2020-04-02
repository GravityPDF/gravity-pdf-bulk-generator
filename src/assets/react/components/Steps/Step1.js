/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

/* Redux Actions */
import { updateDirectoryStructure } from '../../actions/tagPicker'
import { generateSessionId, togglePdfStatus, toggleModal } from '../../actions/pdf'

/* Components */
import Step1Body from './Step1Body'
import ProgressBar from '../ProgressBar/ProgressBar'

/* Helpers */
import { stripForwardSlashes } from '../../helpers/stripForwardSlashes'
import { cancelButton } from '../../helpers/cancelButton'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Step1 Component
 *
 * @since 1.0
 */
class Step1 extends React.Component {

  /**
   * PropTypes
   *
   * @since 1.0
   */
  static propTypes = {
    directoryStructure: PropTypes.string.isRequired,
    pdfList: PropTypes.array.isRequired,
    generateSessionId: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    updateDirectoryStructure: PropTypes.func.isRequired,
    togglePdfStatus: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleModal: PropTypes.func.isRequired
  }

  /**
   * Initialize component state
   *
   * @type {concurrency: number, retryInterval: number, delayInterval: number
   *
   * @since 1.0
   */
  state = {
    concurrency: 5,
    retryInterval: 3,
    delayInterval: 3000
  }

  /**
   * Add focus event to document on mount
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
   * Request to build the bulk PDF download. Generate session ID and process to Step2
   *
   * @param e
   *
   * @since 1.0
   */
  build = e => {
    e.preventDefault()

    const { concurrency, retryInterval, delayInterval } = this.state
    const { directoryStructure, pdfList } = this.props

    /* Generate active PDF list */
    const activePdfList = []
    pdfList.map(item => {
      item.active && activePdfList.push(item.id)
    })

    /* Check if there's an active PDF selected */
    if (activePdfList.length === 0) {
      alert('Please select at least one PDF to generate for the entries.')
    } else {
      /* Strip out forward slashes before passing to path */
      const path = stripForwardSlashes(directoryStructure)

      /* Generate session ID and  */
      this.props.generateSessionId(path, concurrency, retryInterval, delayInterval)
      this.props.history.push('/step/2')
    }
  }

  /**
   * Update tag directory structure, adding '/' between tags
   *
   * @param tag
   *
   * @since 1.0
   */
  tagSelect = tag => {
    const { directoryStructure } = this.props

    this.props.updateDirectoryStructure(directoryStructure + tag + '/')
  }

  /**
   * Update tag directory structure, removing a tag and '/' at the end of it
   *
   * @param tag
   *
   * @since 1.0
   */
  tagDeselect = tag => {
    const { directoryStructure } = this.props

    this.props.updateDirectoryStructure(directoryStructure.replace(tag + '/', ''))
  }

  /**
   * Display Step1 UI
   *
   * @returns {Step1: component}
   *
   * @since 1.0
   */
  render () {
    const {
      pdfList,
      togglePdfStatus,
      directoryStructure,
      updateDirectoryStructure,
      tags,
      toggleModal,
      history
    } = this.props

    return (
      <div ref={node => this.container = node} tabIndex='-1'>
        <button
          className='gfpdf-close-button'
          onClick={e => cancelButton({ e, toggleModal, history })}>
          <span className='screen-reader-text'>Close dialog</span>
        </button>

        <ProgressBar step={1} />

        <Step1Body
          pdfList={pdfList}
          togglePdfStatus={togglePdfStatus}
          directoryStructure={directoryStructure}
          updateDirectoryStructure={updateDirectoryStructure}
          tags={tags}
          tagSelect={this.tagSelect}
          tagDeselect={this.tagDeselect} />

        <footer>
          <button
            className='button-primary build'
            onClick={this.build}>
            Build
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
 * @returns {tags: array of objects, directoryStructure: string, pdfList: array}
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
  selectedEntryIdsError: state.form.selectedEntryIdsError,
  tags: state.tagPicker.tags,
  directoryStructure: state.tagPicker.directoryStructure,
  pdfList: state.pdf.pdfList
})

/**
 * Connect and dispatch redux actions as props
 *
 * @since 1.0
 */
export default connect(mapStateToProps, {
  updateDirectoryStructure,
  generateSessionId,
  togglePdfStatus,
  toggleModal
})(Step1)
