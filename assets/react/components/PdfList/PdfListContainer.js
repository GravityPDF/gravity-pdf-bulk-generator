/* Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as Container } from 'react-window'
/* Components */
import PdfList from './PdfList'
/* Helpers */
import language from '../../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.1
 */

/**
 * Display PDF list container and toggle switch option
 *
 * @param items
 * @param onChange
 *
 * @returns { PdfListContainer: component }
 *
 * @since 1.0
 */
const PdfListContainer = ({ items, onChange }) => (
  <Container
    data-test='component-PdfListContainer'
    className='gfpdf-pdf-list-container'
    height={items.length > 6 ? 350 : (50 * items.length)}
    itemCount={items.length}
    itemSize={50}
    itemData={{ items: items, screenReaderLabel: language.label, onChange: onChange }}
  >
    {PdfList}
  </Container>
)

/**
 * PropTypes
 *
 * @since 1.0
 */
PdfListContainer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired
}

export default React.memo(PdfListContainer)
