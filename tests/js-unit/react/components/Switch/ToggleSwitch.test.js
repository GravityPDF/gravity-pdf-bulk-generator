import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import ToggleSwitch from '../../../../../assets/react/components/Switch/ToggleSwitch'

describe('/react/components/Switch/ - Switch.js', () => {
  let wrapper
  let component
  const id = 1
  const active = false
  const screenReaderLabel = 'label'
  // Mocked functions
  const onChangeMock = jest.fn()

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <ToggleSwitch id={id} active={active} screenReaderLabel={screenReaderLabel} onChange={onChangeMock} />
      )
      component = findByTestAttr(wrapper, 'component-ToggleSwitch')
    })

    test('renders <ToggleSwitch /> component', () => {
      expect(component.length).toBe(1)
    })

    test('should call onChange prop', () => {
      component.simulate('change', id)

      expect(onChangeMock).toHaveBeenCalledTimes(1)
    })
  })
})
