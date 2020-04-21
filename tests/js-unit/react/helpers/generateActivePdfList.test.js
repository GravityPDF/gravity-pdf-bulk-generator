import { generateActivePdfList, constructPdfData } from '../../../../assets/react/helpers/generateActivePdfList'

describe('/react/helpers/ - generateActivePdfList.js', () => {

  test('should return only an array of active PDF list from the original PDF list', () => {
    const pdfList = [
      { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true },
      { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: true },
      { id: '5e2e3', name: 'templateC', templateSelected: 'rubix', active: false }
    ]
    expect(generateActivePdfList(pdfList)).toEqual([
      { id: '5e12a', name: 'templateA' },
      { id: '5e2e1', name: 'templateB' }
    ])
  })

  test('should take the raw entry IDs and PDF List and build an array containing each iteration', () => {
    const entryIds = ['73', '74']
    const pdfList = [
      { id: '5e12a', name: 'templateA', templateSelected: 'blank-slate', active: true },
      { id: '5e2e1', name: 'templateB', templateSelected: 'rubix', active: true }
    ]
    const sessionId = '6f2c9'

    expect(constructPdfData(entryIds, pdfList, sessionId)).toEqual([
      { sessionId, entryId: '73', pdfId: '5e12a', pdfName: 'templateA' },
      { sessionId, entryId: '73', pdfId: '5e2e1', pdfName: 'templateB' },
      { sessionId, entryId: '74', pdfId: '5e12a', pdfName: 'templateA' },
      { sessionId, entryId: '74', pdfId: '5e2e1', pdfName: 'templateB' }
    ])
  })
})
