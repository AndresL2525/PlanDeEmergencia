import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../utils/errors'

export type Errores = Record<string, string>

// Maneja los valores de un formulario, la validación en el cliente
// y los errores que devuelve la API (por campo y generales).
export function useFormulario<T extends object>(inicial: T, validar: (valores: T) => Errores) {
  const [valores, setValores] = useState<T>(inicial)
  const [errores, setErrores] = useState<Errores>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const setCampo = <K extends keyof T>(campo: K, valor: T[K]) => {
    setValores((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => {
      const clave = String(campo)
      if (!prev[clave]) return prev
      const copia = { ...prev }
      delete copia[clave]
      return copia
    })
  }

  const handleSubmit = (enviar: (valores: T) => Promise<void>) => async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const erroresCliente = validar(valores)
    setErrores(erroresCliente)
    setErrorGeneral(null)
    if (Object.keys(erroresCliente).length > 0) {
      setErrorGeneral('Revisa los campos marcados en rojo.')
      return
    }
    setEnviando(true)
    try {
      await enviar(valores)
    } catch (err) {
      setErrores(getFieldErrors(err))
      setErrorGeneral(getErrorMessage(err))
    } finally {
      setEnviando(false)
    }
  }

  return { valores, setValores, setCampo, errores, errorGeneral, enviando, handleSubmit }
}
