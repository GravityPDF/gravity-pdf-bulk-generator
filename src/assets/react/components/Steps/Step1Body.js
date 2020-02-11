import React from 'react'
import PropTypes from 'prop-types'
import ListToggle from '../ListToggle'
import TagInput from '../TagPicker/TagInput'
import TagPicker from '../TagPicker/TagPicker'

const Step1Body = (
  {
    pdfList,
    togglePdfStatus,
    directoryStructure,
    updateDirectoryStructure,
    tags,
    tagSelect,
    tagDeselect
  }
) => {
  return (
    <section id='gfpdf-step1' className='gfpdf-step' tabIndex='disabke'>
      <div className='gfpdf-settings-group'>
        <h3>Select PDFs</h3>

        <p>Specify which PDFs you would like to generate for the selected entries.</p>

        <ListToggle
          items={pdfList}
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
          onSelectCallback={tagSelect}
          onDeselectCallback={tagDeselect}
          inputValue={directoryStructure} />
      </div>
    </section>
  )
}

Step1Body.propTypes = {
  pdfList: PropTypes.array.isRequired,
  togglePdfStatus: PropTypes.func.isRequired,
  directoryStructure: PropTypes.string.isRequired,
  updateDirectoryStructure: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  tagSelect: PropTypes.func.isRequired,
  tagDeselect: PropTypes.func.isRequired
}

export default Step1Body
