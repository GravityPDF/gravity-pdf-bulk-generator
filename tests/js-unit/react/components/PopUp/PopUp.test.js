import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import { PopUp } from '../../../../../assets/react/components/PopUp/PopUp'

describe('/react/components/PopUp/ - PopUp.js', () => {

  let wrapper
  let component
  let e
  let map = {}
  let escapeKeyListener
  let fatalError = false
  let modal = true
  let inst
  // Mocked functions
  const historyMock = { push: jest.fn(), location: { pathname: '' } }

  describe('Lifecycle methods - ', () => {

    beforeEach(() => {
      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={historyMock} />)
      inst = wrapper.instance()
    })

    test('componentDidMount() - Assign keyword listener to document on mount', () => {
      // Mocked functions
      document.addEventListener = jest.fn((event, cb) => map[event] = cb)
      escapeKeyListener = jest.spyOn(inst, 'escapeKeyListener')
      inst.componentDidMount()
      /* Simulate event */
      map.keydown({ key: 'Escape', keycode: 27 })

      expect(escapeKeyListener).toHaveBeenCalledTimes(1)
    })
  })

  describe('Component methods - ', () => {

    beforeEach(() => {
      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={historyMock} />)
      inst = wrapper.instance()
    })

    test('escapeKeyListener() - Listen if \'escape\' key is pressed from the keyboard', () => {
      e = { keyCode: 27, preventDefault () {} }
      inst.escapeKeyListener(e)

      expect(historyMock.push.mock.calls.length).toBe(1)
    })
  })

  describe('Renders main component - ', () => {

    beforeEach(() => {
      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={historyMock} />)
      component = findByTestAttr(wrapper, 'component-PopUp')
    })

    test('renders <PopUp /> component', () => {
      expect(component.length).toBe(1)
    })

    test('Show pop-up if modal is true', () => {
      expect(component.find('ForwardRef').length).toBe(2)
      expect(component.find('Route').length).toBe(2)
    })

    test('hide pop-up if modal is false', () => {
      modal = false
      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={historyMock} />)
      component = findByTestAttr(wrapper, 'component-PopUp')

      expect(component.find('ForwardRef').length).toBe(0)
      expect(component.find('Route').length).toBe(0)
    })
  })
})
