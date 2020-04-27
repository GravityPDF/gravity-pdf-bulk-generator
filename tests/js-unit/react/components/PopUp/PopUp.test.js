import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import { PopUp } from '../../../../../assets/react/components/PopUp/PopUp'

describe('/react/components/PopUp/ - PopUp.js', () => {
  let wrapper
  let component
  let e
  const map = {}
  let keyListener
  const fatalError = false
  let modal = true
  let inst
  // Mocked functions
  const historyMock = { push: jest.fn(), location: { pathname: '' } }

  describe('Lifecycle methods - ', () => {
    let addEventListenerMock
    let removeEventListenerMock

    beforeEach(() => {
      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={historyMock} />)
      addEventListenerMock = document.addEventListener = jest.fn((event, cb) => map[event] = cb)
      removeEventListenerMock = document.removeEventListener = jest.fn((event, cb) => map[event] = cb)
      inst = wrapper.instance()
    })

    test('componentDidMount() - Assign keyword listener to document on mount', () => {
      // Mocked functions
      keyListener = jest.spyOn(inst, 'keyListener').mockImplementation(() => {})
      inst.componentDidMount()
      /* Simulate event */
      map.keydown()

      expect(addEventListenerMock).toHaveBeenCalledTimes(1)
      expect(keyListener).toHaveBeenCalledTimes(1)
    })

    test('componentWIllUnmount - Cleanup our document event listeners', () => {
      inst.componentWillUnmount()

      expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Component methods - ', () => {
    beforeEach(() => {
      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={historyMock} />)
      inst = wrapper.instance()
    })

    test('keyListener() - Handle key presses from the keyboard (Escape)', () => {
      e = { key: 'Escape', preventDefault () {} }
      inst.keyListener(e)

      expect(historyMock.push.mock.calls.length).toBe(1)
    })

    test('keyListener() - Handle key presses from the keyboard (Enter - condition: true)', () => {
      e = { key: 'Enter', preventDefault: jest.fn() }
      inst.keyListener(e)

      expect(e.preventDefault).toHaveBeenCalledTimes(1)

      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={{ push: jest.fn(), location: { pathname: '/step/1' } }} />)
      inst = wrapper.instance()
      inst.keyListener(e)

      expect(e.preventDefault).toHaveBeenCalledTimes(1)
    })

    test('keyListener() - Handle key presses from the keyboard (Enter - condition: false)', () => {
      e = { key: 'Enter', preventDefault: jest.fn() }
      wrapper = shallow(<PopUp fatalError={fatalError} modal={modal} history={{ push: jest.fn(), location: { pathname: '/step/1' } }} />)
      inst = wrapper.instance()
      inst.keyListener(e)

      expect(e.preventDefault).toHaveBeenCalledTimes(0)
    })

    test('keyListener() - Don\'t handle keys if the modal is currently closed', () => {
      e = { key: 'Escape', preventDefault () {} }
      wrapper = shallow(<PopUp fatalError={fatalError} modal={false} history={historyMock} />)
      inst = wrapper.instance()
      inst.keyListener(e)

      expect(historyMock.push.mock.calls.length).toBe(0)
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
