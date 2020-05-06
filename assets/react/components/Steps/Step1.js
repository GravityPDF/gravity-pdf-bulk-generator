/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
/* Redux Actions */
import { updateDirectoryStructure } from '../../actions/tagPicker'
import { generateSessionId, togglePdfStatus } from '../../actions/pdf'
/* Components */
import ProgressBar from '../ProgressBar/ProgressBar'
import Step1Body from './Step1Body'
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
 * Step1 Component
 *
 * @since 1.0
 */
export class Step1 extends React.Component {
  /**
   * PropTypes
   *
   * @since 1.0
   */
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object).isRequired,
    directoryStructure: PropTypes.string.isRequired,
    pdfList: PropTypes.array.isRequired,
    updateDirectoryStructure: PropTypes.func.isRequired,
    generateSessionId: PropTypes.func.isRequired,
    togglePdfStatus: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  /**
   * Initialize component state
   *
   * @type { concurrency: int }
   *
   * @since 1.0
   */
  state = {
    concurrency: 5
  }

  /**
   * On mount, Add focus event to document on mount
   *
   * @since 1.0
   */
  componentDidMount () {
    document.addEventListener('focus', this.handleFocus, true)
    document.addEventListener('keypress', this.handleEnter)
  }

  /**
   * Cleanup our document event listeners
   *
   * @since 1.0
   */
  componentWillUnmount () {
    document.removeEventListener('focus', this.handleFocus, true)
    document.removeEventListener('keypress', this.handleEnter)
  }

  /**
   * When a focus event is fired and it's not apart of any DOM elements in our
   * container we will focus the container instead. In most cases this keeps the focus from
   * jumping outside our Template Container and allows for better keyboard navigation.
   *
   * @param e: object
   *
   * @since 1.0
   */
  handleFocus = e => {
    if (!this.container.contains(e.target)) {
      this.container.focus()
    }
  }

  /**
   * Handle 'enter' key press from the keyboard
   *
   * @param e
   *
   * @since 1.0
   */
  handleEnter = e => {
    if (e.key === 'Enter') {
      this.handleBuild(e)
    }
  }

  /**
   * Request to build the bulk PDF download. Generate session ID and process to Step2
   *
   * @param e: object
   *
   * @since 1.0
   */
  handleBuild = e => {
    e.preventDefault()

    const { concurrency } = this.state
    const { directoryStructure, pdfList } = this.props

    /* Generate active PDF list */
    const activePdfList = []
    pdfList.map(item => {
      item.active && activePdfList.push(item.id)
    })

    /* Check if there's an active PDF selected */
    if (activePdfList.length === 0) {
      window.alert(language.stepActivePdfEmpty)
    } else {
      /* Kick off the Bulk Generator Process */
      this.props.generateSessionId(directoryStructure, concurrency)
    }
  }

  /**
   * Update tag directory structure, adding '/' between tags
   *
   * @param tag: string
   *
   * @since 1.0
   */
  tagSelect = tag => {
    let { directoryStructure } = this.props

    if (directoryStructure[directoryStructure.length - 1] !== '/') {
      directoryStructure = directoryStructure + '/'
    }

    this.props.updateDirectoryStructure(directoryStructure + tag + '/')
  }

  /**
   * Update tag directory structure, removing a tag and '/' at the end of it
   *
   * @param tag: string
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
   * @returns { Step1: component }
   *
   * @since 1.0
   */
  render () {
    const {
      tags,
      directoryStructure,
      pdfList,
      updateDirectoryStructure,
      togglePdfStatus,
      history
    } = this.props

    return (
      <div
        data-test='component-Step1'
        ref={node => (this.container = node)}
        tabIndex='-1'
      >
        <button
          className='gfpdf-close-button'
          onClick={e => cancelModal({ e, history })}
        >
          <span className='screen-reader-text'>{language.stepCloseDialog}</span>
        </button>

        <ProgressBar step={1} />

        <Step1Body
          pdfList={pdfList}
          togglePdfStatus={togglePdfStatus}
          directoryStructure={directoryStructure}
          updateDirectoryStructure={updateDirectoryStructure}
          tags={tags}
          tagSelect={this.tagSelect}
          tagDeselect={this.tagDeselect}
        />

        <footer>
          <button
            className='button-primary build'
            onClick={this.handleBuild}
          >
            {language.stepBuild}
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
 * @returns { tags: array of objects, directoryStructure: string, pdfList: array }
 *
 * @since 1.0
 */
const mapStateToProps = state => ({
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
  togglePdfStatus
})(Step1)
