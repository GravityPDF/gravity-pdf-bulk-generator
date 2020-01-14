import React from 'react'
import './ProgressBar.scss'

const steps = [
  'Configure',
  'Build',
  'Download'
]

const ProgressBar = ({ step }) => {
  return (
    <ol className='gfpdf-progress-steps'>
      {steps.map((name, index) => (
        <li
          key={index}
          className={(step - 1) === index ? 'active' : ''}>
          {name}
        </li>
      ))}
    </ol>
  )
}

export default ProgressBar
