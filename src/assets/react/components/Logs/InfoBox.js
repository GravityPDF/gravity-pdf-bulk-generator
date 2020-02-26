import React from 'react'
import PropTypes from 'prop-types'
import List from './List'

const InfoBox = (
  {
    title,
    list,
    toggle,
    state
  }
) => (
  <div className={'errors-container ' + state.toString()}>
    <h3 className={title.toLowerCase()} onClick={toggle}>
        <span className='lines'>
          {title} ({list.length})
          <span className='expand'>
            {state ? '-' : '+'}
          </span>
        </span>
    </h3>

    <List
      list={list}
      state={state}
      title={title} />
  </div>
)

InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      pdfName: PropTypes.string,
      pdfId: PropTypes.string,
      entryId: PropTypes.string
    })
  ),
  toggle: PropTypes.func.isRequired,
  state: PropTypes.bool.isRequired
}

export default InfoBox
