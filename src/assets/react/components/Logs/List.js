import React from 'react'
import PropTypes from 'prop-types'

const List  = ({ list, state, title }) => {
  return (
    <div className='items'>
      {
        list.map((item, index) => (
          <div key={index} className={'item ' + state.toString() + ' ' + title.toLowerCase()}>
            { title === 'Success' ? 'Completed' : 'Failed' } generation of {item.pdfName}.pdf (#{item.pdfId}) for entry #{item.entryId}
          </div>
        ))
      }
    </div>
  )
}

List.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      pdfName: PropTypes.string.isRequired,
      pdfId: PropTypes.string.isRequired,
      entryId: PropTypes.string.isRequired
    })
  ).isRequired,
  state: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default List
