import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import FatalError from '../../../../../assets/react/components/FatalError/FatalError'

describe('/react/components/FatalError/ - FatalError.js', () => {
  let wrapper
  let component

  describe('Renders main component - ', () => {
    test('renders <FatalError /> component', () => {
      wrapper = shallow(<FatalError pluginUrl='https://gravitypdf.com' adminUrl='https://gravitypdf.com' />)
      component = findByTestAttr(wrapper, 'component-FatalError')

      expect(component.length).toBe(1)
      expect(wrapper.find('img').length).toBe(1)
      expect(wrapper.find('p').length).toBe(1)
    })
  })
})
