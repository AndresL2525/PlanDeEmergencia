import { useCallback, useEffect, useRef, useState } from 'react'
import type { DependencyList } from 'react'
import { getErrorMessage } from '../utils/errors'

// Ejecuta una petición al montar el componente y maneja los estados de carga y error.
export function useFetch<T>(fetcher: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Evita que una respuesta antigua sobrescriba una más reciente.
  const ultimaPeticion = useRef(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cargar = useCallback(fetcher, deps)

  const reload = useCallback(async () => {
    const id = ++ultimaPeticion.current
    setLoading(true)
    setError(null)
    try {
      const resultado = await cargar()
      if (id === ultimaPeticion.current) setData(resultado)
    } catch (err) {
      if (id === ultimaPeticion.current) setError(getErrorMessage(err))
    } finally {
      if (id === ultimaPeticion.current) setLoading(false)
    }
  }, [cargar])

  useEffect(() => {
    void reload()
  }, [reload])

  return { data, setData, loading, error, reload }
}
