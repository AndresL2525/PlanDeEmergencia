import type { CategoriaKit, CategoriaRiesgo, NivelPeligrosidad, TipoVivienda } from '../types/models'

export const CATEGORIAS_RIESGO: Record<CategoriaRiesgo, string> = {
  natural: 'Natural',
  tecnologico: 'Tecnológico',
  sanitario: 'Sanitario',
  social: 'Social',
}

export const NIVELES: Record<NivelPeligrosidad, string> = {
  bajo: 'Bajo',
  medio: 'Medio',
  alto: 'Alto',
}

export const CATEGORIAS_KIT: Record<CategoriaKit, string> = {
  agua_alimentos: 'Agua y alimentos',
  botiquin: 'Botiquín',
  documentos: 'Documentos',
  herramientas: 'Herramientas',
  higiene: 'Higiene',
  comunicacion: 'Comunicación',
}

export const TIPOS_VIVIENDA: Record<TipoVivienda, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  finca: 'Finca',
  otro: 'Otro',
}

// Colores de las etiquetas según el nivel (bajo, medio, alto).
export const NIVEL_ESTILOS: Record<NivelPeligrosidad, string> = {
  bajo: 'bg-green-100 text-green-800',
  medio: 'bg-amber-100 text-amber-800',
  alto: 'bg-red-100 text-red-800',
}

// Convierte un objeto de opciones en una lista para <select>.
export function opciones<K extends string>(mapa: Record<K, string>) {
  return (Object.entries(mapa) as [K, string][]).map(([value, label]) => ({ value, label }))
}

// Teléfono: opcionalmente "+", y entre 7 y 15 dígitos.
export const TELEFONO_REGEX = /^\+?\d{7,15}$/

export function formatearFecha(fecha: string | null): string {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}
