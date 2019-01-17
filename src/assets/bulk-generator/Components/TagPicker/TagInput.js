import React from 'react'
import PropTypes from 'prop-types'

const TagInput = ({value, onChange}) => {
  return (
    <input type="text" name="gfpdf-directory-structure" value={value} className="large-text code" onChange={(e) => onChange(e.target.value)} />
  )
}

TagInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default TagInput