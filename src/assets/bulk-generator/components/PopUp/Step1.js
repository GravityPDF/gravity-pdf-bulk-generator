import React from 'react'
import { connect } from 'react-redux'
import { updateDirectoryStructure } from '../../actions/tagPicker'
import { togglePdfStatus } from '../../actions/pdf'
import ListToggle from '../ListToggle'
import TagPicker from '../TagPicker/TagPicker'
import TagInput from '../TagPicker/TagInput'
import ProgressBar from './ProgressBar'

class Step1 extends React.Component {
  cancel = event => {
    event.stopPropagation()
    this.props.history.push('/')
  }

  tagSelect = (tag) => {
    this.props.updateDirectoryStructure(this.props.directoryStructure + tag + '/')
  }

  tagDeselect = (tag) => {
    this.props.updateDirectoryStructure(this.props.directoryStructure.replace(tag + '/', ''))
  }

  render () {
    return (
      <>
        <ProgressBar step={1} />

        <section className="gfpdf-step">
          <div className="gfpdf-settings-group">
            <h3>Select PDFs</h3>

            <p>Specify which PDFs you would like to generate for the selected entries.</p>

            <ListToggle items={this.props.pdfs} onChange={this.props.updateActivePdfs} />
          </div>

          <div className="gfpdf-settings-group">
            <h3>Directory Structure</h3>

            <p>Specify the directory structure to use for the PDFs of the selected entries. Merge tags are supported.</p>

            <TagInput value={this.props.directoryStructure} onChange={this.props.updateDirectoryStructure} />

            <p>Common tags:</p>

            <TagPicker
              tags={this.props.tags}
              onSelectCallback={this.tagSelect}
              onDeselectCallback={this.tagDeselect}
              inputValue={this.props.directoryStructure}
            />
          </div>

        </section>

        <footer>
          <button className="button button-large" onClick={this.cancel}>Cancel</button>

          <button className="button button-primary button-large">Build</button>
        </footer>
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateDirectoryStructure: (value) => {
      dispatch(updateDirectoryStructure(value))
    },

    updateActivePdfs: (index) => {
      dispatch(togglePdfStatus(index))
    }
  }
}

const MapStateToProps = (state) => {
  return {
    pdfs: state.pdf.list,
    tags: state.tagPicker.tags,
    directoryStructure: state.tagPicker.directoryStructure,
  }
}

export default connect(MapStateToProps, mapDispatchToProps)(Step1)
