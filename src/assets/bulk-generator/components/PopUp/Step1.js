import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { connect } from 'react-redux'
import { updateDirectoryStructure } from '../../actions/tagPicker'
import Switch from '../Switch/Switch'
import TagPicker from '../TagPicker/TagPicker'
import TagInput from '../TagPicker/TagInput'

class Step1 extends React.Component {
  cancel = event => {
    unmountComponentAtNode(this.props.container)
    event.stopPropagation()
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
        <section className="gfpdf-step">
          <div className="gfpdf-settings-group">
            <h3>Select PDFs</h3>

            <p>Specify which PDFs you would like to generate for the selected entries.</p>

            <ol className="gfpdf-toggle-list">
              <li>
                <label>Certificate of Completion <span>(ID: 1234567)</span></label>

                <Switch screenReaderLabel="Label" />
              </li>

              <li>
                <label>Certificate of Completion <span>ID: 1234567</span></label>

                <Switch screenReaderLabel="Label" />
              </li>
            </ol>
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
    }
  }
}

const MapStateToProps = (state) => {
  return {
    tags: state.tagPicker.tags,
    directoryStructure: state.tagPicker.directoryStructure,
  }
}

export default connect(MapStateToProps, mapDispatchToProps)(Step1)
