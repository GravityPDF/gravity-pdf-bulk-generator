import { parseUrlForSearchParameters } from '../../../../assets/react/helpers/parseUrlForSearchParameters'

describe('/react/helpers/ - parseUrlForSearchParameters.js', () => {
  let url

  test('should parse URL filter data into an object', () => {
    url = '?page=gf_entries&view=entries&id=5&orderby=1.3&order=asc&s=1&filter=unread&field_id=is_starred&operator=is'

    expect(parseUrlForSearchParameters(url)).toEqual({
      s: '1',
      field_id: 'is_starred',
      operator: 'is',
      filter: 'unread',
      order: 'asc',
      orderby: '1.3'
    })
  })

  test('should check corresponding filter data value is empty, include it in the object', () => {
    url = '?page=gf_entries&view=entries&id=5&filter=star'

    expect(parseUrlForSearchParameters(url)).toEqual({
      s: '',
      field_id: '',
      operator: '',
      filter: 'star',
      order: '',
      orderby: ''
    })
  })
})
