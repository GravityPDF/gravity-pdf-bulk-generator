import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import InfoBox from '../../../../../assets/react/components/Logs/InfoBox'

describe('/react/components/Logs/ - InfoBox.js', () => {

  let wrapper
  let component
  let state = false
  const title = 'Success'
  const logs = [
    'Generated First PDF template (#5e12aa36690bd) for Entry #69',
    'Generated First PDF template (#5e12aa36690bd) for Entry #71'
  ]
  const className = 'success'
  // Mocked functions
  const toggleMock = jest.fn()

  describe('Renders main component - ', () => {

    beforeEach(() => {
      wrapper = shallow(
        <InfoBox
          title={title}
          logs={logs}
          toggle={toggleMock}
          state={state}
          className={className} />
      )
    })

    test('renders <InfoBox /> component', () => {
      component = findByTestAttr(wrapper, 'component-InfoBox')

      expect(component.length).toBe(1)
      expect(component.find('h3').length).toBe(1)
    })

    test('renders toggle box option and list length', () => {
      component = findByTestAttr(wrapper, 'component-Infobox-length-icon')

      expect(component.text()).toContain('Success (2)')
      expect(component.text()).toContain('+')

      state = true
      wrapper = shallow(
        <InfoBox
          title={title}
          logs={logs}
          toggle={toggleMock}
          state={state}
          className={className} />
      )
      component = findByTestAttr(wrapper, 'component-Infobox-length-icon')

      expect(component.text()).toContain('Success (2)')
      expect(component.text()).toContain('-')
    })

    test('renders <List /> component', () => {
      component = findByTestAttr(wrapper, 'component-InfoBox')

      expect(component.find('List').length).toBe(2)
    })
  })
})
