/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display TagInput UI
 *
 * @param value
 * @param onChange
 *
 * @returns {TagInput: component}
 *
 * @since 1.0
 */
const TagInput = ({ value, onChange }) => {
  return (
    <input
      data-test='component-TagInput'
      type='text'
      name='gfpdf-directory-structure'
      value={value}
      className='large-text code'
      onChange={(e) => onChange(e.target.value)} />
  )
}

/**
 * PropTypes
 *
 * @since 1.0
 */
TagInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default TagInput
