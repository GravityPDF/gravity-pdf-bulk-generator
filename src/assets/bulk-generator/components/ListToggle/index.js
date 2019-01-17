import React from 'react'
import Switch from '../Switch/Switch'
import PropTypes from 'prop-types'

const ListToggle = ({items, onChange}) => {
  return (
    <ol className="gfpdf-toggle-list">
      {
        items.map((pdf, index) => {
          return (
            <li key={index}>
              <label onClick={() => onChange(index)}>{pdf.label} <span>(ID: {pdf.id})</span></label>

              <Switch screenReaderLabel="Label" active={pdf.active} onChange={onChange} id={index} />
            </li>
          )
        })
      }
    </ol>
  )
}

ListToggle.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ListToggle