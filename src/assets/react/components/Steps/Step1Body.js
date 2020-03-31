/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/* Components */
import ListToggle from '../ListToggle/ListToggle'
import TagInput from '../TagPicker/TagInput'
import TagPicker from '../TagPicker/TagPicker'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display Step1Body UI
 *
 * @param pdfList
 * @param togglePdfStatus
 * @param directoryStructure
 * @param updateDirectoryStructure
 * @param tags
 * @param tagSelect
 * @param tagDeselect
 *
 * @returns {Step1Body: component}
 *
 * @since 1.0
 */
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
) => (
  <section id='gfpdf-step1' className='gfpdf-step'>
    <div className='gfpdf-settings-group'>
      <h3>Select PDFs</h3>

      <p>Specify the PDFs you would like to generate for the selected entries.</p>

      <ListToggle
        items={pdfList}
        onChange={togglePdfStatus} />
    </div>

    <div className='gfpdf-settings-group'>
      <h3>Directory Structure</h3>

      <p>Specify the directory structure to use for the PDFs of the selected entries. Form merge tags are
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

/**
 * PropTypes
 *
 * @since 1.0
 */
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
