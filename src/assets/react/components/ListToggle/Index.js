import React from 'react'
import PropTypes from 'prop-types'
import Switch from '../Switch/Switch'

const ListToggle = ({ items, onChange }) => {
  return (
    <ol className='gfpdf-toggle-list'>
      {
        items.map((pdf, index) => {
          return (
            <li key={index}>
              <label
                onClick={() => onChange(index)}>
                {pdf.name} <span>(ID: {pdf.id})</span>
              </label>

              <Switch
                screenReaderLabel='Label'
                active={pdf.active}
                onChange={onChange}
                id={index} />
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
      name: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ListToggle
