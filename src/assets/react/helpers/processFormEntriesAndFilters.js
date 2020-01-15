export function processFormEntriesAndFilters () {
  // Get current URL
  const currentUrl = window.location.search

  // Process to get S value
  const sReg = /s=(.*)/
  const getS = sReg.exec(currentUrl) && sReg.exec(currentUrl)[1].replace(/&.*$/, '')

  // Processs to get Field ID value
  const fieldIdReg = /field_id=(.*)/
  const getFieldId = fieldIdReg.exec(currentUrl) && fieldIdReg.exec(currentUrl)[1].replace(/&.*$/, '')

  // Process to get Operator value
  const operatorReg = /operator=(.*)/
  const getOperator = operatorReg.exec(currentUrl) && operatorReg.exec(currentUrl)[1]

  // Process to get Filter value
  const filterReg = /filter=(.*)/
  const getFilter = filterReg.exec(currentUrl) && filterReg.exec(currentUrl)[1].replace(/&.*$/, '')

  // Process to get Order value
  const orderReg = /order=(.*)/
  const getOrder = orderReg.exec(currentUrl) && orderReg.exec(currentUrl)[1].replace(/&.*$/, '')

  // Process to get OrderBy value
  const orderByReg = /orderby=(.*)/
  const getOrderBy = orderByReg.exec(currentUrl) && orderByReg.exec(currentUrl)[1].replace(/&.*$/, '')

  // Construct object for API call request data
  const data = {
    's': getS ? getS : '',
    'field_id': getFieldId ? getFieldId : '',
    'operator': getOperator ? getOperator : '',
    'filter': getFilter ? getFilter : '',
    'order': getOrder ? getOrder : '',
    'orderby': getOrderBy ? getOrderBy : ''
  }

  return data
}
