import axios from 'axios'

// Mensajes por defecto según el código HTTP que responde Django.
const MENSAJES_HTTP: Record<number, string> = {
  400: 'Los datos enviados no son válidos. Revisa el formulario.',
  404: 'El recurso solicitado no existe o fue eliminado.',
  409: 'No se puede completar la acción porque existen registros relacionados.',
  500: 'Ocurrió un error interno en el servidor.',
  502: 'El servicio de IA respondió con un error o con un formato inválido. Intenta de nuevo.',
  503: 'El servicio de IA no está disponible o no está configurado.',
  504: 'El servicio de IA tardó demasiado en responder. Intenta de nuevo.',
}

const CLAVES_GENERALES = ['error', 'detail', 'detalles', 'non_field_errors']

function aTexto(valor: unknown): string {
  if (typeof valor === 'string') return valor
  if (Array.isArray(valor)) return valor.map(aTexto).filter(Boolean).join(' ')
  return ''
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

// Devuelve un mensaje claro para mostrar al usuario a partir de cualquier error.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Verifica tu conexión e intenta de nuevo.'
    }
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica que la API de Django esté en ejecución.'
    }
    const { status, data } = error.response
    if (esObjeto(data)) {
      const mensaje = aTexto(data.error) || aTexto(data.detail) || aTexto(data.non_field_errors)
      if (mensaje) return mensaje
    }
    return MENSAJES_HTTP[status] ?? `Error inesperado (código ${status}).`
  }
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}

// Convierte los errores de validación de DRF ({ campo: ["mensaje"] }) en { campo: "mensaje" }.
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error) || error.response?.status !== 400) return {}
  const data: unknown = error.response.data
  if (!esObjeto(data)) return {}

  const origen = esObjeto(data.detalles) ? data.detalles : data
  const resultado: Record<string, string> = {}
  for (const [campo, valor] of Object.entries(origen)) {
    if (CLAVES_GENERALES.includes(campo)) continue
    const texto = aTexto(valor)
    if (texto) resultado[campo] = texto
  }
  return resultado
}
