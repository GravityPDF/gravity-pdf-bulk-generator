import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import { Step3 } from '../../../../../assets/react/components/Steps/Step3'

describe('/react/components/Steps/ - Step3.js', () => {

  let wrapper
  let component
  let inst
  const downloadZipUrl = 'https://gravitypdf.com'
  // Mocked functions
  const historyMock = { location: { pathname: '/step/3' }, push: jest.fn() }

  describe('Lifecycle methods - ', () => {

    let map = {}
    let addEventListenerMock
    let removeEventListenerMock
    let requestDownloadZipUrl
    let handleFocus

    beforeEach(() => {
      wrapper = shallow(<Step3 downloadZipUrl={downloadZipUrl} history={historyMock} />)
      map = {}
      addEventListenerMock = document.addEventListener = jest.fn((event, cb) => map[event] = cb)
      removeEventListenerMock = document.removeEventListener = jest.fn((event, cb) => map[event] = cb)
      inst = wrapper.instance()
      handleFocus = jest.spyOn(inst, 'handleFocus').mockImplementation(() => {})
    })

    test('componentDidMount() - call function requestDownloadZipUrl and add focus event to document', () => {
      requestDownloadZipUrl = jest.spyOn(inst, 'requestDownloadZipUrl').mockImplementation(() => {})
      inst.componentDidMount()
      /* Simulate keyboard pressKey */
      map.focus()

      expect(requestDownloadZipUrl).toHaveBeenCalledTimes(1)
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
      wrapper = shallow(<Step3 downloadZipUrl={downloadZipUrl} history={historyMock} />)
      inst = wrapper.instance()
    })

    test('requestDownloadZipUrl() - Auto download the generated PDF zip file', () => {
      jest.spyOn(window.location, 'assign').mockImplementation(() => {})
      inst.requestDownloadZipUrl()

      expect(window.location.assign).toHaveBeenCalledTimes(1)
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
      wrapper = shallow(<Step3 downloadZipUrl={downloadZipUrl} history={historyMock} />)
      component = findByTestAttr(wrapper, 'component-Step3')
    })

    test('renders <Step3 /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('span').length).toBe(1)
      expect(component.find('button').length).toBe(1)
    })

    test('check cancelModal button click', () => {
      component.find('button.gfpdf-close-button').simulate('click', { preventDefault () {} })

      expect(historyMock.push).toHaveBeenCalledTimes(1)
    })

    test('renders <ProgressBar /> component', () => {
      expect(component.find('ProgressBar').length).toBe(1)
    })

    test('renders <Step3Body /> component', () => {
      expect(component.find('Step3Body').length).toBe(1)
    })
  })
})
