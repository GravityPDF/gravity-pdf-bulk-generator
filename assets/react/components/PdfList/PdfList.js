/* Dependencies */
import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'

/* Lazy Load Components */
const Switch = lazy(() => import('react-switch'))

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.1
 */

/**
 * PDF list and switch to toggle PDF (active or inactive)
 *
 * @param data
 * @param index
 * @param style
 *
 * @returns { PdfList: component }
 *
 * @since 1.0
 */
const PdfList = ({ data, index, style }) => {
  return (
    <li
      data-test='component-PdfList'
      style={{
        ...style,
        height: 24,
        width: '97%'
      }}
    >
      <label
        className={data.items[index].id === '0' ? 'toggleAll' : ''}
        onClick={() => data.onChange(index)}
      >
        {data.items[index].name} <span>{data.items[index].id !== '0' ? ('ID: ' + data.items[index].id) : ''}</span>
      </label>

      <Suspense fallback={<div>loading...</div>}>
        <Switch
          checked={data.items[index].active}
          onChange={() => data.onChange(index)}
          offColor='#AAA'
          onColor='#5BC236'
          uncheckedIcon={false}
          height={26}
          width={52}
          aria-label={data.screenReaderLabel}
        />
      </Suspense>
    </li>
  )
}

/**
 * PropTypes
 *
 * @since 1.0
 */
PdfList.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        templateSelected: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired
      })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    screenReaderLabel: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.string.isRequired
  }).isRequired
}

export default React.memo(PdfList)
