import { createCrudApi } from './client'
import type { PlanFamiliar, PlanFamiliarInput } from '../types/models'

export const planesApi = createCrudApi<PlanFamiliar, PlanFamiliarInput>('/planes/')
