export const typeIdToName = async (id: string): Promise<string> => {
  try {
    const resp = await fetch(`/api/device-types/${id}`)
    const deviceType = await resp.json()
    return deviceType.name
  } catch (e) {
    console.log(e)
    return 'N.A.'
  }
}
