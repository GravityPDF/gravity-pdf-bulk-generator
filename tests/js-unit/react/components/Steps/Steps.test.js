import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import Steps from '../../../../../assets/react/components/Steps/Steps'
import Step1 from '../../../../../assets/react/components/Steps/Step1'
import Step2 from '../../../../../assets/react/components/Steps/Step2'
import Step3 from '../../../../../assets/react/components/Steps/Step3'

describe('/react/components/Steps/ - Steps.js', () => {

  let wrapper
  let component

  wrapper = shallow(<Steps />)
  component = findByTestAttr(wrapper, 'component-Steps')

  describe('Renders main component - ', () => {

    test('renders <Steps /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('header').length).toBe(1)
      expect(component.find('h2').length).toBe(1)
      expect(component.find('Switch').length).toBe(1)
      expect(component.find('Route').at(0).props()).toHaveProperty('path', '/step/1')
      expect(component.find('Route').at(0).props()).toHaveProperty('component', Step1)
      expect(component.find('Route').at(1).props()).toHaveProperty('path', '/step/2')
      expect(component.find('Route').at(1).props()).toHaveProperty('component', Step2)
      expect(component.find('Route').at(2).props()).toHaveProperty('path', '/step/3')
      expect(component.find('Route').at(2).props()).toHaveProperty('component', Step3)
    })
  })
})
