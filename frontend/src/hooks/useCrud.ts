import type { CrudApi } from '../api/client'
import { useFetch } from './useFetch'

// Carga la lista de un recurso y expone crear, actualizar y eliminar.
// Si una operación falla, el error se lanza para que el formulario lo muestre.
export function useCrud<T extends { id: number }, TInput>(crudApi: CrudApi<T, TInput>) {
  const { data, setData, loading, error, reload } = useFetch(() => crudApi.list(), [crudApi])

  const create = async (input: TInput) => {
    const nuevo = await crudApi.create(input)
    setData((prev) => [...(prev ?? []), nuevo])
    return nuevo
  }

  const update = async (id: number, input: TInput) => {
    const actualizado = await crudApi.update(id, input)
    setData((prev) => (prev ?? []).map((item) => (item.id === id ? actualizado : item)))
    return actualizado
  }

  const remove = async (id: number) => {
    await crudApi.remove(id)
    setData((prev) => (prev ?? []).filter((item) => item.id !== id))
  }

  return { items: data ?? [], loading, error, reload, create, update, remove }
}
