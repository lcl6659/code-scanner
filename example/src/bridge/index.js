import { bridge as GGR } from './ggr'

const getBridge = () => {
  return GGR
}

export const BRIDGE = getBridge()

export const checkGGRApi = async (list) => {
  if (list && Array.isArray(list)) {
    let result = await GGR.checkJsApi(list)
    if (result.code === 0) {
      return result.data
    } else {
      return false
    }
  }
}
