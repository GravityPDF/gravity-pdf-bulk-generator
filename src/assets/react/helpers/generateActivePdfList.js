export function generateActivePdfList(pdfList) {
  const list = []

  pdfList.map(item => {
    item.active && list.push(item.id)
  })

  return list
}
