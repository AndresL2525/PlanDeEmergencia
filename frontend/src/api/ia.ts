import { api } from './client'
import type { PlanIA } from '../types/planIA'

// La IA puede tardar más que una petición normal.
const IA_TIMEOUT_MS = 90000

// IMPORTANTE: el frontend solo habla con Django.
// Django es quien llama a la API externa de IA usando la clave del .env del backend.
export const iaApi = {
  generarPlan: async (planId: number) =>
    (await api.post<PlanIA>(`/planes/${planId}/generar-plan-ia/`, null, { timeout: IA_TIMEOUT_MS })).data,

  obtenerPlan: async (planId: number) => (await api.get<PlanIA>(`/planes/${planId}/plan-ia/`)).data,
}
