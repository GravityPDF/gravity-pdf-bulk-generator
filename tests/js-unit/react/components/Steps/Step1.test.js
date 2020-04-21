import React from 'react'
import { mount, shallow } from 'enzyme'
import { findByTestAttr } from '../../testUtils'
import { Step1 } from '../../../../../assets/react/components/Steps/Step1'

describe('/react/components/Steps/ - Step1.js', () => {
  let wrapper
  let component
  let e
  let inst
  let pdfList = []
  const tags = [{}]
  const directoryStructure = '/{date_created:format:Y}/{date_created:format:m}/'
  // Mocked functions
  const updateDirectoryStructureMock = jest.fn()
  const generateSessionIdMock = jest.fn()
  const togglePdfStatusMock = jest.fn()
  const historyMock = { location: { pathname: '/step/1' }, push: jest.fn() }

  describe('Lifecycle methods - ', () => {
    const map = {}
    let addEventListenerMock
    let removeEventListenerMock
    let handleFocus
    let handleEnter

    beforeEach(() => {
      wrapper = shallow(
        <Step1
          tags={tags}
          directoryStructure={directoryStructure}
          pdfList={pdfList}
          updateDirectoryStructure={updateDirectoryStructureMock}
          generateSessionId={generateSessionIdMock}
          togglePdfStatus={togglePdfStatusMock}
          history={historyMock}
        />
      )
      addEventListenerMock = document.addEventListener = jest.fn((event, cb) => map[event] = cb)
      removeEventListenerMock = document.removeEventListener = jest.fn((event, cb) => map[event] = cb)
      jest.spyOn(window, 'alert').mockImplementation(() => {})
      inst = wrapper.instance()
      handleFocus = jest.spyOn(inst, 'handleFocus').mockImplementation(() => {})
      handleEnter = jest.spyOn(inst, 'handleEnter')
    })

    test('componentDidMount() - On mount, Add focus event to document', () => {
      e = { key: 'Enter', preventDefault () {} }
      inst.componentDidMount()
      /* Simulate keyboard press */
      map.focus()
      map.keypress(e)

      expect(addEventListenerMock).toHaveBeenCalledTimes(2)
      expect(handleFocus).toHaveBeenCalledTimes(1)
      expect(handleEnter).toHaveBeenCalledTimes(1)
    })

    test('componentWillUnmount() - Cleanup our document event listeners', () => {
      inst.componentWillUnmount()

      expect(removeEventListenerMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('Component methods - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Step1
          tags={tags}
          directoryStructure={directoryStructure}
          pdfList={pdfList}
          updateDirectoryStructure={updateDirectoryStructureMock}
          generateSessionId={generateSessionIdMock}
          togglePdfStatus={togglePdfStatusMock}
          history={historyMock}
        />
      )
      inst = wrapper.instance()
    })

    test('handleFocus() - This keeps the focus from jumping outside our container (contition: true)', () => {
      const container = { contains: jest.fn(), focus: jest.fn() }
      e = { target: {} }
      inst.container = container
      inst.handleFocus(e)

      expect(container.focus).toHaveBeenCalledTimes(1)
    })

    test('handleEnter() - Handle \'enter\' key press from the keyboard', () => {
      e = { key: 'Enter' }
      const handleBuild = jest.spyOn(inst, 'handleBuild').mockImplementation(() => {})
      inst.handleEnter(e)

      expect(handleBuild).toHaveBeenCalledTimes(1)
    })

    test('handleBuild() - Request to build the bulk PDF download (active pdf)', () => {
      pdfList = [
        { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true },
        { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: true }
      ]
      wrapper = shallow(
        <Step1
          tags={tags}
          directoryStructure={directoryStructure}
          pdfList={pdfList}
          updateDirectoryStructure={updateDirectoryStructureMock}
          generateSessionId={generateSessionIdMock}
          togglePdfStatus={togglePdfStatusMock}
          history={historyMock}
        />
      )
      inst = wrapper.instance()
      e = { preventDefault () {} }
      inst.handleBuild(e)

      /* If there's an active PDF selected */
      expect(generateSessionIdMock).toHaveBeenCalledTimes(1)
    })

    test('handleBuild() - Request to build the bulk PDF download (no active pdf)', () => {
      pdfList = [
        { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false },
        { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }
      ]
      wrapper = shallow(
        <Step1
          tags={tags}
          directoryStructure={directoryStructure}
          pdfList={pdfList}
          updateDirectoryStructure={updateDirectoryStructureMock}
          generateSessionId={generateSessionIdMock}
          togglePdfStatus={togglePdfStatusMock}
          history={historyMock}
        />
      )
      jest.spyOn(window, 'alert').mockImplementation(() => {})
      inst = wrapper.instance()
      e = { preventDefault () {} }
      inst.handleBuild(e)

      /* if active PDF not selected */
      expect(generateSessionIdMock).toHaveBeenCalledTimes(0)
      expect(window.alert).toHaveBeenCalledTimes(1)
    })

    test('tagSelect() - Update tag directory structure, adding \'/\' between tags', () => {
      inst.tagSelect()

      expect(updateDirectoryStructureMock).toHaveBeenCalledTimes(1)
    })

    test('tagDeselect() - Update tag directory structure, removing a tag and \'/\' at the end of it', () => {
      inst.tagDeselect()

      expect(updateDirectoryStructureMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Renders main component - ', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Step1
          tags={tags}
          directoryStructure={directoryStructure}
          pdfList={pdfList}
          updateDirectoryStructure={updateDirectoryStructureMock}
          generateSessionId={generateSessionIdMock}
          togglePdfStatus={togglePdfStatusMock}
          history={historyMock}
        />
      )
      component = findByTestAttr(wrapper, 'component-Step1')
    })

    test('renders <Step1 /> component', () => {
      expect(component.length).toBe(1)
      expect(component.find('button').length).toBe(2)
      expect(component.find('footer').length).toBe(1)
    })

    test('check  <Step1 /> component ref', () => {
      wrapper = mount(
        <Step1
          tags={[{ id: '{date_created:format:Y}', label: 'Year' }]}
          directoryStructure={directoryStructure}
          pdfList={[{ id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }]}
          updateDirectoryStructure={updateDirectoryStructureMock}
          generateSessionId={generateSessionIdMock}
          togglePdfStatus={togglePdfStatusMock}
          history={historyMock}
        />
      )

      expect(wrapper.instance().container).toBeTruthy()
    })

    test('check cancelModal button click', () => {
      component.find('button.gfpdf-close-button').simulate('click', { preventDefault () {} })

      expect(historyMock.push).toHaveBeenCalledTimes(1)
    })

    test('renders <ProgressBar /> component', () => {
      expect(component.find('ProgressBar').length).toBe(1)
    })

    test('renders <Step1Body /> component', () => {
      expect(component.find('Step1Body').length).toBe(1)
    })
  })
})
