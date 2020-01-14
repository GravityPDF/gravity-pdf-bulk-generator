import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { updateDirectoryStructure } from '../../actions/tagPicker'
import { togglePdfStatus, disableModal } from '../../actions/pdf'
import ListToggle from '../ListToggle/index'
import TagPicker from '../TagPicker/TagPicker'
import TagInput from '../TagPicker/TagInput'
import ProgressBar from '../ProgressBar'
import './Step1.scss'

class Step1 extends React.Component {

  cancel = event => {
    event.stopPropagation()
    event.preventDefault()
    this.props.history.push('/')
    this.props.disableModal()
  }

  build = event => {
    event.stopPropagation()
    event.preventDefault()
    this.props.history.push('/step/2')
  }

  tagSelect = (tag) => {
    this.props.updateDirectoryStructure(this.props.directoryStructure + tag + '/')
  }

  tagDeselect = (tag) => {
    this.props.updateDirectoryStructure(this.props.directoryStructure.replace(tag + '/', ''))
  }

  render () {
    return (
      <Fragment>
        <ProgressBar step={1} />

        <section id='gfpdf-step1' className='gfpdf-step'>
          <div className='gfpdf-settings-group'>
            <h3>Select PDFs</h3>

            <p>Specify which PDFs you would like to generate for the selected entries.</p>

            <ListToggle
              items={this.props.pdfs}
              onChange={this.props.togglePdfStatus} />
          </div>

          <div className='gfpdf-settings-group'>
            <h3>Directory Structure</h3>

            <p>Specify the directory structure to use for the PDFs of the selected entries. Merge tags are
              supported.</p>

            <TagInput
              value={this.props.directoryStructure}
              onChange={this.props.updateDirectoryStructure} />

            <p>Common tags:</p>

            <TagPicker
              tags={this.props.tags}
              onSelectCallback={this.tagSelect}
              onDeselectCallback={this.tagDeselect}
              inputValue={this.props.directoryStructure} />
          </div>
        </section>

        <footer>
          <button
            className='button button-large'
            onClick={this.cancel}>
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

const MapStateToProps = state => ({
  pdfs: state.pdf.list,
  tags: state.tagPicker.tags,
  directoryStructure: state.tagPicker.directoryStructure
})

export default connect(MapStateToProps, {
  updateDirectoryStructure,
  togglePdfStatus,
  disableModal
})(Step1)
