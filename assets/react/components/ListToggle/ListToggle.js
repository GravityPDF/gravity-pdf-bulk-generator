/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
/* Components */
import Switch from '../Switch/Switch'
/* Helpers */
import language from '../../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display PDF list and toggle switch option
 *
 * @param items
 * @param onChange
 *
 * @returns { ListToggle: component }
 *
 * @since 1.0
 */
const ListToggle = ({ items, onChange }) => (
  <ol className='gfpdf-toggle-list'>
    {
      items.map((pdf, index) => {
        return (
          <li key={index}>
            <label
              className={pdf.id === '0' ? 'toggleAll': ''}
              onClick={() => onChange(index)}>
              {pdf.name} <span>{pdf.id !== '0' ? ('ID: ' + pdf.id) : ''}</span>
            </label>

            <Switch
              screenReaderLabel={language.label}
              active={pdf.active}
              onChange={onChange}
              id={index} />
          </li>
        )
      })
    }
  </ol>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
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
