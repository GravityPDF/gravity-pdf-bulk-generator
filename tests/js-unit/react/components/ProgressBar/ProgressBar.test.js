import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import ProgressBar from '../../../../../assets/react/components/ProgressBar/ProgressBar'

describe('/react/components/ProgressBar/ - ProgressBar.js', () => {

  let wrapper
  let component

  describe('Renders main component - ', () => {

    test('renders <ProgressBar /> component', () => {
      wrapper = shallow(<ProgressBar step={2} />)
      component = findByTestAttr(wrapper, 'component-ProgressBar')

      expect(component.length).toBe(1)
      expect(component.find('li').length).toBe(3)
      expect(component.find('li').at(0).text()).toContain('Configure')
      expect(component.find('li').at(1).text()).toContain('Build')
      expect(component.find('li').at(2).text()).toContain('Download')
      expect(component.find('li.active').text()).toContain('Build')
    })
  })
})
