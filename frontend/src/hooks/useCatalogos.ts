import { elementosKitApi } from '../api/elementosKit'
import { protocolosApi } from '../api/protocolos'
import { tiposRiesgoApi } from '../api/tiposRiesgo'
import { useFetch } from './useFetch'

// Carga en paralelo los tres catálogos que se relacionan con un plan familiar.
export function useCatalogos() {
  return useFetch(async () => {
    const [tiposRiesgo, protocolos, elementosKit] = await Promise.all([
      tiposRiesgoApi.list(),
      protocolosApi.list(),
      elementosKitApi.list(),
    ])
    return { tiposRiesgo, protocolos, elementosKit }
  })
}
