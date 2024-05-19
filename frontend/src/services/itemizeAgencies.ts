export const itemizeAgencies = (rows: any) => {
  var items = {}
  rows.forEach((e) => {
    items[e.id] = e.agency_id
  })
  return Object.values(items).sort()
}
