import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import Step2Body from '../../../../../assets/react/components/Steps/Step2Body'

describe('/react/components/Steps/ - Step2Body.js', () => {
  let wrapper
  let component
  const downloadPercentage = 20

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(<Step2Body downloadPercentage={downloadPercentage} />)
      component = findByTestAttr(wrapper, 'component-Step2Body')
    })

    test('renders <Step2Body /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('h2').length).toBe(1)
      expect(component.find('em').length).toBe(1)
    })

    test('renders <CircularProgressbar /> component', () => {
      expect(component.find('CircularProgressbar').length).toBe(1)
    })

    test('renders <LoadingDots /> component', () => {
      expect(component.find('LoadingDots').length).toBe(1)
    })

    test('renders <Logs /> component', () => {
      component = findByTestAttr(wrapper, 'component-Logs')

      expect(component.length).toBe(1)
    })
  })
})
