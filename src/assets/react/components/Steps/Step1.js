import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { updateDirectoryStructure } from '../../actions/tagPicker'
import {
  generateActivePDFlist,
  getSessionID,
  togglePdfStatus,
  toggleModal
} from '../../actions/pdf'
import ListToggle from '../ListToggle'
import ProgressBar from '../ProgressBar'
import TagPicker from '../TagPicker/TagPicker'
import TagInput from '../TagPicker/TagInput'
import { cancelButton } from '../../helpers/cancelButton'

class Step1 extends React.Component {

  build = e => {
    e.preventDefault()

    const { list } = this.props.pdf
    const { directoryStructure } = this.props.tagPicker
    const activePDFlist = []

    list.map(item => {
      item.active && activePDFlist.push(item.id)
    })

    if (activePDFlist.length === 0) {
      alert('Please specify at least one PDF you would like to generate for the selected entries.')
    } else {
      this.props.generateActivePDFlist(activePDFlist)
      this.props.getSessionID(directoryStructure)
      this.props.history.push('/step/2')
    }
  }

  tagSelect = tag => {
    const { directoryStructure } = this.props.tagPicker

    this.props.updateDirectoryStructure(directoryStructure + tag + '/')
  }

  tagDeselect = tag => {
    const { directoryStructure } = this.props.tagPicker

    this.props.updateDirectoryStructure(directoryStructure.replace(tag + '/', ''))
  }

  render () {
    const {
      togglePdfStatus,
      updateDirectoryStructure,
      history,
      toggleModal
    } = this.props
    const { list } = this.props.pdf
    const { tags, directoryStructure } = this.props.tagPicker

    return (
      <Fragment>
        <ProgressBar step={1} />

        <section id='gfpdf-step1' className='gfpdf-step'>
          <div className='gfpdf-settings-group'>
            <h3>Select PDFs</h3>

            <p>Specify which PDFs you would like to generate for the selected entries.</p>

            <ListToggle
              items={list}
              onChange={togglePdfStatus} />
          </div>

          <div className='gfpdf-settings-group'>
            <h3>Directory Structure</h3>

            <p>Specify the directory structure to use for the PDFs of the selected entries. Merge tags are
              supported.</p>

            <TagInput
              value={directoryStructure}
              onChange={updateDirectoryStructure} />

            <p>Common tags:</p>

            <TagPicker
              tags={tags}
              onSelectCallback={this.tagSelect}
              onDeselectCallback={this.tagDeselect}
              inputValue={directoryStructure} />
          </div>
        </section>

        <footer>
          <button
            className='button button-large'
            onClick={e => cancelButton(e, { history, toggleModal })}>
            Cancel
          </button>

          <button
            className='button button-primary button-large'
            onClick={this.build}>
            Build
          </button>
        </footer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  pdf: state.pdf,
  tagPicker: state.tagPicker
})

export default connect(mapStateToProps, {
  updateDirectoryStructure,
  generateActivePDFlist,
  getSessionID,
  togglePdfStatus,
  toggleModal
})(Step1)
