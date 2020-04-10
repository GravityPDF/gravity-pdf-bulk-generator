import React from 'react'
import { shallow } from 'enzyme'
import { findByTestAttr } from './testUtils'
import { BulkGenerator } from '../../../assets/react/BulkGenerator'

describe('/react/ - BulkGenerator.js', () => {

  let wrapper
  let component
  let e
  let inst
  const downloadPercentage = 20
  const location = {}
  const modal = false
  // Mocked functions
  const proceedStep1Mock = jest.fn()
  const generatePdfListSuccessMock = jest.fn()
  const processCheckboxMock = jest.fn()
  const getSelectedEntriesIdMock = jest.fn()
  const historyMock = { push: jest.fn() }

  describe('Lifecycle methods - ', () => {

    let prevProps
    let deselectCheckboxes
    let setEventListener

    beforeEach(() => {
      wrapper = shallow(
        <BulkGenerator
          downloadPercentage={downloadPercentage}
          location={location}
          proceedStep1={proceedStep1Mock}
          generatePdfListSuccess={generatePdfListSuccessMock}
          processCheckbox={processCheckboxMock}
          getSelectedEntriesId={getSelectedEntriesIdMock}
          history={historyMock}
          modal={modal} />
      )
      inst = wrapper.instance()
    })

    test('componentDidMount() - On mount, call function setEventListener()', () => {
      e = { addEventListener: jest.fn() }
      setEventListener = jest.spyOn(inst, 'setEventListener').mockImplementation(() => e)
      inst.componentDidMount()

      expect(setEventListener).toHaveBeenCalledTimes(1)
    })

    test('componentDidUpdate() - On update, call functions based on conditions', () => {
      prevProps = { modal: true }
      deselectCheckboxes = jest.spyOn(inst, 'deselectCheckboxes').mockImplementation(() => {})
      inst.componentDidUpdate(prevProps)

      expect(deselectCheckboxes).toHaveBeenCalledTimes(1)
    })

    test('componentDidUpdate() - If condition not met, do nothing', () => {
      prevProps = { modal: false }
      deselectCheckboxes = jest.spyOn(inst, 'deselectCheckboxes').mockImplementation(() => {})
      inst.componentDidUpdate(prevProps)

      expect(deselectCheckboxes).toHaveBeenCalledTimes(0)
    })
  })

  describe('Component methods - ', () => {

    let setGlobalState
    let processAllEntriesId
    let setPdfListState
    let generatePdfList
    let result
    let pdfs

    beforeEach(() => {
      wrapper = shallow(
        <BulkGenerator
          downloadPercentage={downloadPercentage}
          location={location}
          proceedStep1={proceedStep1Mock}
          generatePdfListSuccess={generatePdfListSuccessMock}
          processCheckbox={processCheckboxMock}
          getSelectedEntriesId={getSelectedEntriesIdMock}
          history={historyMock}
          modal={modal} />
      )
      inst = wrapper.instance()
    })

    test('setGlobalState() - Set global state and local formId state', () => {
      setPdfListState = jest.spyOn(inst, 'setPdfListState').mockImplementation(() => {})
      inst.setGlobalState()

      expect(wrapper.state('formId')).toBe('5')
      expect(setPdfListState).toHaveBeenCalledTimes(1)
    })

    test('setPdfListState() - Process PDF list state and add \'Toggle All\' option in the list', () => {
      pdfs = [
        { name: 'templateA', template: 'blank-slate', filename: 'templateA', id: '5e12a', active: true },
        { name: 'templateB', template: 'rubix', filename: 'templateB', id: '5e2e1', active: true }
      ]
      generatePdfList = jest.spyOn(inst, 'generatePdfList')

      /* Add 'Toggle All' in the list */
      expect(inst.setPdfListState(pdfs)[0].name).toBe('Toggle All')
      expect(generatePdfList).toHaveBeenCalledTimes(1)
      expect(generatePdfListSuccessMock).toHaveBeenCalledTimes(1)

      pdfs = [{ name: 'templateA', template: 'blank-slate', filename: 'templateA', id: '5e12a', active: true }]
      result = [{ id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true }]

      /* Set active true by default if there's only 1 pdf template */
      expect(inst.setPdfListState(pdfs)).toEqual(result)
    })

    test('generatePdfList() - Generate PDF array list', () => {
      pdfs = [
        { name: 'templateA', pdf_size: 'A4', template: 'blank-slate', filename: 'templateA', id: '5e12a', active: true },
        { name: 'templateB', pdf_size: 'A4', template: 'rubix', filename: 'templateB', id: '5e2e1', active: true }
      ]
      result = [
        { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: false },
        { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: false }
      ]

      expect(inst.generatePdfList(pdfs)).toEqual(result)

      pdfs = [{
        name: 'templateA',
        pdf_size: 'A4',
        template: 'blank-slate',
        filename: 'templateA',
        id: '5e12a',
        active: true
      }]
      result = [{ id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true }]

      /* If only one generate with 'active: true' attribute */
      expect(inst.generatePdfList(pdfs, true)).toEqual(result)
    })

    test('setEventListener() - Set event listener for bulk apply buttons (popupSelectAllEntries === 1)', () => {
      /* Set up document body */
      document.body.innerHTML =
        '<div>' +
        '  <select id="bulk-action-selector-top"></select>' +
        '   <option value="download_pdf">Download PDF</option>' +
        '  </select>' +
        '  <input type="submit" id="doaction" value="Apply" />' +
        '  <input value="1" id="all_entries" />' +
        '  <input type="checkbox" id="entry[]" name="entry[]" value="72" />' +
        '  <input type="submit" id="doaction2" value="Apply" />' +
        '</div>'
      setGlobalState = jest.spyOn(inst, 'setGlobalState').mockImplementation(() => {})
      processAllEntriesId = jest.spyOn(inst, 'processAllEntriesId').mockImplementation(() => {})
      inst.setEventListener()
      document.getElementById('entry[]').click()
      document.getElementById('doaction').click()

      expect(setGlobalState).toHaveBeenCalledTimes(1)
      expect(proceedStep1Mock).toHaveBeenCalledTimes(1)
      expect(processAllEntriesId).toHaveBeenCalledTimes(1)
      expect(processCheckboxMock).toHaveBeenCalledTimes(0)
    })

    test('setEventListener() - Set event listener for bulk apply buttons (popupSelectAllEntries !== 1)', () => {
      /* Set up document body */
      document.body.innerHTML =
        '<div>' +
        '  <select id="bulk-action-selector-top"></select>' +
        '   <option value="download_pdf">Download PDF</option>' +
        '  </select>' +
        '  <input type="submit" id="doaction" value="Apply" />' +
        '  <input value="0" id="all_entries" />' +
        '  <input type="checkbox" id="entry[]" name="entry[]" value="72" />' +
        '  <input type="submit" id="doaction2" value="Apply" />' +
        '</div>'
      setGlobalState = jest.spyOn(inst, 'setGlobalState').mockImplementation(() => {})
      processAllEntriesId = jest.spyOn(inst, 'processAllEntriesId').mockImplementation(() => {})
      inst.setEventListener()
      document.getElementById('entry[]').click()
      document.getElementById('doaction').click()

      expect(setGlobalState).toHaveBeenCalledTimes(1)
      expect(proceedStep1Mock).toHaveBeenCalledTimes(1)
      expect(processAllEntriesId).toHaveBeenCalledTimes(0)
      expect(processCheckboxMock).toHaveBeenCalledTimes(1)
    })

    test('setEventListener() - If condition not met, return false', () => {
      /* Set up document body */
      document.body.innerHTML =
        '<div>' +
        '  <select id="bulk-action-selector-top"></select>' +
        '   <option value="print">Print</option>' +
        '  </select>' +
        '  <input type="submit" id="doaction" value="Apply" />' +
        '  <input value="0" id="all_entries" />' +
        '  <input type="checkbox" id="entry[]" name="entry[]" value="72" />' +
        '  <input type="submit" id="doaction2" value="Apply" />' +
        '</div>'
      setGlobalState = jest.spyOn(inst, 'setGlobalState').mockImplementation(() => {})
      processAllEntriesId = jest.spyOn(inst, 'processAllEntriesId').mockImplementation(() => {})
      inst.setEventListener()
      document.getElementById('entry[]').click()
      document.getElementById('doaction').click()

      expect(setGlobalState).toHaveBeenCalledTimes(0)
      expect(proceedStep1Mock).toHaveBeenCalledTimes(0)
    })

    test('processAllEntriesId() - Call our redux action getSelectedEntriesId and process form all entries ID', () => {
      inst.processAllEntriesId()

      expect(getSelectedEntriesIdMock).toHaveBeenCalledTimes(1)
    })

    test('deselectCheckboxes() - Deselect checkboxes after modal has been closed', () => {
      /* Set up document body */
      document.body.innerHTML =
        '<div>' +
        '  <input value="1" id="all_entries" />' +
        '  <input id="cb-select-all-1" type="checkbox" />' +
        '</div>'
      document.getElementById('cb-select-all-1').checked = true
      inst.deselectCheckboxes()

      expect(document.getElementById('all_entries').value).toBe('false')

      /* Set up document body */
      document.body.innerHTML =
        '<div>' +
        '  <input id="cb-select-all-1" type="checkbox" />' +
        '  <input type="checkbox" name="entry[]" value="73" />' +
        '  <input type="checkbox" name="entry[]" value="74" />' +
        '  <input type="checkbox" name="entry[]" value="75" />' +
        '</div>'
      document.querySelectorAll('input[name="entry[]"]').forEach(item => item.checked = true)
      inst.deselectCheckboxes()

      document.querySelectorAll('input[name="entry[]"]').forEach(item => expect(item.checked).toBe(false))
    })
  })

  describe('Renders main component - ', () => {

    beforeEach(() => {
      wrapper = shallow(
        <BulkGenerator
          downloadPercentage={downloadPercentage}
          location={location}
          proceedStep1={proceedStep1Mock}
          generatePdfListSuccess={generatePdfListSuccessMock}
          processCheckbox={processCheckboxMock}
          getSelectedEntriesId={getSelectedEntriesIdMock}
          history={historyMock}
          modal={modal} />
      )
      component = findByTestAttr(wrapper, 'component-BulkGenerator')
    })

    test('renders <BulkGenerator /> component', () => {
      expect(component.length).toBe(1)
    })
  })
})
