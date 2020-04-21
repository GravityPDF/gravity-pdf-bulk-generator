import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import Step3Body from '../../../../../assets/react/components/Steps/Step3Body'

describe('/react/components/Steps/ - Step3Body.js', () => {

  let wrapper
  let component
  const downloadZipUrl = 'https://gravitypdf.com'

  describe('Renders main component - ', () => {

    beforeEach(() => {
      wrapper = shallow(<Step3Body downloadZipUrl={downloadZipUrl} />)
      component = findByTestAttr(wrapper, 'component-Step3Body')
    })

    test('renders <Step3Body /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('h2').length).toBe(1)
      expect(component.find('p').length).toBe(1)
    })

    test('renders <Logs /> component', () => {
      component = findByTestAttr(wrapper, 'component-Logs')

      expect(component.length).toBe(1)
    })
  })
})
