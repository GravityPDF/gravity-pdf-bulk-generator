import React from 'react'
import { mount, shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import { Step2 } from '../../../../../assets/react/components/Steps/Step2'
import FatalError from '../../../../../assets/react/components/FatalError/FatalError'

describe('/react/components/Steps/ - Step2.js', () => {

  let wrapper
  let component
  let inst
  let fatalError = false
  const downloadPercentage = 10
  // Mocked functions
  const historyMock = { location: { pathname: '/step/2' }, push: jest.fn() }

  describe('Lifecycle methods - ', () => {

    let map = {}
    let addEventListenerMock
    let removeEventListenerMock
    let handleFocus

    beforeEach(() => {
      wrapper = shallow(
        <Step2 downloadPercentage={downloadPercentage} fatalError={fatalError} history={historyMock} />
      )
      map = {}
      addEventListenerMock = document.addEventListener = jest.fn((event, cb) => map[event] = cb)
      removeEventListenerMock = document.removeEventListener = jest.fn((event, cb) => map[event] = cb)
      inst = wrapper.instance()
      handleFocus = jest.spyOn(inst, 'handleFocus').mockImplementation(() => {})
    })

    test('componentDidMount() - On mount, Add focus event to document', () => {
      inst.componentDidMount()
      /* Simulate keyboard pressKey */
      map.focus()

      expect(addEventListenerMock).toHaveBeenCalledTimes(1)
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    test('componentWillUnmount() - Cleanup our document event listeners', () => {
      inst.componentWillUnmount()
      /* Simulate keyboard pressKey */
      map.focus()

      expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Component methods - ', () => {

    beforeEach(() => {
      wrapper = shallow(
        <Step2 downloadPercentage={downloadPercentage} fatalError={fatalError} history={historyMock} />
      )
      inst = wrapper.instance()
    })

    test('handleFocus() - This keeps the focus from jumping outside our container (contition: true)', () => {
      const container = { contains: jest.fn(), focus: jest.fn() }
      const e = { target: {} }
      inst.container = container
      inst.handleFocus(e)

      expect(container.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Renders main component - ', () => {

    beforeEach(() => {
      wrapper = shallow(
        <Step2 downloadPercentage={downloadPercentage} fatalError={fatalError} history={historyMock} />
      )
      component = findByTestAttr(wrapper, 'component-Step2')
    })

    test('renders <Step2 /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('footer').length).toBe(1)
      expect(component.find('button').length).toBe(1)
    })

    test('check cancelModal button click', () => {
      jest.spyOn(window, 'confirm').mockImplementation(() => {})
      component.find('button').simulate('click', { preventDefault () {} })

      expect(window.confirm).toHaveBeenCalledTimes(1)
    })

    test('render <ProgressBar /> component', () => {
      expect(component.find('ProgressBar').length).toBe(1)
    })

    test('renders <Step2Body /> component', () => {
      expect(component.find('Step2Body').length).toBe(1)
    })

    test('renders <FatalError /> component', () => {
      fatalError = true
      wrapper = shallow(
        <Step2 downloadPercentage={downloadPercentage} fatalError={fatalError} history={historyMock} />
      )

      expect(wrapper.find('FatalError').length).toBe(1)
    })

    test('check <Step2 /> component ref', () => {
      wrapper = mount(
        <Step2 downloadPercentage={downloadPercentage} fatalError={fatalError} history={historyMock} />
      )

      expect(wrapper.instance().container).toBeTruthy()
    })
  })
})
