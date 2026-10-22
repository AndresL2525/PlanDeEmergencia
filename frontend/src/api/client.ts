import axios from 'axios'

// URL base de la API de Django. Se configura en el archivo .env (VITE_API_URL).
export const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// DRF puede devolver una lista directa o una respuesta paginada { results: [...] }.
type ListResponse<T> = T[] | { results: T[] }

function unwrapList<T>(data: ListResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results
}

export interface CrudApi<T, TInput> {
  list: () => Promise<T[]>
  get: (id: number) => Promise<T>
  create: (data: TInput) => Promise<T>
  update: (id: number, data: TInput) => Promise<T>
  remove: (id: number) => Promise<void>
}

// Crea las 5 operaciones CRUD para un endpoint, por ejemplo '/tipos-riesgo/'.
export function createCrudApi<T, TInput>(endpoint: string): CrudApi<T, TInput> {
  return {
    list: async () => unwrapList((await api.get<ListResponse<T>>(endpoint)).data),
    get: async (id) => (await api.get<T>(`${endpoint}${id}/`)).data,
    create: async (data) => (await api.post<T>(endpoint, data)).data,
    update: async (id, data) => (await api.put<T>(`${endpoint}${id}/`, data)).data,
    remove: async (id) => {
      await api.delete(`${endpoint}${id}/`)
    },
  }
}
