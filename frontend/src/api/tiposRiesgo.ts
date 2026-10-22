import { createCrudApi } from './client'
import type { TipoRiesgo, TipoRiesgoInput } from '../types/models'

export const tiposRiesgoApi = createCrudApi<TipoRiesgo, TipoRiesgoInput>('/tipos-riesgo/')
