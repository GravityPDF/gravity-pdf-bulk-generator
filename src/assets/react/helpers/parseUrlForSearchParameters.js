export const parseUrlForSearchParameters = (currentUrl) => {
  const filterDetails = [
    ['s', /s=(.*)/],
    ['field_id', /field_id=(.*)/],
    ['operator', /operator=(.*)/],
    ['filter', /filter=(.*)/],
    ['order', /order=(.*)/],
    ['orderby', /orderby=(.*)/]
  ]
  const data = {}

  // Construct object for API call request data
  for (let x = 0; x < filterDetails.length; x++) {
    data[filterDetails[x][0]] = filterDetails[x][1].exec(currentUrl) ? filterDetails[x][1].exec(currentUrl)[1].replace(/&.*$/, '') : ''
  }

  return data
}
