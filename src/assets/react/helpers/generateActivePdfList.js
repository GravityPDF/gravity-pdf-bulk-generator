export const generateActivePdfList = (pdfList) => {
  const list = []

  pdfList.map(item => {
    const id = item.id
    const name = item.name

    item.active && list.push({ id, name })
  })

  return list
}
