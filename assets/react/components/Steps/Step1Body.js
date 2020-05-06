/* Dependencies */
import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { sprintf } from 'sprintf-js'
/* Components */
import LoadingSuspense from '../Loading/LoadingSuspense'
import TagInput from '../TagPicker/TagInput'
import TagPicker from '../TagPicker/TagPicker'
/* Helpers */
import language from '../../helpers/language'

/* Lazy Load Components */
const PdfListContainer = lazy(() => import('../PdfList/PdfListContainer'))

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
 * @returns { Step1Body: component }
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
  <section
    data-test='component-Step1Body'
    id='gfpdf-step1'
    className='gfpdf-step'
  >
    <div className='gfpdf-settings-group'>
      <h3>{language.stepSelectPdfs}</h3>

      <p>{language.stepSelectPdfsDesc}</p>

      <Suspense fallback={<LoadingSuspense />}>
        <PdfListContainer
          items={pdfList}
          onChange={togglePdfStatus}
        />
      </Suspense>
    </div>

    <div className='gfpdf-settings-group'>
      <h3>{language.stepDirectoryStructure}</h3>

      <p dangerouslySetInnerHTML={{ __html: sprintf(language.stepDirectoryStructureDesc, '<a href="https://docs.gravityforms.com/category/user-guides/merge-tags-getting-started/">', '</a>') }} />

      <TagInput
        value={directoryStructure}
        onChange={updateDirectoryStructure}
      />

      <p>{language.stepCommonTagsLabel}</p>

      <TagPicker
        tags={tags}
        onSelectCallback={tagSelect}
        onDeselectCallback={tagDeselect}
        inputValue={directoryStructure}
      />
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
